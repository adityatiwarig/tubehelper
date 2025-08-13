import { NextRequest, NextResponse } from "next/server";
import translate from "google-translate-api-x";

/**
 * Try fetching captions from YouTube timedtext endpoint (no OAuth, no API key).
 * Works only if the video has public/auto captions allowed.
 * We try VTT first (easy to parse), then XML fallback.
 */
async function fetchTimedTextRaw(videoId: string, lang: string) {
  // Try WebVTT first (fmt=vtt). Many videos allow this.
  const vttUrl = `https://video.google.com/timedtext?v=${encodeURIComponent(
    videoId
  )}&lang=${encodeURIComponent(lang)}&fmt=vtt`;

  let res = await fetch(vttUrl);
  if (res.ok) {
    const text = await res.text();
    if (text && text.trim().length > 0) return { kind: "vtt" as const, text };
  }

  // Fallback: XML transcript
  const xmlUrl = `https://video.google.com/timedtext?v=${encodeURIComponent(
    videoId
  )}&lang=${encodeURIComponent(lang)}`;

  res = await fetch(xmlUrl);
  if (res.ok) {
    const text = await res.text();
    if (text && text.trim().length > 0) return { kind: "xml" as const, text };
  }

  return null;
}

/** Parse simple WebVTT into plain lines (very basic). */
function parseVTTtoLines(vtt: string): string[] {
  // Remove WEBVTT header and timestamps, keep caption text lines.
  const lines = vtt
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && l !== "WEBVTT" && !/^\d+$/.test(l) && !/^\d{2}:\d{2}:\d{2}\.\d{3}\s+-->\s+\d{2}:\d{2}:\d{2}\.\d{3}/.test(l));

  // Merge consecutive lines into sentences-ish by joining with space and splitting lightly.
  // Keep it simple for now.
  return lines;
}

/** Parse simple YouTube XML transcript <text start dur>value</text> into lines. */
function parseXMLTranscript(xml: string): string[] {
  // Very lightweight parsing (no external deps), decode a few entities.
  const entries: string[] = [];
  const regex = /<text[^>]*>([\s\S]*?)<\/text>/g;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(xml)) !== null) {
    let t = m[1];
    // XML stores entities like &amp;#39; &amp;quot; &amp;amp; etc.
    t = t
      .replace(/&amp;#39;/g, "'")
      .replace(/&#39;/g, "'")
      .replace(/&amp;quot;/g, '"')
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/\s+/g, " ")
      .trim();
    if (t) entries.push(t);
  }
  return entries;
}

export async function POST(req: NextRequest) {
  try {
    const { videoId, targetLang } = await req.json();

    if (!videoId) {
      return NextResponse.json({ error: "Missing videoId" }, { status: 400 });
    }
    const toLang = (targetLang || "hi").trim();

    // We’ll try a few English tags commonly seen for source captions.
    const candidateLangs = ["en", "en-US", "en-GB"];

    let sourceLines: string[] = [];
    let lastError: string | null = null;

    for (const lang of candidateLangs) {
      try {
        const raw = await fetchTimedTextRaw(videoId, lang);
        if (!raw) continue;

        if (raw.kind === "vtt") {
          sourceLines = parseVTTtoLines(raw.text);
        } else {
          sourceLines = parseXMLTranscript(raw.text);
        }
        if (sourceLines.length > 0) break;
      } catch (e: any) {
        lastError = e?.message || "fetch/parse error";
      }
    }

    if (sourceLines.length === 0) {
      // Could not fetch public captions via timedtext.
      // Most likely: captions unavailable OR login required (OAuth).
      return NextResponse.json(
        {
          error:
            "Public captions not accessible for this video (login/OAuth may be required or captions are unavailable).",
          detail: lastError,
        },
        { status: 403 }
      );
    }

    // Deduplicate tiny lines and clean up.
    sourceLines = sourceLines
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    // Translate line-by-line; return exactly what your frontend expects: string[]
    // where each element can be shown directly (we’ll put original + translated).
    const output: string[] = [];
    for (let i = 0; i < sourceLines.length; i++) {
      try {
        const res = await translate(sourceLines[i], { to: toLang });
        output.push(`${sourceLines[i]}\n${res.text}`);
      } catch (err: any) {
        // If a line fails, skip it—keep going.
        // You can also push only original if you prefer:
        // output.push(sourceLines[i]);
      }
      // (Optional) Throttle lightly if you hit rate limits:
      // await new Promise(r => setTimeout(r, 50));
    }

    return NextResponse.json({ translated: output }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

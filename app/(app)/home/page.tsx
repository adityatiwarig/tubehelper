"use client";

import { useMemo, useState } from "react";
import getYouTubeId from "get-youtube-id";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogOut, DollarSign } from "lucide-react";
import { useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";



import { NavigationMenu, NavigationMenuList, NavigationMenuItem } from "@/components/ui/navigation-menu";


type TranscriptLine = {
  text: string;
  start: number;
  duration: number;
};



const BACKEND = "http://127.0.0.1:8000/transcript";

export default function Home() {
  // transcript states (unchanged)
  const [videoUrl, setVideoUrl] = useState("");
  const [lang, setLang] = useState("en");
  const [transcript, setTranscript] = useState<TranscriptLine[]>([]);
  const [loading, setLoading] = useState(false);
  const { signOut } = useClerk();

  const [errorMsg, setErrorMsg] = useState("");

  const router = useRouter();

  // gemini bot states (new, but isolated)
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [asking, setAsking] = useState(false);

  const videoId = useMemo(() => getYouTubeId(videoUrl || "") || "", [videoUrl]);

  const handleGetTranscript = async () => {
    setErrorMsg("");
    setTranscript([]);
    setLoading(true);

    try {
      const id = getYouTubeId(videoUrl || "") || videoUrl.trim();
      if (!id) {
        setErrorMsg("Please enter a valid YouTube URL (or 11-char video ID).");
        return;
      }

      const res = await fetch(BACKEND, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId: id, lang }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        setErrorMsg(data.error || "Failed to get transcript.");
        return;
      }

      setTranscript(data.transcript || []);
      if (!videoUrl && data.videoId) {
        setVideoUrl(`https://www.youtube.com/watch?v=${data.videoId}`);
      }
    } catch (e) {
      setErrorMsg("Network error. Is the backend running?");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const formatted = useMemo(
    () => transcript.map((l) => `[${formatTime(l.start)}] ${l.text}`).join("\n"),
    [transcript]
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formatted || "");
    } catch {}
  };

  const handleDownload = () => {
    const blob = new Blob([formatted || ""], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = videoId ? `${videoId}_transcript.txt` : "transcript.txt";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  // ---- Gemini handler (hooked to your /api/ask) ----
  const handleAskGemini = async () => {
    if (!question.trim()) return;
    setAsking(true);
    setAnswer("");
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      setAnswer(data.answer || "No answer found.");
    } catch (err) {
      console.error("Gemini error:", err);
      setAnswer("Something went wrong.");
    } finally {
      setAsking(false);
    }
  };

    const handleLogout = () => {
  signOut(() => {
    window.location.href = "/";
  });
};


  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background (unchanged) */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-blue-600/30 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-purple-600/30 blur-3xl" />
      </div>

      <nav className="bg-gray-900 text-white px-6 py-3 flex justify-between items-center shadow-lg">
      <NavigationMenu className="w-full">
  <NavigationMenuList className="flex items-center gap-6">
    {/* Logo / Home */}
    <NavigationMenuItem>
      <Link
        href="/"
        className="flex items-center gap-2 text-lg font-bold text-white hover:text-yellow-400 transition-colors duration-200"
      >
        <span className="inline-block w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
        YT Transcript + Gemini
      </Link>
    </NavigationMenuItem>

    {/* Quiz (Paid) */}
    <NavigationMenuItem>
      <Link
        href="/quiz-access"
        className="relative flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-black font-semibold shadow-lg shadow-yellow-500/50 hover:shadow-yellow-400/80 transition-all duration-300 hover:scale-105"
      >
        <span className="absolute inset-0 rounded-full bg-yellow-300 opacity-20 blur-md animate-pulse"></span>
        <DollarSign className="w-5 h-5 text-yellow-900 drop-shadow" />
        Quiz (Paid)
      </Link>
    </NavigationMenuItem>

    {/* Docs Link */}
    <NavigationMenuItem>
<Link href="/docs" className="hover:text-yellow-400 transition">
    Docs
  </Link>
    </NavigationMenuItem>

    {/* Contact */}
    <NavigationMenuItem>
      <Link
        href="/contact"
        className="text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 px-4 py-2 rounded-lg transition-colors duration-200"
      >
        Contact
      </Link>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>



        <div className="flex items-center gap-4">
          <Button
  variant="destructive"
  size="sm"
  className="flex items-center gap-1 px-4 py-2 rounded"
  onClick={handleLogout}
>
  <LogOut className="w-4 h-4" />
  Logout
</Button>

        </div>
</nav>


      {/* Header */}
      <header className="mx-auto w-full max-w-6xl px-4 pt-10 pb-4">
        <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          YouTube Transcript Grabber
        </h1>
        <p className="mt-2 text-sm text-slate-300">
          Paste any YouTube URL or video ID, then fetch the captions (prefers English).
        </p>
      </header>

      {/* Main: 3-col grid. Right column has Transcript (top) + Gemini (bottom) */}
      <main className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-5 px-4 pb-10 md:grid-cols-3">
        {/* LEFT: Controls + Video (slightly smaller card for better balance) */}
        <section className="md:col-span-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-xl backdrop-blur">
            {/* controls row */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                placeholder="Enter YouTube URL or video ID"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="flex-1 rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-slate-100 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-slate-100 outline-none focus:ring-2 focus:ring-blue-500"
                title="Preferred language (fallback auto)"
              >
                <option value="en">English (en)</option>
                <option value="hi">Hindi (hi)</option>
                <option value="auto">Auto</option>
              </select>
              <button
                onClick={handleGetTranscript}
                disabled={loading}
                className="rounded-xl bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-500 disabled:opacity-60"
              >
                {loading ? "Fetching..." : "Get Transcript"}
              </button>
            </div>

            {/* error (same place) */}
            {errorMsg && (
              <div className="mt-3 rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                {errorMsg}
              </div>
            )}

            {/* video (kept compact) */}
            {videoId && (
              <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
                <iframe
                  className="aspect-video w-full"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            )}
          </div>

          {/* full text block (unchanged, moved under video left side) */}
          {transcript.length > 0 && (
            <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4 shadow-xl backdrop-blur">
              <h3 className="mb-2 text-base font-semibold text-white">Plain Text</h3>
              <pre className="max-h-64 overflow-y-auto whitespace-pre-wrap rounded-lg border border-white/10 bg-black/20 p-3 text-sm text-slate-100">
                {formatted}
              </pre>
            </div>
          )}
        </section>

        {/* RIGHT: Transcript (top) + Gemini (bottom) */}
        <aside className="flex flex-col gap-5 md:col-span-1">
          {/* Transcript panel (TOP) */}
          <div className="flex h-[360px] min-h-[360px] flex-col rounded-2xl border border-white/10 bg-white/5 p-4 shadow-xl backdrop-blur">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Transcript</h2>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  disabled={!transcript.length}
                  className="rounded-lg border border-white/10 bg-white/10 px-3 py-1 text-xs text-slate-100 hover:bg-white/20 disabled:opacity-50"
                >
                  Copy
                </button>
                <button
                  onClick={handleDownload}
                  disabled={!transcript.length}
                  className="rounded-lg border border-white/10 bg-white/10 px-3 py-1 text-xs text-slate-100 hover:bg-white/20 disabled:opacity-50"
                >
                  Download
                </button>
              </div>
            </div>

            <div className="scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent mt-1 flex-1 space-y-2 overflow-y-auto pr-1">
              {!loading && transcript.length === 0 ? (
                <p className="text-sm text-slate-300">No transcript yet.</p>
              ) : null}

              {loading ? (
                <p className="text-sm text-slate-300">Loading…</p>
              ) : (
                <ul className="space-y-2">
                  {transcript.map((l, i) => (
                    <li
                      key={`${l.start}-${i}`}
                      className="rounded-lg border border-white/10 bg-black/20 p-2 text-slate-100"
                    >
                      <a
                        href={
                          videoId
                            ? `https://www.youtube.com/watch?v=${videoId}&t=${Math.floor(l.start)}s`
                            : "#"
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="mr-2 rounded bg-blue-600/20 px-2 py-0.5 text-xs font-medium text-blue-200 hover:bg-blue-600/30"
                        title="Open at this time on YouTube"
                      >
                        {formatTime(l.start)}
                      </a>
                      <span className="align-middle">{l.text}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Gemini bot (BOTTOM) */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-xl backdrop-blur">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-pink-300">🤖</span>
              <h3 className="text-base font-semibold text-white">Ask Gemini</h3>
            </div>

            <div className="flex gap-2">
              <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask anything…"
                className="flex-1 rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-slate-100 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={handleAskGemini}
                disabled={asking || !question.trim()}
                className="rounded-xl bg-purple-600 px-4 py-2 text-white hover:bg-purple-500 disabled:opacity-60"
              >
                {asking ? "..." : "Ask"}
              </button>
            </div>

            <div className="mt-3 max-h-60 overflow-y-auto rounded-lg border border-white/10 bg-black/20 p-3 text-sm text-slate-100">
              {answer ? (
                <pre className="whitespace-pre-wrap">{answer}</pre>
              ) : (
                <span className="text-slate-300">Type a question and press Ask.</span>
              )}
            </div>
          </div>
        </aside>
      </main>

      {/* Footer (unchanged) */}
      <footer className="mx-auto w-full max-w-6xl px-4 pb-8 text-center text-xs text-slate-400">
        Built with Next.js + FastAPI • Make sure your backend is running on{" "}
        <code className="rounded bg-white/10 px-1 py-0.5">127.0.0.1:8000</code>
      </footer>
    </div>
  );
}

/* ---------- helpers ---------- */
function formatTime(sec: number) {
  const s = Math.floor(sec);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  const two = (n: number) => n.toString().padStart(2, "0");
  return h > 0 ? `${h}:${two(m)}:${two(ss)}` : `${m}:${two(ss)}`;
}

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { videoId, oauthToken } = await req.json();

    if (!videoId || !oauthToken) {
      return NextResponse.json(
        { error: "videoId and oauthToken are required" },
        { status: 400 }
      );
    }

    // Step 1: List captions for the video
    const listRes = await fetch(
      `https://www.googleapis.com/youtube/v3/captions?part=snippet&videoId=${videoId}`,
      {
        headers: {
          Authorization: `Bearer ${oauthToken}`,
        },
      }
    );

    const listData = await listRes.json();
    if (!listData.items || listData.items.length === 0) {
      return NextResponse.json({ error: "No captions found" }, { status: 404 });
    }

    const captionId = listData.items[0].id;

    // Step 2: Download the caption in SRT format
    const downloadRes = await fetch(
      `https://www.googleapis.com/youtube/v3/captions/${captionId}?tfmt=srt`,
      {
        headers: {
          Authorization: `Bearer ${oauthToken}`,
        },
      }
    );

    const srtText = await downloadRes.text();

    // Step 3: Parse SRT into JSON format
    const transcript = srtText
      .split("\n\n")
      .filter(Boolean)
      .map((block) => {
        const lines = block.split("\n");
        const time = lines[1];
        const text = lines.slice(2).join(" ");
        return { time, text };
      });

    return NextResponse.json({ transcript });
  } catch (err) {
    console.error("Error fetching transcript:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

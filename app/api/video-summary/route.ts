import { NextResponse } from "next/server";
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const { videoUrl } = await req.json();

    // Video ID nikaalna
    const videoIdMatch = videoUrl.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (!videoIdMatch) {
      return NextResponse.json({ error: "Invalid YouTube URL" }, { status: 400 });
    }
    const videoId = videoIdMatch[1];

    // YouTube API se title + description lana
    const ytRes = await axios.get(
      "https://www.googleapis.com/youtube/v3/videos",
      {
        params: {
          part: "snippet",
          id: videoId,
          key: process.env.YOUTUBE_API_KEY,
        },
      }
    );

    if (!ytRes.data.items?.length) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    const { title, description } = ytRes.data.items[0].snippet;

    // Gemini call
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Video Title: ${title}\nDescription: ${description}\n\nWrite a detailed essay or summary about the topic of this video.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return NextResponse.json({ title, description, essay: text });

  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

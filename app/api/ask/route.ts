import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { question } = await req.json();

    if (!question) {
      return NextResponse.json({ error: "Question is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing API key" }, { status: 500 });
    }

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: question }] }],
        }),
      }
    );

    const data = await geminiRes.json();
    console.log("Gemini API raw response:", JSON.stringify(data, null, 2));

    const answer =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No answer found.";

    return NextResponse.json({ answer });
  } catch (err) {
    console.error("Error in API route:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

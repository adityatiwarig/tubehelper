import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

export async function POST(req: Request) {
  try {
    const { topic } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: "No topic provided" }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(apiKey!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Generate exactly 5 multiple choice questions on the topic "${topic}".
      Return in JSON format like this:
      {
        "questions": [
          {
            "question": "What is ...?",
            "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
            "answer": "Option 2"
          }
        ]
      }
      Do not include any extra text outside JSON.
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Extract JSON safely
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) {
      return NextResponse.json({ error: "Invalid JSON from AI" }, { status: 500 });
    }

    const jsonData = JSON.parse(match[0]);
    return NextResponse.json(jsonData);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error generating quiz" }, { status: 500 });
  }
}

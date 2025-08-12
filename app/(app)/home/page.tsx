"use client";

import { useState } from "react";
import Link from "next/link";

function getYouTubeId(url: string) {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) {
      return u.pathname.slice(1);
    }
    if (u.searchParams.has("v")) {
      return u.searchParams.get("v");
    }
  } catch (e) {
    return null;
  }
  return null;
}

export default function HomePage() {
  const [videoUrl, setVideoUrl] = useState("");
  const [transcript, setTranscript] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleGetTranscript = async () => {
    const videoId = getYouTubeId(videoUrl);
    if (!videoId) {
      alert("Please enter a valid YouTube URL");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/transcribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId }),
      });
      const data = await res.json();
      setTranscript(data || []);
    } catch (err) {
      console.error("Error fetching transcript:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAskGemini = async () => {
    if (!question.trim()) return;
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
    }
  };

  const videoId = getYouTubeId(videoUrl);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navbar */}
      <nav className="flex justify-between items-center bg-gray-900 text-white px-6 py-3">
        <h1 className="text-lg font-bold">YT Transcript + Gemini</h1>
        <div className="flex gap-3">
          <Link href="/sign-in">
            <button className="bg-indigo-500 px-4 py-2 rounded hover:bg-indigo-600">
              Sign In
            </button>
          </Link>
          <Link href="/sign-up">
            <button className="bg-green-500 px-4 py-2 rounded hover:bg-green-600">
              Sign Up
            </button>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Left side - Video + Transcript */}
        <div className="w-1/2 p-6 border-r overflow-y-auto">
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Paste YouTube link here..."
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="flex-1 border p-2 rounded"
            />
            <button
              onClick={handleGetTranscript}
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded"
            >
              Get
            </button>
          </div>

          {videoId && (
            <div className="mb-4 aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                className="w-full h-full rounded"
                allowFullScreen
              />
            </div>
          )}

          <div>
            {loading ? (
              <p>Loading transcript...</p>
            ) : transcript.length > 0 ? (
              transcript.map((line, i) => (
                <p key={i} className="mb-1">
                  {line}
                </p>
              ))
            ) : (
              <p>No transcript yet.</p>
            )}
          </div>
        </div>

        {/* Right side - Gemini Q&A */}
        <div className="w-1/2 p-6 overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Ask Gemini AI</h2>
          <textarea
            placeholder="Ask something..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full border p-2 rounded mb-2"
            rows={4}
          />
          <button
            onClick={handleAskGemini}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Ask
          </button>

          {answer && (
            <div className="mt-4 p-3 bg-gray-100 rounded text-black">
              <strong>Answer:</strong>
              <p>{answer}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

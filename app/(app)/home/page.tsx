"use client";
import { useState } from "react";
import { SignedIn, SignedOut, SignOutButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  const [videoUrl, setVideoUrl] = useState("");
  const [transcript, setTranscript] = useState<{ start: number; duration: number; text: string }[]>([]);
  const [loadingTranscript, setLoadingTranscript] = useState(false);

  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState<{ type: "question" | "answer"; content: string }[]>([]);
  const [loadingChat, setLoadingChat] = useState(false);

  // Fetch transcript
  const handleTranscript = async () => {
    if (!videoUrl.trim()) return;
    setLoadingTranscript(true);
    try {
      const res = await fetch("/api/transcript", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoUrl }),
      });
      const data = await res.json();
      setTranscript(data.lines || []);
    } catch (err) {
      console.error(err);
      setTranscript([]);
    }
    setLoadingTranscript(false);
  };

  // Send question to Gemini
  const handleChat = async () => {
    if (!question.trim()) return;
    const currentQ = question;
    setChatHistory(prev => [...prev, { type: "question", content: currentQ }]);
    setQuestion("");
    setLoadingChat(true);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: currentQ }),
      });
      const data = await res.json();
      setChatHistory(prev => [...prev, { type: "answer", content: data.answer || "No answer found." }]);
    } catch (err) {
      console.error(err);
      setChatHistory(prev => [...prev, { type: "answer", content: "Error occurred." }]);
    }
    setLoadingChat(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-indigo-200 p-4">
      
      {/* Auth Buttons */}
      <div className="flex justify-end gap-2 mb-4">
  {/* Always show Sign In */}
  <Link href="/sign-in">
    <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded">
      Sign In
    </button>
  </Link>

  {/* Always show Sign Up */}
  <Link href="/sign-up">
    <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
      Sign Up
    </button>
  </Link>

  {/* Show Logout only when signed in */}
  <SignedIn>
    <SignOutButton redirectUrl="/">
      <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
        Logout
      </button>
    </SignOutButton>
  </SignedIn>
</div>


      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Left Panel: Video + Transcript */}
        <div className="bg-white rounded-lg shadow p-4 flex flex-col">
          <h2 className="text-lg font-bold mb-2 text-indigo-700">YouTube Video & Transcript</h2>
          <div className="flex mb-4 gap-2">
            <input
              type="text"
              placeholder="Enter YouTube URL..."
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="flex-1 border border-gray-300 rounded p-2"
            />
            <button
              onClick={handleTranscript}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded"
            >
              Get
            </button>
          </div>
          {videoUrl && (
            <div className="mb-4 aspect-video">
              <iframe
                src={videoUrl.replace("watch?v=", "embed/")}
                className="w-full h-full rounded"
                allowFullScreen
              />
            </div>
          )}
          <div className="flex-1 overflow-y-auto border-t pt-2">
            {loadingTranscript ? (
              <p className="text-gray-500">Generating transcript...</p>
            ) : transcript.length > 0 ? (
              <ul className="space-y-1 text-sm">
                {transcript.map((line, idx) => (
                  <li key={idx}>
                    <span className="text-gray-500">[{line.start}s]</span> {line.text}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">No transcript yet.</p>
            )}
          </div>
        </div>

        {/* Right Panel: Gemini Chat */}
        <div className="bg-white rounded-lg shadow p-4 flex flex-col">
          <h2 className="text-lg font-bold mb-2 text-indigo-700">Gemini Chatbot</h2>
          <div className="flex-1 overflow-y-auto border p-2 rounded mb-2 bg-gray-50">
            {chatHistory.length === 0 && (
              <p className="text-gray-500 text-sm">Ask me anything...</p>
            )}
            {chatHistory.map((chat, idx) => (
              <div key={idx} className={`mb-2 ${chat.type === "question" ? "text-right" : "text-left"}`}>
                <div
                  className={`inline-block p-2 rounded-lg max-w-[80%] ${
                    chat.type === "question" ? "bg-indigo-500 text-white" : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {chat.content}
                </div>
              </div>
            ))}
            {loadingChat && (
              <div className="text-left">
                <span className="inline-block bg-gray-200 p-2 rounded-lg animate-pulse">
                  Thinking...
                </span>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleChat();
                }
              }}
              placeholder="Type your question..."
              className="flex-1 border border-gray-300 rounded p-2"
            />
            <button
              onClick={handleChat}
              disabled={loadingChat}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

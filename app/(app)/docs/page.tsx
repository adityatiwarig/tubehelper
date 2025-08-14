"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function DocsPage() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-6 py-8 transition-colors">
      <div className="max-w-5xl mx-auto space-y-12">

        {/* Header */}
        <header className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-6">
          <div>
            <h1 className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
              Application Documentation
            </h1>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
              This document provides an overview of the application's features, technical
              architecture, and intended usage patterns.
            </p>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow transition"
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </header>

        {/* Section 1 */}
        <section>
          <h2 className="text-2xl font-semibold text-indigo-500 dark:text-indigo-400">
            1. YouTube Transcript Feature
          </h2>
          <p className="mt-3 leading-relaxed">
            The YouTube Transcript module allows users to fetch video transcripts directly from YouTube.
            It uses the <code className="bg-gray-200 dark:bg-gray-800 px-1 rounded">youtube-transcript</code> library
            to retrieve accurate, time-synced captions. This feature is particularly useful for educational
            content, research purposes, and generating subtitles.
          </p>
          <h3 className="mt-4 font-medium">Usage Flow:</h3>
          <ol className="list-decimal list-inside mt-2 space-y-1">
            <li>Enter a valid YouTube video URL or ID.</li>
            <li>The backend fetches available captions using the API.</li>
            <li>The transcript is displayed in a scrollable, well-formatted container.</li>
          </ol>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Note: If captions are unavailable for a given video, the system will notify the user.
          </p>
        </section>

        {/* Section 2 */}
        <section>
          <h2 className="text-2xl font-semibold text-indigo-500 dark:text-indigo-400">
            2. Gemini AI Chatbot
          </h2>
          <p className="mt-3 leading-relaxed">
            The Gemini AI Chatbot integrates Google's Gemini 1.5 Flash API to deliver real-time,
            context-aware responses. It is designed to handle both factual and conversational queries
            with a focus on accuracy and natural interaction.
          </p>
          <h3 className="mt-4 font-medium">Usage Flow:</h3>
          <ol className="list-decimal list-inside mt-2 space-y-1">
            <li>User types a question in the chatbot input panel.</li>
            <li>The query is sent to the Gemini API with relevant context.</li>
            <li>The AI responds with a precise and relevant answer, displayed in the chat window.</li>
          </ol>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            The chatbot supports continuous conversation, maintaining context across multiple turns.
          </p>
        </section>

        {/* Section 3 */}
        <section>
          <h2 className="text-2xl font-semibold text-indigo-500 dark:text-indigo-400">
            3. Paid Section (Premium Features)
          </h2>
          <p className="mt-3 leading-relaxed">
            Certain advanced features are reserved for subscribed users. These premium modules
            are currently in the maintenance phase but will soon be fully functional.
          </p>
          <h3 className="mt-4 font-medium">Planned Features:</h3>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Custom AI-powered quiz generation.</li>
            <li>Performance analytics and learning recommendations.</li>
            <li>Access to higher-accuracy AI models and datasets.</li>
          </ul>
          <p className="mt-2 italic text-gray-500 dark:text-gray-400">
            Non-subscribed users will be prompted to upgrade when attempting to access these modules.
          </p>
        </section>

        {/* Back to Home */}
        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
          <Link
            href="/"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg shadow transition"
          >
            ← Back to Home
          </Link>
        </div>

      </div>
    </main>
  );
}

"use client";

import { SocialIcon } from "react-social-icons";
import Link from "next/link";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-6 py-12">
      <div className="max-w-3xl mx-auto text-center">
        
        {/* Heading */}
        <h1 className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">
          Contact Me
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-12">
          Feel free to reach out to me through any of the platforms below.
        </p>

        {/* Contact Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-6">

          {/* Email */}
          <a
            href="mailto:aditya2461tiwari@gmail.com"
            className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 px-6 py-3 rounded-lg shadow transition"
          >
            <SocialIcon network="email" fgColor="#ef4444" bgColor="transparent" style={{ height: 30, width: 30 }} />
            <span className="font-medium">aditya2461tiwari@gmail.com</span>
          </a>

          {/* Twitter */}
          <a
            href="https://x.com/ADITYA94306?t=QBVJawxD1f1KA809e2sCog&s=09"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 px-6 py-3 rounded-lg shadow transition"
          >
            <SocialIcon network="twitter" fgColor="#0ea5e9" bgColor="transparent" style={{ height: 30, width: 30 }} />
            <span className="font-medium">Twitter</span>
          </a>

          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/in/aditya-tiwari-40b763309/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 px-6 py-3 rounded-lg shadow transition"
          >
            <SocialIcon network="linkedin" fgColor="#2563eb" bgColor="transparent" style={{ height: 30, width: 30 }} />
            <span className="font-medium">LinkedIn</span>
          </a>

        </div>

        {/* Back to Home */}
        <div className="mt-12">
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

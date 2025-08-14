"use client";

import { useRouter } from "next/navigation";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";
import { Sparkles } from "lucide-react";

export default function Home() {
  const router = useRouter();

  const handleSignIn = () => {
    router.push("/sign-in");
  };

  const handleSignup = () => {
    router.push("/sign-up");
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* 🌌 Background with glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-blue-600/30 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-purple-600/30 blur-3xl" />
      </div>

      {/* 🌟 Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-12 text-white">
        <h1 className="flex items-center gap-2 text-4xl sm:text-5xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-pulse">
          <Sparkles className="w-8 h-8 text-yellow-300" />
          TUBEHELPER + Gemini
        </h1>

        <p className="mt-6 text-lg text-slate-300 text-center max-w-xl">
          Fetch YouTube transcripts, ask Gemini AI questions, and take interactive quizzes — all in one place.
        </p>

        {/* 🔐 Auth Card */}
        <div className="mt-10 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-6 sm:p-8 w-full max-w-md text-center shadow-xl">
          <p className="text-xl font-semibold mb-4">Already have an account?</p>
          <InteractiveHoverButton
            onClick={handleSignIn}
            className="w-full mb-6 font-semibold !text-black !bg-white rounded-full"
          >
            Sign In
          </InteractiveHoverButton>

          <p className="text-xl font-semibold mb-4">New here?</p>
          <InteractiveHoverButton
            onClick={handleSignup}
            className="w-full font-semibold !text-black !bg-white rounded-full"
          >
            Sign Up
          </InteractiveHoverButton>
        </div>
      </div>
    </div>
  );
}

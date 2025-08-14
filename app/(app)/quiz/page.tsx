"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Question {
  question: string;
  options: string[];
  answer: string;
}

export default function QuizPage() {
  const [topic, setTopic] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [score, setScore] = useState<number | null>(null);
  const router = useRouter();

  // ✅ Access Check
  useEffect(() => {
    async function checkAccess() {
      const res = await fetch("/api/check-subscription");
      if (!res.ok) {
        router.push("/quiz-access");
        return;
      }
      const data = await res.json();
      if (!data.active) {
        router.push("/quiz-access");
      }
    }
    checkAccess();
  }, [router]);

  const generateQuiz = async () => {
    if (!topic.trim()) return alert("Please enter a topic");
    setLoading(true);
    setQuestions([]);
    setScore(null);
    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });
      const data = await res.json();
      if (data.questions) {
        setQuestions(data.questions);
      } else {
        alert("Could not generate quiz");
      }
    } catch (err) {
      console.error(err);
      alert("Error generating quiz");
    } finally {
      setLoading(false);
    }
  };

  const handleOptionChange = (qIndex: number, option: string) => {
    setAnswers((prev) => ({ ...prev, [qIndex]: option }));
  };

  const handleSubmit = () => {
    let correct = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.answer) correct++;
    });
    setScore(correct);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white">
      {/* Navbar */}
      <nav className="backdrop-blur-md bg-white/10 shadow-lg px-6 py-3 flex justify-between items-center border-b border-white/20">
        <h1 className="font-extrabold text-2xl tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
          ⚡ AI Quiz
        </h1>
        <div className="flex gap-6">
          <a href="/" className="hover:text-purple-300 transition-colors">Home</a>
          <a href="/quiz" className="hover:text-purple-300 transition-colors">Quiz</a>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-3xl mx-auto p-6">
        <h2 className="text-4xl font-extrabold mb-4 text-center bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent drop-shadow-lg">
          Generate Your Quiz
        </h2>

        {/* Topic Input */}
        <div className="flex gap-2 mb-8">
          <input
            type="text"
            placeholder="Enter topic (e.g. JavaScript)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="flex-1 p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          />
          <button
            onClick={generateQuiz}
            disabled={loading}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-5 py-3 rounded-lg shadow-md transform hover:scale-105 transition-all"
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>

        {/* Questions */}
        {questions.length > 0 && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="space-y-6"
          >
            {questions.map((q, i) => (
              <div
                key={i}
                className="bg-white/10 backdrop-blur-md p-5 rounded-2xl shadow-lg border border-white/20 transition-transform hover:scale-[1.02]"
              >
                <p className="font-semibold text-lg">{i + 1}. {q.question}</p>
                <div className="mt-3 space-y-2">
                  {q.options.map((opt, idx) => (
                    <label
                      key={idx}
                      className={`block p-3 rounded-lg cursor-pointer transition ${
                        answers[i] === opt
                          ? "bg-purple-500/30 border border-purple-400"
                          : "hover:bg-white/5 border border-transparent"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`q-${i}`}
                        value={opt}
                        checked={answers[i] === opt}
                        onChange={() => handleOptionChange(i, opt)}
                        className="mr-2 accent-purple-500"
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 rounded-lg font-bold transform hover:scale-105 transition-all shadow-lg"
            >
              Submit
            </button>
          </form>
        )}

        {/* Score */}
        {score !== null && (
          <div className="mt-8 bg-gradient-to-r from-blue-400/30 to-cyan-500/30 backdrop-blur-md text-white p-5 rounded-2xl shadow-lg border border-white/20 text-center">
            <p className="font-bold text-2xl">
              🎯 Your Score: {score} / {questions.length}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

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

  // ✅ Backend Access Check
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
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 text-gray-900">
      <nav className="bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 shadow-lg px-6 py-3 flex justify-between items-center">
        <h1 className="font-extrabold text-xl tracking-wide text-white drop-shadow-lg">⚡ AI Quiz</h1>
        <div className="flex gap-6">
          <a href="/" className="hover:underline text-white font-medium">Home</a>
          <a href="/quiz" className="hover:underline text-white font-medium">Quiz</a>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto p-6">
        <h2 className="text-3xl font-bold mb-4 text-center text-purple-700">Generate Your Quiz</h2>
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Enter topic (e.g. JavaScript)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="flex-1 border-2 border-purple-400 rounded-lg p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
          />
          <button
            onClick={generateQuiz}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg shadow-md transform hover:scale-105 transition-all"
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>

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
                className="bg-white text-gray-900 p-4 rounded-xl shadow-md hover:shadow-lg border border-gray-200 transition-all"
              >
                <p className="font-semibold text-lg">{i + 1}. {q.question}</p>
                <div className="mt-2 space-y-2">
                  {q.options.map((opt, idx) => (
                    <label
                      key={idx}
                      className={`block p-2 rounded-lg cursor-pointer transition ${
                        answers[i] === opt ? "bg-purple-100 border border-purple-400" : "hover:bg-gray-100"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`q-${i}`}
                        value={opt}
                        checked={answers[i] === opt}
                        onChange={() => handleOptionChange(i, opt)}
                        className="mr-2"
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg shadow-md transform hover:scale-105 transition-all"
            >
              Submit
            </button>
          </form>
        )}

        {score !== null && (
          <div className="mt-6 bg-blue-100 text-gray-900 p-4 rounded-lg shadow-md border border-blue-300">
            <p className="font-bold text-lg text-center">
              🎯 Your Score: {score} / {questions.length}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

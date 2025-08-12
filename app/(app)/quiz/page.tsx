"use client";

import { useState } from "react";

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
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* Navbar */}
      <nav className="bg-purple-600 text-white px-6 py-3 flex justify-between items-center">
        <h1 className="font-bold text-lg">AI Quiz</h1>
        <div className="flex gap-4">
          <a href="/" className="hover:underline">Home</a>
          <a href="/quiz" className="hover:underline">Quiz</a>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-4">Generate a Quiz</h2>

        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Enter topic (e.g. JavaScript)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="flex-1 border border-gray-400 rounded p-2 text-gray-900"
          />
          <button
            onClick={generateQuiz}
            disabled={loading}
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded"
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
              <div key={i} className="bg-white text-gray-900 p-4 rounded shadow">
                <p className="font-medium">{i + 1}. {q.question}</p>
                <div className="mt-2 space-y-1">
                  {q.options.map((opt, idx) => (
                    <label key={idx} className="block">
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
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            >
              Submit
            </button>
          </form>
        )}

        {score !== null && (
          <div className="mt-6 bg-blue-100 text-gray-900 p-4 rounded">
            <p className="font-bold text-lg">
              Your Score: {score} / {questions.length}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

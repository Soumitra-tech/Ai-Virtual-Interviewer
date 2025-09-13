import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../auth/AuthContext";

export default function CandidateDashboard() {
  const { logout } = useAuth();

  const [question, setQuestion] = useState("Tell me about yourself.");
  const [answer, setAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const buzzerRef = useRef(null);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Play buzzer sound in last 10 seconds
  useEffect(() => {
    if (timeLeft <= 10 && timeLeft > 0) {
      buzzerRef.current?.play().catch(() => {});
    } else {
      buzzerRef.current?.pause();
      if (buzzerRef.current) buzzerRef.current.currentTime = 0;
    }
  }, [timeLeft]);

  const questions = [
    "Tell me about yourself.",
    "Why should we hire you?",
    "What are your strengths and weaknesses?",
    "Where do you see yourself in 5 years?",
    "Describe a challenge you faced and how you handled it.",
  ];

  const handleNextQuestion = () => {
    const randomIndex = Math.floor(Math.random() * questions.length);
    setQuestion(questions[randomIndex]);
    setAnswer("");
    setTimeLeft(60);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 px-4 relative">
      {/* Background glowing orbs */}
      <div className="absolute w-80 h-80 bg-blue-500 rounded-full blur-3xl opacity-20 animate-pulse top-16 left-12"></div>
      <div className="absolute w-64 h-64 bg-purple-500 rounded-full blur-3xl opacity-20 animate-pulse bottom-16 right-12"></div>

      {/* Dashboard Card */}
      <div className="relative w-full max-w-2xl bg-gray-800/90 border border-gray-700 rounded-2xl shadow-xl p-8 backdrop-blur-md">
        <h1 className="text-3xl font-bold text-center text-white mb-6">
          🎤 Virtual Interview Practice
        </h1>

        <h2 className="text-xl font-medium text-gray-200 text-center mb-6">
          {question}
        </h2>

        <p
          className={`text-center font-semibold mb-6 ${
            timeLeft <= 10 ? "text-red-400 animate-pulse" : "text-gray-300"
          }`}
        >
          Time Left: {timeLeft}s
        </p>

        <textarea
          className="w-full p-4 rounded-lg bg-gray-900 border border-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          rows={5}
          placeholder="Type your answer here..."
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />

        <div className="flex justify-center space-x-4 mt-6">
          <button
            onClick={handleNextQuestion}
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow hover:scale-[1.02] transform transition duration-200"
          >
            Next Question
          </button>
          <button
            onClick={logout}
            className="px-6 py-2 rounded-lg border border-red-500 text-red-400 hover:bg-red-500 hover:text-white transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Buzzer sound */}
      <audio
        ref={buzzerRef}
        src="https://www.soundjay.com/buttons/beep-07a.mp3"
        preload="auto"
      />
    </div>
  );
}


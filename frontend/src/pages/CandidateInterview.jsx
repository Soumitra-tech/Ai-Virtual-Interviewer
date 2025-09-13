import React, { useState, useEffect, useRef } from "react";

const INITIAL_TIME = 60;

export default function CandidateInterview() {
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [history, setHistory] = useState([]);
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [timerActive, setTimerActive] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [listening, setListening] = useState(false);

  const recognitionRef = useRef(null);
  const audioRefs = useRef({ beep: null, buzzer: null });
  const questionStartRef = useRef(null);

  const questions = [
    "Tell me about yourself.",
    "Why do you want to work at our company?",
    "What are your strengths and weaknesses?",
    "Describe a challenging project you worked on.",
    "Where do you see yourself in 5 years?",
    "Explain a technical decision you took in your last project.",
    "How do you stay updated with new technologies?",
    "Describe a time you fixed a production bug.",
    "How do you prioritize tasks when overloaded?",
    "How do you handle feedback?",
  ];

  useEffect(() => {
    audioRefs.current.beep = new Audio("/sound.mp3");
    audioRefs.current.buzzer = new Audio("/buzzer.mp3");
  }, []);

  const speakQuestion = (text) => {
    if (!voiceEnabled || !("speechSynthesis" in window)) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  };

  const getRemainingQuestions = (curHistory = history) =>
    questions.filter((q) => !curHistory.some((h) => h.question === q));

  const pickRandomQuestion = (curHistory = history) => {
    const remaining = getRemainingQuestions(curHistory);
    if (remaining.length === 0) {
      setCompleted(true);
      setTimerActive(false);
      setQuestion("");
      return;
    }
    const next = remaining[Math.floor(Math.random() * remaining.length)];
    setQuestion(next);
    setAnswer("");
    setTimeLeft(INITIAL_TIME);
    setTimerActive(true);
    questionStartRef.current = Date.now();
    speakQuestion(next);
  };

  const startInterview = () => {
    setStarted(true);
    setCompleted(false);
    setHistory([]);
    pickRandomQuestion([]);
  };

  // Speech recognition
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      recognitionRef.current = null;
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setAnswer(transcript);
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognitionRef.current = recognition;
  }, []);

  const startListening = () => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.start();
      setListening(true);
    } catch {}
  };
  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  const submitAnswer = () => {
    if (answer.trim() === "") return;
    stopListening();
    const timeTaken = questionStartRef.current
      ? Math.max(1, Math.round((Date.now() - questionStartRef.current) / 1000))
      : 0;
    const feedback = "Feedback will appear here (connect AI later).";
    const newEntry = { question, answer, timeTaken, feedback, score: null };
    const newHistory = [...history, newEntry];
    setHistory(newHistory);
    newHistory.length >= questions.length
      ? setCompleted(true)
      : pickRandomQuestion(newHistory);
  };

  const skipQuestion = () => {
    stopListening();
    const timeTaken = questionStartRef.current
      ? Math.max(1, Math.round((Date.now() - questionStartRef.current) / 1000))
      : 0;
    const newEntry = {
      question,
      answer: "(skipped)",
      timeTaken,
      feedback: "Skipped",
      score: null,
    };
    const newHistory = [...history, newEntry];
    setHistory(newHistory);
    newHistory.length >= questions.length
      ? setCompleted(true)
      : pickRandomQuestion(newHistory);
  };

  const handleTimeout = () => {
    stopListening();
    const timeTaken = questionStartRef.current
      ? Math.max(1, Math.round((Date.now() - questionStartRef.current) / 1000))
      : 0;
    const newEntry = {
      question,
      answer: "(no response)",
      timeTaken,
      feedback: "Timed out",
      score: null,
    };
    const newHistory = [...history, newEntry];
    setHistory(newHistory);
    newHistory.length >= questions.length
      ? setCompleted(true)
      : pickRandomQuestion(newHistory);
  };

  // Timer countdown
  useEffect(() => {
    if (!timerActive) return;
    const id = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [timerActive]);

  // Sounds on timeout
  useEffect(() => {
    if (!timerActive) return;
    if (timeLeft === 10) audioRefs.current.beep?.play().catch(() => {});
    if (timeLeft === 0) {
      audioRefs.current.buzzer?.play().catch(() => {});
      setTimeout(() => handleTimeout(), 300);
    }
  }, [timeLeft, timerActive]);

  const avgTime =
    history.length === 0
      ? 0
      : Math.round(
          (history.reduce((s, h) => s + (h.timeTaken || 0), 0) / history.length) *
            10
        ) / 10;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 relative overflow-hidden">
      {/* Glowing background */}
      <div className="absolute w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-20 animate-pulse top-20 left-10"></div>
      <div className="absolute w-72 h-72 bg-purple-500 rounded-full blur-3xl opacity-20 animate-pulse bottom-20 right-10"></div>

      {/* Header */}
      <header className="relative z-10 bg-gray-800/80 backdrop-blur-md border-b border-gray-700 text-white p-4 flex justify-between items-center">
        <h1 className="text-lg font-bold">🎤 Candidate Interview</h1>
        <div className="flex items-center gap-3">
          <span className="bg-purple-600 px-3 py-1 rounded-full text-sm">
            {history.length}/{questions.length}
          </span>
          <button
            onClick={() => setVoiceEnabled((v) => !v)}
            className="px-3 py-1 border border-blue-400 text-blue-400 rounded-lg hover:bg-blue-500 hover:text-white transition"
          >
            {voiceEnabled ? "🔊 Voice On" : "🔇 Voice Off"}
          </button>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto py-8 px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Panel */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-gray-800/90 border border-gray-700 rounded-2xl shadow-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-bold text-blue-400">
                  Practice Interview
                </h2>
                <p className="text-gray-400">
                  Answer questions, practice timing, and boost confidence.
                </p>
              </div>
              {!started ? (
                <button
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md"
                  onClick={startInterview}
                >
                  ✅ Start
                </button>
              ) : (
                <button
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-md"
                  onClick={() => window.location.reload()}
                >
                  🔄 Reset
                </button>
              )}
            </div>

            {/* Active Question */}
            {started && !completed && (
              <>
                <div className="mb-4">
                  <p
                    className={`font-medium ${
                      timeLeft <= 10 ? "text-red-400 animate-pulse" : "text-green-400"
                    }`}
                  >
                    ⏳ Time Left: {timeLeft}s
                  </p>
                  <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                    <div
                      className={`h-2 rounded-full ${
                        timeLeft <= 10 ? "bg-red-500" : "bg-blue-500"
                      }`}
                      style={{ width: `${(timeLeft / INITIAL_TIME) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-white">
                    {question}
                  </h3>
                  <div className="flex gap-2 mt-2">
                    {!listening ? (
                      <button
                        className="bg-green-600 text-white px-4 py-2 rounded-lg"
                        onClick={startListening}
                      >
                        🎙️ Speak
                      </button>
                    ) : (
                      <button
                        className="bg-red-600 text-white px-4 py-2 rounded-lg"
                        onClick={stopListening}
                      >
                        ⏹️ Stop
                      </button>
                    )}
                    <button
                      className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg"
                      onClick={skipQuestion}
                    >
                      ⏭️ Skip
                    </button>
                  </div>
                </div>

                <textarea
                  className="w-full bg-gray-900 border border-gray-700 text-gray-200 rounded-lg p-3 mb-3 focus:ring-2 focus:ring-blue-500 outline-none"
                  rows={4}
                  placeholder="Type your answer here..."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                />

                <div className="flex justify-end">
                  <button
                    className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-lg shadow hover:scale-[1.05] transform transition duration-200"
                    onClick={submitAnswer}
                  >
                    Submit
                  </button>
                </div>
              </>
            )}

            {/* Completed */}
            {completed && (
              <div className="p-4 bg-gray-900/70 border border-gray-700 rounded-lg">
                <h3 className="text-xl font-bold mb-2 text-green-400">
                  🎉 Interview Completed
                </h3>
                <p className="text-gray-300">
                  Answered: {history.length} / {questions.length}
                </p>
                <p className="text-gray-300">
                  Average time per question: {avgTime}s
                </p>
                <div className="mt-4 space-y-4">
                  {history.map((h, i) => (
                    <div
                      key={i}
                      className="border-b border-gray-700 pb-2 flex gap-3 items-start"
                    >
                      <span className="font-bold text-blue-400">{i + 1}.</span>
                      <div>
                        <p className="font-semibold text-white">{h.question}</p>
                        <p className="text-gray-300">{h.answer}</p>
                        <p className="text-sm text-gray-500">
                          {h.timeTaken}s • {h.feedback}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-center mt-4">
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                    onClick={() => window.location.reload()}
                  >
                    🔄 Restart
                  </button>
                </div>
              </div>
            )}

            {!started && (
              <div className="bg-gray-900/70 p-3 rounded-lg text-gray-300 border border-gray-700">
                💡 Tip: Use <b>Speak</b> 🎙️ to answer verbally, or type in the
                box. Toggle voice at the top-right to mute the interviewer.
              </div>
            )}
          </div>
        </div>

        {/* Right Panel */}
        <div className="bg-gray-800/90 border border-gray-700 rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-blue-400 mb-3">
            📝 Recent Answers
          </h3>
          {history.length === 0 ? (
            <p className="text-gray-500">No answers yet.</p>
          ) : (
            <ul className="space-y-2">
              {history
                .slice()
                .reverse()
                .map((h, i) => (
                  <li
                    key={i}
                    className="border-b border-gray-700 pb-2 text-sm text-gray-300"
                  >
                    <p className="font-semibold text-white">{h.question}</p>
                    <p className="text-gray-400">
                      {h.answer} • {h.timeTaken}s
                    </p>
                  </li>
                ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}



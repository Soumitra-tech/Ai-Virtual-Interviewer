import React, { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(email, password);
      const role = user.role.toLowerCase();
      if (role === "candidate") navigate("/candidate");
      else if (role === "recruiter") navigate("/recruiter");
      else navigate("/");
    } catch (err) {
      alert("Login failed: " + (err.response?.data?.message || "Unknown error"));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      {/* Animated glowing ring background */}
      <div className="absolute w-72 h-72 bg-blue-500 rounded-full blur-3xl opacity-20 animate-pulse top-10 left-10"></div>
      <div className="absolute w-64 h-64 bg-purple-500 rounded-full blur-3xl opacity-20 animate-pulse bottom-10 right-10"></div>

      {/* Login Card */}
      <div className="relative w-full max-w-md bg-gray-800/90 border border-gray-700 shadow-xl rounded-2xl p-8 backdrop-blur-md">
        <h2 className="text-3xl font-bold text-center text-white mb-6 tracking-wide">
          Login to <span className="text-blue-400">Your Account</span>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              type="email"
              className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <input
              type="password"
              className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow-md hover:scale-[1.02] transform transition duration-200"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-center text-gray-400 mt-5">
          Don’t have an account?{" "}
          <span
            className="text-blue-400 hover:underline cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}
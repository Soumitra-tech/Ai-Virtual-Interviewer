import React, { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("candidate");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup({ name, email, password, role });
      navigate("/login");
    } catch (err) {
      alert("Signup failed: " + (err.response?.data?.message || "Unknown error"));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 relative overflow-hidden">
      {/* Background glowing orbs */}
      <div className="absolute w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-20 animate-pulse top-16 left-12"></div>
      <div className="absolute w-72 h-72 bg-purple-500 rounded-full blur-3xl opacity-20 animate-pulse bottom-16 right-12"></div>

      {/* Signup Card */}
      <div className="relative z-10 w-full max-w-md bg-gray-800/90 border border-gray-700 rounded-2xl shadow-xl p-8 backdrop-blur-md">
        <h2 className="text-3xl font-bold text-center text-white mb-6">
          ✨ Create Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            <option value="candidate">Candidate</option>
            <option value="recruiter">Recruiter</option>
          </select>

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow hover:scale-[1.02] transform transition duration-200"
          >
            Sign Up
          </button>

          <p className="text-sm text-center text-gray-400 mt-2">
            Already have an account?{" "}
            <span
              className="text-blue-400 hover:underline cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}


import React from "react";
import { useAuth } from "../auth/AuthContext";

export default function RecruiterDashboard() {
  const { logout } = useAuth();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-lg text-center">
        <h1 className="text-3xl font-bold mb-4">💼 Recruiter Dashboard</h1>
        <p className="text-gray-700 mb-6">
          Welcome Recruiter! Here you can review candidate performance.
        </p>
        <button
          onClick={logout}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

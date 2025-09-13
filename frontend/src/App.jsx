import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import CandidateInterview from "./pages/CandidateInterview";
import RecruiterDashboard from "./pages/RecruiterDashboard";

function PrivateRoute({ children, role }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (role && user.role.toLowerCase() !== role.toLowerCase()) return <Navigate to="/login" />;
  return children;
}


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/candidate" element={<PrivateRoute role="candidate"><CandidateInterview /></PrivateRoute>} />
        <Route path="/recruiter" element={<PrivateRoute role="recruiter"><RecruiterDashboard /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}


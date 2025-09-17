import React, { createContext, useContext, useState } from "react";
import API from "../utils/api"; // ✅ import central axios instance

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    const res = await API.post("/api/auth/login", { email, password });
    setUser(res.data.user);
    localStorage.setItem("token", res.data.token);
    return res.data.user;
  };

  const signup = async ({ email, password, role }) => {
    const res = await API.post("/api/auth/register", {
      email,
      password,
      role,
    });
    return res.data.user;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

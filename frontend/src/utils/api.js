// src/utils/api.js
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // ✅ dynamic URL
  withCredentials: true,
});

export default API;

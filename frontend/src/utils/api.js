<<<<<<< HEAD
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

export default API;
=======
// src/utils/api.js
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // ✅ dynamic URL
  withCredentials: true,
});

export default API;
>>>>>>> 04418289274121c1af2b0526cdeaf7d2b70140fc

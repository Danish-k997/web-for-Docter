import axios from "axios";
const rawURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
const baseURL = `${rawURL.replace(/\/$/, "")}/api`;

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;

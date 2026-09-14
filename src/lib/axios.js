import axios from "axios";

// In production the frontend (Vercel) and backend (Render) are separate
// domains, so the API base can't just be a relative "/api" — it needs the
// backend's real URL, supplied at build time via VITE_API_URL.
const API_ORIGIN =
  import.meta.env.MODE === "development" ? "http://localhost:7500" : import.meta.env.VITE_API_URL || "";

export const axiosInstance = axios.create({
  baseURL: `${API_ORIGIN}/api`,
  withCredentials: true,
});

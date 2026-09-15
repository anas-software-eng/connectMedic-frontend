import axios from "axios";

// VITE_API_URL always wins when set (e.g. pointing a local dev server at the
// deployed Render backend instead of a local one). Falls back to a local
// backend in dev, or same-origin in production if it's ever left unset.
const API_ORIGIN =
  import.meta.env.VITE_API_URL || (import.meta.env.MODE === "development" ? "http://localhost:7500" : "");

export const axiosInstance = axios.create({
  baseURL: `${API_ORIGIN}/api`,
  withCredentials: true,
});

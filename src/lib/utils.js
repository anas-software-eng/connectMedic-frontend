// Best-effort message out of an Axios error. Falls back past a missing
// response body (network drop, CORS, timeout) instead of throwing.
export function getErrorMessage(error, fallback = "Something went wrong") {
  return error?.response?.data?.message || error?.message || fallback;
}

export function formatMessageTime(date) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

// "2026-09-12" -> "Sat, 12 Sep 2026"
export function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// "14:30" -> "2:30 PM"
export function formatTime(timeStr) {
  if (!timeStr) return "";
  const [h, m] = String(timeStr).split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m).padStart(2, "0")} ${ampm}`;
}

// Compact relative time for notification/activity feeds: "2m ago", "3h ago".
export function timeAgo(date) {
  const seconds = Math.round((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// Specializations may be stored as a slug ("general-physician") or a label
// ("Cardiologist") depending on how the profile was saved — show both nicely.
export function formatSpec(value) {
  const v = String(value || "");
  return v.includes("-")
    ? v.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : v;
}

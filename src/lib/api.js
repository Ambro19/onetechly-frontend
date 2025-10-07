// Central axios client so every request points to the right API.
// PROD → https://api.onetechly.com
// DEV  → REACT_APP_API_URL (if set) else http://localhost:8000

import axios from "axios";

const prodDefault =
  typeof window !== "undefined" &&
  window.location.hostname &&
  window.location.hostname.endsWith("onetechly.com")
    ? "https://api.onetechly.com"
    : null;

const baseURL =
  (process.env.REACT_APP_API_URL || "").trim() ||
  prodDefault ||
  "http://localhost:8000";

export const api = axios.create({
  baseURL,
  // withCredentials: true, // enable only if you switch to cookie-based auth
});

export function currentApiBase() {
  return baseURL;
}

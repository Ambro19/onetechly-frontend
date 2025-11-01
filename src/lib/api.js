// src/lib/api.js
import axios from "axios";

// API configuration with fallbacks
const API_BASE_URLS = {
  production: process.env.REACT_APP_API_URL || "https://api.onetechly.com",
  development: "http://localhost:8000",
  local: "http://192.168.1.185:8000",
};

// Determine current environment
const getApiBase = () => {
  const env = process.env.NODE_ENV;
  const customUrl = process.env.REACT_APP_API_URL;
  
  if (customUrl) return customUrl;
  
  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    return API_BASE_URLS.development;
  }
  
  if (window.location.hostname === "192.168.1.185") {
    return API_BASE_URLS.local;
  }
  
  return API_BASE_URLS.production;
};

export const currentApiBase = getApiBase;

// Create axios instance with better defaults
export const api = axios.create({
  baseURL: getApiBase(),
  timeout: 30000,
  withCredentials: true, // Important for cookies/sessions if used
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`API ${config.method?.toUpperCase()} ${config.url}`, config);
    return config;
  },
  (error) => {
    console.error("API request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("API response error:", error);
    
    // Enhanced error handling
    if (error.code === "NETWORK_ERROR" || error.code === "ECONNREFUSED") {
      error.message = "Cannot connect to server. Please check your internet connection.";
    } else if (error.response?.status === 401) {
      // Auto-logout on 401
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
      delete api.defaults.headers.common["Authorization"];
      
      // Only redirect if we're not already on login page
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login?session=expired";
      }
    }
    
    return Promise.reject(error);
  }
);

// API helper functions
export const apiGetJson = async (endpoint) => {
  const response = await api.get(endpoint);
  return response.data;
};

export const apiPostJson = async (endpoint, data) => {
  const response = await api.post(endpoint, data);
  return response.data;
};

export const apiPutJson = async (endpoint, data) => {
  const response = await api.put(endpoint, data);
  return response.data;
};

export const apiDeleteJson = async (endpoint) => {
  const response = await api.delete(endpoint);
  return response.data;
};

// Wake API function with better error handling
export const wakeApi = async () => {
  try {
    const response = await fetch(`${getApiBase()}/health`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    console.log("API wake-up successful");
    return true;
  } catch (error) {
    console.warn("API wake-up failed:", error.message);
    return false;
  }
};

//////////////////////////////////////////////////////////////////////////
// // src/lib/api.js
// // Centralized API client + small helper wrappers.
// // PROD → https://api.onetechly.com     (or set REACT_APP_API_URL on your host)
// // DEV  → REACT_APP_API_URL (if set) else http://localhost:8000

// import axios from "axios";

// const TOKEN_KEY = "auth_token";

// // ----- Resolve base URL (env first, then prod default on onetechly.com, else localhost)
// const prodDefault =
//   typeof window !== "undefined" &&
//   window.location.hostname &&
//   window.location.hostname.endsWith("onetechly.com")
//     ? "https://api.onetechly.com"
//     : null;

// const baseURL =
//   (process.env.REACT_APP_API_URL || process.env.REACT_APP_API_BASE_URL || "").trim() ||
//   prodDefault ||
//   "http://localhost:8000";

// // ----- Axios instance
// export const api = axios.create({
//   baseURL,
//   timeout: 30000, // 30s network timeout
// });

// // Attach Bearer token from localStorage if present
// api.interceptors.request.use((config) => {
//   try {
//     const token = localStorage.getItem(TOKEN_KEY);
//     if (token && !config.headers?.Authorization) {
//       config.headers = config.headers || {};
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//   } catch {
//     /* ignore */
//   }
//   return config;
// });

// // ----- Error normalization (nice messages everywhere)
// function normalizeError(err) {
//   // Axios error shapes vary (network vs server)
//   const res = err?.response;
//   const data = res?.data;

//   const detail =
//     data?.detail ||
//     data?.message ||
//     data?.error ||
//     (typeof data === "string" ? data : null);

//   const status = res?.status;
//   const code = err?.code;

//   const msg =
//     detail ||
//     (status ? `Request failed with status ${status}` : code ? `Network error (${code})` : "Network error");

//   const out = new Error(msg);
//   out.status = status;
//   out.code = code;
//   out.data = data;
//   return out;
// }

// // ----- Small exponential-backoff helper (handles Render cold starts, 503s, brief flaps)
// async function withRetry(fn, {
//   attempts = 8,           // ~50–60s max
//   firstDelayMs = 800,
//   maxDelayMs = 6000,
//   shouldRetry = (error) => {
//     const status = error?.response?.status;
//     // Retry on 429/503/504 and on network errors (no response)
//     return !error?.response || status === 429 || status === 503 || status === 504;
//   },
// } = {}) {
//   let delay = firstDelayMs;
//   let lastErr;
//   for (let i = 0; i < attempts; i++) {
//     try {
//       return await fn();
//     } catch (err) {
//       lastErr = err;
//       if (i === attempts - 1 || !shouldRetry(err)) break;
//       await new Promise((r) => setTimeout(r, delay));
//       delay = Math.min(maxDelayMs, Math.round(delay * 1.6));
//     }
//   }
//   throw normalizeError(lastErr);
// }

// // ----- JSON helpers (consistent behavior + retries)
// export async function apiGetJson(path, config = {}) {
//   return withRetry(async () => {
//     try {
//       const res = await api.get(path, config);
//       return res.data;
//     } catch (err) {
//       throw normalizeError(err);
//     }
//   });
// }

// export async function apiPostJson(path, body, config = {}) {
//   return withRetry(async () => {
//     try {
//       const res = await api.post(path, body, {
//         headers: { "Content-Type": "application/json" },
//         ...config,
//       });
//       return res.data;
//     } catch (err) {
//       throw normalizeError(err);
//     }
//   });
// }

// export async function apiPutJson(path, body, config = {}) {
//   return withRetry(async () => {
//     try {
//       const res = await api.put(path, body, {
//         headers: { "Content-Type": "application/json" },
//         ...config,
//       });
//       return res.data;
//     } catch (err) {
//       throw normalizeError(err);
//     }
//   });
// }

// export async function apiDelete(path, config = {}) {
//   return withRetry(async () => {
//     try {
//       const res = await api.delete(path, config);
//       return res.data;
//     } catch (err) {
//       throw normalizeError(err);
//     }
//   });
// }

// // ----- Wake the API (use on app mount, optional)
// export async function wakeApi() {
//   try {
//     await withRetry(() => api.get("/health", { validateStatus: () => true }), {
//       attempts: 6,
//       firstDelayMs: 600,
//     });
//     return true;
//   } catch {
//     return false; // Non-fatal; UI can still proceed and show a toast if needed
//   }
// }

// // Handy getter (used by AuthDebug etc.)
// export function currentApiBase() {
//   return baseURL;
// }

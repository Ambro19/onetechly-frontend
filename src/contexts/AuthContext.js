// ========================================
// AUTH CONTEXT - PIXELPERFECT SCREENSHOT API
// ========================================
// File: frontend/src/contexts/AuthContext.js
// Author: OneTechly
// Purpose: Authentication context provider with token management
// Updated: January 2026 - Production-ready hardened version
//
// Improvements:
// - Robust error normalization (works with axios OR fetch OR custom api helpers)
// - Health-check gating for login + clean messages for 401/422/429/5xx
// - Safer boot: validates token, clears corrupted storage, avoids stale auth states
// - Centralized storage + header application

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import toast from "react-hot-toast";
import {
  api,
  apiGetJson,
  apiPostJson,
  wakeApi,
  currentApiBase as currentApiBaseFn,
} from "../lib/api";

const AuthContext = createContext(null);

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

// Frontend guardrails (optional, matches .env we added)
const PASSWORD_MAX_LEN = Number(process.env.REACT_APP_PASSWORD_MAX_LEN || 128);

function safeJsonParse(str, fallback = null) {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}

/**
 * Normalize errors coming from:
 * - axios (error.response / error.request)
 * - fetch wrappers (Error with .status / .data)
 * - custom api libs
 */
function normalizeApiError(err) {
  const out = {
    status: undefined,
    detail: undefined,
    message: "Request failed",
    raw: err,
  };

  if (!err) return out;

  // Axios-style
  const axiosStatus = err?.response?.status;
  const axiosDetail = err?.response?.data?.detail ?? err?.response?.data?.message;
  if (axiosStatus) {
    out.status = axiosStatus;
    out.detail = axiosDetail;
    out.message = typeof axiosDetail === "string" ? axiosDetail : (err.message || out.message);
    return out;
  }

  // Fetch-like "Response" accidentally thrown/passed
  if (typeof err?.status === "number") {
    out.status = err.status;
    const d = err?.detail ?? err?.data?.detail ?? err?.message;
    out.detail = d;
    out.message = typeof d === "string" ? d : (err.message || out.message);
    return out;
  }

  // Plain error
  if (typeof err?.message === "string") {
    out.message = err.message;
    return out;
  }

  // String
  if (typeof err === "string") {
    out.message = err;
    return out;
  }

  return out;
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState("checking");

  const isAuthenticated = !!token;

  // Apply token to axios instance headers (source of truth).
  const applyToken = useCallback((tok) => {
    try {
      if (tok) {
        api.defaults.headers.common["Authorization"] = `Bearer ${tok}`;
        localStorage.setItem(TOKEN_KEY, tok);
      } else {
        delete api.defaults.headers.common["Authorization"];
        localStorage.removeItem(TOKEN_KEY);
      }
    } catch {
      /* ignore storage errors */
    }
  }, []);

  const clearAuth = useCallback(() => {
    setToken("");
    setUser(null);
    applyToken("");
    try {
      localStorage.removeItem(USER_KEY);
    } catch {
      /* ignore */
    }
  }, [applyToken]);

  // Check API connectivity
  const checkApiHealth = useCallback(async () => {
    try {
      const base = currentApiBaseFn().replace(/\/+$/, "");
      const response = await fetch(`${base}/health`, { cache: "no-store" });
      if (response.ok) {
        setApiStatus("healthy");
        return true;
      }
      setApiStatus("unhealthy");
      return false;
    } catch (error) {
      console.error("API health check failed:", error);
      setApiStatus("offline");
      return false;
    }
  }, []);

  // Boot: load token+user from storage, attach to axios, validate token
  useEffect(() => {
    const initializeAuth = async () => {
      const savedToken = localStorage.getItem(TOKEN_KEY) || "";
      const savedUserRaw = localStorage.getItem(USER_KEY);

      // Always attempt health check, but don't block UI forever on it
      await checkApiHealth();

      if (savedToken) {
        setToken(savedToken);
        applyToken(savedToken);

        // Verify token is still valid
        try {
          const me = await apiGetJson("/users/me");
          if (me) {
            setUser(me);
            try {
              localStorage.setItem(USER_KEY, JSON.stringify(me));
            } catch {
              /* ignore storage errors */
            }
          } else {
            clearAuth();
          }
        } catch (e) {
          console.error("Token validation failed:", e);
          clearAuth();
        }
      } else {
        // No token -> do NOT treat saved user as authenticated.
        // (We can keep it around for UI hints if you want, but default is safer.)
        if (savedUserRaw) {
          const parsed = safeJsonParse(savedUserRaw, null);
          if (parsed && typeof parsed === "object") {
            setUser(parsed);
          } else {
            try {
              localStorage.removeItem(USER_KEY);
            } catch {}
          }
        }
      }

      setIsLoading(false);
    };

    initializeAuth();
  }, [applyToken, checkApiHealth, clearAuth]);

  // ---- Login (robust)
  const login = useCallback(
    async (username, password) => {
      const isHealthy = await checkApiHealth();
      if (!isHealthy) {
        throw new Error("Service is temporarily unavailable. Please try again later.");
      }

      const u = (username || "").trim();
      const p = (password || "");

      if (!u || !p) {
        throw new Error("Please enter both username and password");
      }

      // Guard against accidental huge pastes (backend is safe now, but keep UX clean)
      if (p.length > PASSWORD_MAX_LEN) {
        throw new Error(`Password must be at most ${PASSWORD_MAX_LEN} characters`);
      }

      // PixelPerfect backend uses /token_json
      const body = { username: u, password: p };

      try {
        const res = await apiPostJson("/token_json", body);

        if (!res?.access_token) {
          throw new Error("Invalid login response from server");
        }

        // Set token first
        applyToken(res.access_token);
        setToken(res.access_token);

        // Fetch user profile
        try {
          const me = await apiGetJson("/users/me");
          if (me) {
            setUser(me);
            try {
              localStorage.setItem(USER_KEY, JSON.stringify(me));
            } catch {
              /* ignore */
            }
          } else if (res.user) {
            setUser(res.user);
            try {
              localStorage.setItem(USER_KEY, JSON.stringify(res.user));
            } catch {
              /* ignore */
            }
          }
        } catch (e) {
          // Don’t fail login if profile fetch fails — just log it.
          console.error("Failed to fetch /users/me after login:", e);
          if (res.user) {
            setUser(res.user);
            try {
              localStorage.setItem(USER_KEY, JSON.stringify(res.user));
            } catch {}
          }
        }

        return res;
      } catch (err) {
        // Ensure we don't leave half-auth state
        clearAuth();

        const n = normalizeApiError(err);
        const status = n.status;

        // Prefer backend "detail" string when present
        const detail = typeof n.detail === "string" ? n.detail : undefined;

        if (status === 401) throw new Error("Invalid username or password");
        if (status === 422) throw new Error(detail || "Invalid input data");
        if (status === 429) throw new Error("Too many attempts. Please wait and try again.");
        if (status >= 500) throw new Error("Server error. Please try again later.");

        // Network / connectivity
        if (
          n.message?.toLowerCase().includes("network") ||
          n.message?.toLowerCase().includes("connect") ||
          n.message?.toLowerCase().includes("failed to fetch")
        ) {
          throw new Error("Cannot connect to server. Please check your connection.");
        }

        throw new Error(detail || n.message || "Login failed");
      }
    },
    [applyToken, checkApiHealth, clearAuth]
  );

  // ---- Logout
  const logout = useCallback(() => {
    clearAuth();
    toast.success("Signed out");
  }, [clearAuth]);

  // Wake API and check health periodically
  useEffect(() => {
    const initializeApi = async () => {
      try {
        await wakeApi();
        await checkApiHealth();
      } catch (error) {
        console.error("API initialization failed:", error);
      }
    };

    initializeApi();

    // periodic health check every 5 minutes
    const interval = setInterval(checkApiHealth, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [checkApiHealth]);

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated,
      isLoading,
      apiStatus,
      login,
      logout,
      setToken,
      setUser,
      apiBaseUrl: currentApiBaseFn(),
      apiFetch: api,
      checkApiHealth,
    }),
    [token, user, isAuthenticated, isLoading, apiStatus, login, logout, checkApiHealth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}

//////////////////////////////////////////////////////////////////
// // ========================================
// // AUTH CONTEXT - PIXELPERFECT SCREENSHOT API
// // ========================================
// // File: frontend/src/contexts/AuthContext.js
// // Author: OneTechly
// // Purpose: Authentication context provider with token management
// // Updated: January 2026 - Updated for PixelPerfect

// import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
// import toast from "react-hot-toast";
// import { api, apiGetJson, apiPostJson, wakeApi, currentApiBase as currentApiBaseFn } from "../lib/api";

// const AuthContext = createContext(null);

// const TOKEN_KEY = "auth_token";
// const USER_KEY = "auth_user";

// export function AuthProvider({ children }) {
//   const [token, setToken] = useState("");
//   const [user, setUser] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [apiStatus, setApiStatus] = useState("checking");

//   const isAuthenticated = !!token;

//   // Apply token to axios instance headers (source of truth).
//   const applyToken = useCallback((tok) => {
//     try {
//       if (tok) {
//         api.defaults.headers.common["Authorization"] = `Bearer ${tok}`;
//         localStorage.setItem(TOKEN_KEY, tok);
//       } else {
//         delete api.defaults.headers.common["Authorization"];
//         localStorage.removeItem(TOKEN_KEY);
//       }
//     } catch {
//       /* ignore storage errors */
//     }
//   }, []);

//   // Check API connectivity
//   const checkApiHealth = useCallback(async () => {
//     try {
//       const response = await fetch(`${currentApiBaseFn()}/health`);
//       if (response.ok) {
//         setApiStatus("healthy");
//         return true;
//       } else {
//         setApiStatus("unhealthy");
//         return false;
//       }
//     } catch (error) {
//       console.error("API health check failed:", error);
//       setApiStatus("offline");
//       return false;
//     }
//   }, []);

//   // Boot: load token+user from storage, attach to axios
//   useEffect(() => {
//     const initializeAuth = async () => {
//       const savedToken = localStorage.getItem(TOKEN_KEY) || "";
//       const savedUser = localStorage.getItem(USER_KEY);
      
//       // Check API health first
//       await checkApiHealth();
      
//       if (savedToken) {
//         setToken(savedToken);
//         applyToken(savedToken);
        
//         // Verify token is still valid
//         try {
//           const me = await apiGetJson("/users/me");
//           if (me) {
//             setUser(me);
//             try {
//               localStorage.setItem(USER_KEY, JSON.stringify(me));
//             } catch {
//               /* ignore storage errors */
//             }
//           } else {
//             // Token invalid
//             setToken("");
//             applyToken("");
//             localStorage.removeItem(USER_KEY);
//           }
//         } catch (error) {
//           console.error("Token validation failed:", error);
//           // Token invalid or API error
//           setToken("");
//           applyToken("");
//           localStorage.removeItem(USER_KEY);
//         }
//       } else if (savedUser) {
//         try {
//           setUser(JSON.parse(savedUser));
//         } catch {
//           localStorage.removeItem(USER_KEY);
//         }
//       }
      
//       setIsLoading(false);
//     };

//     initializeAuth();
//   }, [applyToken, checkApiHealth]);

//   // ---- Enhanced Login with better error handling
//   const login = useCallback(async (username, password) => {
//     // Check API health first
//     const isHealthy = await checkApiHealth();
//     if (!isHealthy) {
//       throw new Error("Service is temporarily unavailable. Please try again later.");
//     }

//     // ✅ Use /token_json endpoint (PixelPerfect backend)
//     const body = { 
//       username: (username || "").trim(), 
//       password: password || "" 
//     };
    
//     try {
//       const res = await apiPostJson("/token_json", body);
      
//       if (!res?.access_token) {
//         throw new Error("Invalid login response from server");
//       }
      
//       applyToken(res.access_token);
//       setToken(res.access_token);
      
//       // Get fresh user data after login
//       try {
//         const userData = await apiGetJson("/users/me");
//         if (userData) {
//           setUser(userData);
//           try {
//             localStorage.setItem(USER_KEY, JSON.stringify(userData));
//           } catch {
//             /* ignore storage errors */
//           }
//         }
//       } catch (userError) {
//         console.error("Failed to fetch user data after login:", userError);
//         // Still proceed with login if we have basic user info
//         if (res.user) {
//           setUser(res.user);
//           try {
//             localStorage.setItem(USER_KEY, JSON.stringify(res.user));
//           } catch {
//             /* ignore storage errors */
//           }
//         }
//       }
      
//       return res;
//     } catch (error) {
//       console.error("Login error:", error);
      
//       // Provide more specific error messages
//       if (error.response) {
//         const status = error.response.status;
//         const message = error.response.data?.detail || error.message;
        
//         if (status === 401) {
//           throw new Error("Invalid username or password");
//         } else if (status === 422) {
//           throw new Error("Invalid input data");
//         } else if (status >= 500) {
//           throw new Error("Server error. Please try again later.");
//         } else {
//           throw new Error(message || "Login failed");
//         }
//       } else if (error.request) {
//         throw new Error("Cannot connect to server. Please check your connection.");
//       } else {
//         throw new Error(error.message || "Login failed");
//       }
//     }
//   }, [applyToken, checkApiHealth]);

//   // ---- Logout
//   const logout = useCallback(() => {
//     setToken("");
//     applyToken("");
//     setUser(null);
//     try {
//       localStorage.removeItem(USER_KEY);
//     } catch {
//       /* ignore */
//     }
//     toast.success("Signed out");
//   }, [applyToken]);

//   // Wake API and check health periodically
//   useEffect(() => {
//     const initializeApi = async () => {
//       try {
//         await wakeApi();
//         await checkApiHealth();
//       } catch (error) {
//         console.error("API initialization failed:", error);
//       }
//     };

//     initializeApi();
    
//     // Optional: periodic health check every 5 minutes
//     const interval = setInterval(checkApiHealth, 5 * 60 * 1000);
//     return () => clearInterval(interval);
//   }, [checkApiHealth]);

//   const value = useMemo(
//     () => ({
//       token,
//       user,
//       isAuthenticated,
//       isLoading,
//       apiStatus,
//       login,
//       logout,
//       setToken,
//       setUser,
//       apiBaseUrl: currentApiBaseFn(),
//       apiFetch: api,
//       checkApiHealth,
//     }),
//     [token, user, isAuthenticated, isLoading, apiStatus, login, logout, checkApiHealth]
//   );

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// }

// export function useAuth() {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
//   return ctx;
// }

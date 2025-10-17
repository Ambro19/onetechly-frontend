// src/contexts/AuthContext.js
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

/** ---------- API base detection ---------- */
function resolveApiBase() {
  const envUrl =
    process.env.REACT_APP_API_URL ||
    process.env.REACT_APP_API_BASE_URL ||
    "";

  if (envUrl) return envUrl.replace(/\/+$/, "");

  // If site is running on onetechly.com, talk to the Render API
  const host = typeof window !== "undefined" ? window.location.hostname : "";
  if (host.endsWith("onetechly.com")) {
    return "https://youtube-trans-downloader-api.onrender.com";
  }

  // Fallback for local dev
  return "http://localhost:8000";
}

const API_BASE_URL = resolveApiBase();

/** ---------- Storage keys ---------- */
const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

/** ---------- Retry / wake helpers ---------- */
const DEFAULT_TIMEOUT_MS = 9000;

function timeoutSignal(ms = DEFAULT_TIMEOUT_MS) {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), ms);
  return { signal: ctrl.signal, cancel: () => clearTimeout(id) };
}

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Wake (or confirm) the API by hitting /health with retry & small backoff.
 * Good for free-tier cold starts.
 */
async function wakeApi({
  maxAttempts = 4,
  initialDelayMs = 400,
  timeoutMs = DEFAULT_TIMEOUT_MS,
} = {}) {
  let attempt = 0;
  let lastErr;

  while (attempt < maxAttempts) {
    const delay = attempt === 0 ? 0 : initialDelayMs * Math.pow(1.6, attempt - 1);
    if (delay) await sleep(delay);

    const t = timeoutSignal(timeoutMs);
    try {
      const res = await fetch(`${API_BASE_URL}/health`, {
        method: "GET",
        mode: "cors",
        headers: { "Accept": "application/json" },
        signal: t.signal,
      });
      t.cancel();
      if (res.ok) return true;

      // 503/522/524 are common during warmup or Render routing hiccups
      if ([503, 522, 524].includes(res.status)) {
        lastErr = new Error(`Service warming up (HTTP ${res.status})`);
        attempt++;
        continue;
      }

      // Any other non-OK breaks fast; let caller see it
      const txt = await res.text().catch(() => "");
      throw new Error(`Health check failed (${res.status}) ${txt}`.trim());
    } catch (e) {
      t.cancel();
      lastErr = e;
      attempt++;
      // Network/CORS/timeout — keep trying a few times
    }
  }
  throw lastErr || new Error("API did not respond");
}

/**
 * apiFetch → wraps fetch with:
 *  - wakeApi() before first call (and again if we detect cold/cors/timeout)
 *  - bearer token injection
 *  - small, bounded retries for transient failures
 */
async function apiFetch(path, { retry = 2, token } = {}, init = {}) {
  const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;

  // Ensure API is up at least once before we hit an app route
  await wakeApi().catch(() => { /* we'll still try the actual call below */ });

  let lastErr;
  for (let attempt = 0; attempt <= retry; attempt++) {
    const t = timeoutSignal(DEFAULT_TIMEOUT_MS);
    try {
      const headers = new Headers(init.headers || {});
      if (token && !headers.has("Authorization")) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      const res = await fetch(url, { ...init, headers, signal: t.signal });

      t.cancel();

      // If CORS blocked or service warming, try to wake & retry
      if (!res.ok && [503, 522, 524].includes(res.status)) {
        lastErr = new Error(`Service temporarily unavailable (${res.status})`);
        await wakeApi().catch(() => {});
        continue;
      }

      return res;
    } catch (e) {
      t.cancel();
      lastErr = e;

      // AbortError or network error → try to wake and retry
      if (attempt < retry) {
        await wakeApi().catch(() => {});
        continue;
      }
    }
  }
  throw lastErr;
}

/** ---------- React Context ---------- */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || "");
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY) || "null");
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  const isAuthenticated = !!token;

  /** Persist session */
  const saveSession = useCallback((tok, usr) => {
    setToken(tok || "");
    setUser(usr || null);
    if (tok) localStorage.setItem(TOKEN_KEY, tok);
    else localStorage.removeItem(TOKEN_KEY);
    if (usr) localStorage.setItem(USER_KEY, JSON.stringify(usr));
    else localStorage.removeItem(USER_KEY);
  }, []);

  /** Login (password grant) */
  const login = useCallback(
    async (username, password) => {
      setIsLoading(true);
      try {
        const body = new URLSearchParams({ username, password });

        const res = await apiFetch(
          "/token",
          { retry: 2 },
          {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body,
          }
        );

        let data = null;
        try {
          data = await res.json();
        } catch {
          /* ignore */
        }

        if (!res.ok) {
          const msg =
            data?.detail ||
            (res.status === 422
              ? "Invalid login payload (expected form data)."
              : res.status === 401
              ? "Incorrect username or password"
              : `Login failed (${res.status})`);
          const err = new Error(msg);
          err.status = res.status;
          throw err;
        }

        const tok = data?.access_token || "";
        const usr = data?.user || null;
        const mustChange =
          !!data?.must_change_password ||
          !!data?.mustChangePassword ||
          !!data?.mustChange;

        if (!tok) {
          const err = new Error("Login response missing access_token");
          err.status = 500;
          throw err;
        }

        saveSession(tok, usr);
        return { mustChange, user: usr, token: tok };
      } finally {
        setIsLoading(false);
      }
    },
    [saveSession]
  );

  /** Logout */
  const logout = useCallback(() => {
    saveSession("", null);
  }, [saveSession]);

  /** Optional: attach token to window.fetch by default */
  useEffect(() => {
    if (window.__fetch_patched__) return;
    window.__fetch_patched__ = true;
    const origFetch = window.fetch.bind(window);
    window.fetch = (input, init = {}) => {
      try {
        const headers = new Headers(init.headers || {});
        const tok = localStorage.getItem(TOKEN_KEY);
        if (tok && !headers.has("Authorization")) {
          headers.set("Authorization", `Bearer ${tok}`);
        }
        return origFetch(input, { ...init, headers });
      } catch {
        return origFetch(input, init);
      }
    };
  }, []);

  /** Try to wake API once on app load (non-blocking) */
  useEffect(() => {
    wakeApi().catch(() => {});
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated,
      isLoading,
      login,
      logout,
      setToken, // for edge cases
      setUser,
      apiBaseUrl: API_BASE_URL,
      apiFetch, // expose wrapper for other calls if you want it
    }),
    [token, user, isAuthenticated, isLoading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}


/////////////////////////////////////////////////////////////
// // src/contexts/AuthContext.js
// import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

// const API_BASE_URL =
//   process.env.REACT_APP_API_URL ||
//   process.env.REACT_APP_API_BASE_URL ||
//   'http://localhost:8000';

// const TOKEN_KEY = 'auth_token';
// const USER_KEY  = 'auth_user';

// const AuthContext = createContext(null);

// export function AuthProvider({ children }) {
//   const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '');
//   const [user, setUser]   = useState(() => {
//     try { return JSON.parse(localStorage.getItem(USER_KEY) || 'null'); }
//     catch { return null; }
//   });
//   const [isLoading, setIsLoading] = useState(false);

//   const isAuthenticated = !!token;

//   // ---- helpers
//   const saveSession = useCallback((tok, usr) => {
//     setToken(tok || '');
//     setUser(usr || null);
//     if (tok) localStorage.setItem(TOKEN_KEY, tok); else localStorage.removeItem(TOKEN_KEY);
//     if (usr) localStorage.setItem(USER_KEY, JSON.stringify(usr)); else localStorage.removeItem(USER_KEY);
//   }, []);

//   const login = useCallback(async (username, password) => {
//     setIsLoading(true);
//     try {
//       const body = new URLSearchParams({ username, password });

//       const res = await fetch(`${API_BASE_URL}/token`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//         body
//       });

//       const data = await res.json().catch(() => null);

//       if (!res.ok) {
//         const msg =
//           data?.detail ||
//           (res.status === 422 ? 'Invalid login payload (expected form data).' :
//            res.status === 401 ? 'Incorrect username or password' :
//            `Login failed (${res.status})`);
//         const err = new Error(msg);
//         err.status = res.status;
//         throw err;
//       }

//       const tok = data?.access_token || '';
//       const usr = data?.user || null;
//       const mustChange =
//         !!data?.must_change_password || !!data?.mustChangePassword || !!data?.mustChange;

//       if (!tok) {
//         const err = new Error('Login response missing access_token');
//         err.status = 500;
//         throw err;
//       }

//       saveSession(tok, usr);

//       return { mustChange, user: usr, token: tok };
//     } finally {
//       setIsLoading(false);
//     }
//   }, [saveSession]);

//   const logout = useCallback(() => {
//     saveSession('', null);
//   }, [saveSession]);

//   // Optional: attach token to window.fetch by default (best-effort)
//   useEffect(() => {
//     // Only patch once
//     if (window.__fetch_patched__) return;
//     window.__fetch_patched__ = true;
//     const origFetch = window.fetch.bind(window);
//     window.fetch = (input, init = {}) => {
//       try {
//         const headers = new Headers(init.headers || {});
//         const tok = localStorage.getItem(TOKEN_KEY);
//         if (tok && !headers.has('Authorization')) {
//           headers.set('Authorization', `Bearer ${tok}`);
//         }
//         return origFetch(input, { ...init, headers });
//       } catch {
//         return origFetch(input, init);
//       }
//     };
//   }, []);

//   const value = useMemo(() => ({
//     token,
//     user,
//     isAuthenticated,
//     isLoading,
//     login,
//     logout,
//     setToken,  // exposed for rare edge-cases
//     setUser,
//   }), [token, user, isAuthenticated, isLoading, login, logout]);

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// }

// export function useAuth() {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
//   return ctx;
// }

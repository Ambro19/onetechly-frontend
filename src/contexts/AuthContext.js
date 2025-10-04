// src/contexts/AuthContext.js
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  process.env.REACT_APP_API_BASE_URL ||
  'http://localhost:8000';

const TOKEN_KEY = 'auth_token';
const USER_KEY  = 'auth_user';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '');
  const [user, setUser]   = useState(() => {
    try { return JSON.parse(localStorage.getItem(USER_KEY) || 'null'); }
    catch { return null; }
  });
  const [isLoading, setIsLoading] = useState(false);

  const isAuthenticated = !!token;

  // ---- helpers
  const saveSession = useCallback((tok, usr) => {
    setToken(tok || '');
    setUser(usr || null);
    if (tok) localStorage.setItem(TOKEN_KEY, tok); else localStorage.removeItem(TOKEN_KEY);
    if (usr) localStorage.setItem(USER_KEY, JSON.stringify(usr)); else localStorage.removeItem(USER_KEY);
  }, []);

  const login = useCallback(async (username, password) => {
    setIsLoading(true);
    try {
      const body = new URLSearchParams({ username, password });

      const res = await fetch(`${API_BASE_URL}/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const msg =
          data?.detail ||
          (res.status === 422 ? 'Invalid login payload (expected form data).' :
           res.status === 401 ? 'Incorrect username or password' :
           `Login failed (${res.status})`);
        const err = new Error(msg);
        err.status = res.status;
        throw err;
      }

      const tok = data?.access_token || '';
      const usr = data?.user || null;
      const mustChange =
        !!data?.must_change_password || !!data?.mustChangePassword || !!data?.mustChange;

      if (!tok) {
        const err = new Error('Login response missing access_token');
        err.status = 500;
        throw err;
      }

      saveSession(tok, usr);

      return { mustChange, user: usr, token: tok };
    } finally {
      setIsLoading(false);
    }
  }, [saveSession]);

  const logout = useCallback(() => {
    saveSession('', null);
  }, [saveSession]);

  // Optional: attach token to window.fetch by default (best-effort)
  useEffect(() => {
    // Only patch once
    if (window.__fetch_patched__) return;
    window.__fetch_patched__ = true;
    const origFetch = window.fetch.bind(window);
    window.fetch = (input, init = {}) => {
      try {
        const headers = new Headers(init.headers || {});
        const tok = localStorage.getItem(TOKEN_KEY);
        if (tok && !headers.has('Authorization')) {
          headers.set('Authorization', `Bearer ${tok}`);
        }
        return origFetch(input, { ...init, headers });
      } catch {
        return origFetch(input, init);
      }
    };
  }, []);

  const value = useMemo(() => ({
    token,
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    setToken,  // exposed for rare edge-cases
    setUser,
  }), [token, user, isAuthenticated, isLoading, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}




////////////////////////////////////////////////////////////////////////////////////
// // AuthContext.js — Canonical identity (email) loaded from /users/me
// // Throws on auth failures so UI can't show success by mistake.

// import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { getDisplayEmail } from '../utils/userDisplay';

// const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://192.168.1.185:8000';

// const AuthContext = createContext();
// export const useAuth = () => {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
//   return ctx;
// };

// export const AuthProvider = ({ children }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [token, setToken] = useState(null);
//   const [user, setUser] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const navigate = useNavigate();

//   const clearAuthState = useCallback(() => {
//     try {
//       setToken(null);
//       setUser(null);
//       setIsAuthenticated(false);
//       localStorage.removeItem('token');
//       localStorage.removeItem('user');
//       sessionStorage.removeItem('token');
//       sessionStorage.removeItem('user');
//       localStorage.removeItem('subscription_status');
//       localStorage.removeItem('usage_data');
//     } catch {}
//   }, []);

//   const logout = useCallback(() => {
//     clearAuthState();
//     navigate('/login', { replace: true });
//     return { success: true };
//   }, [clearAuthState, navigate]);

//   const isTokenExpired = useCallback((t) => {
//     if (!t) return true;
//     try {
//       const payload = JSON.parse(atob(t.split('.')[1]));
//       return (Date.now() / 1000) > payload.exp;
//     } catch {
//       return true;
//     }
//   }, []);

//   const fetchMe = async (accessToken) => {
//     const res = await fetch(`${API_BASE_URL}/users/me`, {
//       headers: { Authorization: `Bearer ${accessToken}` }
//     });
//     if (!res.ok) throw new Error('Failed to load user');
//     const me = await res.json();
//     const cleanEmail = (me?.email || '').trim().toLowerCase();
//     const u = { username: me?.username || me?.name || 'User', email: cleanEmail };
//     setUser(u);
//     localStorage.setItem('user', JSON.stringify(u));
//     return u;
//   };

//   // Restore session on load
//   useEffect(() => {
//     (async () => {
//       try {
//         const storedToken = localStorage.getItem('token');
//         const storedUser = localStorage.getItem('user');

//         if (storedToken && storedToken.split('.').length === 3 && !isTokenExpired(storedToken)) {
//           setToken(storedToken);
//           setIsAuthenticated(true);

//           if (storedUser) {
//             const u = JSON.parse(storedUser);
//             const clean = { ...u, email: getDisplayEmail(u) };
//             setUser(clean);
//             localStorage.setItem('user', JSON.stringify(clean));
//           }

//           // Refresh canonical identity from backend
//           try {
//             await fetchMe(storedToken);
//           } catch {
//             // If /users/me fails, force logout to avoid zombie UI
//             clearAuthState();
//           }
//         } else {
//           clearAuthState();
//         }
//       } finally {
//         setIsLoading(false);
//       }
//     })();
//   }, [isTokenExpired, clearAuthState]);

//   // IMPORTANT: login function with this version:
//   const login = async (username, password) => {
//   const uname = String(username || '').trim();
//   const res = await fetch(`${API_BASE_URL}/token`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//     body: new URLSearchParams({ username: uname, password })
//   });

//   if (!res.ok) {
//     let msg = 'Login failed';
//     try { msg = (await res.json())?.detail || msg; } catch {}
//     clearAuthState();
//     throw new Error(msg);
//   }

//   const data = await res.json();
//   const newToken = data.access_token;
//   localStorage.setItem('token', newToken);
//   setToken(newToken);
//   setIsAuthenticated(true);

//   try {
//     await fetchMe(newToken);
//   } catch {
//     clearAuthState();
//     throw new Error('Login failed: could not load user profile');
//   }

//   // ✅ bubble the flag to caller so LoginPage can redirect
//   const mustChange = !!data.must_change_password;
//   if (mustChange) localStorage.setItem('must_change_password', '1');
//   else localStorage.removeItem('must_change_password');

//   return { mustChange };
// };
  
//   // IMPORTANT: also throw on failure
//   const register = async (username, email, password) => {
//     const payload = {
//       username: String(username || '').trim(),
//       email: String(email || '').trim().toLowerCase(),
//       password
//     };
//     const res = await fetch(`${API_BASE_URL}/register`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(payload)
//     });

//     if (!res.ok) {
//       let msg = 'Registration failed';
//       try { msg = (await res.json())?.detail || msg; } catch {}
//       throw new Error(msg);
//     }
//     return true;
//   };

//   useEffect(() => {
//     if (token && isTokenExpired(token)) logout();
//   }, [token, isTokenExpired, logout]);

//   const updateUser = (partial) => {
//     const next = { ...(user || {}), ...(partial || {}) };
//     if (next.email) next.email = String(next.email).trim().toLowerCase();
//     setUser(next);
//     localStorage.setItem('user', JSON.stringify(next));
//   };

//   const value = {
//     isAuthenticated,
//     token,
//     user,
//     isLoading,
//     login,
//     register,
//     logout,
//     updateUser,
//     clearAuthState,
//     refreshToken: async () => true,
//     isTokenExpired: () => isTokenExpired(token)
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

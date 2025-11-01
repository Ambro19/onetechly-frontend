// src/contexts/AuthContext.js
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { api, apiGetJson, apiPostJson, wakeApi, currentApiBase as currentApiBaseFn } from "../lib/api";

const AuthContext = createContext(null);

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

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

  // Check API connectivity
  const checkApiHealth = useCallback(async () => {
    try {
      const response = await fetch(`${currentApiBaseFn()}/health`);
      if (response.ok) {
        setApiStatus("healthy");
        return true;
      } else {
        setApiStatus("unhealthy");
        return false;
      }
    } catch (error) {
      console.error("API health check failed:", error);
      setApiStatus("offline");
      return false;
    }
  }, []);

  // Boot: load token+user from storage, attach to axios
  useEffect(() => {
    const initializeAuth = async () => {
      const savedToken = localStorage.getItem(TOKEN_KEY) || "";
      const savedUser = localStorage.getItem(USER_KEY);
      
      // Check API health first
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
            // Token invalid
            setToken("");
            applyToken("");
            localStorage.removeItem(USER_KEY);
          }
        } catch (error) {
          console.error("Token validation failed:", error);
          // Token invalid or API error
          setToken("");
          applyToken("");
          localStorage.removeItem(USER_KEY);
        }
      } else if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          localStorage.removeItem(USER_KEY);
        }
      }
      
      setIsLoading(false);
    };

    initializeAuth();
  }, [applyToken, checkApiHealth]);

  // ---- Enhanced Login with better error handling
  const login = useCallback(async (username, password) => {
    // Check API health first
    const isHealthy = await checkApiHealth();
    if (!isHealthy) {
      throw new Error("Service is temporarily unavailable. Please try again later.");
    }

    const body = { 
      username: (username || "").trim(), 
      password: password || "" 
    };
    
    try {
      const res = await apiPostJson("/token_json", body);
      
      if (!res?.access_token) {
        throw new Error("Invalid login response from server");
      }
      
      applyToken(res.access_token);
      setToken(res.access_token);
      
      // Get fresh user data after login
      try {
        const userData = await apiGetJson("/users/me");
        if (userData) {
          setUser(userData);
          try {
            localStorage.setItem(USER_KEY, JSON.stringify(userData));
          } catch {
            /* ignore storage errors */
          }
        }
      } catch (userError) {
        console.error("Failed to fetch user data after login:", userError);
        // Still proceed with login if we have basic user info
        if (res.user) {
          setUser(res.user);
          try {
            localStorage.setItem(USER_KEY, JSON.stringify(res.user));
          } catch {
            /* ignore storage errors */
          }
        }
      }
      
      return res;
    } catch (error) {
      console.error("Login error:", error);
      
      // Provide more specific error messages
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.detail || error.message;
        
        if (status === 401) {
          throw new Error("Invalid username or password");
        } else if (status === 422) {
          throw new Error("Invalid input data");
        } else if (status >= 500) {
          throw new Error("Server error. Please try again later.");
        } else {
          throw new Error(message || "Login failed");
        }
      } else if (error.request) {
        throw new Error("Cannot connect to server. Please check your connection.");
      } else {
        throw new Error(error.message || "Login failed");
      }
    }
  }, [applyToken, checkApiHealth]);

  // ---- Logout
  const logout = useCallback(() => {
    setToken("");
    applyToken("");
    setUser(null);
    try {
      localStorage.removeItem(USER_KEY);
    } catch {
      /* ignore */
    }
    toast.success("Signed out");
  }, [applyToken]);

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
    
    // Optional: periodic health check every 5 minutes
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

///////////////////////////////////////////////////
// // src/contexts/AuthContext.js
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

//   // Boot: load token+user from storage, attach to axios
//   useEffect(() => {
//     const savedToken = localStorage.getItem(TOKEN_KEY) || "";
//     const savedUser = localStorage.getItem(USER_KEY);
//     if (savedToken) {
//       setToken(savedToken);
//       applyToken(savedToken);
//     }
//     if (savedUser) {
//       try {
//         setUser(JSON.parse(savedUser));
//       } catch {
//         localStorage.removeItem(USER_KEY);
//       }
//     }
//     setIsLoading(false);
//   }, [applyToken]);

//   // Helper to persist user in storage
//   const persistUser = useCallback((u) => {
//     setUser(u);
//     try {
//       localStorage.setItem(USER_KEY, JSON.stringify(u || null));
//     } catch {
//       /* ignore */
//     }
//   }, []);

//   // ---- Login using JSON endpoint (/token_json)
//   const login = useCallback(async (username, password) => {
//     const body = { username: (username || "").trim(), password: password || "" };
//     const res = await apiPostJson("/token_json", body); // <— key change
//     // { access_token, token_type, user, must_change_password }
//     if (!res?.access_token) {
//       throw new Error("Invalid login response from server");
//     }
//     applyToken(res.access_token);
//     setToken(res.access_token);
//     persistUser(res.user || null);
//     return res;
//   }, [applyToken, persistUser]);

//   // ---- Logout
//   const logout = useCallback(() => {
//     setToken("");
//     applyToken("");
//     persistUser(null);
//     toast.success("Signed out");
//   }, [applyToken, persistUser]);

//   // Optional: validate token/user when authenticated (non-blocking)
//   useEffect(() => {
//     if (!token) return;
//     (async () => {
//       try {
//         const me = await apiGetJson("/users/me");
//         if (me) persistUser(me);
//       } catch (e) {
//         // Token invalid/expired → sign out quietly
//         logout();
//       }
//     })();
//   }, [token, persistUser, logout]);

//   // Wake API once (handles Render cold starts)
//   useEffect(() => {
//     wakeApi().catch(() => {});
//   }, []);

//   const value = useMemo(
//     () => ({
//       token,
//       user,
//       isAuthenticated,
//       isLoading,
//       login,
//       logout,
//       setToken,      // exposed for rare edge-cases
//       setUser,       // exposed for rare edge-cases
//       apiBaseUrl: currentApiBaseFn(),
//       apiFetch: api, // expose axios instance if needed
//     }),
//     [token, user, isAuthenticated, isLoading, login, logout]
//   );

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// }

// export function useAuth() {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
//   return ctx;
// }



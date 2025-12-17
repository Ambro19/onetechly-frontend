// frontend/src/contexts/SubscriptionContext.js
// Production-ready: robust refresh, safe polling, 401 handling, reset-overdue re-sync,
// consistent URL building, reduced noisy logs, and ESLint-safe dependencies.

import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';

const API_BASE_URL = (process.env.REACT_APP_API_URL || 'http://localhost:8000').replace(/\/+$/, '');

const SubscriptionContext = createContext(null);

function safeLower(x, fallback = 'free') {
  return (typeof x === 'string' && x.trim() ? x.trim().toLowerCase() : fallback);
}

function isResetOverdue(nextResetIso) {
  if (!nextResetIso) return false;
  const d = new Date(nextResetIso);
  if (Number.isNaN(d.getTime())) return false;
  return Date.now() >= d.getTime();
}

export function SubscriptionProvider({ children }) {
  const { token, isAuthenticated, logout } = useAuth();

  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [tier, setTier] = useState('free');
  const [isLoading, setIsLoading] = useState(true);
  const [lastFetch, setLastFetch] = useState(null);

  // --- Refs to avoid stale closures and to keep polling safe
  const tokenRef = useRef(token);
  const authRef = useRef(isAuthenticated);
  const logoutRef = useRef(logout);

  useEffect(() => {
    tokenRef.current = token;
    authRef.current = isAuthenticated;
    logoutRef.current = logout;
  }, [token, isAuthenticated, logout]);

  const inFlightRef = useRef(false);
  const fetchAttemptsRef = useRef(0);
  const maxFetchAttempts = 30;

  const statusRef = useRef(subscriptionStatus);
  useEffect(() => {
    statusRef.current = subscriptionStatus;
  }, [subscriptionStatus]);

  // Optional: reduce console noise in prod
  const debugLog = useCallback((...args) => {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.log(...args);
    }
  }, []);

  const buildStatusUrl = useCallback((forceSync) => {
    // backend exposes /subscription_status and /subscription_status/
    // use the canonical path without trailing slash
    const sync = forceSync ? '1' : '0';
    return `${API_BASE_URL}/subscription_status?sync=${sync}&_t=${Date.now()}`;
  }, []);

  /**
   * Refresh subscription status from backend.
   * forceSync=true hits Stripe sync path on backend (sync=1).
   * forceSync=false does a lightweight refresh (sync=0).
   */
  const refreshSubscriptionStatus = useCallback(async (forceSync = true) => {
    const t = tokenRef.current;
    const authed = authRef.current;

    if (!t || !authed) {
      // When logged out, reset state
      setSubscriptionStatus(null);
      setTier('free');
      setIsLoading(false);
      return;
    }

    if (inFlightRef.current) return;

    if (fetchAttemptsRef.current >= maxFetchAttempts) {
      // eslint-disable-next-line no-console
      console.warn('⚠️ Max subscription fetch attempts reached. Polling paused.');
      setIsLoading(false);
      return;
    }

    inFlightRef.current = true;
    fetchAttemptsRef.current += 1;

    try {
      const url = buildStatusUrl(forceSync);
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${t}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      });

      // If token is invalid/expired, force logout to avoid stale UI loops
      if (res.status === 401) {
        try {
          logoutRef.current?.();
        } catch {}
        setSubscriptionStatus(null);
        setTier('free');
        return;
      }

      if (!res.ok) {
        // eslint-disable-next-line no-console
        console.error('❌ Failed to fetch subscription status:', res.status);
        return;
      }

      const data = await res.json();

      // If the reset date is overdue, we strongly prefer a sync=1 refresh once
      // to ensure backend applies "reset + downgrade" deterministically.
      if (!forceSync && isResetOverdue(data?.next_reset)) {
        // run one forced sync immediately (best effort)
        inFlightRef.current = false;
        await refreshSubscriptionStatus(true);
        return;
      }

      const newTier = safeLower(data?.tier, 'free');

      setSubscriptionStatus(data);
      setTier(newTier);
      setLastFetch(Date.now());
      setIsLoading(false);

      debugLog('🔍 Subscription status updated:', {
        tier: newTier,
        usage: data?.usage,
        limits: data?.limits,
        next_reset: data?.next_reset,
      });

      // Only reset attempts when we have a healthy response
      fetchAttemptsRef.current = 0;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('❌ Subscription fetch error:', e);
    } finally {
      inFlightRef.current = false;
      setIsLoading(false);
    }
  }, [buildStatusUrl, debugLog]);

  // Initial fetch whenever auth becomes valid
  useEffect(() => {
    if (isAuthenticated && token) {
      fetchAttemptsRef.current = 0;
      refreshSubscriptionStatus(true);
    } else {
      // logged out
      setSubscriptionStatus(null);
      setTier('free');
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, token]);

  // Poll every 60 seconds (light refresh), but auto-sync if reset is overdue
  useEffect(() => {
    if (!isAuthenticated || !token) return;

    const interval = setInterval(() => {
      if (fetchAttemptsRef.current < maxFetchAttempts) {
        refreshSubscriptionStatus(false);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [isAuthenticated, token, refreshSubscriptionStatus]);

  // Also refresh when tab regains focus / becomes visible to prevent stale tier/usage
  useEffect(() => {
    if (!isAuthenticated || !token) return;

    const onFocus = () => refreshSubscriptionStatus(false);
    const onVis = () => {
      if (document.visibilityState === 'visible') refreshSubscriptionStatus(false);
    };

    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVis);

    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [isAuthenticated, token, refreshSubscriptionStatus]);

  const startCheckout = useCallback(
    async (planType) => {
      const t = tokenRef.current;
      const authed = authRef.current;

      if (!t || !authed) throw new Error('Authentication required');

      const res = await fetch(`${API_BASE_URL}/billing/create_checkout_session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${t}`,
        },
        body: JSON.stringify({ plan: planType }),
      });

      if (res.status === 401) {
        try {
          logoutRef.current?.();
        } catch {}
        throw new Error('Session expired. Please log in again.');
      }

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.url) throw new Error(data?.detail || 'Checkout setup failed');

      // reset attempts before redirect
      fetchAttemptsRef.current = 0;
      window.location.href = data.url;
    },
    [] // uses refs (tokenRef/authRef/logoutRef) so no deps needed
  );

  // Usage formatting helper (safe for "unlimited")
  const formatUsage = useCallback((actionType) => {
    const used = Number(subscriptionStatus?.usage?.[actionType] ?? 0);
    const limit = subscriptionStatus?.limits?.[actionType];

    if (limit === 'unlimited' || limit === Infinity || limit === '∞') {
      return `${used} / ∞`;
    }

    const numericLimit = Number(limit);
    return `${used} / ${Number.isFinite(numericLimit) ? numericLimit : 0}`;
  }, [subscriptionStatus]);

  const value = {
    subscriptionStatus,
    tier,
    isLoading,
    refreshSubscriptionStatus,
    startCheckout,
    lastFetch,
    formatUsage,
  };

  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>;
}

export function useSubscription() {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) throw new Error('useSubscription must be used within SubscriptionProvider');
  return ctx;
}


// // frontend/src/contexts/SubscriptionContext.js
// // Enhanced with better usage formatting and ESLint fixes

// import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
// import { useAuth } from './AuthContext';

// const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// const SubscriptionContext = createContext();

// export function SubscriptionProvider({ children }) {
//   const { token, isAuthenticated } = useAuth();
//   const [subscriptionStatus, setSubscriptionStatus] = useState(null);
//   const [tier, setTier] = useState('free');
//   const [isLoading, setIsLoading] = useState(true);
//   const [lastFetch, setLastFetch] = useState(null);

//   const fetchAttempts = useRef(0);
//   const maxFetchAttempts = 30;
//   const isFetchingRef = useRef(false);

//   // FIXED: Added isLoading to dependency array
//   const refreshSubscriptionStatus = useCallback(async (forceSync = true) => {
//     if (!token || !isAuthenticated || isFetchingRef.current) return;
//     if (fetchAttempts.current >= maxFetchAttempts) {
//       console.warn('⚠️ Max fetch attempts reached. Stopping polling.');
//       return;
//     }

//     isFetchingRef.current = true;
//     fetchAttempts.current += 1;

//     try {
//       const url = `${API_BASE_URL}/subscription_status?sync=${forceSync ? '1' : '0'}&_t=${Date.now()}`;
//       const res = await fetch(url, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         cache: 'no-store',
//       });

//       if (res.ok) {
//         const data = await res.json();
//         const newTier = (data?.tier || 'free').toLowerCase();

//         setSubscriptionStatus(data);
//         setTier(newTier);
//         setLastFetch(Date.now());

//         console.log('🔍 Subscription:', {
//           tier: newTier,
//           usage: data.usage,
//           limits: data.limits,
//           timestamp: new Date().toISOString(),
//         });

//         if (newTier !== 'free') {
//           fetchAttempts.current = 0;
//         }
//       } else {
//         console.error('❌ Failed to fetch subscription:', res.status);
//       }
//     } catch (e) {
//       console.error('❌ Subscription fetch error:', e);
//     } finally {
//       if (isLoading) setIsLoading(false);
//       isFetchingRef.current = false;
//     }
//   }, [token, isAuthenticated, isLoading]); // FIXED: Added isLoading dependency

//   useEffect(() => {
//     if (isAuthenticated && token) {
//       fetchAttempts.current = 0;
//       refreshSubscriptionStatus(true);
//     }
//   }, [isAuthenticated, token, refreshSubscriptionStatus]);

//   useEffect(() => {
//     if (!isAuthenticated || !token) return;
//     const interval = setInterval(() => {
//       if (fetchAttempts.current < maxFetchAttempts) {
//         refreshSubscriptionStatus(false);
//       }
//     }, 60000);
//     return () => clearInterval(interval);
//   }, [isAuthenticated, token, refreshSubscriptionStatus]);

//   const startCheckout = useCallback(async (planType) => {
//     if (!token) throw new Error('Authentication required');

//     try {
//       const res = await fetch(`${API_BASE_URL}/billing/create_checkout_session`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ plan: planType }),
//       });

//       const data = await res.json();
//       if (!res.ok || !data?.url) throw new Error(data?.detail || 'Checkout setup failed');

//       fetchAttempts.current = 0;
//       window.location.href = data.url;
//     } catch (err) {
//       console.error('Checkout error:', err);
//       throw err;
//     }
//   }, [token]);

//   // Enhanced usage formatting
//   const formatUsage = useCallback((actionType) => {
//     const usage = subscriptionStatus?.usage?.[actionType] || 0;
//     const limit = subscriptionStatus?.limits?.[actionType];
    
//     if (limit === 'unlimited' || limit === Infinity || limit === '∞') {
//       return `${usage} / ∞`;
//     }
    
//     const numericLimit = Number(limit) || 0;
//     return `${usage} / ${numericLimit}`;
//   }, [subscriptionStatus]);

//   const value = {
//     subscriptionStatus,
//     tier,
//     isLoading,
//     refreshSubscriptionStatus,
//     startCheckout,
//     lastFetch,
//     formatUsage,
//   };

//   return (
//     <SubscriptionContext.Provider value={value}>
//       {children}
//     </SubscriptionContext.Provider>
//   );
// }

// export function useSubscription() {
//   const ctx = useContext(SubscriptionContext);
//   if (!ctx) throw new Error('useSubscription must be used within SubscriptionProvider');
//   return ctx;
// }



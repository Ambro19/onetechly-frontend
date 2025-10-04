// // SubscriptionContext.js — per-user cache, hard replace, and force refresh
// import React, { createContext, useContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';
// import { useAuth } from './AuthContext';

// const API_BASE_URL =
//   process.env.REACT_APP_API_URL ||
//   process.env.REACT_APP_API_BASE_URL ||
//   'http://localhost:8000';

// const SubscriptionContext = createContext(null);

// const CACHE_TTL_MS = 60 * 1000; // 1 minute cache (dev-friendly)
// const keyFor = (username) => `subStatus:${(username || '').toLowerCase()}`;

// export function SubscriptionProvider({ children }) {
//   const { token, user } = useAuth();
//   const username = (user?.username || '').trim();
//   const cacheKey = keyFor(username);

//   const [subscriptionStatus, setSubscriptionStatus] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const tier = useMemo(
//     () => (subscriptionStatus?.tier || 'free').toLowerCase(),
//     [subscriptionStatus]
//   );

//   // Load cached (per-user) on mount/user change
//   useEffect(() => {
//     if (!username) {
//       setSubscriptionStatus(null);
//       return;
//     }
//     try {
//       const raw = localStorage.getItem(cacheKey);
//       if (!raw) return;
//       const parsed = JSON.parse(raw);
//       if (parsed?.__ts && Date.now() - parsed.__ts < CACHE_TTL_MS) {
//         setSubscriptionStatus(parsed.data);
//       }
//     } catch {
//       /* ignore */
//     }
//   }, [cacheKey, username]);

//   const saveCache = useCallback((data) => {
//     try {
//       localStorage.setItem(cacheKey, JSON.stringify({ __ts: Date.now(), data }));
//     } catch {
//       /* ignore */
//     }
//   }, [cacheKey]);

//   const fetchStatus = useCallback(async (sync = 0) => {
//     if (!token || !username) return null;
//     const url = `${API_BASE_URL}/subscription_status?sync=${sync}&_t=${Date.now()}`;
//     const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
//     if (!res.ok) throw new Error('Failed to fetch subscription status');
//     const data = await res.json();

//     // Normalize server -> UI
//     const normalized = {
//       ...data,
//       tier: (data?.tier || 'free').toLowerCase(),
//       usage: {
//         clean_transcripts: Number(data?.usage?.clean_transcripts || 0),
//         unclean_transcripts: Number(data?.usage?.unclean_transcripts || 0),
//         audio_downloads: Number(data?.usage?.audio_downloads || 0),
//         video_downloads: Number(data?.usage?.video_downloads || 0),
//       },
//       limits: {
//         clean_transcripts: data?.limits?.clean_transcripts ?? 0,
//         unclean_transcripts: data?.limits?.unclean_transcripts ?? 0,
//         audio_downloads: data?.limits?.audio_downloads ?? 0,
//         video_downloads: data?.limits?.video_downloads ?? 0,
//       },
//     };

//     // **Hard replace** state (no merge) so usage never stays stale
//     setSubscriptionStatus(normalized);
//     saveCache(normalized);
//     return normalized;
//   }, [API_BASE_URL, token, username, saveCache]);

//   // Public API
//   const refreshSubscriptionStatus = useCallback(async (opts = {}) => {
//     // opts: { force?: boolean, sync?: boolean }
//     const { force = false, sync = false } = (opts || {});
//     if (!username || !token) return null;

//     const raw = localStorage.getItem(cacheKey);
//     const cached = raw ? JSON.parse(raw) : null;
//     const freshEnough = cached?.__ts && Date.now() - cached.__ts < CACHE_TTL_MS;

//     if (!force && freshEnough && subscriptionStatus) {
//       return subscriptionStatus;
//     }

//     setLoading(true);
//     try {
//       const data = await fetchStatus(sync ? 1 : 0);
//       return data;
//     } finally {
//       setLoading(false);
//     }
//   }, [username, token, cacheKey, subscriptionStatus, fetchStatus]);

//   // Stripe checkout helper (kept same external API)
//   const startCheckout = useCallback(async (planType /* 'pro'|'premium' */) => {
//     if (!token) throw new Error('Please log in');

//     const res = await fetch(`${API_BASE_URL}/billing/create_checkout_session`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
//       body: JSON.stringify({ plan: planType }),
//     });
//     const js = await res.json();
//     if (!res.ok || !js?.url) {
//       throw new Error(js?.detail || 'Failed to start checkout');
//     }
//     window.location.assign(js.url);
//   }, [token]);

//   // Bust cache on user change
//   useEffect(() => {
//     setSubscriptionStatus(null);
//   }, [username]);

//   const value = useMemo(() => ({
//     subscriptionStatus,
//     tier,
//     loading,
//     refreshSubscriptionStatus,
//     startCheckout,
//   }), [subscriptionStatus, tier, loading, refreshSubscriptionStatus, startCheckout]);

//   return (
//     <SubscriptionContext.Provider value={value}>
//       {children}
//     </SubscriptionContext.Provider>
//   );
// }

// export function useSubscription() {
//   return useContext(SubscriptionContext);
// }


// ////////////// =============== DeepSeek ========== //////////////////////////
// frontend/src/contexts/SubscriptionContext.js
// Enhanced with better usage formatting and ESLint fixes

import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const SubscriptionContext = createContext();

export function SubscriptionProvider({ children }) {
  const { token, isAuthenticated } = useAuth();
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [tier, setTier] = useState('free');
  const [isLoading, setIsLoading] = useState(true);
  const [lastFetch, setLastFetch] = useState(null);

  const fetchAttempts = useRef(0);
  const maxFetchAttempts = 30;
  const isFetchingRef = useRef(false);

  // FIXED: Added isLoading to dependency array
  const refreshSubscriptionStatus = useCallback(async (forceSync = true) => {
    if (!token || !isAuthenticated || isFetchingRef.current) return;
    if (fetchAttempts.current >= maxFetchAttempts) {
      console.warn('⚠️ Max fetch attempts reached. Stopping polling.');
      return;
    }

    isFetchingRef.current = true;
    fetchAttempts.current += 1;

    try {
      const url = `${API_BASE_URL}/subscription_status?sync=${forceSync ? '1' : '0'}&_t=${Date.now()}`;
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      });

      if (res.ok) {
        const data = await res.json();
        const newTier = (data?.tier || 'free').toLowerCase();

        setSubscriptionStatus(data);
        setTier(newTier);
        setLastFetch(Date.now());

        console.log('🔍 Subscription:', {
          tier: newTier,
          usage: data.usage,
          limits: data.limits,
          timestamp: new Date().toISOString(),
        });

        if (newTier !== 'free') {
          fetchAttempts.current = 0;
        }
      } else {
        console.error('❌ Failed to fetch subscription:', res.status);
      }
    } catch (e) {
      console.error('❌ Subscription fetch error:', e);
    } finally {
      if (isLoading) setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, [token, isAuthenticated, isLoading]); // FIXED: Added isLoading dependency

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchAttempts.current = 0;
      refreshSubscriptionStatus(true);
    }
  }, [isAuthenticated, token, refreshSubscriptionStatus]);

  useEffect(() => {
    if (!isAuthenticated || !token) return;
    const interval = setInterval(() => {
      if (fetchAttempts.current < maxFetchAttempts) {
        refreshSubscriptionStatus(false);
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [isAuthenticated, token, refreshSubscriptionStatus]);

  const startCheckout = useCallback(async (planType) => {
    if (!token) throw new Error('Authentication required');

    try {
      const res = await fetch(`${API_BASE_URL}/billing/create_checkout_session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ plan: planType }),
      });

      const data = await res.json();
      if (!res.ok || !data?.url) throw new Error(data?.detail || 'Checkout setup failed');

      fetchAttempts.current = 0;
      window.location.href = data.url;
    } catch (err) {
      console.error('Checkout error:', err);
      throw err;
    }
  }, [token]);

  // Enhanced usage formatting
  const formatUsage = useCallback((actionType) => {
    const usage = subscriptionStatus?.usage?.[actionType] || 0;
    const limit = subscriptionStatus?.limits?.[actionType];
    
    if (limit === 'unlimited' || limit === Infinity || limit === '∞') {
      return `${usage} / ∞`;
    }
    
    const numericLimit = Number(limit) || 0;
    return `${usage} / ${numericLimit}`;
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

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) throw new Error('useSubscription must be used within SubscriptionProvider');
  return ctx;
}



// frontend/src/pages/History.js — PixelPerfect Screenshot API
// CONVERTED FROM: YCD History.js
// PURPOSE: Complete screenshot history with robust caching and error handling
// CHANGES: Download history → Screenshot history

import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { getDisplayEmail, getDisplayName } from '../utils/userDisplay';
import AppBrand from '../components/AppBrand';

const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  process.env.REACT_APP_API_BASE_URL ||
  'http://localhost:8000';

// Debug helper
const debug =
  process.env.NODE_ENV === 'development'
    ? (...args) => console.log('[History]', ...args)
    : () => {};

// Small in-memory cache (per user)
const CACHE_TTL_MS = 30_000;
const cache = new Map();

// Prevent overlapping fetches
let inflight = null;

// Enhanced timestamp parsing
const parseServerTime = (ts) => {
  if (!ts) return null;
  if (/Z$|[+-]\d{2}:\d{2}$/.test(ts)) return new Date(ts);
  return new Date(`${ts}Z`);
};

// CONVERTED: Tabs for screenshot formats
const TABS = [
  { key: 'all', label: 'All Screenshots', icon: '📸' },
  { key: 'png', label: 'PNG', icon: '🖼️' },
  { key: 'jpeg', label: 'JPEG', icon: '📷' },
  { key: 'webp', label: 'WebP', icon: '🎨' },
  { key: 'pdf', label: 'PDF', icon: '📄' },
];

// CONVERTED: Type/icon helpers for screenshots
const typeToIcon = (type, format) => {
  const f = (format || '').toLowerCase();

  if (f === 'png') return '🖼️';
  if (f === 'jpeg' || f === 'jpg') return '📷';
  if (f === 'webp') return '🎨';
  if (f === 'pdf') return '📄';
  
  return '📸'; // Default screenshot icon
};

const prettyType = (rawType, fileFormat) => {
  const format = (fileFormat || '').toLowerCase();

  if (format === 'png') return 'PNG Screenshot';
  if (format === 'jpeg' || format === 'jpg') return 'JPEG Screenshot';
  if (format === 'webp') return 'WebP Screenshot';
  if (format === 'pdf') return 'PDF Screenshot';

  if (rawType) return rawType.replace(/_/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase());
  return 'Screenshot';
};

const formatSize = (bytes) => {
  if (bytes == null || bytes === 0) return '—';
  const units = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  let n = Number(bytes);
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i++;
  }
  return `${n.toFixed(n < 10 ? 1 : 0)} ${units[i]}`;
};

const formatWhen = (iso) => {
  const d = parseServerTime(iso);
  if (!d || isNaN(d.getTime())) return '—';
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 172800) return 'Yesterday';
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const formatProcessing = (v) => {
  if (v == null) return '—';
  const num = parseFloat(v);
  return Number.isFinite(num) ? `${num.toFixed(2)}s` : String(v);
};

// CONVERTED: Normalize screenshot item
const normalizeItem = (raw, idx) => {
  const get = (obj, ...keys) => keys.find((k) => obj && obj[k] != null) && obj[keys.find((k) => obj && obj[k] != null)];
  const id = get(raw, 'id', 'screenshot_id') ?? `generated-${Date.now()}-${idx}`;
  const type = get(raw, 'type', 'screenshot_type', 'category') || 'screenshot';
  const fileFormat =
    get(raw, 'format', 'file_format', 'ext', 'extension') || 'png';
  const timestamp = get(raw, 'created_at', 'timestamp', 'captured_at') || new Date().toISOString();
  const url = get(raw, 'url', 'target_url', 'website_url');

  return {
    id,
    type,
    format: fileFormat,
    url: url,
    width: get(raw, 'width'),
    height: get(raw, 'height'),
    file_size: get(raw, 'file_size', 'size_bytes', 'size') || 0,
    created_at: timestamp,
    processing_time: get(raw, 'processing_time', 'process_time', 'duration'),
    status: get(raw, 'status') || 'completed',
    screenshot_url: get(raw, 'screenshot_url', 'url', 'file_url'),
    full_page: get(raw, 'full_page', 'fullpage'),
    dark_mode: get(raw, 'dark_mode', 'darkmode'),
    error_message: get(raw, 'error_message', 'error'),
    description: get(raw, 'description'),
  };
};

// Fetch wrapper with 429/5xx backoff
async function fetchWithBackoff(url, options, { tries = 4, baseDelay = 500 } = {}) {
  let attempt = 0;
  while (attempt < tries) {
    const res = await fetch(url, options).catch(() => null);
    if (res && res.ok) return res;

    const status = res?.status ?? 0;
    if ([429, 502, 503, 504].includes(status) || !res) {
      const wait = baseDelay * Math.pow(2, attempt);
      await new Promise((r) => setTimeout(r, wait));
      attempt++;
      continue;
    }
    return res;
  }
  return null;
}

export default function History() {
  const { token, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [active, setActive] = useState('all');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  const username = (user?.username || '').toLowerCase();
  const mountedRef = useRef(true);

  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    mountedRef.current = true;
    const onScroll = () => setShowScrollToTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => {
      mountedRef.current = false;
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Single load function (429-safe + cache + de-dupe)
  const load = useCallback(async () => {
    if (!token) return;
    if (loading) return;

    // Serve from short cache if available
    const c = cache.get(username);
    if (c && Date.now() - c.ts < CACHE_TTL_MS) {
      debug('Using cached history');
      setItems(c.items);
      setLastFetch(new Date(c.ts));
      setHasLoaded(true);
      setConnectionError(null);
      return;
    }

    setLoading(true);
    setConnectionError(null);

    // De-dupe overlapping calls globally
    if (!inflight) {
      inflight = (async () => {
        const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

        // CONVERTED: Try screenshot history endpoints
        const endpoints = [
          `${API_BASE_URL}/api/v1/user/screenshot-history`,
          `${API_BASE_URL}/user/screenshot-history`,
          `${API_BASE_URL}/api/v1/screenshots`,
        ];

        let got = null;
        for (const url of endpoints) {
          debug('Fetching:', url);
          const res = await fetchWithBackoff(url, { method: 'GET', headers }, { tries: 4, baseDelay: 500 });
          if (!res) continue;
          if (res.ok) {
            const data = await res.json().catch(() => ({}));
            const arr = Array.isArray(data.screenshots)
              ? data.screenshots
              : Array.isArray(data.items)
              ? data.items
              : Array.isArray(data)
              ? data
              : [];
            got = arr;
            break;
          }
          if (res.status === 500) {
            const txt = await res.text().catch(() => '');
            if (txt.includes('no such column'))
              throw new Error('Database needs migration - missing columns detected');
            throw new Error('Database connection issue - please contact support');
          }
          if (res.status === 404) throw new Error('History endpoint not available');
          if (res.status === 429) throw new Error('Server is busy (429). Please retry in a moment.');
        }

        if (!got) got = [];
        // Normalize, sort, limit
        const normalized = got.slice(0, 120).map(normalizeItem);
        normalized.sort((a, b) => {
          const A = parseServerTime(a.created_at)?.getTime() || 0;
          const B = parseServerTime(b.created_at)?.getTime() || 0;
          return B - A;
        });

        // Cache
        cache.set(username, { ts: Date.now(), items: normalized });
        return normalized;
      })();
    }

    try {
      const normalized = await inflight;
      if (!mountedRef.current) return;
      setItems(normalized);
      setConnectionError(null);
      setLastFetch(new Date());
    } catch (err) {
      if (!mountedRef.current) return;
      console.error('💥 History load failed:', err);
      setItems([]);
      setConnectionError(err?.message || 'Failed to load history');
      if (!hasLoaded) {
        toast.error(`Unable to load history: ${err?.message || 'Unknown error'}`, {
          id: 'history-error',
          duration: 6000,
        });
      }
    } finally {
      if (mountedRef.current) {
        setHasLoaded(true);
        setLoading(false);
      }
      inflight = null;
    }
  }, [token, loading, username, hasLoaded]);

  // Load once on mount
  useEffect(() => {
    if (isAuthenticated && !hasLoaded) load();
  }, [isAuthenticated, load, hasLoaded, username]);

  // Manual refresh
  const handleManualRefresh = useCallback(async () => {
    cache.delete(username);
    setHasLoaded(false);
    await load();
  }, [load, username]);

  // CONVERTED: Filtering by screenshot format
  const filtered = useMemo(() => {
    if (active === 'all') return items;
    return items.filter((item) => {
      const format = (item.format || '').toLowerCase();
      
      switch (active) {
        case 'png':
          return format === 'png';
        case 'jpeg':
          return format === 'jpeg' || format === 'jpg';
        case 'webp':
          return format === 'webp';
        case 'pdf':
          return format === 'pdf';
        default:
          return true;
      }
    });
  }, [active, items]);

  // CONVERTED: Counts by format
  const counts = useMemo(() => {
    const cats = { png: 0, jpeg: 0, webp: 0, pdf: 0 };
    items.forEach((item) => {
      const format = (item.format || '').toLowerCase();
      
      if (format === 'png') {
        cats.png++;
      } else if (format === 'jpeg' || format === 'jpg') {
        cats.jpeg++;
      } else if (format === 'webp') {
        cats.webp++;
      } else if (format === 'pdf') {
        cats.pdf++;
      }
    });
    return { all: cats.png + cats.jpeg + cats.webp + cats.pdf, ...cats };
  }, [items]);

  const email = getDisplayEmail(user);
  const name = getDisplayName(user);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-6">

        {/* Brand Header */}
        <div className="mb-6">
          <AppBrand
            size={32}
            showText={true}
            label="PixelPerfect API"
            logoSrc="/logo_pixelperfect.png"
            to="/dashboard"
          />
        </div>

        {/* Page Header */}
        <header className="mb-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="text-6xl">📸</div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🗂️ Screenshot History</h1>
          
          {/* Clear label that this shows COMPLETE history */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 border border-purple-200 rounded-full text-sm mb-3">
            <span className="text-purple-700 font-medium">📚 Complete screenshot history (all time)</span>
            <button 
              onClick={() => navigate('/activity')} 
              className="text-purple-600 hover:text-purple-800 underline font-semibold"
            >
              View Recent Activity →
            </button>
          </div>

          <div className="text-sm text-gray-600">
            Logged in as: <span className="font-medium text-blue-700">{name}</span>{' '}
            (<span className="font-mono text-xs">{email}</span>)
          </div>

          {lastFetch && (
            <div className="mt-1 text-xs text-gray-500">Last updated: {lastFetch.toLocaleTimeString()}</div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-4 gap-3">
            <button
              onClick={() => navigate('/screenshot')}
              className="px-4 py-3 rounded-lg text-white bg-blue-600 hover:bg-blue-700 font-medium transition-colors"
            >
              ← New Screenshot
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-3 rounded-lg text-white bg-gray-800 hover:bg-gray-900 font-medium transition-colors"
            >
              🏠 Dashboard
            </button>
            <button
              onClick={() => navigate('/activity')}
              className="px-4 py-3 rounded-lg text-white bg-purple-600 hover:bg-purple-700 font-medium transition-colors"
            >
              📋 Activity
            </button>
            <button
              onClick={handleManualRefresh}
              disabled={loading}
              className="px-4 py-3 rounded-lg text-white bg-green-600 hover:bg-green-700 font-medium disabled:opacity-50 transition-colors"
            >
              {loading ? '🔄 Loading...' : '🔄 Refresh'}
            </button>
          </div>

          {/* Tabs */}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActive(tab.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200 ${
                  active === tab.key
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md transform scale-105'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                }`}
              >
                {tab.icon} {tab.label} ({counts[tab.key] || 0})
              </button>
            ))}
          </div>
        </header>

        {/* Error banner */}
        {connectionError && (
          <div className="mb-6 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-lg font-semibold text-red-800 mb-2">Unable to Load Screenshot History</h3>
                <p className="text-red-700 text-sm leading-relaxed mb-3">
                  {connectionError.includes('missing columns')
                    ? 'The database needs to be updated with new columns. Run: python migrate_database.py'
                    : connectionError.includes('Database')
                    ? 'Database configuration issue on the server.'
                    : connectionError}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleManualRefresh}
                    disabled={loading}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
                  >
                    {loading ? '🔄 Retrying...' : '🔄 Try Again'}
                  </button>
                  <button
                    onClick={() => setConnectionError(null)}
                    className="bg-red-100 text-red-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                  >
                    ✕ Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main content */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading && items.length === 0 ? (
            <div className="py-16 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Screenshots</h3>
              <p className="text-gray-600">Fetching your screenshot history...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center">
              <div className="text-6xl mb-4">📸</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {items.length === 0 ? 'No screenshots yet' : `No ${active} screenshots`}
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {items.length === 0
                  ? 'Start capturing screenshots to see your history here.'
                  : `You haven't captured any ${active} screenshots yet. Try a different format or capture a new screenshot.`}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => navigate('/screenshot')}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Capture Screenshot
                </button>
                {items.length > 0 && (
                  <button
                    onClick={() => setActive('all')}
                    className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                  >
                    View All Screenshots
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filtered.map((item, index) => (
                <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors duration-150">
                  <div className="flex items-start gap-4">
                    <div className="text-3xl flex-shrink-0">{typeToIcon(item.type, item.format)}</div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900 text-lg truncate">
                          {prettyType(item.type, item.format)}
                        </h3>

                        {item.full_page && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Full Page
                          </span>
                        )}

                        {item.dark_mode && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-800 text-white">
                            Dark Mode
                          </span>
                        )}

                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            item.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : item.status === 'processing'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {item.status || 'completed'}
                        </span>
                      </div>

                      {item.url && (
                        <p className="text-sm text-gray-600 mb-2 truncate" title={item.url}>
                          🌐 {item.url}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        {item.width && item.height && (
                          <span className="flex items-center gap-1">
                            📐 {item.width}x{item.height}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          📄 {item.format?.toUpperCase() || 'Unknown'}
                        </span>
                        <span className="flex items-center gap-1">📏 {formatSize(item.file_size)}</span>
                        {item.processing_time && (
                          <span className="flex items-center gap-1">⏱️ {formatProcessing(item.processing_time)}</span>
                        )}
                      </div>

                      {item.screenshot_url && (
                        <div className="mt-3">
                          <a
                            href={item.screenshot_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm"
                          >
                            🔗 View Screenshot
                          </a>
                        </div>
                      )}
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-medium text-gray-900 mb-1">{formatWhen(item.created_at)}</div>
                      <div className="text-xs text-gray-500">#{index + 1}</div>
                    </div>
                  </div>

                  {item.error_message && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-700">⚠️ {item.error_message}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Footer actions */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/activity')}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium"
          >
            📋 <span>View Recent Activity</span>
          </button>
          <button
            onClick={() => navigate('/screenshot')}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium"
          >
            🚀 <span>Capture New Screenshot</span>
          </button>
        </div>

        <footer className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-gray-500 bg-white px-4 py-2 rounded-lg border">
            ℹ️ Complete screenshot history (all time) • Manual refresh only
          </div>
        </footer>

        {/* Scroll-to-top */}
        {showScrollToTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 z-50 hover:scale-110"
            aria-label="Scroll to top"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
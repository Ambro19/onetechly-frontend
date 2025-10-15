// frontend/src/pages/History.js — 429-safe loader, de-dupe, short cache; keeps your UI intact
import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { getDisplayEmail, getDisplayName } from '../utils/userDisplay';
import AppBrand from '../components/AppBrand';
import YcdLogo from '../components/YcdLogo';

const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  process.env.REACT_APP_API_BASE_URL ||
  'http://localhost:8000';

// Debug helper
const debug =
  process.env.NODE_ENV === 'development'
    ? (...args) => console.log('[History]', ...args)
    : () => {};

// ------ Small in-memory cache (per user) ------
const CACHE_TTL_MS = 30_000;
const cache = new Map(); // key: username -> { ts, items }

// Prevent overlapping fetches even if refresh clicked multiple times
let inflight = null;

// Enhanced timestamp parsing
const parseServerTime = (ts) => {
  if (!ts) return null;
  if (/Z$|[+-]\d{2}:\d{2}$/.test(ts)) return new Date(ts);
  return new Date(`${ts}Z`);
};

const TABS = [
  { key: 'all', label: 'All Downloads', icon: '📁' },
  { key: 'transcripts', label: 'Transcripts', icon: '📄' },
  { key: 'audio', label: 'Audio', icon: '🎵' },
  { key: 'video', label: 'Video', icon: '🎬' },
];

// Type/icon helpers
const typeToIcon = (type, format) => {
  const t = (type || '').toLowerCase();
  const f = (format || '').toLowerCase();

  if (t.includes('audio') || ['mp3', 'm4a', 'aac', 'wav', 'flac'].includes(f)) return '🎵';
  if (t.includes('video') || ['mp4', 'mkv', 'avi', 'mov', 'webm'].includes(f)) return '🎬';

  if (t.includes('transcript') || ['srt', 'vtt', 'txt'].includes(f)) {
    if (['srt', 'vtt'].includes(f)) return '🕒';
    if (t.includes('unclean') || t.includes('timestamp')) return '🕒';
    return '📄';
  }
  return '📄';
};

const prettyType = (rawType, fileFormat) => {
  const type = (rawType || '').toLowerCase();
  const format = (fileFormat || '').toLowerCase();

  if (['srt', 'vtt'].includes(format)) {
    return format === 'srt' ? 'SRT Transcript (Timestamped)' : 'VTT Transcript (Timestamped)';
  }
  if (format === 'txt') {
    if (type.includes('unclean') || type.includes('timestamp')) return 'Timestamped Transcript';
    return 'Clean Transcript';
  }
  if (['mp3', 'm4a', 'aac', 'wav', 'flac'].includes(format)) return 'Audio File';
  if (['mp4', 'mkv', 'avi', 'mov', 'webm'].includes(format)) return 'Video File';

  if (type.includes('clean_transcript') || type === 'clean') return 'Clean Transcript';
  if (type.includes('unclean_transcript') || type === 'unclean') return 'Timestamped Transcript';
  if (type.includes('audio_download') || type === 'audio') return 'Audio File';
  if (type.includes('video_download') || type === 'video') return 'Video File';

  if (rawType) return rawType.replace(/_/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase());
  return 'Content';
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

// Normalize one item
const normalizeItem = (raw, idx) => {
  const get = (obj, ...keys) => keys.find((k) => obj && obj[k] != null) && obj[keys.find((k) => obj && obj[k] != null)];
  const id = get(raw, 'id') ?? `generated-${Date.now()}-${idx}`;
  const type = get(raw, 'type', 'transcript_type', 'file_type', 'category', 'action') || 'transcript';
  const fileFormat =
    get(raw, 'file_format', 'format', 'ext', 'extension') ||
    (type.includes('audio') ? 'mp3' : type.includes('video') ? 'mp4' : 'txt');
  const timestamp = get(raw, 'downloaded_at', 'created_at', 'timestamp', 'time') || new Date().toISOString();
  const fileName =
    get(raw, 'file_name', 'filename', 'name') ||
    `${type}_${get(raw, 'video_id', 'youtube_id', 'yt_id') || 'unknown'}.${fileFormat}`;

  return {
    id,
    type,
    file_format: fileFormat,
    video_id: get(raw, 'video_id', 'videoId', 'youtube_id', 'yt_id'),
    quality: get(raw, 'quality'),
    file_size: get(raw, 'file_size', 'size') || 0,
    downloaded_at: timestamp,
    processing_time: get(raw, 'processing_time', 'process_time', 'duration'),
    status: get(raw, 'status') || 'completed',
    file_name: fileName,
    language: get(raw, 'language', 'lang') || 'en',
    error_message: get(raw, 'error_message', 'error'),
    description: get(raw, 'description'),
    action: get(raw, 'action'),
  };
};

// Fetch wrapper with 429/5xx backoff (max 4 tries)
async function fetchWithBackoff(url, options, { tries = 4, baseDelay = 500 } = {}) {
  let attempt = 0;
  while (attempt < tries) {
    const res = await fetch(url, options).catch(() => null);
    if (res && res.ok) return res;

    const status = res?.status ?? 0;
    // Retry on 429 or transient 5xx
    if ([429, 502, 503, 504].includes(status) || !res) {
      const wait = baseDelay * Math.pow(2, attempt); // 0.5s, 1s, 2s, 4s
      await new Promise((r) => setTimeout(r, wait));
      attempt++;
      continue;
    }
    return res; // non-retryable status
  }
  return null; // give up
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

        // Try primary endpoint
        const endpoints = [
          `${API_BASE_URL}/user/download-history`,
          // Fallbacks:
          `${API_BASE_URL}/user/history`,
          `${API_BASE_URL}/download-history`,
        ];

        let got = null;
        for (const url of endpoints) {
          debug('Fetching:', url);
          const res = await fetchWithBackoff(url, { method: 'GET', headers }, { tries: 4, baseDelay: 500 });
          if (!res) continue;
          if (res.ok) {
            const data = await res.json().catch(() => ({}));
            const arr = Array.isArray(data.downloads)
              ? data.downloads
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
          const A = parseServerTime(a.downloaded_at)?.getTime() || 0;
          const B = parseServerTime(b.downloaded_at)?.getTime() || 0;
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

  // Load once on mount (or when user changes)
  useEffect(() => {
    if (isAuthenticated && !hasLoaded) load();
  }, [isAuthenticated, load, hasLoaded, username]);

  // Manual refresh
  const handleManualRefresh = useCallback(async () => {
    cache.delete(username); // Invalidate short cache
    setHasLoaded(false);
    await load();
  }, [load, username]);

  // Filtering
  const filtered = useMemo(() => {
    if (active === 'all') return items;
    return items.filter((item) => {
      const type = (item.type || '').toLowerCase();
      const format = (item.file_format || '').toLowerCase();
      const action = (item.action || '').toLowerCase();

      switch (active) {
        case 'transcripts':
          return (
            type.includes('transcript') ||
            type.includes('clean') ||
            type.includes('unclean') ||
            action.includes('transcript') ||
            ['srt', 'vtt', 'txt'].includes(format)
          );
        case 'audio':
          return (
            type.includes('audio') ||
            action.includes('audio') ||
            ['mp3', 'm4a', 'aac', 'wav', 'flac'].includes(format)
          );
        case 'video':
          return (
            type.includes('video') ||
            action.includes('video') ||
            ['mp4', 'mkv', 'avi', 'mov', 'webm'].includes(format)
          );
        default:
          return true;
      }
    });
  }, [active, items]);

  // Counts
  const counts = useMemo(() => {
    const cats = { transcripts: 0, audio: 0, video: 0 };
    items.forEach((item) => {
      const type = (item.type || '').toLowerCase();
      const format = (item.file_format || '').toLowerCase();
      const action = (item.action || '').toLowerCase();

      if (
        type.includes('transcript') ||
        type.includes('clean') ||
        type.includes('unclean') ||
        action.includes('transcript') ||
        ['srt', 'vtt', 'txt'].includes(format)
      ) {
        cats.transcripts++;
      } else if (
        type.includes('audio') ||
        action.includes('audio') ||
        ['mp3', 'm4a', 'aac', 'wav', 'flac'].includes(format)
      ) {
        cats.audio++;
      } else if (
        type.includes('video') ||
        action.includes('video') ||
        ['mp4', 'mkv', 'avi', 'mov', 'webm'].includes(format)
      ) {
        cats.video++;
      }
    });
    return { all: cats.transcripts + cats.audio + cats.video, ...cats };
  }, [items]);

  const email = getDisplayEmail(user);
  const name = getDisplayName(user);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-6">

        {/* ============ Professional Brand Header (Top-Left) ============ */}
        <div className="mb-6">
          <AppBrand
            size={32}
            showText={true}
            label="OneTechly — YCD"
            logoSrc="/logo_onetechly.png"
            to="/app/dashboard"
          />
        </div>

        {/* ============ Centered Page Header with Official YCD Logo ============ */}
        <header className="mb-6 text-center">
          <div className="flex justify-center mb-4">
            <YcdLogo size={56} />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🗂️ Download History</h1>
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
              onClick={() => navigate('/download')}
              className="px-4 py-3 rounded-lg text-white bg-blue-600 hover:bg-blue-700 font-medium transition-colors"
            >
              ← Downloads
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
                <h3 className="text-lg font-semibold text-red-800 mb-2">Unable to Load Download History</h3>
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Downloads</h3>
              <p className="text-gray-600">Fetching your download history...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center">
              <div className="text-6xl mb-4">📂</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {items.length === 0 ? 'No downloads yet' : `No ${active} downloads`}
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {items.length === 0
                  ? 'Start downloading content to see your history here.'
                  : `You haven't downloaded any ${active} content yet. Try a different category or start a new download.`}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => navigate('/download')}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Start Downloading
                </button>
                {items.length > 0 && (
                  <button
                    onClick={() => setActive('all')}
                    className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                  >
                    View All Downloads
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filtered.map((item, index) => (
                <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors duration-150">
                  <div className="flex items-start gap-4">
                    <div className="text-3xl flex-shrink-0">{typeToIcon(item.type, item.file_format)}</div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900 text-lg truncate">
                          {prettyType(item.type, item.file_format)}
                        </h3>

                        {item.quality && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {item.quality}
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

                      {item.file_name && (
                        <p className="text-sm text-gray-600 mb-2 truncate" title={item.file_name}>
                          📁 {item.file_name}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        {item.video_id && (
                          <span className="flex items-center gap-1">
                            🎬 <span className="font-mono">{item.video_id}</span>
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          📄 {item.file_format?.toUpperCase() || 'Unknown'}
                        </span>
                        <span className="flex items-center gap-1">📏 {formatSize(item.file_size)}</span>
                        {item.processing_time && (
                          <span className="flex items-center gap-1">⏱️ {formatProcessing(item.processing_time)}</span>
                        )}
                        {item.language && (
                          <span className="flex items-center gap-1">🌐 {item.language.toUpperCase()}</span>
                        )}
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-medium text-gray-900 mb-1">{formatWhen(item.downloaded_at)}</div>
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
            onClick={() => navigate('/download')}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium"
          >
            🚀 <span>Start New Download</span>
          </button>
        </div>

        <footer className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-gray-500 bg-white px-4 py-2 rounded-lg border">
            ℹ️ Download history • Files are delivered immediately • Manual refresh only
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

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
// // frontend/src/pages/History.js — 429-safe loader, de-dupe, short cache; keeps your UI intact
// import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import toast from 'react-hot-toast';
// import { useAuth } from '../contexts/AuthContext';
// import { getDisplayEmail, getDisplayName } from '../utils/userDisplay';
// import Logo from '../components/Logo';
// import AppPageTitle from '../components/AppPageTitle';

// const API_BASE_URL =
//   process.env.REACT_APP_API_URL ||
//   process.env.REACT_APP_API_BASE_URL ||
//   'http://localhost:8000';

// // Debug helper
// const debug =
//   process.env.NODE_ENV === 'development'
//     ? (...args) => console.log('[History]', ...args)
//     : () => {};

// // ------ Small in-memory cache (per user) ------
// const CACHE_TTL_MS = 30_000;
// const cache = new Map(); // key: username -> { ts, items }

// // Prevent overlapping fetches even if refresh clicked multiple times
// let inflight = null;

// // Enhanced timestamp parsing
// const parseServerTime = (ts) => {
//   if (!ts) return null;
//   if (/Z$|[+-]\d{2}:\d{2}$/.test(ts)) return new Date(ts);
//   return new Date(`${ts}Z`);
// };

// const TABS = [
//   { key: 'all', label: 'All Downloads', icon: '📁' },
//   { key: 'transcripts', label: 'Transcripts', icon: '📄' },
//   { key: 'audio', label: 'Audio', icon: '🎵' },
//   { key: 'video', label: 'Video', icon: '🎬' },
// ];

// // Type/icon helpers
// const typeToIcon = (type, format) => {
//   const t = (type || '').toLowerCase();
//   const f = (format || '').toLowerCase();

//   if (t.includes('audio') || ['mp3', 'm4a', 'aac', 'wav', 'flac'].includes(f)) return '🎵';
//   if (t.includes('video') || ['mp4', 'mkv', 'avi', 'mov', 'webm'].includes(f)) return '🎬';

//   if (t.includes('transcript') || ['srt', 'vtt', 'txt'].includes(f)) {
//     if (['srt', 'vtt'].includes(f)) return '🕒';
//     if (t.includes('unclean') || t.includes('timestamp')) return '🕒';
//     return '📄';
//   }
//   return '📄';
// };

// const prettyType = (rawType, fileFormat) => {
//   const type = (rawType || '').toLowerCase();
//   const format = (fileFormat || '').toLowerCase();

//   if (['srt', 'vtt'].includes(format)) {
//     return format === 'srt' ? 'SRT Transcript (Timestamped)' : 'VTT Transcript (Timestamped)';
//   }
//   if (format === 'txt') {
//     if (type.includes('unclean') || type.includes('timestamp')) return 'Timestamped Transcript';
//     return 'Clean Transcript';
//   }
//   if (['mp3', 'm4a', 'aac', 'wav', 'flac'].includes(format)) return 'Audio File';
//   if (['mp4', 'mkv', 'avi', 'mov', 'webm'].includes(format)) return 'Video File';

//   if (type.includes('clean_transcript') || type === 'clean') return 'Clean Transcript';
//   if (type.includes('unclean_transcript') || type === 'unclean') return 'Timestamped Transcript';
//   if (type.includes('audio_download') || type === 'audio') return 'Audio File';
//   if (type.includes('video_download') || type === 'video') return 'Video File';

//   if (rawType) return rawType.replace(/_/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase());
//   return 'Content';
// };

// const formatSize = (bytes) => {
//   if (bytes == null || bytes === 0) return '—';
//   const units = ['B', 'KB', 'MB', 'GB'];
//   let i = 0;
//   let n = Number(bytes);
//   while (n >= 1024 && i < units.length - 1) {
//     n /= 1024;
//     i++;
//   }
//   return `${n.toFixed(n < 10 ? 1 : 0)} ${units[i]}`;
// };

// const formatWhen = (iso) => {
//   const d = parseServerTime(iso);
//   if (!d || isNaN(d.getTime())) return '—';
//   const diff = (Date.now() - d.getTime()) / 1000;
//   if (diff < 60) return 'Just now';
//   if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
//   if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
//   if (diff < 172800) return 'Yesterday';
//   return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
// };

// const formatProcessing = (v) => {
//   if (v == null) return '—';
//   const num = parseFloat(v);
//   return Number.isFinite(num) ? `${num.toFixed(2)}s` : String(v);
// };

// // Normalize one item
// const normalizeItem = (raw, idx) => {
//   const get = (obj, ...keys) => keys.find((k) => obj && obj[k] != null) && obj[keys.find((k) => obj && obj[k] != null)];
//   const id = get(raw, 'id') ?? `generated-${Date.now()}-${idx}`;
//   const type = get(raw, 'type', 'transcript_type', 'file_type', 'category', 'action') || 'transcript';
//   const fileFormat =
//     get(raw, 'file_format', 'format', 'ext', 'extension') ||
//     (type.includes('audio') ? 'mp3' : type.includes('video') ? 'mp4' : 'txt');
//   const timestamp = get(raw, 'downloaded_at', 'created_at', 'timestamp', 'time') || new Date().toISOString();
//   const fileName =
//     get(raw, 'file_name', 'filename', 'name') ||
//     `${type}_${get(raw, 'video_id', 'youtube_id', 'yt_id') || 'unknown'}.${fileFormat}`;

//   return {
//     id,
//     type,
//     file_format: fileFormat,
//     video_id: get(raw, 'video_id', 'videoId', 'youtube_id', 'yt_id'),
//     quality: get(raw, 'quality'),
//     file_size: get(raw, 'file_size', 'size') || 0,
//     downloaded_at: timestamp,
//     processing_time: get(raw, 'processing_time', 'process_time', 'duration'),
//     status: get(raw, 'status') || 'completed',
//     file_name: fileName,
//     language: get(raw, 'language', 'lang') || 'en',
//     error_message: get(raw, 'error_message', 'error'),
//     description: get(raw, 'description'),
//     action: get(raw, 'action'),
//   };
// };

// // Fetch wrapper with 429/5xx backoff (max 4 tries)
// async function fetchWithBackoff(url, options, { tries = 4, baseDelay = 500 } = {}) {
//   let attempt = 0;
//   while (attempt < tries) {
//     const res = await fetch(url, options).catch(() => null);
//     if (res && res.ok) return res;

//     const status = res?.status ?? 0;
//     // Retry on 429 or transient 5xx
//     if ([429, 502, 503, 504].includes(status) || !res) {
//       const wait = baseDelay * Math.pow(2, attempt); // 0.5s, 1s, 2s, 4s
//       await new Promise((r) => setTimeout(r, wait));
//       attempt++;
//       continue;
//     }
//     return res; // non-retryable status
//   }
//   return null; // give up
// }

// export default function History() {
//   const { token, isAuthenticated, user } = useAuth();
//   const navigate = useNavigate();

//   const [active, setActive] = useState('all');
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [connectionError, setConnectionError] = useState(null);
//   const [lastFetch, setLastFetch] = useState(null);
//   const [hasLoaded, setHasLoaded] = useState(false);
//   const [showScrollToTop, setShowScrollToTop] = useState(false);

//   const username = (user?.username || '').toLowerCase();
//   const mountedRef = useRef(true);

//   useEffect(() => {
//     if (!isAuthenticated) navigate('/login');
//   }, [isAuthenticated, navigate]);

//   useEffect(() => {
//     mountedRef.current = true;
//     const onScroll = () => setShowScrollToTop(window.scrollY > 400);
//     window.addEventListener('scroll', onScroll);
//     return () => {
//       mountedRef.current = false;
//       window.removeEventListener('scroll', onScroll);
//     };
//   }, []);

//   const scrollToTop = useCallback(() => {
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   }, []);

//   // Single load function (429-safe + cache + de-dupe)
//   const load = useCallback(async () => {
//     if (!token) return;
//     if (loading) return;

//     // Serve from short cache if available
//     const c = cache.get(username);
//     if (c && Date.now() - c.ts < CACHE_TTL_MS) {
//       debug('Using cached history');
//       setItems(c.items);
//       setLastFetch(new Date(c.ts));
//       setHasLoaded(true);
//       setConnectionError(null);
//       return;
//     }

//     setLoading(true);
//     setConnectionError(null);

//     // De-dupe overlapping calls globally
//     if (!inflight) {
//       inflight = (async () => {
//         const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

//         // Try primary endpoint
//         const endpoints = [
//           `${API_BASE_URL}/user/download-history`,
//           // Fallbacks:
//           `${API_BASE_URL}/user/history`,
//           `${API_BASE_URL}/download-history`,
//         ];

//         let got = null;
//         for (const url of endpoints) {
//           debug('Fetching:', url);
//           const res = await fetchWithBackoff(url, { method: 'GET', headers }, { tries: 4, baseDelay: 500 });
//           if (!res) continue;
//           if (res.ok) {
//             const data = await res.json().catch(() => ({}));
//             const arr = Array.isArray(data.downloads)
//               ? data.downloads
//               : Array.isArray(data.items)
//               ? data.items
//               : Array.isArray(data)
//               ? data
//               : [];
//             got = arr;
//             break;
//           }
//           if (res.status === 500) {
//             const txt = await res.text().catch(() => '');
//             if (txt.includes('no such column'))
//               throw new Error('Database needs migration - missing columns detected');
//             throw new Error('Database connection issue - please contact support');
//           }
//           if (res.status === 404) throw new Error('History endpoint not available');
//           if (res.status === 429) throw new Error('Server is busy (429). Please retry in a moment.');
//         }

//         if (!got) got = [];
//         // Normalize, sort, limit
//         const normalized = got.slice(0, 120).map(normalizeItem);
//         normalized.sort((a, b) => {
//           const A = parseServerTime(a.downloaded_at)?.getTime() || 0;
//           const B = parseServerTime(b.downloaded_at)?.getTime() || 0;
//           return B - A;
//         });

//         // Cache
//         cache.set(username, { ts: Date.now(), items: normalized });
//         return normalized;
//       })();
//     }

//     try {
//       const normalized = await inflight;
//       if (!mountedRef.current) return;
//       setItems(normalized);
//       setConnectionError(null);
//       setLastFetch(new Date());
//     } catch (err) {
//       if (!mountedRef.current) return;
//       console.error('💥 History load failed:', err);
//       setItems([]);
//       setConnectionError(err?.message || 'Failed to load history');
//       if (!hasLoaded) {
//         toast.error(`Unable to load history: ${err?.message || 'Unknown error'}`, {
//           id: 'history-error',
//           duration: 6000,
//         });
//       }
//     } finally {
//       if (mountedRef.current) {
//         setHasLoaded(true);
//         setLoading(false);
//       }
//       inflight = null;
//     }
//   }, [token, loading, username, hasLoaded]);

//   // Load once on mount (or when user changes)
//   useEffect(() => {
//     if (isAuthenticated && !hasLoaded) load();
//   }, [isAuthenticated, load, hasLoaded, username]);

//   // Manual refresh
//   const handleManualRefresh = useCallback(async () => {
//     cache.delete(username); // Invalidate short cache
//     setHasLoaded(false);
//     await load();
//   }, [load, username]);

//   // Filtering
//   const filtered = useMemo(() => {
//     if (active === 'all') return items;
//     return items.filter((item) => {
//       const type = (item.type || '').toLowerCase();
//       const format = (item.file_format || '').toLowerCase();
//       const action = (item.action || '').toLowerCase();

//       switch (active) {
//         case 'transcripts':
//           return (
//             type.includes('transcript') ||
//             type.includes('clean') ||
//             type.includes('unclean') ||
//             action.includes('transcript') ||
//             ['srt', 'vtt', 'txt'].includes(format)
//           );
//         case 'audio':
//           return (
//             type.includes('audio') ||
//             action.includes('audio') ||
//             ['mp3', 'm4a', 'aac', 'wav', 'flac'].includes(format)
//           );
//         case 'video':
//           return (
//             type.includes('video') ||
//             action.includes('video') ||
//             ['mp4', 'mkv', 'avi', 'mov', 'webm'].includes(format)
//           );
//         default:
//           return true;
//       }
//     });
//   }, [active, items]);

//   // Counts
//   const counts = useMemo(() => {
//     const cats = { transcripts: 0, audio: 0, video: 0 };
//     items.forEach((item) => {
//       const type = (item.type || '').toLowerCase();
//       const format = (item.file_format || '').toLowerCase();
//       const action = (item.action || '').toLowerCase();

//       if (
//         type.includes('transcript') ||
//         type.includes('clean') ||
//         type.includes('unclean') ||
//         action.includes('transcript') ||
//         ['srt', 'vtt', 'txt'].includes(format)
//       ) {
//         cats.transcripts++;
//       } else if (
//         type.includes('audio') ||
//         action.includes('audio') ||
//         ['mp3', 'm4a', 'aac', 'wav', 'flac'].includes(format)
//       ) {
//         cats.audio++;
//       } else if (
//         type.includes('video') ||
//         action.includes('video') ||
//         ['mp4', 'mkv', 'avi', 'mov', 'webm'].includes(format)
//       ) {
//         cats.video++;
//       }
//     });
//     return { all: cats.transcripts + cats.audio + cats.video, ...cats };
//   }, [items]);

//   const email = getDisplayEmail(user);
//   const name = getDisplayName(user);

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-6">
//         <header className="mb-6 text-center">
//           <div className="flex justify-center mb-3">
//             <Logo variant="large" showText={false} />
//           </div>
//           <h1 className="text-3xl font-bold text-gray-900">🗂️ Download History</h1>
//           <div className="mt-1 text-sm text-gray-600">
//             Logged in as: <span className="font-medium text-blue-700">{name}</span>{' '}
//             (<span className="font-mono text-xs">{email}</span>)
//           </div>

//           {lastFetch && (
//             <div className="mt-1 text-xs text-gray-500">Last updated: {lastFetch.toLocaleTimeString()}</div>
//           )}

//           <div className="mt-4 grid grid-cols-1 sm:grid-cols-4 gap-3">
//             <button
//               onClick={() => navigate('/download')}
//               className="px-4 py-3 rounded-lg text-white bg-blue-600 hover:bg-blue-700 font-medium transition-colors"
//             >
//               ← Downloads
//             </button>
//             <button
//               onClick={() => navigate('/dashboard')}
//               className="px-4 py-3 rounded-lg text-white bg-gray-800 hover:bg-gray-900 font-medium transition-colors"
//             >
//               🏠 Dashboard
//             </button>
//             <button
//               onClick={() => navigate('/activity')}
//               className="px-4 py-3 rounded-lg text-white bg-purple-600 hover:bg-purple-700 font-medium transition-colors"
//             >
//               📋 Activity
//             </button>
//             <button
//               onClick={handleManualRefresh}
//               disabled={loading}
//               className="px-4 py-3 rounded-lg text-white bg-green-600 hover:bg-green-700 font-medium disabled:opacity-50 transition-colors"
//             >
//               {loading ? '🔄 Loading...' : '🔄 Refresh'}
//             </button>
//           </div>

//           {/* Tabs */}
//           <div className="mt-6 flex flex-wrap justify-center gap-2">
//             {TABS.map((tab) => (
//               <button
//                 key={tab.key}
//                 onClick={() => setActive(tab.key)}
//                 className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200 ${
//                   active === tab.key
//                     ? 'bg-blue-600 text-white border-blue-600 shadow-md transform scale-105'
//                     : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
//                 }`}
//               >
//                 {tab.icon} {tab.label} ({counts[tab.key] || 0})
//               </button>
//             ))}
//           </div>
//         </header>

//         {/* Page title bar */}
//         <AppPageTitle
//           title="Download History"
//           subtitle={
//             <>
//               Logged in as:{' '}
//               <span className="font-semibold text-blue-600">{user?.username || 'User'}</span>{' '}
//               (<span className="font-mono">{user?.email}</span>)
//             </>
//           }
//           right={
//             <div className="flex items-center gap-3">
//               <button
//                 onClick={() => navigate('/dashboard')}
//                 className="text-sm text-gray-700 hover:text-gray-900 underline"
//               >
//                 ← Back to Dashboard
//               </button>
//               {/* FIX: use the real handler & loading flag */}
//               <button
//                 onClick={handleManualRefresh}
//                 className="text-sm text-blue-600 hover:text-blue-800 underline disabled:opacity-50"
//                 disabled={loading}
//                 title="Refresh history"
//               >
//                 {loading ? 'Refreshing…' : 'Refresh'}
//               </button>
//             </div>
//           }
//         />

//         {/* Error banner */}
//         {connectionError && (
//           <div className="mb-6 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl p-4">
//             <div className="flex items-start">
//               <div className="flex-shrink-0">
//                 <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                   />
//                 </svg>
//               </div>
//               <div className="ml-3 flex-1">
//                 <h3 className="text-lg font-semibold text-red-800 mb-2">Unable to Load Download History</h3>
//                 <p className="text-red-700 text-sm leading-relaxed mb-3">
//                   {connectionError.includes('missing columns')
//                     ? 'The database needs to be updated with new columns. Run: python migrate_database.py'
//                     : connectionError.includes('Database')
//                     ? 'Database configuration issue on the server.'
//                     : connectionError}
//                 </p>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={handleManualRefresh}
//                     disabled={loading}
//                     className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
//                   >
//                     {loading ? '🔄 Retrying...' : '🔄 Try Again'}
//                   </button>
//                   <button
//                     onClick={() => setConnectionError(null)}
//                     className="bg-red-100 text-red-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
//                   >
//                     ✕ Dismiss
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Main content */}
//         <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//           {loading && items.length === 0 ? (
//             <div className="py-16 text-center">
//               <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//               </div>
//               <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Downloads</h3>
//               <p className="text-gray-600">Fetching your download history...</p>
//             </div>
//           ) : filtered.length === 0 ? (
//             <div className="py-16 text-center">
//               <div className="text-6xl mb-4">📂</div>
//               <h3 className="text-xl font-semibold text-gray-900 mb-2">
//                 {items.length === 0 ? 'No downloads yet' : `No ${active} downloads`}
//               </h3>
//               <p className="text-gray-600 mb-6 max-w-md mx-auto">
//                 {items.length === 0
//                   ? 'Start downloading content to see your history here.'
//                   : `You haven't downloaded any ${active} content yet. Try a different category or start a new download.`}
//               </p>
//               <div className="flex flex-col sm:flex-row gap-3 justify-center">
//                 <button
//                   onClick={() => navigate('/download')}
//                   className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
//                 >
//                   Start Downloading
//                 </button>
//                 {items.length > 0 && (
//                   <button
//                     onClick={() => setActive('all')}
//                     className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
//                   >
//                     View All Downloads
//                   </button>
//                 )}
//               </div>
//             </div>
//           ) : (
//             <div className="divide-y divide-gray-100">
//               {filtered.map((item, index) => (
//                 <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors duration-150">
//                   <div className="flex items-start gap-4">
//                     <div className="text-3xl flex-shrink-0">{typeToIcon(item.type, item.file_format)}</div>

//                     <div className="flex-1 min-w-0">
//                       <div className="flex flex-wrap items-center gap-2 mb-2">
//                         <h3 className="font-semibold text-gray-900 text-lg truncate">
//                           {prettyType(item.type, item.file_format)}
//                         </h3>

//                         {item.quality && (
//                           <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                             {item.quality}
//                           </span>
//                         )}

//                         <span
//                           className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                             item.status === 'completed'
//                               ? 'bg-green-100 text-green-800'
//                               : item.status === 'processing'
//                               ? 'bg-yellow-100 text-yellow-800'
//                               : 'bg-red-100 text-red-800'
//                           }`}
//                         >
//                           {item.status || 'completed'}
//                         </span>
//                       </div>

//                       {item.file_name && (
//                         <p className="text-sm text-gray-600 mb-2 truncate" title={item.file_name}>
//                           📁 {item.file_name}
//                         </p>
//                       )}

//                       <div className="flex flex-wrap gap-4 text-sm text-gray-500">
//                         {item.video_id && (
//                           <span className="flex items-center gap-1">
//                             🎬 <span className="font-mono">{item.video_id}</span>
//                           </span>
//                         )}
//                         <span className="flex items-center gap-1">
//                           📄 {item.file_format?.toUpperCase() || 'Unknown'}
//                         </span>
//                         <span className="flex items-center gap-1">📏 {formatSize(item.file_size)}</span>
//                         {item.processing_time && (
//                           <span className="flex items-center gap-1">⏱️ {formatProcessing(item.processing_time)}</span>
//                         )}
//                         {item.language && (
//                           <span className="flex items-center gap-1">🌐 {item.language.toUpperCase()}</span>
//                         )}
//                       </div>
//                     </div>

//                     <div className="text-right flex-shrink-0">
//                       <div className="text-sm font-medium text-gray-900 mb-1">{formatWhen(item.downloaded_at)}</div>
//                       <div className="text-xs text-gray-500">#{index + 1}</div>
//                     </div>
//                   </div>

//                   {item.error_message && (
//                     <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
//                       <p className="text-sm text-red-700">⚠️ {item.error_message}</p>
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           )}
//         </section>

//         {/* Footer actions */}
//         <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
//           <button
//             onClick={() => navigate('/activity')}
//             className="flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium"
//           >
//             📋 <span>View Recent Activity</span>
//           </button>
//           <button
//             onClick={() => navigate('/download')}
//             className="flex items-center justify-center gap-2 px-6 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium"
//           >
//             🚀 <span>Start New Download</span>
//           </button>
//         </div>

//         <footer className="mt-6 text-center">
//           <div className="inline-flex items-center gap-2 text-sm text-gray-500 bg-white px-4 py-2 rounded-lg border">
//             ℹ️ Download history • Files are delivered immediately • Manual refresh only
//           </div>
//         </footer>

//         {/* Scroll-to-top */}
//         {showScrollToTop && (
//           <button
//             onClick={scrollToTop}
//             className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 z-50 hover:scale-110"
//             aria-label="Scroll to top"
//           >
//             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
//             </svg>
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }



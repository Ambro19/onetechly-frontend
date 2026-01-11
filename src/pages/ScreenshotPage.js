// frontend/src/pages/ScreenshotPage.js — PixelPerfect Screenshot API
// CONVERTED FROM: YCD Download.js
// PURPOSE: Main screenshot capture page with full configuration options
// CHANGES: YouTube download → Website screenshot capture

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import AppBrand from '../components/AppBrand';

const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  process.env.REACT_APP_API_BASE_URL ||
  'http://localhost:8000';

// CONVERTED: Viewport presets for common device sizes
const VIEWPORT_PRESETS = {
  desktop: { width: 1920, height: 1080, name: 'Desktop (1920x1080)' },
  laptop: { width: 1366, height: 768, name: 'Laptop (1366x768)' },
  tablet: { width: 768, height: 1024, name: 'Tablet (768x1024)' },
  mobile: { width: 375, height: 667, name: 'Mobile (375x667)' },
  ultrawide: { width: 3440, height: 1440, name: 'Ultrawide (3440x1440)' }
};

export default function ScreenshotPage() {
  const navigate = useNavigate();
  const { token, user, isAuthenticated, logout } = useAuth();
  const { subscriptionStatus, tier, refreshSubscriptionStatus } = useSubscription();

  // CONVERTED: Website URL input (not YouTube)
  const [websiteUrl, setWebsiteUrl] = useState('');
  
  // CONVERTED: Screenshot configuration options
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);
  const [format, setFormat] = useState('png');
  const [fullPage, setFullPage] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [delay, setDelay] = useState(0);
  const [removeElements, setRemoveElements] = useState('');

  // Result states
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [screenshotData, setScreenshotData] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [screenshotCompleted, setScreenshotCompleted] = useState(false);
  const [isRefreshingSubscription, setIsRefreshingSubscription] = useState(false);

  const pollStopRef = useRef(false);

  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
  }, [isAuthenticated, navigate]);

  // URL validation
  const isValidUrl = (urlString) => {
    try {
      const url = new URL(urlString);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const xUiValidUrl = isValidUrl(websiteUrl);

  // CONVERTED: Subscription helpers (simplified for screenshots)
  const limits = useMemo(() => subscriptionStatus?.limits || {}, [subscriptionStatus]);
  const usage  = useMemo(() => subscriptionStatus?.usage  || {}, [subscriptionStatus]);

  const isUnlimited = (limit) => limit === 'unlimited' || limit === Infinity;

  const getUsed = (k) => Number(usage?.[k] ?? 0);
  const getLimit = (k) => limits?.[k];

  const atLimit = (k) => {
    const lim = getLimit(k);
    if (isUnlimited(lim) || lim === undefined || lim === null) return false;
    return getUsed(k) >= Number(lim);
  };

  // CONVERTED: Single usage key for screenshots
  const actionKey = 'screenshots';

  const safeFormatUsage = (k) => {
    const u = getUsed(k);
    const l = getLimit(k);
    if (isUnlimited(l)) return `${u} / ∞`;
    const clamped = Math.min(Number(u || 0), Number(l || 0));
    return `${clamped} / ${l ?? 0}`;
  };

  const getUsageLimitMessage = () => {
    if (atLimit(actionKey)) {
      return 'Monthly screenshot limit reached. Please upgrade your plan.';
    }
    return null;
  };

  const xUiDisabledReason = () => {
    if (!xUiValidUrl) return 'Enter a valid website URL starting with http:// or https://';
    if (atLimit(actionKey)) return getUsageLimitMessage();
    return '';
  };

  const xUiPrimaryDisabled = isLoading || !xUiValidUrl || atLimit(actionKey);

  const formatResetDate = useCallback(() => {
    if (!subscriptionStatus?.next_reset) return null;
    const d = new Date(subscriptionStatus.next_reset);
    if (Number.isNaN(d.getTime())) return null;
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  }, [subscriptionStatus]);

  const isResetOverdue = useMemo(() => {
    if (!subscriptionStatus?.next_reset) return false;
    const d = new Date(subscriptionStatus.next_reset);
    if (Number.isNaN(d.getTime())) return false;
    return Date.now() > d.getTime();
  }, [subscriptionStatus]);

  const forceRefreshIfNeeded = useCallback(async (reason) => {
    if (!isAuthenticated || !refreshSubscriptionStatus) return;
    try {
      if (isResetOverdue) {
        await refreshSubscriptionStatus();
      } else {
        await refreshSubscriptionStatus();
      }
    } catch {}
  }, [isAuthenticated, refreshSubscriptionStatus, isResetOverdue]);

  useEffect(() => {
    if (isAuthenticated && refreshSubscriptionStatus) {
      refreshSubscriptionStatus().catch(() => {});
    }
  }, [isAuthenticated, refreshSubscriptionStatus]);

  useEffect(() => {
    const onFocus = () => forceRefreshIfNeeded('focus');
    const onVis = () => {
      if (document.visibilityState === 'visible') forceRefreshIfNeeded('visible');
    };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVis);
    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [forceRefreshIfNeeded]);

  const pollUsageSync = useCallback(async (beforeUsageMap, keyToObserve) => {
    const maxTries = 6;
    let tries = 0;

    while (tries < maxTries && !pollStopRef.current) {
      tries += 1;
      try {
        await refreshSubscriptionStatus();
      } catch {}
      await new Promise((res) => setTimeout(res, 450));

      const currentUsed = getUsed(keyToObserve);
      const beforeUsed = Number(beforeUsageMap?.[keyToObserve] ?? 0);

      if (currentUsed > beforeUsed) return true;
    }
    return false;
  }, [refreshSubscriptionStatus, getUsed]);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      toast.success('👋 Logged out successfully!');
      navigate('/login');
    }
  };

  // CONVERTED: Capture screenshot (main function)
  const handleCapture = async () => {
    try {
      setIsLoading(true);
      setError('');
      setScreenshotUrl('');
      setScreenshotData(null);
      setSuccessMessage('');
      setScreenshotCompleted(false);
      pollStopRef.current = false;

      if (isResetOverdue) {
        await forceRefreshIfNeeded('pre-capture');
      }

      if (!isValidUrl(websiteUrl)) {
        throw new Error('Please enter a valid website URL starting with http:// or https://');
      }

      const beforeUsage = {
        screenshots: getUsed('screenshots'),
      };

      const payload = {
        url: websiteUrl,
        width: width,
        height: height,
        format: format,
        full_page: fullPage,
        dark_mode: darkMode,
        delay: delay,
      };

      // Add remove_elements if provided
      if (removeElements.trim()) {
        payload.remove_elements = removeElements.split(',').map(s => s.trim()).filter(Boolean);
      }

      const res = await fetch(`${API_BASE_URL}/api/v1/screenshot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.detail || 'Screenshot capture failed');
      }

      const data = await res.json();

      setScreenshotUrl(data.screenshot_url || '');
      setScreenshotData({
        id: data.screenshot_id,
        url: websiteUrl,
        width: data.width,
        height: data.height,
        format: data.format,
        size: data.size_bytes,
        created_at: data.created_at
      });
      setScreenshotCompleted(true);
      setSuccessMessage('Screenshot captured successfully!');
      toast.success('📸 Screenshot captured!');

      await pollUsageSync(beforeUsage, 'screenshots');

    } catch (err) {
      setError(err.message || 'Screenshot capture failed');
      toast.error(err.message || 'Screenshot capture failed');
    } finally {
      setIsLoading(false);
      try {
        await refreshSubscriptionStatus();
      } catch {}
    }
  };

  const handleDownload = () => {
    if (!screenshotUrl) return;
    
    const a = document.createElement('a');
    a.href = screenshotUrl;
    a.download = `screenshot_${Date.now()}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success('💾 Screenshot downloaded!');
  };

  const applyPreset = (preset) => {
    setWidth(preset.width);
    setHeight(preset.height);
    toast.success(`Applied ${preset.name} preset`);
  };

  const primaryBtnClass = `flex-1 py-3 px-6 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
    xUiPrimaryDisabled
      ? 'bg-gray-300 text-gray-600 cursor-not-allowed opacity-70'
      : 'bg-blue-600 enabled:hover:bg-blue-700 text-white focus:ring-blue-500'
  }`;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Brand header */}
        <div className="mb-6">
          <AppBrand
            size={32}
            showText={true}
            label="PixelPerfect API"
            logoSrc="/logo_pixelperfect.png"
            to="/dashboard"
          />
        </div>

        <div className="text-center mb-6">
          <div className="flex justify-center items-center mb-4">
            <div className="text-6xl">📸</div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">📸 Capture Website Screenshot</h1>
          <div className="text-sm text-gray-600 mb-2">
            Logged in as{' '}
            <span className="font-semibold text-blue-600">{user?.username || 'User'}</span> ({user?.email})
          </div>

          <button
            onClick={handleLogout}
            className="text-sm text-red-600 hover:text-red-800 underline transition-colors"
          >
            Logout
          </button>

          {successMessage && <span className="sr-only" aria-live="polite">{successMessage}</span>}

          {/* Subscription card - SIMPLIFIED for screenshots */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-4 mt-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm">
                <span className="font-semibold">Current Plan:</span>{' '}
                <span
                  className={`ml-1 px-2 py-1 rounded text-xs font-medium ${
                    tier === 'free'
                      ? 'bg-yellow-100 text-yellow-800'
                      : tier === 'pro'
                      ? 'bg-blue-100 text-blue-800'
                      : tier === 'business'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {tier?.charAt(0).toUpperCase() + tier?.slice(1) || 'Free'}
                </span>
              </div>

              <button
                onClick={async () => {
                  setIsRefreshingSubscription(true);
                  try {
                    await refreshSubscriptionStatus();
                    toast.success('Subscription status refreshed!', { duration: 1600 });
                  } catch {
                    toast.error('Failed to refresh subscription status');
                  } finally {
                    setIsRefreshingSubscription(false);
                  }
                }}
                disabled={isRefreshingSubscription}
                className="text-xs text-blue-600 hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center transition-colors"
                title="Refresh subscription status"
              >
                <svg
                  className={`w-3 h-3 mr-1 ${isRefreshingSubscription ? 'animate-spin' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                {isRefreshingSubscription ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2 mt-2 text-xs">
              <div className="font-medium">📸 Screenshots: {safeFormatUsage('screenshots')}</div>
            </div>

            {subscriptionStatus?.next_reset && (
              <div className="mt-1 text-xs text-gray-500">
                Resets {formatResetDate()}
                {isResetOverdue && (
                  <span className="ml-2 text-red-600 font-semibold">
                    (reset passed — refreshing plan status)
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Examples */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 shadow-sm">
          <h3 className="text-green-800 font-semibold mb-2">✅ Try These Example Websites:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="font-medium text-green-700">Example.com</div>
              <div className="text-green-600">Simple test website</div>
              <button 
                onClick={() => setWebsiteUrl('https://example.com')}
                className="text-xs text-green-500 hover:text-green-700 underline mt-1"
              >
                Use this URL
              </button>
            </div>
            <div>
              <div className="font-medium text-green-700">GitHub.com</div>
              <div className="text-green-600">Popular code hosting site</div>
              <button 
                onClick={() => setWebsiteUrl('https://github.com')}
                className="text-xs text-green-500 hover:text-green-700 underline mt-1"
              >
                Use this URL
              </button>
            </div>
          </div>
        </div>

        {/* URL Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter Website URL:
          </label>
          <input
            type="text"
            placeholder="https://example.com"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        {websiteUrl && xUiValidUrl && (
          <div className="bg-green-50 border border-green-200 rounded p-2 mb-4">
            <span className="text-green-700 text-sm">✅ Valid URL detected: </span>
            <span className="font-bold text-green-800">{websiteUrl}</span>
          </div>
        )}

        {/* Screenshot Configuration */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">📐 Screenshot Configuration</h3>
          
          {/* Viewport Presets */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Quick Presets:</label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
              {Object.entries(VIEWPORT_PRESETS).map(([key, preset]) => (
                <button
                  key={key}
                  onClick={() => applyPreset(preset)}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Dimensions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Width (px)</label>
              <input
                type="number"
                value={width}
                onChange={(e) => setWidth(parseInt(e.target.value) || 1920)}
                className="w-full border border-gray-300 rounded px-3 py-2"
                min="320"
                max="3840"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Height (px)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(parseInt(e.target.value) || 1080)}
                className="w-full border border-gray-300 rounded px-3 py-2"
                min="240"
                max="2160"
              />
            </div>
          </div>

          {/* Format Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="png">PNG (lossless, larger file)</option>
              <option value="jpeg">JPEG (lossy, smaller file)</option>
              <option value="webp">WebP (best compression)</option>
            </select>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={fullPage}
                onChange={(e) => setFullPage(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-700">Capture full page (scroll entire page)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-700">Use dark mode</span>
            </label>
          </div>

          {/* Advanced Options */}
          <div className="border-t border-gray-200 pt-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Advanced Options</h4>
            
            <div className="mb-3">
              <label className="block text-sm text-gray-700 mb-1">Delay before capture (seconds)</label>
              <input
                type="number"
                value={delay}
                onChange={(e) => setDelay(parseInt(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded px-3 py-2"
                min="0"
                max="10"
              />
              <p className="text-xs text-gray-500 mt-1">Wait time to allow page to fully load</p>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Remove elements (CSS selectors)</label>
              <input
                type="text"
                value={removeElements}
                onChange={(e) => setRemoveElements(e.target.value)}
                placeholder=".cookie-banner, #popup, .ads"
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
              <p className="text-xs text-gray-500 mt-1">Comma-separated CSS selectors to hide before capture</p>
            </div>
          </div>
        </div>

        {/* Errors */}
        {getUsageLimitMessage() && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-4 shadow-sm">
            ⚠️ {getUsageLimitMessage()}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-4 shadow-sm">
            ⚠️ {error}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={handleCapture}
            disabled={xUiPrimaryDisabled}
            aria-disabled={xUiPrimaryDisabled}
            title={xUiDisabledReason()}
            className={primaryBtnClass}
          >
            {isLoading ? '⏳ Capturing…' : '📸 Capture Screenshot'}
          </button>

          <button
            onClick={() => {
              setWebsiteUrl('');
              setScreenshotUrl('');
              setScreenshotData(null);
              setError('');
              setSuccessMessage('');
              setScreenshotCompleted(false);
              pollStopRef.current = true;
            }}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            🗑️ Clear
          </button>
        </div>

        {/* Results */}
        {screenshotUrl && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 flex items-center">
              🖼️ Screenshot Result
              {screenshotCompleted && (
                <span className="ml-2 text-green-600 text-sm font-normal">✅ Capture Complete</span>
              )}
            </h2>

            {/* Screenshot Preview */}
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <img 
                src={screenshotUrl} 
                alt="Screenshot preview"
                className="max-w-full h-auto border border-gray-300 rounded shadow-lg mx-auto"
              />
            </div>

            {/* Screenshot Info */}
            {screenshotData && (
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg mb-4 border border-green-200">
                <div className="font-semibold text-gray-800 mb-1">✅ Screenshot Details</div>
                <div className="text-sm text-gray-800">URL: {screenshotData.url}</div>
                <div className="text-sm text-gray-800">
                  Dimensions: {screenshotData.width}x{screenshotData.height}
                </div>
                <div className="text-sm text-gray-800">Format: {screenshotData.format.toUpperCase()}</div>
                {screenshotData.size && (
                  <div className="text-sm text-gray-800">
                    Size: {(screenshotData.size / 1024).toFixed(2)} KB
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleDownload}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                💾 Download
              </button>
              <a
                href={screenshotUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                🔗 Open in New Tab
              </a>
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="text-center mb-6">
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              ← Back to Dashboard
            </button>
            <button
              onClick={() => navigate('/history')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              📚 View History
            </button>
            <button
              onClick={() => navigate('/activity')}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              📋 Recent Activity
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

/////////////////////////////////////////////////////////////////////////////////////////
// // frontend/src/pages/ScreenshotPage.js

// // Add better error handling
// const handleCapture = async () => {
//   setLoading(true);
//   setError(null);
  
//   try {
//     // Validate URL
//     if (!isValidUrl(url)) {
//       throw new Error('Please enter a valid URL starting with http:// or https://');
//     }
    
//     // Show loading toast
//     const loadingToast = toast.loading('Capturing screenshot...');
    
//     const response = await fetch(`${API_URL}/api/v1/screenshot`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`
//       },
//       body: JSON.stringify({ url, ...options })
//     });
    
//     if (!response.ok) {
//       const error = await response.json();
//       throw new Error(error.detail || 'Screenshot failed');
//     }
    
//     const data = await response.json();
//     setScreenshot(data);
    
//     toast.dismiss(loadingToast);
//     toast.success('Screenshot captured successfully!');
    
//   } catch (error) {
//     setError(error.message);
//     toast.error(error.message);
//   } finally {
//     setLoading(false);
//   }
// };
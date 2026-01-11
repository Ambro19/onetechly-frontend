// src/pages/Activity.js — PixelPerfect Screenshot API
// CONVERTED FROM: YCD Activity.js
// PURPOSE: Show recent screenshot captures with activity tracking

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import AppBrand from '../components/AppBrand';
import { getDisplayEmail, getDisplayName } from '../utils/userDisplay';

const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  process.env.REACT_APP_API_BASE_URL ||
  'http://localhost:8000';

// Development debug helper
const debug = process.env.NODE_ENV === 'development' ? (...args) => console.log(...args) : () => {};

// Professional timestamp handling
const parseServerTime = (ts) => {
  if (!ts) return null;
  if (/Z$|[+-]\d{2}:\d{2}$/.test(ts)) return new Date(ts);
  return new Date(`${ts}Z`);
};

const formatLocalDateTime = (ts) => {
  const d = parseServerTime(ts);
  if (!d || isNaN(d.getTime())) return '—';
  return d.toLocaleString([], { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit', 
    minute: '2-digit'
  });
};

const formatTimeAgo = (ts) => {
  const d = parseServerTime(ts);
  if (!d || isNaN(d.getTime())) return '—';
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 172800) return 'Yesterday';
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return d.toLocaleDateString();
};

// Utility function for file size formatting
const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  let size = bytes;
  while (size >= 1024 && i < units.length - 1) {
    size /= 1024;
    i++;
  }
  return `${size.toFixed(size < 10 ? 1 : 0)} ${units[i]}`;
};

// CONVERTED: Activity enhancement for screenshots (not downloads)
const enhanceActivity = (activity, _index) => {
  const extractField = (obj, ...keys) => {
    for (const key of keys) {
      if (obj && obj[key] != null && obj[key] !== '') return obj[key];
    }
    return null;
  };

  const type = extractField(activity, 'type', 'screenshot_type', 'category') || 'screenshot';
  const action = extractField(activity, 'action', 'description') || '';
  const format = extractField(activity, 'format', 'file_format', 'ext') || 'png';
  const url = extractField(activity, 'url', 'target_url', 'website_url');
  const status = extractField(activity, 'status') || 'completed';
  
  let enhancedIcon = activity.icon || '📸';
  let enhancedAction = action || 'Screenshot Captured';
  let enhancedDescription = activity.description || '';
  let enhancedCategory = activity.category || 'screenshot';

  // CONVERTED: Categorization for screenshots (PNG, JPEG, WEBP, PDF)
  if (format === 'png') {
    enhancedIcon = '🖼️';
    enhancedAction = 'PNG Screenshot';
    enhancedCategory = 'png';
    enhancedDescription = `PNG screenshot${url ? ` of ${url}` : ''}`;
  }
  else if (format === 'jpeg' || format === 'jpg') {
    enhancedIcon = '📸';
    enhancedAction = 'JPEG Screenshot';
    enhancedCategory = 'jpeg';
    enhancedDescription = `JPEG screenshot${url ? ` of ${url}` : ''}`;
  }
  else if (format === 'webp') {
    enhancedIcon = '🎨';
    enhancedAction = 'WebP Screenshot';
    enhancedCategory = 'webp';
    enhancedDescription = `WebP screenshot${url ? ` of ${url}` : ''}`;
  }
  else if (format === 'pdf') {
    enhancedIcon = '📄';
    enhancedAction = 'PDF Screenshot';
    enhancedCategory = 'pdf';
    enhancedDescription = `PDF screenshot${url ? ` of ${url}` : ''}`;
  }
  else {
    enhancedIcon = '📸';
    enhancedAction = 'Screenshot Captured';
    enhancedCategory = 'screenshot';
    enhancedDescription = url ? `Screenshot of ${url}` : 'Screenshot captured';
  }

  // Add dimensions if available
  if (activity.width && activity.height) {
    enhancedDescription += ` (${activity.width}x${activity.height})`;
  }
  
  // Add file size if available
  if (activity.file_size || activity.size_bytes) {
    const size = formatFileSize(activity.file_size || activity.size_bytes);
    enhancedDescription += ` - ${size}`;
  }

  // Add full-page indicator
  if (activity.full_page) {
    enhancedDescription += ' • Full Page';
  }

  return {
    ...activity,
    id: activity.id || activity.screenshot_id || `activity-${Date.now()}-${_index}`,
    icon: enhancedIcon,
    action: enhancedAction,
    description: enhancedDescription,
    category: enhancedCategory,
    timestamp: activity.timestamp || activity.created_at || new Date().toISOString(),
    enhanced: true,
    status: status
  };
};

export default function ActivityPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('unknown');
  const [lastFetch, setLastFetch] = useState(null);
  const [hasTriedLoad, setHasTriedLoad] = useState(false);
  const { token, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // PRODUCTION: Single load function, no auto-refresh
  const load = useCallback(async () => {
    if (loading) return; // Prevent concurrent calls
    
    setLoading(true);
    setConnectionStatus('connecting');
    
    const requestHeaders = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    try {
      let activities = [];

      // CONVERTED: Screenshot activity endpoints
      const endpoints = [
        '/api/v1/user/recent-activity',      // Primary endpoint
        '/api/v1/user/screenshot-history',   // Fallback
        '/user/recent-activity'              // Legacy fallback
      ];

      for (const endpoint of endpoints) {
        try {
          debug(`🔄 Trying ${endpoint}...`);
          const res = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'GET',
            headers: requestHeaders,
          });

          if (res.ok) {
            const data = await res.json();
            debug(`✅ Success from ${endpoint}:`, data);
            
            // CONVERTED: Handle screenshot activity data
            if (data.activities && Array.isArray(data.activities)) {
              activities = data.activities;
            } else if (data.screenshots && Array.isArray(data.screenshots)) {
              // Convert screenshots to activity format
              activities = data.screenshots.slice(0, 20).map((screenshot, idx) => ({
                id: screenshot.id || screenshot.screenshot_id || idx + 1,
                action: 'Screenshot Captured',
                description: `Screenshot of ${screenshot.url || 'website'}`,
                timestamp: screenshot.created_at || screenshot.timestamp,
                url: screenshot.url,
                width: screenshot.width,
                height: screenshot.height,
                format: screenshot.format,
                file_size: screenshot.size_bytes || screenshot.file_size,
                full_page: screenshot.full_page,
                status: screenshot.status || 'completed'
              }));
            } else if (Array.isArray(data)) {
              activities = data;
            }
            
            if (activities.length > 0) {
              setConnectionStatus('connected');
              break;
            }
          } else if (res.status === 500) {
            const errorText = await res.text();
            if (errorText.includes('no such column')) {
              throw new Error('Database migration needed - missing columns detected');
            }
          }
        } catch (error) {
          debug(`❌ ${endpoint} failed:`, error.message);
          
          if (error.message.includes('Database migration needed')) {
            throw error;
          }
          continue;
        }
      }

      // Handle results
      if (activities.length > 0) {
        const enhancedActivities = activities.map(enhanceActivity);
        enhancedActivities.sort((a, b) => {
          const timeA = parseServerTime(a.timestamp)?.getTime() || 0;
          const timeB = parseServerTime(b.timestamp)?.getTime() || 0;
          return timeB - timeA;
        });

        debug('✅ Enhanced activities:', enhancedActivities);
        setItems(enhancedActivities);
        setConnectionStatus('connected');
        
        if (!hasTriedLoad) {
          toast.success(`Loaded ${enhancedActivities.length} recent screenshots`, { 
            id: 'activity-success'
          });
        }
      } else {
        setConnectionStatus('no-data');
        setItems([]);
      }

      setLastFetch(new Date());
      setHasTriedLoad(true);

    } catch (error) {
      console.error('💥 API failure:', error);
      setConnectionStatus('error');
      setItems([]);
      
      if (!hasTriedLoad) {
        if (error.message.includes('Database migration needed')) {
          toast.error('Database needs migration - run python migrate_database.py', { 
            id: 'activity-error',
            duration: 8000
          });
        } else {
          toast.error('Unable to connect to server', { 
            id: 'activity-error',
            duration: 4000
          });
        }
      }
      setHasTriedLoad(true);
    } finally {
      setLoading(false);
    }
  }, [token, loading, hasTriedLoad]);

  // PRODUCTION: Load once on mount, NO auto-refresh
  useEffect(() => {
    if (isAuthenticated && !hasTriedLoad) {
      load();
    }
  }, [isAuthenticated, load, hasTriedLoad]);

  // Manual retry only
  const handleRetry = useCallback(() => {
    if (!loading) {
      setHasTriedLoad(false);
      setConnectionStatus('unknown');
      load();
    }
  }, [load, loading]);

  const name = getDisplayName(user);
  const email = getDisplayEmail(user);

  // CONVERTED: Group activities by format instead of type
  const groupedActivities = useMemo(() => {
    const groups = {
      recent: [],
      png: [],
      jpeg: [],
      webp: [],
      pdf: [],
      other: []
    };

    items.forEach((activity, index) => {
      if (index < 5) groups.recent.push(activity);
      
      const format = (activity.format || '').toLowerCase();
      switch (format) {
        case 'png':
          groups.png.push(activity);
          break;
        case 'jpeg':
        case 'jpg':
          groups.jpeg.push(activity);
          break;
        case 'webp':
          groups.webp.push(activity);
          break;
        case 'pdf':
          groups.pdf.push(activity);
          break;
        default:
          groups.other.push(activity);
      }
    });

    return groups;
  }, [items]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 py-6">

        {/* ============ Professional Brand Header (Top-Left) ============ */}
        <div className="mb-6">
          <AppBrand
            size={32}
            showText={true}
            label="PixelPerfect API"
            logoSrc="/logo_pixelperfect.png"
            to="/dashboard"
          />
        </div>

        {/* ============ Centered Page Header ============ */}
        <header className="mb-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="text-6xl">📸</div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">📋 Recent Activity</h1>
          
          {/* Clear label that this shows RECENT activity only */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-sm mb-3">
            <span className="text-blue-700 font-medium">Showing your most recent screenshots</span>
            <button 
              onClick={() => navigate('/history')} 
              className="text-blue-600 hover:text-blue-800 underline font-semibold"
            >
              View Complete History →
            </button>
          </div>

          <div className="text-sm text-gray-600">
            Logged in as: <span className="font-medium text-blue-700">{name}</span>{' '}
            (<span className="font-mono text-xs">{email}</span>)
          </div>
          
          {lastFetch && (
            <div className="mt-1 text-xs text-gray-500">
              Last updated: {lastFetch.toLocaleTimeString()}
              {connectionStatus === 'connected' && ' • Recent activity loaded'}
            </div>
          )}

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
              onClick={() => navigate('/history')} 
              className="px-4 py-3 rounded-lg text-white bg-purple-600 hover:bg-purple-700 font-medium transition-colors"
            >
              🗂️ Full History
            </button>
            <button 
              onClick={handleRetry} 
              disabled={loading} 
              className="px-4 py-3 rounded-lg text-white bg-green-600 hover:bg-green-700 font-medium disabled:opacity-50 transition-colors"
            >
              {loading ? '🔄 Loading...' : '🔄 Refresh'}
            </button>
          </div>
        </header>

        {/* Enhanced error handling with specific solutions */}
        {connectionStatus === 'error' && (
          <div className="mb-6 bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-yellow-800">
                  Connection Issue
                </h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Unable to load recent activity. Please check your connection and try again.
                </p>
              </div>
              <button
                onClick={handleRetry}
                disabled={loading}
                className="ml-3 bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700 disabled:opacity-50"
              >
                {loading ? 'Trying...' : 'Retry'}
              </button>
            </div>
          </div>
        )}

        {/* Main activity section */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading && items.length === 0 ? (
            <div className="py-16 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Recent Activity</h3>
              <p className="text-gray-600">Connecting to server...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="py-16 text-center">
              <div className="text-6xl mb-4">📸</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No recent screenshots</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Start capturing screenshots to see your recent activity here. This page shows your most recent screenshot captures.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button 
                  onClick={() => navigate('/screenshot')} 
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Capture Screenshot
                </button>
                <button 
                  onClick={handleRetry} 
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                >
                  🔄 Check for Activity
                </button>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {/* Enhanced Summary Stats - CONVERTED for screenshots */}
              <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">📊 Recent Activity Summary</h3>
                  <div className="flex items-center gap-2">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      connectionStatus === 'connected' ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {connectionStatus === 'connected' ? '✅ Data Loaded' : '📊 Activity Data'}
                    </div>
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      📍 Recent Only • <button onClick={() => navigate('/history')} className="underline ml-1">View All</button>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{items.length}</div>
                    <div className="text-sm text-gray-600">Recent Captures</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{groupedActivities.png.length}</div>
                    <div className="text-sm text-gray-600">PNG</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{groupedActivities.jpeg.length}</div>
                    <div className="text-sm text-gray-600">JPEG</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{groupedActivities.webp.length + groupedActivities.pdf.length}</div>
                    <div className="text-sm text-gray-600">Other</div>
                  </div>
                </div>
              </div>

              {/* Recent Activity List */}
              {items.map((activity, _index) => (
                <div
                  key={activity.id}
                  className="p-6 hover:bg-gray-50 transition-colors duration-150"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-3xl flex-shrink-0">{activity.icon}</div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900 text-lg">
                          {activity.action}
                        </h3>
                        
                        {activity.status && (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            activity.status === 'completed' 
                              ? 'bg-green-100 text-green-800'
                              : activity.status === 'processing'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {activity.status}
                          </span>
                        )}
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                        {activity.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 text-xs">
                        {activity.url && (
                          <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                            🌐 {new URL(activity.url).hostname}
                          </span>
                        )}
                        {activity.format && (
                          <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                            📄 {activity.format.toUpperCase()}
                          </span>
                        )}
                        {activity.width && activity.height && (
                          <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                            📐 {activity.width}x{activity.height}
                          </span>
                        )}
                        {(activity.file_size || activity.size_bytes) && (
                          <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 rounded-full">
                            📏 {formatFileSize(activity.file_size || activity.size_bytes)}
                          </span>
                        )}
                        {activity.full_page && (
                          <span className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">
                            📜 Full Page
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-medium text-gray-900 mb-1">
                        {formatTimeAgo(activity.timestamp)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatLocalDateTime(activity.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Professional quick actions footer */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button 
            onClick={() => navigate('/history')} 
            className="flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium"
          >
            📚 <span>View Complete History ({items.length}+ items)</span>
          </button>
          <button 
            onClick={() => navigate('/screenshot')} 
            className="flex items-center justify-center gap-2 px-6 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium"
          >
            🚀 <span>Capture New Screenshot</span>
          </button>
        </div>

        {/* Status footer */}
        <footer className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-gray-500 bg-white px-4 py-2 rounded-lg border">
            {connectionStatus === 'connected' ? (
              <>✅ Recent activity loaded • Manual refresh only</>
            ) : (
              <>📊 Activity tracking • Manual refresh available</>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
}
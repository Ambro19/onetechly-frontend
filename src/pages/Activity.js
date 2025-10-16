// src/pages/ActivityPage.js — PRODUCTION: No auto-refresh, completely stable

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import AppBrand from '../components/AppBrand';
import YcdLogo from '../components/YcdLogo';
import { getDisplayEmail, getDisplayName } from '../utils/userDisplay';

const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  process.env.REACT_APP_API_BASE_URL ||
  'http://192.168.1.185:8000';

// Development debug helper (won't trigger ESLint warnings)
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

// Professional activity enhancement with proper transcript classification
const enhanceActivity = (activity, _index) => {
  const extractField = (obj, ...keys) => {
    for (const key of keys) {
      if (obj && obj[key] != null && obj[key] !== '') return obj[key];
    }
    return null;
  };

  const type = extractField(activity, 'type', 'transcript_type', 'file_type', 'category') || '';
  const action = extractField(activity, 'action', 'description') || '';
  const format = extractField(activity, 'file_format', 'format', 'ext') || '';
  const videoId = extractField(activity, 'video_id', 'youtube_id', 'yt_id');
  const status = extractField(activity, 'status') || 'completed';
  
  let enhancedIcon = activity.icon;
  let enhancedAction = action;
  let enhancedDescription = activity.description || '';
  let enhancedCategory = activity.category || 'general';

  // Enhanced categorization with format-first logic
  if (['srt', 'vtt'].includes(format)) {
    enhancedIcon = '🕒';
    enhancedAction = format === 'srt' ? 'Generated SRT Transcript' : 'Generated VTT Transcript';
    enhancedCategory = 'transcript';
    enhancedDescription = `${format?.toUpperCase()} transcript${videoId ? ` for video ${videoId}` : ''}`;
  }
  else if (format === 'txt' && (type.includes('clean') || !type.includes('unclean'))) {
    enhancedIcon = '📄';
    enhancedAction = 'Generated Clean Transcript';
    enhancedCategory = 'transcript';
    enhancedDescription = `Clean text transcript${videoId ? ` for video ${videoId}` : ''}`;
  }
  else if (format === 'txt' && type.includes('unclean')) {
    enhancedIcon = '🕒';
    enhancedAction = 'Generated Timestamped Transcript';
    enhancedCategory = 'transcript';
    enhancedDescription = `Timestamped transcript${videoId ? ` for video ${videoId}` : ''}`;
  }
  else if (type.includes('audio') || action.includes('audio') || 
           ['mp3', 'm4a', 'aac', 'wav'].includes(format)) {
    enhancedIcon = '🎵';
    enhancedAction = 'Downloaded Audio File';
    enhancedCategory = 'audio';
    enhancedDescription = `${format?.toUpperCase() || 'Audio'} file${videoId ? ` from video ${videoId}` : ''}`;
  }
  else if (type.includes('video') || action.includes('video') || 
           ['mp4', 'mkv', 'avi', 'mov'].includes(format)) {
    enhancedIcon = '🎬';
    enhancedAction = 'Downloaded Video File';
    enhancedCategory = 'video';
    enhancedDescription = `${format?.toUpperCase() || 'Video'} file${videoId ? ` (${videoId})` : ''}`;
  }
  else if (!enhancedIcon) {
    enhancedIcon = '📁';
    enhancedAction = action || 'Content Activity';
    enhancedCategory = 'general';
  }

  if (activity.quality && activity.quality !== 'default') {
    enhancedDescription += ` (${activity.quality})`;
  }
  if (activity.file_size) {
    const size = formatFileSize(activity.file_size);
    enhancedDescription += ` - ${size}`;
  }

  return {
    ...activity,
    id: activity.id || `activity-${Date.now()}-${_index}`,
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

      // Single attempt at each endpoint
      const endpoints = [
        '/user/recent-activity',
        '/user/download-history'
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
            
            if (endpoint === '/user/recent-activity') {
              activities = Array.isArray(data.activities) ? data.activities : [];
            } else {
              // Convert download history to activity format
              const downloads = Array.isArray(data.downloads) ? data.downloads : [];
              activities = downloads.slice(0, 10).map((download, idx) => ({
                id: download.id || idx + 1,
                action: `Downloaded ${download.type || 'content'}`,
                description: `${download.type || 'Content'} for video ${download.video_id || 'Unknown'}`,
                timestamp: download.downloaded_at || download.created_at,
                type: download.type,
                video_id: download.video_id,
                file_size: download.file_size,
                file_format: download.file_format,
                quality: download.quality,
                status: download.status || 'completed'
              }));
            }
            
            if (activities.length > 0) {
              setConnectionStatus('connected');
              break;
            }
          } else if (res.status === 500) {
            // Handle database column errors specifically
            const errorText = await res.text();
            if (errorText.includes('no such column')) {
              throw new Error('Database migration needed - missing columns detected');
            }
          }
        } catch (error) {
          debug(`❌ ${endpoint} failed:`, error.message);
          
          // If it's a database migration error, don't try other endpoints
          if (error.message.includes('Database migration needed')) {
            throw error;
          }
          continue;
        }
      }

      // Handle results
      if (activities.length > 0) {
        // Enhance and sort activities
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
          toast.success(`Loaded ${enhancedActivities.length} activities`, { 
            id: 'activity-success'
          });
        }
      } else {
        // No data found - connection issues
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
        // More specific error messages
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
      setHasTriedLoad(false); // Allow reload
      setConnectionStatus('unknown');
      load();
    }
  }, [load, loading]);

  const name = getDisplayName(user);
  const email = getDisplayEmail(user);

  // Group activities by category for better organization
  const groupedActivities = useMemo(() => {
    const groups = {
      recent: [],
      transcript: [],
      audio: [],
      video: [],
      other: []
    };

    items.forEach((activity, index) => {
      if (index < 5) groups.recent.push(activity);
      
      switch (activity.category) {
        case 'transcript':
          groups.transcript.push(activity);
          break;
        case 'audio':
          groups.audio.push(activity);
          break;
        case 'video':
          groups.video.push(activity);
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

          <h1 className="text-3xl font-bold text-gray-900 mb-2">📋 Recent Activity</h1>
          <div className="text-sm text-gray-600">
            Logged in as: <span className="font-medium text-blue-700">{name}</span>{' '}
            (<span className="font-mono text-xs">{email}</span>)
          </div>
          
          {lastFetch && (
            <div className="mt-1 text-xs text-gray-500">
              Last updated: {lastFetch.toLocaleTimeString()}
              {connectionStatus === 'connected' && ' • Data loaded'}
            </div>
          )}

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
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No activity yet</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Start using the app to see your recent activity here. Downloads, transcripts, and other actions will appear in this feed.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button 
                  onClick={() => navigate('/download')} 
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Start Downloading
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
              {/* Enhanced Summary Stats */}
              <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">📊 Activity Summary</h3>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    connectionStatus === 'connected' ? 'bg-green-100 text-green-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {connectionStatus === 'connected' ? '✅ Data Loaded' : '📊 Activity Data'}
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{items.length}</div>
                    <div className="text-sm text-gray-600">Total Actions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{groupedActivities.transcript.length}</div>
                    <div className="text-sm text-gray-600">Transcripts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{groupedActivities.audio.length}</div>
                    <div className="text-sm text-gray-600">Audio Files</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{groupedActivities.video.length}</div>
                    <div className="text-sm text-gray-600">Video Files</div>
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
                        {activity.video_id && (
                          <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                            🎬 Video: {activity.video_id}
                          </span>
                        )}
                        {activity.file_format && (
                          <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                            📄 {activity.file_format.toUpperCase()}
                          </span>
                        )}
                        {activity.quality && activity.quality !== 'default' && (
                          <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                            ⭐ {activity.quality}
                          </span>
                        )}
                        {activity.file_size && (
                          <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 rounded-full">
                            📏 {formatFileSize(activity.file_size)}
                          </span>
                        )}
                        {activity.processing_time && (
                          <span className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">
                            ⏱️ {activity.processing_time.toFixed(2)}s
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
            📚 <span>View Complete History</span>
          </button>
          <button 
            onClick={() => navigate('/download')} 
            className="flex items-center justify-center gap-2 px-6 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium"
          >
            🚀 <span>Start New Download</span>
          </button>
        </div>

        {/* Status footer */}
        <footer className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-gray-500 bg-white px-4 py-2 rounded-lg border">
            {connectionStatus === 'connected' ? (
              <>✅ Data loaded • Manual refresh only</>
            ) : (
              <>📊 Activity tracking • Manual refresh available</>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
}

////////////////////////////////////////////////////////////////////////////////////
// // src/pages/ActivityPage.js — PRODUCTION: No auto-refresh, completely stable

// import React, { useEffect, useState, useCallback, useMemo } from 'react';
// import { useNavigate } from 'react-router-dom';
// import toast from 'react-hot-toast';
// import { useAuth } from '../contexts/AuthContext';
// import Logo from '../components/Logo';
// import { getDisplayEmail, getDisplayName } from '../utils/userDisplay';

// const API_BASE_URL =
//   process.env.REACT_APP_API_URL ||
//   process.env.REACT_APP_API_BASE_URL ||
//   'http://192.168.1.185:8000';

// // Development debug helper (won't trigger ESLint warnings)
// const debug = process.env.NODE_ENV === 'development' ? (...args) => console.log(...args) : () => {};

// // Professional timestamp handling
// const parseServerTime = (ts) => {
//   if (!ts) return null;
//   if (/Z$|[+-]\d{2}:\d{2}$/.test(ts)) return new Date(ts);
//   return new Date(`${ts}Z`);
// };

// const formatLocalDateTime = (ts) => {
//   const d = parseServerTime(ts);
//   if (!d || isNaN(d.getTime())) return '—';
//   return d.toLocaleString([], { 
//     year: 'numeric', 
//     month: 'short', 
//     day: 'numeric',
//     hour: '2-digit', 
//     minute: '2-digit'
//   });
// };

// const formatTimeAgo = (ts) => {
//   const d = parseServerTime(ts);
//   if (!d || isNaN(d.getTime())) return '—';
//   const diff = (Date.now() - d.getTime()) / 1000;
//   if (diff < 60) return 'Just now';
//   if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
//   if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
//   if (diff < 172800) return 'Yesterday';
//   if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
//   return d.toLocaleDateString();
// };

// // Utility function for file size formatting
// const formatFileSize = (bytes) => {
//   if (!bytes || bytes === 0) return '0 B';
//   const units = ['B', 'KB', 'MB', 'GB'];
//   let i = 0;
//   let size = bytes;
//   while (size >= 1024 && i < units.length - 1) {
//     size /= 1024;
//     i++;
//   }
//   return `${size.toFixed(size < 10 ? 1 : 0)} ${units[i]}`;
// };

// // Professional activity enhancement with proper transcript classification
// const enhanceActivity = (activity, _index) => {
//   const extractField = (obj, ...keys) => {
//     for (const key of keys) {
//       if (obj && obj[key] != null && obj[key] !== '') return obj[key];
//     }
//     return null;
//   };

//   const type = extractField(activity, 'type', 'transcript_type', 'file_type', 'category') || '';
//   const action = extractField(activity, 'action', 'description') || '';
//   const format = extractField(activity, 'file_format', 'format', 'ext') || '';
//   const videoId = extractField(activity, 'video_id', 'youtube_id', 'yt_id');
//   const status = extractField(activity, 'status') || 'completed';
  
//   let enhancedIcon = activity.icon;
//   let enhancedAction = action;
//   let enhancedDescription = activity.description || '';
//   let enhancedCategory = activity.category || 'general';

//   // Enhanced categorization with format-first logic
//   if (['srt', 'vtt'].includes(format)) {
//     enhancedIcon = '🕒';
//     enhancedAction = format === 'srt' ? 'Generated SRT Transcript' : 'Generated VTT Transcript';
//     enhancedCategory = 'transcript';
//     enhancedDescription = `${format?.toUpperCase()} transcript${videoId ? ` for video ${videoId}` : ''}`;
//   }
//   else if (format === 'txt' && (type.includes('clean') || !type.includes('unclean'))) {
//     enhancedIcon = '📄';
//     enhancedAction = 'Generated Clean Transcript';
//     enhancedCategory = 'transcript';
//     enhancedDescription = `Clean text transcript${videoId ? ` for video ${videoId}` : ''}`;
//   }
//   else if (format === 'txt' && type.includes('unclean')) {
//     enhancedIcon = '🕒';
//     enhancedAction = 'Generated Timestamped Transcript';
//     enhancedCategory = 'transcript';
//     enhancedDescription = `Timestamped transcript${videoId ? ` for video ${videoId}` : ''}`;
//   }
//   else if (type.includes('audio') || action.includes('audio') || 
//            ['mp3', 'm4a', 'aac', 'wav'].includes(format)) {
//     enhancedIcon = '🎵';
//     enhancedAction = 'Downloaded Audio File';
//     enhancedCategory = 'audio';
//     enhancedDescription = `${format?.toUpperCase() || 'Audio'} file${videoId ? ` from video ${videoId}` : ''}`;
//   }
//   else if (type.includes('video') || action.includes('video') || 
//            ['mp4', 'mkv', 'avi', 'mov'].includes(format)) {
//     enhancedIcon = '🎬';
//     enhancedAction = 'Downloaded Video File';
//     enhancedCategory = 'video';
//     enhancedDescription = `${format?.toUpperCase() || 'Video'} file${videoId ? ` (${videoId})` : ''}`;
//   }
//   else if (!enhancedIcon) {
//     enhancedIcon = '📁';
//     enhancedAction = action || 'Content Activity';
//     enhancedCategory = 'general';
//   }

//   if (activity.quality && activity.quality !== 'default') {
//     enhancedDescription += ` (${activity.quality})`;
//   }
//   if (activity.file_size) {
//     const size = formatFileSize(activity.file_size);
//     enhancedDescription += ` - ${size}`;
//   }

//   return {
//     ...activity,
//     id: activity.id || `activity-${Date.now()}-${_index}`,
//     icon: enhancedIcon,
//     action: enhancedAction,
//     description: enhancedDescription,
//     category: enhancedCategory,
//     timestamp: activity.timestamp || activity.created_at || new Date().toISOString(),
//     enhanced: true,
//     status: status
//   };
// };

// export default function ActivityPage() {
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [connectionStatus, setConnectionStatus] = useState('unknown');
//   const [lastFetch, setLastFetch] = useState(null);
//   const [hasTriedLoad, setHasTriedLoad] = useState(false);
//   const { token, isAuthenticated, user } = useAuth();
//   const navigate = useNavigate();

//   // PRODUCTION: Single load function, no auto-refresh
//   const load = useCallback(async () => {
//     if (loading) return; // Prevent concurrent calls
    
//     setLoading(true);
//     setConnectionStatus('connecting');
    
//     const requestHeaders = {
//       'Authorization': `Bearer ${token}`,
//       'Content-Type': 'application/json',
//     };

//     try {
//       let activities = [];

//       // Single attempt at each endpoint
//       const endpoints = [
//         '/user/recent-activity',
//         '/user/download-history'
//       ];

//       for (const endpoint of endpoints) {
//         try {
//           debug(`🔄 Trying ${endpoint}...`);
//           const res = await fetch(`${API_BASE_URL}${endpoint}`, {
//             method: 'GET',
//             headers: requestHeaders,
//           });

//           if (res.ok) {
//             const data = await res.json();
//             debug(`✅ Success from ${endpoint}:`, data);
            
//             if (endpoint === '/user/recent-activity') {
//               activities = Array.isArray(data.activities) ? data.activities : [];
//             } else {
//               // Convert download history to activity format
//               const downloads = Array.isArray(data.downloads) ? data.downloads : [];
//               activities = downloads.slice(0, 10).map((download, idx) => ({
//                 id: download.id || idx + 1,
//                 action: `Downloaded ${download.type || 'content'}`,
//                 description: `${download.type || 'Content'} for video ${download.video_id || 'Unknown'}`,
//                 timestamp: download.downloaded_at || download.created_at,
//                 type: download.type,
//                 video_id: download.video_id,
//                 file_size: download.file_size,
//                 file_format: download.file_format,
//                 quality: download.quality,
//                 status: download.status || 'completed'
//               }));
//             }
            
//             if (activities.length > 0) {
//               setConnectionStatus('connected');
//               break;
//             }
//           } else if (res.status === 500) {
//             // Handle database column errors specifically
//             const errorText = await res.text();
//             if (errorText.includes('no such column')) {
//               throw new Error('Database migration needed - missing columns detected');
//             }
//           }
//         } catch (error) {
//           debug(`❌ ${endpoint} failed:`, error.message);
          
//           // If it's a database migration error, don't try other endpoints
//           if (error.message.includes('Database migration needed')) {
//             throw error;
//           }
//           continue;
//         }
//       }

//       // Handle results
//       if (activities.length > 0) {
//         // Enhance and sort activities
//         const enhancedActivities = activities.map(enhanceActivity);
//         enhancedActivities.sort((a, b) => {
//           const timeA = parseServerTime(a.timestamp)?.getTime() || 0;
//           const timeB = parseServerTime(b.timestamp)?.getTime() || 0;
//           return timeB - timeA;
//         });

//         debug('✅ Enhanced activities:', enhancedActivities);
//         setItems(enhancedActivities);
//         setConnectionStatus('connected');
        
//         if (!hasTriedLoad) {
//           toast.success(`Loaded ${enhancedActivities.length} activities`, { 
//             id: 'activity-success'
//           });
//         }
//       } else {
//         // No data found - connection issues
//         setConnectionStatus('no-data');
//         setItems([]);
//       }

//       setLastFetch(new Date());
//       setHasTriedLoad(true);

//     } catch (error) {
//       console.error('💥 API failure:', error);
//       setConnectionStatus('error');
//       setItems([]);
      
//       if (!hasTriedLoad) {
//         // More specific error messages
//         if (error.message.includes('Database migration needed')) {
//           toast.error('Database needs migration - run python migrate_database.py', { 
//             id: 'activity-error',
//             duration: 8000
//           });
//         } else {
//           toast.error('Unable to connect to server', { 
//             id: 'activity-error',
//             duration: 4000
//           });
//         }
//       }
//       setHasTriedLoad(true);
//     } finally {
//       setLoading(false);
//     }
//   }, [token, loading, hasTriedLoad]);

//   // PRODUCTION: Load once on mount, NO auto-refresh
//   useEffect(() => {
//     if (isAuthenticated && !hasTriedLoad) {
//       load();
//     }
//   }, [isAuthenticated, load, hasTriedLoad]);

//   // Manual retry only
//   const handleRetry = useCallback(() => {
//     if (!loading) {
//       setHasTriedLoad(false); // Allow reload
//       setConnectionStatus('unknown');
//       load();
//     }
//   }, [load, loading]);

//   const name = getDisplayName(user);
//   const email = getDisplayEmail(user);

//   // Group activities by category for better organization
//   const groupedActivities = useMemo(() => {
//     const groups = {
//       recent: [],
//       transcript: [],
//       audio: [],
//       video: [],
//       other: []
//     };

//     items.forEach((activity, index) => {
//       if (index < 5) groups.recent.push(activity);
      
//       switch (activity.category) {
//         case 'transcript':
//           groups.transcript.push(activity);
//           break;
//         case 'audio':
//           groups.audio.push(activity);
//           break;
//         case 'video':
//           groups.video.push(activity);
//           break;
//         default:
//           groups.other.push(activity);
//       }
//     });

//     return groups;
//   }, [items]);

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 py-6">
//         <header className="mb-6 text-center">
//           <div className="flex justify-center mb-3">
//             <Logo variant="large" showText={false} />
//           </div>
//           <h1 className="text-3xl font-bold text-gray-900">📋 Recent Activity</h1>
//           <div className="mt-1 text-sm text-gray-600">
//             Logged in as: <span className="font-medium text-blue-700">{name}</span>{' '}
//             (<span className="font-mono text-xs">{email}</span>)
//           </div>
          
//           {lastFetch && (
//             <div className="mt-1 text-xs text-gray-500">
//               Last updated: {lastFetch.toLocaleTimeString()}
//               {connectionStatus === 'connected' && ' • Data loaded'}
//             </div>
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
//               onClick={() => navigate('/history')} 
//               className="px-4 py-3 rounded-lg text-white bg-purple-600 hover:bg-purple-700 font-medium transition-colors"
//             >
//               🗂️ Full History
//             </button>
//             <button 
//               onClick={handleRetry} 
//               disabled={loading} 
//               className="px-4 py-3 rounded-lg text-white bg-green-600 hover:bg-green-700 font-medium disabled:opacity-50 transition-colors"
//             >
//               {loading ? '🔄 Loading...' : '🔄 Refresh'}
//             </button>
//           </div>
//         </header>

//         {/* Enhanced error handling with specific solutions */}
//         {connectionStatus === 'error' && (
//           <div className="mb-6 bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl p-4">
//             <div className="flex items-center">
//               <div className="flex-shrink-0">
//                 <svg className="h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
//                 </svg>
//               </div>
//               <div className="ml-3 flex-1">
//                 <h3 className="text-sm font-medium text-yellow-800">
//                   Connection Issue
//                 </h3>
//                 <p className="text-sm text-yellow-700 mt-1">
//                   Unable to load recent activity. Please check your connection and try again.
//                 </p>
//               </div>
//               <button
//                 onClick={handleRetry}
//                 disabled={loading}
//                 className="ml-3 bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700 disabled:opacity-50"
//               >
//                 {loading ? 'Trying...' : 'Retry'}
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Main activity section */}
//         <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//           {loading && items.length === 0 ? (
//             <div className="py-16 text-center">
//               <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//               </div>
//               <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Recent Activity</h3>
//               <p className="text-gray-600">Connecting to server...</p>
//             </div>
//           ) : items.length === 0 ? (
//             <div className="py-16 text-center">
//               <div className="text-6xl mb-4">📋</div>
//               <h3 className="text-xl font-semibold text-gray-900 mb-2">No activity yet</h3>
//               <p className="text-gray-600 mb-6 max-w-md mx-auto">
//                 Start using the app to see your recent activity here. Downloads, transcripts, and other actions will appear in this feed.
//               </p>
//               <div className="flex flex-col sm:flex-row gap-3 justify-center">
//                 <button 
//                   onClick={() => navigate('/download')} 
//                   className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
//                 >
//                   Start Downloading
//                 </button>
//                 <button 
//                   onClick={handleRetry} 
//                   className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
//                 >
//                   🔄 Check for Activity
//                 </button>
//               </div>
//             </div>
//           ) : (
//             <div className="divide-y divide-gray-100">
//               {/* Enhanced Summary Stats */}
//               <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
//                 <div className="flex justify-between items-center mb-4">
//                   <h3 className="text-lg font-semibold text-gray-900">📊 Activity Summary</h3>
//                   <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
//                     connectionStatus === 'connected' ? 'bg-green-100 text-green-800' :
//                     'bg-blue-100 text-blue-800'
//                   }`}>
//                     {connectionStatus === 'connected' ? '✅ Data Loaded' : '📊 Activity Data'}
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
//                   <div className="text-center">
//                     <div className="text-2xl font-bold text-blue-600">{items.length}</div>
//                     <div className="text-sm text-gray-600">Total Actions</div>
//                   </div>
//                   <div className="text-center">
//                     <div className="text-2xl font-bold text-green-600">{groupedActivities.transcript.length}</div>
//                     <div className="text-sm text-gray-600">Transcripts</div>
//                   </div>
//                   <div className="text-center">
//                     <div className="text-2xl font-bold text-purple-600">{groupedActivities.audio.length}</div>
//                     <div className="text-sm text-gray-600">Audio Files</div>
//                   </div>
//                   <div className="text-center">
//                     <div className="text-2xl font-bold text-red-600">{groupedActivities.video.length}</div>
//                     <div className="text-sm text-gray-600">Video Files</div>
//                   </div>
//                 </div>
//               </div>

//               {/* Recent Activity List */}
//               {items.map((activity, _index) => (
//                 <div
//                   key={activity.id}
//                   className="p-6 hover:bg-gray-50 transition-colors duration-150"
//                 >
//                   <div className="flex items-start gap-4">
//                     <div className="text-3xl flex-shrink-0">{activity.icon}</div>
                    
//                     <div className="flex-1 min-w-0">
//                       <div className="flex flex-wrap items-center gap-2 mb-2">
//                         <h3 className="font-semibold text-gray-900 text-lg">
//                           {activity.action}
//                         </h3>
                        
//                         {activity.status && (
//                           <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                             activity.status === 'completed' 
//                               ? 'bg-green-100 text-green-800'
//                               : activity.status === 'processing'
//                               ? 'bg-yellow-100 text-yellow-800'
//                               : 'bg-red-100 text-red-800'
//                           }`}>
//                             {activity.status}
//                           </span>
//                         )}
//                       </div>
                      
//                       <p className="text-gray-600 text-sm mb-3 leading-relaxed">
//                         {activity.description}
//                       </p>
                      
//                       <div className="flex flex-wrap gap-2 text-xs">
//                         {activity.video_id && (
//                           <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
//                             🎬 Video: {activity.video_id}
//                           </span>
//                         )}
//                         {activity.file_format && (
//                           <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
//                             📄 {activity.file_format.toUpperCase()}
//                           </span>
//                         )}
//                         {activity.quality && activity.quality !== 'default' && (
//                           <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
//                             ⭐ {activity.quality}
//                           </span>
//                         )}
//                         {activity.file_size && (
//                           <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 rounded-full">
//                             📏 {formatFileSize(activity.file_size)}
//                           </span>
//                         )}
//                         {activity.processing_time && (
//                           <span className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">
//                             ⏱️ {activity.processing_time.toFixed(2)}s
//                           </span>
//                         )}
//                       </div>
//                     </div>
                    
//                     <div className="text-right flex-shrink-0">
//                       <div className="text-sm font-medium text-gray-900 mb-1">
//                         {formatTimeAgo(activity.timestamp)}
//                       </div>
//                       <div className="text-xs text-gray-500">
//                         {formatLocalDateTime(activity.timestamp)}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </section>

//         {/* Professional quick actions footer */}
//         <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
//           <button 
//             onClick={() => navigate('/history')} 
//             className="flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium"
//           >
//             📚 <span>View Complete History</span>
//           </button>
//           <button 
//             onClick={() => navigate('/download')} 
//             className="flex items-center justify-center gap-2 px-6 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium"
//           >
//             🚀 <span>Start New Download</span>
//           </button>
//         </div>

//         {/* Status footer */}
//         <footer className="mt-6 text-center">
//           <div className="inline-flex items-center gap-2 text-sm text-gray-500 bg-white px-4 py-2 rounded-lg border">
//             {connectionStatus === 'connected' ? (
//               <>✅ Data loaded • Manual refresh only</>
//             ) : (
//               <>📊 Activity tracking • Manual refresh available</>
//             )}
//           </div>
//         </footer>
//       </div>
//     </div>
//   );
// }



// frontend/src/pages/BatchJobs.js
// FIXED: Usage limit enforcement + Complete CSV functionality
// Enhanced Batch Jobs UI: Full Audio/Video/Transcript Support with Usage Limits

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import AppBrand from '../components/AppBrand';
import YcdLogo from '../components/YcdLogo';

const API_BASE_URL = process.env.REACT_APP_API_URL || process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

// Development debug helper (won't trigger ESLint warnings)
const debug = process.env.NODE_ENV === 'development' ? (...args) => console.log(...args) : () => {};

// Feature toggles (can be overridden by env)
const BATCH_STUB_MODE_DEFAULT = (process.env.REACT_APP_BATCH_STUB_MODE || 'false').toLowerCase() === 'true';
const PRO_MAX_LINKS = parseInt(process.env.REACT_APP_PRO_BATCH_LIMIT || '3', 10);
const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

// FIXED: Enhanced Result Cell Component with consistent "View [Type] File" labeling
const BatchResultCell = ({ job, onViewTranscript, onDownloadFile }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
      case 'done': return '✅';
      case 'failed': return '❌';
      case 'processing': return '⏳';
      case 'queued': return '⏱️';
      default: return '—';
    }
  };

  const formatFileSize = (sizeInBytes) => {
    if (!sizeInBytes) return '';
    const mb = sizeInBytes / (1024 * 1024);
    if (mb < 1) {
      return `${Math.round(sizeInBytes / 1024)}KB`;
    }
    return `${mb.toFixed(1)}MB`;
  };

  // Completed status - show ONLY view options with consistent labeling
  if (job.status === 'completed' || job.status === 'done') {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap gap-1">
          {/* FIXED: Transcript Results - "View Transcript File" */}
          {job.result_type === 'transcript' && (
            <button
              onClick={() => onViewTranscript && onViewTranscript(job)}
              className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors"
            >
              📄 View Transcript File
            </button>
          )}

          {/* FIXED: Audio Results - "View Audio File" */}
          {job.result_type === 'audio' && (
            <button
              onClick={() => onDownloadFile && onDownloadFile(job)}
              className="inline-flex items-center px-2 py-1 text-xs bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors"
            >
              🎵 View Audio File
            </button>
          )}

          {/* Video Results - Already consistent: "View Video File" */}
          {job.result_type === 'video' && (
            <button
              onClick={() => onDownloadFile && onDownloadFile(job)}
              className="inline-flex items-center px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded hover:bg-purple-200 transition-colors"
            >
              🎬 View Video File
            </button>
          )}
        </div>
        {job.fileSize && (
          <div className="text-xs text-gray-500">
            {formatFileSize(job.fileSize)}
          </div>
        )}
        {job.videoTitle && (
          <div className="text-xs text-gray-600 truncate max-w-[200px]" title={job.videoTitle}>
            {job.videoTitle}
          </div>
        )}
      </div>
    );
  }

  // Failed status - show retry option
  if (job.status === 'failed') {
    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1">
          <span className="text-lg">❌</span>
          <span className="text-xs font-medium text-red-700">Failed</span>
        </div>
        {job.message && (
          <div className="text-xs text-red-600 truncate max-w-[200px]" title={job.message}>
            {job.message}
          </div>
        )}
        <button
          onClick={() => window.location.reload()} 
          className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors self-start"
        >
          🔄 Retry
        </button>
      </div>
    );
  }

  // Processing/Queued status - show status
  return (
    <div className="flex items-center gap-2">
      <span className="text-lg">{getStatusIcon(job.status)}</span>
      <div className="flex flex-col">
        <span className="text-xs font-medium capitalize text-gray-700">
          {job.status}
        </span>
        {job.message && (
          <span className="text-xs text-gray-500 truncate max-w-[150px]" title={job.message}>
            {job.message}
          </span>
        )}
      </div>
    </div>
  );
};

// Enhanced Transcript Viewer Modal with robust Copy functionality
const TranscriptModal = ({ isOpen, onClose, transcript, videoId, videoTitle }) => {
  if (!isOpen) return null;

  const handleDownload = () => {
    try {
      const blob = new Blob([transcript], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transcript_${videoId}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('📄 Transcript downloaded!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Download failed');
    }
  };

  // Enhanced Copy functionality with proper fallbacks
  const handleCopy = async () => {
    try {
      // First try modern clipboard API
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(transcript);
        toast.success('📋 Copied to clipboard!');
        return;
      }
      
      // Fallback for older browsers or non-secure contexts
      const textArea = document.createElement('textarea');
      textArea.value = transcript;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      textArea.style.top = '-9999px';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (successful) {
        toast.success('📋 Copied to clipboard!');
      } else {
        throw new Error('execCommand failed');
      }
      
    } catch (error) {
      console.error('Copy error:', error);
      
      // Final fallback - show the text for manual copying
      const userWantsToProceed = window.confirm(
        'Automatic copy failed. Would you like to see the text in a new window for manual copying?'
      );
      
      if (userWantsToProceed) {
        const newWindow = window.open('', '_blank', 'width=800,height=600,scrollbars=yes');
        if (newWindow) {
          newWindow.document.write(`
            <html>
              <head><title>Transcript - Manual Copy</title></head>
              <body style="font-family: monospace; padding: 20px; line-height: 1.5;">
                <h3>📄 Transcript for Video: ${videoId}</h3>
                <p><strong>Instructions:</strong> Select all text below (Ctrl+A) and copy (Ctrl+C)</p>
                <hr>
                <pre style="white-space: pre-wrap; word-wrap: break-word;">${transcript}</pre>
              </body>
            </html>
          `);
          newWindow.document.close();
        } else {
          toast.error('Copy failed. Please copy the text manually from the modal.');
        }
      } else {
        toast.error('Copy failed. Please copy the text manually.');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl max-h-[80vh] w-full overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">📄 Transcript File</h3>
              <p className="text-sm text-gray-600">Video ID: {videoId}</p>
              {videoTitle && (
                <p className="text-sm text-gray-600 truncate">{videoTitle}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
        </div>
        
        <div className="p-4 overflow-auto max-h-[calc(80vh-200px)]">
          <div className="bg-gray-50 border p-4 rounded text-sm leading-relaxed">
            <pre className="whitespace-pre-wrap font-sans">{transcript}</pre>
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-200 flex gap-3">
          <button
            onClick={handleDownload}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            💾 Download
          </button>
          <button
            onClick={handleCopy}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            📋 Copy
          </button>
          <button
            onClick={onClose}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors ml-auto"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Audio/Video Result Modal Component with consistent file naming
const MediaResultModal = ({ isOpen, onClose, job, onStartDownload }) => {
  if (!isOpen || !job) return null;

  const isAudio = job.result_type === 'audio';
  const title = isAudio ? 'Audio File Ready' : 'Video File Ready';
  const icon = isAudio ? '🎵' : '🎬';
  const fileType = isAudio ? 'MP3' : 'MP4';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full overflow-hidden">
        <div className="p-6 text-center">
          <div className="text-6xl mb-4">{icon}</div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-600 mb-4">
            Quality: {job.quality || 'default'} • Video ID: {job.youtubeId}
          </p>
          
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 mb-6">
            ✅ Successfully Processed
          </div>

          {job.videoTitle && (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg mb-6 border border-green-200">
              <div className="font-semibold text-gray-800 mb-1">✅ File Prepared</div>
              <div className="text-sm text-gray-800">Title: {job.videoTitle}</div>
              <div className="text-sm text-gray-800">Video ID: {job.youtubeId}</div>
              {job.fileSize && (
                <div className="text-sm text-gray-800">
                  Size: {(job.fileSize / (1024 * 1024)).toFixed(1)} MB
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-gray-200 flex gap-3">
          {job.downloadLinks && (
            <button
              onClick={() => {
                onStartDownload(job);
                onClose();
              }}
              className={`flex-1 py-3 px-6 rounded-lg font-medium text-white transition-colors ${
                isAudio ? 'bg-green-600 hover:bg-green-700' : 'bg-purple-600 hover:bg-purple-700'
              }`}
            >
              💾 Start Download ({fileType})
            </button>
          )}
          <button
            onClick={onClose}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const extractVideoId = (input) => {
  const s = (input || '').trim();
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^&\n?#]+)/,
    /(?:youtu\.be\/)([^&\n?#]+)/,
    /(?:youtube\.com\/embed\/)([^&\n?#]+)/,
    /(?:youtube\.com\/shorts\/)([^&\n?#]+)/,
    /[?&]v=([^&\n?#]+)/
  ];
  for (const p of patterns) {
    const m = s.match(p);
    if (m && m[1]) return m[1].substring(0, 11);
  }
  if (s.length >= 11) return s.substring(0, 11);
  return '';
};

// FIXED: Completely rewritten CSV parsing functions with enhanced robustness
const parseCSVForURLs = (csvText) => {
  const urls = [];
  const lines = csvText.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
  
  if (lines.length === 0) return urls;
  
  // Enhanced YouTube URL patterns with more flexible matching
  const youtubePatterns = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?[^"\s]*v=([a-zA-Z0-9_-]{11})/gi,
    /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})/gi,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/gi,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/gi,
    /(?:https?:\/\/)?(?:m\.)?youtube\.com\/watch\?[^"\s]*v=([a-zA-Z0-9_-]{11})/gi,
  ];
  
  debug(`📝 Processing ${lines.length} CSV lines for YouTube URLs`);
  
  lines.forEach((line, lineIndex) => {
    debug(`📝 Line ${lineIndex + 1}:`, line.substring(0, 150) + (line.length > 150 ? '...' : ''));
    
    // Parse CSV line properly (handles quotes and commas)
    const fields = parseCSVRow(line);
    
    // Also try simple comma split as fallback
    const simpleFields = line.split(',').map(f => f.trim().replace(/^["']|["']$/g, ''));
    
    // Also try tab split for TSV files
    const tabFields = line.split('\t').map(f => f.trim().replace(/^["']|["']$/g, ''));
    
    // Combine all methods to ensure we don't miss URLs
    const allFields = [...new Set([...fields, ...simpleFields, ...tabFields, line])];
    
    // Search each field for YouTube URLs
    allFields.forEach(field => {
      if (!field || field.length < 10) return;
      
      // Check each YouTube pattern
      youtubePatterns.forEach(pattern => {
        pattern.lastIndex = 0; // Reset regex state
        let match;
        while ((match = pattern.exec(field)) !== null) {
          const videoId = match[1];
          if (videoId && videoId.length === 11) {
            let fullUrl = `https://www.youtube.com/watch?v=${videoId}`;
            
            // Validate the URL
            if (isValidYouTubeURL(fullUrl)) {
              urls.push(fullUrl);
              debug(`✅ Found URL: ${fullUrl} (from video ID: ${videoId})`);
            }
          }
        }
      });
      
      // Also check for bare video IDs (exactly 11 character alphanumeric strings)
      const bareIdPattern = /\b([a-zA-Z0-9_-]{11})\b/g;
      let bareMatch;
      while ((bareMatch = bareIdPattern.exec(field)) !== null) {
        const videoId = bareMatch[1];
        // Additional validation to ensure it looks like a YouTube ID
        if (/^[a-zA-Z0-9_-]{11}$/.test(videoId) && !/^\d{11}$/.test(videoId)) {
          const fullUrl = `https://www.youtube.com/watch?v=${videoId}`;
          urls.push(fullUrl);
          debug(`✅ Found bare ID: ${videoId} -> ${fullUrl}`);
        }
      }
    });
  });
  
  const uniqueUrls = Array.from(new Set(urls));
  debug(`🎯 Total unique URLs found: ${uniqueUrls.length}`);
  return uniqueUrls;
};

// FIXED: Enhanced CSV row parsing that handles quotes, commas, and escapes properly
const parseCSVRow = (row) => {
  const fields = [];
  let currentField = '';
  let inQuotes = false;
  let i = 0;
  
  while (i < row.length) {
    const char = row[i];
    
    if (char === '"') {
      if (inQuotes && i + 1 < row.length && row[i + 1] === '"') {
        // Escaped quote (two quotes in a row = one quote)
        currentField += '"';
        i += 2;
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
        i++;
      }
    } else if (char === ',' && !inQuotes) {
      // Field separator outside of quotes
      fields.push(currentField.trim());
      currentField = '';
      i++;
    } else {
      currentField += char;
      i++;
    }
  }
  
  // Add the last field
  if (currentField || fields.length > 0) {
    fields.push(currentField.trim());
  }
  
  return fields;
};

// FIXED: Enhanced YouTube URL validation function
const isValidYouTubeURL = (url) => {
  try {
    const urlObj = new URL(url);
    
    // Check if it's a YouTube domain
    const validDomains = ['youtube.com', 'www.youtube.com', 'youtu.be', 'm.youtube.com'];
    if (!validDomains.includes(urlObj.hostname)) {
      return false;
    }
    
    // Extract video ID based on URL format
    let videoId = '';
    
    if (urlObj.hostname.includes('youtu.be')) {
      // youtu.be/VIDEO_ID
      videoId = urlObj.pathname.substring(1).split('?')[0];
    } else if (urlObj.pathname === '/watch') {
      // youtube.com/watch?v=VIDEO_ID
      videoId = urlObj.searchParams.get('v');
    } else if (urlObj.pathname.startsWith('/embed/')) {
      // youtube.com/embed/VIDEO_ID
      videoId = urlObj.pathname.substring(7).split('?')[0];
    } else if (urlObj.pathname.startsWith('/shorts/')) {
      // youtube.com/shorts/VIDEO_ID
      videoId = urlObj.pathname.substring(8).split('?')[0];
    }
    
    // Validate video ID format (exactly 11 characters, alphanumeric + underscore + dash)
    return /^[a-zA-Z0-9_-]{11}$/.test(videoId);
    
  } catch (e) {
    debug(`❌ Invalid URL: ${url}`, e.message);
    return false;
  }
};

export default function BatchJobs() {
  const navigate = useNavigate();
  const { token, isAuthenticated, user } = useAuth();
  const { tier, refreshSubscriptionStatus, subscriptionStatus } = useSubscription();

  const [urlsText, setUrlsText] = useState('');
  const [parsedIds, setParsedIds] = useState([]);
  const [batchType, setBatchType] = useState('transcript'); // transcript | audio | video
  const [audioQuality, setAudioQuality] = useState('medium');
  const [videoQuality, setVideoQuality] = useState('720p');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [stubMode, setStubMode] = useState(BATCH_STUB_MODE_DEFAULT);
  const [currentJobId, setCurrentJobId] = useState(null);
  
  // Modal states
  const [transcriptModal, setTranscriptModal] = useState({
    isOpen: false,
    transcript: '',
    videoId: '',
    videoTitle: ''
  });
  
  const [mediaModal, setMediaModal] = useState({
    isOpen: false,
    job: null
  });

  const timersRef = useRef([]);
  const pollIntervalRef = useRef(null);
  const fileInputRef = useRef(null);

  const canUseBatch = tier === 'pro' || tier === 'premium';
  const isPro = tier === 'pro';

  // FIXED: Usage limit checking functions
  const getUsageLimits = () => {
    const usage = subscriptionStatus?.usage || {};
    const limits = subscriptionStatus?.limits || {};
    
    return {
      clean_transcripts: {
        used: usage.clean_transcripts || 0,
        limit: limits.clean_transcripts || 0,
        remaining: Math.max(0, (limits.clean_transcripts || 0) - (usage.clean_transcripts || 0))
      },
      unclean_transcripts: {
        used: usage.unclean_transcripts || 0,
        limit: limits.unclean_transcripts || 0,
        remaining: Math.max(0, (limits.unclean_transcripts || 0) - (usage.unclean_transcripts || 0))
      },
      audio_downloads: {
        used: usage.audio_downloads || 0,
        limit: limits.audio_downloads || 0,
        remaining: Math.max(0, (limits.audio_downloads || 0) - (usage.audio_downloads || 0))
      },
      video_downloads: {
        used: usage.video_downloads || 0,
        limit: limits.video_downloads || 0,
        remaining: Math.max(0, (limits.video_downloads || 0) - (usage.video_downloads || 0))
      }
    };
  };

  const checkUsageLimits = (batchType, itemCount) => {
    // Premium users have unlimited usage
    if (tier === 'premium') return { canProceed: true };
    
    const limits = getUsageLimits();
    
    switch (batchType) {
      case 'transcript':
        // For transcripts, we'll assume they're clean transcripts
        const transcriptRemaining = limits.clean_transcripts.remaining;
        if (transcriptRemaining < itemCount) {
          return {
            canProceed: false,
            message: `Insufficient transcript downloads remaining. You have ${transcriptRemaining} remaining, but requested ${itemCount}.`,
            upgradeMessage: 'Upgrade to Premium for unlimited transcripts.'
          };
        }
        break;
        
      case 'audio':
        const audioRemaining = limits.audio_downloads.remaining;
        if (audioRemaining < itemCount) {
          return {
            canProceed: false,
            message: `Insufficient audio downloads remaining. You have ${audioRemaining} remaining, but requested ${itemCount}.`,
            upgradeMessage: 'Upgrade to Premium for unlimited audio downloads.'
          };
        }
        break;
        
      case 'video':
        const videoRemaining = limits.video_downloads.remaining;
        if (videoRemaining < itemCount) {
          return {
            canProceed: false,
            message: `Insufficient video downloads remaining. You have ${videoRemaining} remaining, but requested ${itemCount}.`,
            upgradeMessage: 'Upgrade to Premium for unlimited video downloads.'
          };
        }
        break;
    }
    
    return { canProceed: true };
  };

  // FIXED: Usage Limit Warning Component
  const UsageLimitWarning = () => {
    if (tier === 'premium' || parsedIds.length === 0) return null;
    
    const limits = getUsageLimits();
    const itemCount = isPro ? Math.min(parsedIds.length, PRO_MAX_LINKS) : parsedIds.length;
    const usageCheck = checkUsageLimits(batchType, itemCount);
    
    if (!usageCheck.canProceed) {
      return (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Usage Limit Exceeded
              </h3>
              <div className="mt-2 text-sm text-red-700">
                {usageCheck.message}
              </div>
              {usageCheck.upgradeMessage && (
                <div className="mt-2 text-sm text-red-700 font-medium">
                  {usageCheck.upgradeMessage}
                </div>
              )}
              <div className="mt-3">
                <button
                  onClick={() => navigate('/subscription')}
                  className="bg-red-100 text-red-800 px-3 py-1 rounded text-sm hover:bg-red-200 transition-colors"
                >
                  Upgrade Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    // Show warning if getting close to limits
    const currentLimit = batchType === 'transcript' ? limits.clean_transcripts :
                        batchType === 'audio' ? limits.audio_downloads :
                        limits.video_downloads;
    
    if (currentLimit.remaining <= 5 && currentLimit.remaining > 0) {
      return (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Low Usage Remaining
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                You have {currentLimit.remaining} {batchType} downloads remaining this month.
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    return null;
  };

  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const ids = (urlsText || '')
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean)
      .map(extractVideoId)
      .filter((id) => id && id.length === 11);
    setParsedIds(Array.from(new Set(ids))); // de-dupe
  }, [urlsText]);

  // Cleanup on unmount
  useEffect(() => () => {
    timersRef.current.forEach((t) => clearInterval(t));
    timersRef.current = [];
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }
  }, []);

  // Poll for job updates when we have an active job
  useEffect(() => {
    if (currentJobId && !stubMode) {
      pollIntervalRef.current = setInterval(async () => {
        try {
          const res = await fetch(`${API_BASE_URL}/batch/jobs/${currentJobId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          
          if (res.ok) {
            const jobData = await res.json();
            const items = (jobData.items || []).map((item) => ({
              id: `${jobData.id}_${item.idx}`,
              youtubeId: item.youtube_id,
              status: item.status === 'completed' ? 'done' : item.status,
              progress: item.status === 'completed' ? 100 : 
                       item.status === 'processing' ? 75 : 
                       item.status === 'queued' ? 25 : 0,
              result_type: item.result_type,
              resultUrl: item.result_url,
              downloadLinks: item.download_links,
              fileSize: item.file_size,
              videoTitle: item.video_title,
              message: item.message,
              quality: jobData.kind === 'audio' ? audioQuality : 
                      jobData.kind === 'video' ? videoQuality : undefined,
            }));
            
            setJobs(items);
            
            // Stop polling if all items are complete or failed
            const allComplete = items.every(item => 
              item.status === 'done' || item.status === 'completed' || item.status === 'failed'
            );
            
            if (allComplete) {
              clearInterval(pollIntervalRef.current);
              setCurrentJobId(null);
              // Refresh subscription status to update usage counts
              if (refreshSubscriptionStatus) {
                refreshSubscriptionStatus();
              }
            }
          }
        } catch (error) {
          console.error('Error polling job status:', error);
        }
      }, 3000); // Poll every 3 seconds

      // Cleanup interval on dependency change
      return () => {
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
        }
      };
    }
  }, [currentJobId, stubMode, token, refreshSubscriptionStatus, audioQuality, videoQuality]);

  const handleViewTranscript = async (job) => {
    try {
      const res = await fetch(`${API_BASE_URL}/batch/view/${job.youtubeId}/transcript`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (res.ok) {
        const data = await res.json();
        setTranscriptModal({
          isOpen: true,
          transcript: data.transcript || 'No transcript available',
          videoId: job.youtubeId,
          videoTitle: job.videoTitle || 'Unknown Video'
        });
      } else {
        toast.error('Failed to load transcript');
      }
    } catch (error) {
      console.error('Error fetching transcript:', error);
      toast.error('Error loading transcript');
    }
  };

  const handleShowMediaResult = (job) => {
    setMediaModal({
      isOpen: true,
      job: job
    });
  };

  const handleStartDownload = (job) => {
    // Auto-start download like the main download page
    if (job.downloadLinks) {
      const downloadUrl = job.downloadLinks.audio || job.downloadLinks.video;
      if (downloadUrl) {
        window.open(`${API_BASE_URL}${downloadUrl}`, '_blank');
        toast.success('💾 Download started!');
      }
    }
  };

  // FIXED: Completely rewritten CSV upload handler with enhanced file support
  const handleCsvUpload = async (file) => {
    if (!file) return;
    
    try {
      debug('📁 Reading file:', file.name, `(${file.size} bytes, type: ${file.type})`);
      const text = await file.text();
      debug('📄 File content preview:', text.substring(0, 500) + (text.length > 500 ? '...' : ''));
      
      // Enhanced file type detection
      const isCSV = file.name.toLowerCase().endsWith('.csv') || file.type === 'text/csv';
      const isTXT = file.name.toLowerCase().endsWith('.txt') || file.type === 'text/plain';
      const isTSV = file.name.toLowerCase().endsWith('.tsv') || file.type === 'text/tab-separated-values';
      
      if (!isCSV && !isTXT && !isTSV) {
        toast.error('❌ Please upload a CSV, TXT, or TSV file containing YouTube URLs');
        return;
      }

      // Use the enhanced CSV parsing function
      const foundUrls = parseCSVForURLs(text);
      
      if (foundUrls.length === 0) {
        toast.error('❌ No YouTube URLs found in file. Make sure URLs are in format: https://youtube.com/watch?v=VIDEO_ID or video IDs like dQw4w9WgXcQ');
        return;
      }
      
      // Extract and validate video IDs
      const ids = foundUrls.map(extractVideoId).filter((id) => id && id.length === 11);
      const uniqueIds = Array.from(new Set(ids));
      
      if (uniqueIds.length === 0) {
        toast.error('❌ No valid YouTube video IDs found in file');
        return;
      }
      
      // Merge with existing URLs in the text area
      const existingUrls = urlsText ? urlsText.split(/\r?\n/).filter(Boolean) : [];
      const combinedUrls = [...existingUrls, ...foundUrls];
      const uniqueUrls = Array.from(new Set(combinedUrls));
      
      setUrlsText(uniqueUrls.join('\n'));
      toast.success(`✅ Successfully imported ${uniqueIds.length} valid video IDs from ${file.name}`);
      
      debug(`🎯 File Import Summary: Found ${foundUrls.length} URLs, ${uniqueIds.length} valid IDs`);
      
      // Clear the file input for repeat uploads
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
    } catch (error) {
      console.error('File upload error:', error);
      toast.error('❌ Failed to read file. Please check the file format and try again.');
    }
  };

  const simulateProgress = (items, type) => {
    // Enhanced stub mode with different types
    const nextJobs = items.map((yt, idx) => ({
      id: `${Date.now()}_${idx}`,
      youtubeId: yt,
      status: 'queued',
      progress: 0,
      result_type: type,
      resultUrl: null,
      message: 'Waiting to process...',
    }));
    setJobs(nextJobs);

    nextJobs.forEach((job, i) => {
      const delay = 400 + i * 200;
      setTimeout(() => {
        // Start processing
        setJobs((j) => j.map((x) => (x.id === job.id ? { 
          ...x, 
          status: 'processing', 
          message: 'Processing...',
          progress: 25 
        } : x)));
        
        const timer = setInterval(() => {
          setJobs((j) =>
            j.map((x) => {
              if (x.id !== job.id) return x;
              const step = Math.random() * 18 + 5;
              const np = Math.min(100, (x.progress || 0) + step);
              const done = np >= 100;
              
              if (done) {
                const baseLinks = {
                  transcript: `/batch/download/${x.youtubeId}/transcript`,
                  view: `/batch/view/${x.youtubeId}/transcript`
                };
                
                let downloadLinks = baseLinks;
                if (type === 'audio') {
                  downloadLinks = {
                    audio: `/files/${x.youtubeId}_audio_medium.mp3`,
                    direct: `/download-file/audio/${x.youtubeId}_audio_medium.mp3`
                  };
                } else if (type === 'video') {
                  downloadLinks = {
                    video: `/files/${x.youtubeId}_video_720p.mp4`,
                    direct: `/download-file/video/${x.youtubeId}_video_720p.mp4`
                  };
                }

                return { 
                  ...x, 
                  progress: 100, 
                  status: 'done',
                  message: `${type.charAt(0).toUpperCase() + type.slice(1)} ready`,
                  resultUrl: type === 'transcript' ? `/files/${x.youtubeId}_transcript.txt` : 
                            type === 'audio' ? `/files/${x.youtubeId}_audio_medium.mp3` :
                            `/files/${x.youtubeId}_video_720p.mp4`,
                  downloadLinks: downloadLinks
                };
              } else {
                return { ...x, progress: np, status: 'processing' };
              }
            })
          );
        }, 600);
        
        timersRef.current.push(timer);
        
        // Auto-complete after random time
        setTimeout(() => {
          clearInterval(timer);
          setJobs((j) => j.map((x) => (x.id === job.id ? { 
            ...x, 
            progress: 100, 
            status: 'done',
            message: `${type.charAt(0).toUpperCase() + type.slice(1)} ready`,
          } : x)));
        }, 6000 + Math.random() * 3000);
      }, delay);
    });
  };

  // FIXED: Enhanced batch start with usage limit checking
  const startBatch = async () => {
    if (!canUseBatch) return toast('Upgrade to Pro to use Batch Jobs.');
    if (parsedIds.length === 0) return toast.error('Add at least one YouTube URL or ID.');

    let toSubmit = [...parsedIds];
    if (isPro && parsedIds.length > PRO_MAX_LINKS) {
      toSubmit = parsedIds.slice(0, PRO_MAX_LINKS);
      toast('Pro plan allows up to 3 links per batch — submitting the first 3.');
    }

    // FIXED: Check usage limits before submission
    const usageCheck = checkUsageLimits(batchType, toSubmit.length);
    if (!usageCheck.canProceed) {
      toast.error(usageCheck.message);
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        urls: toSubmit,
        kind: batchType
      };

      // Add quality settings for audio/video
      if (batchType === 'audio') {
        payload.quality = audioQuality;
      } else if (batchType === 'video') {
        payload.quality = videoQuality;
      }

      const res = await fetch(`${API_BASE_URL}/batch/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Backend not ready');
      
      const data = await res.json();
      
      // Transform backend response to frontend format
      const items = (data.items || []).map((item) => ({
        id: `${data.id}_${item.idx}`,
        youtubeId: item.youtube_id,
        status: item.status === 'completed' ? 'done' : item.status,
        progress: item.status === 'completed' ? 100 : 
                 item.status === 'processing' ? 50 : 
                 item.status === 'queued' ? 10 : 0,
        result_type: item.result_type,
        resultUrl: item.result_url,
        downloadLinks: item.download_links,
        fileSize: item.file_size,
        videoTitle: item.video_title,
        message: item.message || (item.status === 'queued' ? 'Waiting to process...' : ''),
        quality: batchType === 'audio' ? audioQuality : 
                batchType === 'video' ? videoQuality : undefined,
      }));

      setStubMode(false);
      setJobs(items);
      setCurrentJobId(data.id);
      toast.success(`Batch submitted with ${data.total} items`);

    } catch (e) {
      console.error('Batch submission error:', e);
      // Fallback to enhanced stub
      setStubMode(true);
      simulateProgress(toSubmit, batchType);
      toast('Backend batch endpoint not ready — running in enhanced stub mode.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearAll = () => {
    setUrlsText('');
    setParsedIds([]);
    setJobs([]);
    setCurrentJobId(null);
    setTranscriptModal({ isOpen: false, transcript: '', videoId: '', videoTitle: '' });
    setMediaModal({ isOpen: false, job: null });
    timersRef.current.forEach((t) => clearInterval(t));
    timersRef.current = [];
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }
    // Also clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // FIXED: Enhanced disabled logic with usage limit checking
  const getDisabledStatus = () => {
    if (!canUseBatch || parsedIds.length === 0 || isSubmitting) return true;
    
    // Check usage limits
    const itemCount = isPro ? Math.min(parsedIds.length, PRO_MAX_LINKS) : parsedIds.length;
    const usageCheck = checkUsageLimits(batchType, itemCount);
    
    return !usageCheck.canProceed;
  };

  const disabled = getDisabledStatus();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">

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
          <div className="flex justify-center items-center mb-4">
            <YcdLogo size={56} />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">⚙️ Batch Jobs (Beta)</h1>
          <p className="text-sm text-gray-600 mb-3">
            Process multiple videos at once. Choose transcript, audio, or video batch processing.
          </p>

          {/* Navigation Buttons */}
          <div className="flex justify-center gap-3 mb-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              ← Back to Dashboard
            </button>
            <button
              onClick={() => navigate('/subscription')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              💳 Manage Subscription
            </button>
          </div>

          {/* Plan Status Messages */}
          {!canUseBatch && (
            <div className="text-xs text-red-700 bg-red-50 border border-red-200 px-3 py-2 rounded inline-block">
              Batch Jobs are available on <b>Pro</b> and <b>Premium</b> plans.
            </div>
          )}
          {isPro && (
            <div className="text-xs text-gray-500">Pro: up to {PRO_MAX_LINKS} links per batch.</div>
          )}
        </header>

        {/* FIXED: Usage Limit Warning */}
        <UsageLimitWarning />

        {/* Batch Type Selection */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Select Batch Type</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <label className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
              batchType === 'transcript' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
            }`}>
              <input
                type="radio"
                value="transcript"
                checked={batchType === 'transcript'}
                onChange={(e) => setBatchType(e.target.value)}
                className="mr-2"
              />
              <div className="font-bold text-gray-900">📄 Transcript Batch</div>
              <div className="text-sm text-gray-600">Extract text from multiple videos</div>
            </label>

            <label className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
              batchType === 'audio' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'
            }`}>
              <input
                type="radio"
                value="audio"
                checked={batchType === 'audio'}
                onChange={(e) => setBatchType(e.target.value)}
                className="mr-2"
              />
              <div className="font-bold text-gray-900">🎵 Audio Batch</div>
              <div className="text-sm text-gray-600">Download MP3s from multiple videos</div>
            </label>

            <label className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
              batchType === 'video' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'
            }`}>
              <input
                type="radio"
                value="video"
                checked={batchType === 'video'}
                onChange={(e) => setBatchType(e.target.value)}
                className="mr-2"
              />
              <div className="font-bold text-gray-900">🎬 Video Batch</div>
              <div className="text-sm text-gray-600">Download MP4s from multiple videos</div>
            </label>
          </div>

          {/* FIXED: Professionally aligned quality options */}
          {batchType === 'audio' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <h4 className="font-semibold mb-3 text-green-800 text-center">🎵 Audio Quality</h4>
              <div className="flex justify-center">
                <div className="grid grid-cols-3 gap-4 max-w-md">
                  {['high', 'medium', 'low'].map((q) => (
                    <label key={q} className="flex items-center justify-center p-3 border border-green-300 rounded-lg cursor-pointer hover:bg-green-100 transition-colors min-w-[80px]">
                      <input
                        type="radio"
                        value={q}
                        checked={audioQuality === q}
                        onChange={(e) => setAudioQuality(e.target.value)}
                        className="mr-2"
                      />
                      <span className="capitalize font-medium text-green-800">{q}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {batchType === 'video' && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
              <h4 className="font-semibold mb-3 text-purple-800 text-center">🎬 Video Quality</h4>
              <div className="flex justify-center">
                <div className="grid grid-cols-4 gap-3 max-w-lg">
                  {['1080p', '720p', '480p', '360p'].map((q) => (
                    <label key={q} className="flex items-center justify-center p-3 border border-purple-300 rounded-lg cursor-pointer hover:bg-purple-100 transition-colors min-w-[70px]">
                      <input
                        type="radio"
                        value={q}
                        checked={videoQuality === q}
                        onChange={(e) => setVideoQuality(e.target.value)}
                        className="mr-2"
                      />
                      <span className="font-medium text-purple-800">{q}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input panel */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                YouTube URLs or IDs (one per line)
              </label>
              <textarea
                rows={10}
                value={urlsText}
                onChange={(e) => setUrlsText(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ&#10;jNQXAC9IVRw&#10;https://www.youtube.com/shorts/ABC123"
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm resize-none"
                disabled={isSubmitting}
              />
              <div className="mt-2 text-xs text-gray-600">
                Parsed: <span className="font-semibold">{parsedIds.length}</span> video(s)
                {isPro && parsedIds.length > PRO_MAX_LINKS && (
                  <span className="text-red-600 ml-2">
                    • Pro limit is {PRO_MAX_LINKS}; only first {PRO_MAX_LINKS} will be submitted.
                  </span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload File (CSV/TXT/TSV)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="*"
                  onChange={(e) => handleCsvUpload(e.target.files?.[0])}
                  className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  disabled={isSubmitting}
                />
                <p className="mt-2 text-xs text-gray-500">
                  Upload any text file containing YouTube URLs or video IDs. Supports CSV, TXT, TSV formats.
                </p>
                <p className="mt-1 text-xs text-blue-600">
                  We'll automatically detect YouTube URLs in any column or format.
                </p>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={startBatch}
                  disabled={disabled}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                    disabled 
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed' 
                      : batchType === 'transcript' ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : batchType === 'audio' ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-purple-600 text-white hover:bg-purple-700'
                  }`}
                >
                  {isSubmitting ? '⏳ Starting…' : 
                   batchType === 'transcript' ? '📄 Start Transcript Batch' :
                   batchType === 'audio' ? '🎵 Start Audio Batch' :
                   '🎬 Start Video Batch'}
                </button>
                <button 
                  onClick={clearAll} 
                  disabled={isSubmitting}
                  className="py-2 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  🗑️ Clear
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Jobs table */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Jobs {batchType && `(${batchType.charAt(0).toUpperCase() + batchType.slice(1)})`}
            </h2>
          </div>
          
          <div className="p-6">
            {!jobs.length ? (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-2">📋</div>
                <div className="text-sm text-gray-600">
                  No jobs yet. Add URLs or upload a file, then click "Start Batch".
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-600 border-b border-gray-200">
                      <th className="py-3 pr-4 font-medium">#</th>
                      <th className="py-3 pr-4 font-medium">Video ID</th>
                      <th className="py-3 pr-4 font-medium">Status</th>
                      <th className="py-3 pr-4 font-medium">Progress</th>
                      <th className="py-3 pr-4 font-medium">Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.map((job, idx) => (
                      <tr key={job.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                        <td className="py-4 pr-4 text-gray-900">{idx + 1}</td>
                        <td className="py-4 pr-4 font-mono text-gray-900">{job.youtubeId}</td>
                        <td className="py-4 pr-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            job.status === 'done' || job.status === 'completed' 
                              ? 'bg-green-100 text-green-800' 
                              : job.status === 'failed' 
                                ? 'bg-red-100 text-red-800'
                                : job.status === 'processing' 
                                  ? 'bg-yellow-100 text-yellow-800' 
                                  : 'bg-gray-100 text-gray-800'
                          }`}>
                            {job.status === 'done' || job.status === 'completed' ? '✅ Done' : 
                             job.status === 'failed' ? '❌ Failed' :
                             job.status === 'processing' ? '🔄 Processing' : '⏱️ Queued'}
                          </span>
                        </td>
                        <td className="py-4 pr-4">
                          <div className="w-48 bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div
                              className="h-2 rounded-full transition-all duration-500"
                              style={{
                                width: `${Math.round(job.progress || 0)}%`,
                                background: job.status === 'done' || job.status === 'completed'
                                  ? 'linear-gradient(to right, #10b981, #059669)'
                                  : job.status === 'failed'
                                    ? 'linear-gradient(to right, #ef4444, #dc2626)'
                                    : 'linear-gradient(to right, #3b82f6, #1d4ed8)',
                              }}
                            />
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {Math.round(job.progress || 0)}%
                          </div>
                        </td>
                        <td className="py-4 pr-4">
                          <BatchResultCell 
                            job={job} 
                            onViewTranscript={handleViewTranscript}
                            onDownloadFile={handleShowMediaResult}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {stubMode && IS_DEVELOPMENT && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="text-xs text-yellow-800">
                      <b>Enhanced Stub Mode:</b> Simulating realistic batch processing for {batchType}.
                      Once your backend is ready, this will automatically use real processing.
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-8 text-sm text-gray-500">
          ⚡ Batch processing • Pro and Premium plans • Transcript • Audio • Video
        </footer>
      </div>

      {/* Transcript Modal */}
      <TranscriptModal
        isOpen={transcriptModal.isOpen}
        onClose={() => setTranscriptModal({ isOpen: false, transcript: '', videoId: '', videoTitle: '' })}
        transcript={transcriptModal.transcript}
        videoId={transcriptModal.videoId}
        videoTitle={transcriptModal.videoTitle}
      />

      {/* Media Result Modal */}
      <MediaResultModal
        isOpen={mediaModal.isOpen}
        onClose={() => setMediaModal({ isOpen: false, job: null })}
        job={mediaModal.job}
        onStartDownload={handleStartDownload}
      />
    </div>
  );
}




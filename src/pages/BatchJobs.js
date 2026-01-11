// frontend/src/pages/BatchJobs.js — PixelPerfect Screenshot API
// CONVERTED FROM: YCD BatchJobs.js  
// PURPOSE: Batch screenshot processing with URL list or CSV upload
// CHANGES: YouTube video batch → Website screenshot batch

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import AppBrand from '../components/AppBrand';

const API_BASE_URL = process.env.REACT_APP_API_URL || process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

// Development debug helper
const debug = process.env.NODE_ENV === 'development' ? (...args) => console.log(...args) : () => {};

// Feature toggles
const BATCH_STUB_MODE_DEFAULT = (process.env.REACT_APP_BATCH_STUB_MODE || 'false').toLowerCase() === 'true';
const PRO_MAX_LINKS = parseInt(process.env.REACT_APP_PRO_BATCH_LIMIT || '50', 10);
const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

// CONVERTED: Result Cell Component for screenshot results
const BatchResultCell = ({ job, onViewScreenshot }) => {
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

  // Completed status - show ONLY view options
  if (job.status === 'completed' || job.status === 'done') {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap gap-1">
          <button
            onClick={() => onViewScreenshot && onViewScreenshot(job)}
            className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors"
          >
            🖼️ View Screenshot
          </button>
          {job.screenshot_url && (
            <a
              href={job.screenshot_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-2 py-1 text-xs bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors"
            >
              💾 Download
            </a>
          )}
        </div>
        {job.fileSize && (
          <div className="text-xs text-gray-500">
            {formatFileSize(job.fileSize)}
          </div>
        )}
        {job.dimensions && (
          <div className="text-xs text-gray-600">
            {job.dimensions}
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

// CONVERTED: Screenshot Viewer Modal
const ScreenshotModal = ({ isOpen, onClose, screenshot }) => {
  if (!isOpen || !screenshot) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] w-full overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">🖼️ Screenshot Preview</h3>
              <p className="text-sm text-gray-600">URL: {screenshot.url}</p>
              {screenshot.dimensions && (
                <p className="text-sm text-gray-600">{screenshot.dimensions}</p>
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
        
        <div className="p-4 overflow-auto max-h-[calc(90vh-200px)]">
          <div className="flex justify-center bg-gray-50 p-4 rounded">
            {screenshot.screenshot_url ? (
              <img 
                src={screenshot.screenshot_url} 
                alt="Screenshot preview"
                className="max-w-full h-auto border border-gray-300 rounded shadow-lg"
              />
            ) : (
              <div className="text-gray-500">Screenshot not available</div>
            )}
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-200 flex gap-3">
          {screenshot.screenshot_url && (
            <>
              <a
                href={screenshot.screenshot_url}
                download
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                💾 Download
              </a>
              <a
                href={screenshot.screenshot_url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                🔗 Open in New Tab
              </a>
            </>
          )}
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

// CONVERTED: Extract URLs from input (instead of video IDs)
const extractURL = (input) => {
  const trimmed = (input || '').trim();
  
  // If it's already a valid URL, return it
  try {
    const url = new URL(trimmed);
    if (url.protocol === 'http:' || url.protocol === 'https:') {
      return url.href;
    }
  } catch (e) {
    // Not a valid URL, try to construct one
  }
  
  // If no protocol, add https://
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    return `https://${trimmed}`;
  }
  
  return trimmed;
};

// CONVERTED: Parse CSV for URLs (instead of YouTube video IDs)
const parseCSVForURLs = (csvText) => {
  const urls = [];
  const lines = csvText.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
  
  if (lines.length === 0) return urls;
  
  // URL patterns (any valid URL)
  const urlPattern = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
  
  debug(`📝 Processing ${lines.length} CSV lines for URLs`);
  
  lines.forEach((line, lineIndex) => {
    debug(`📝 Line ${lineIndex + 1}:`, line.substring(0, 150) + (line.length > 150 ? '...' : ''));
    
    // Parse CSV row properly (handles quotes and commas)
    const fields = parseCSVRow(line);
    
    // Also try simple comma split as fallback
    const simpleFields = line.split(',').map(f => f.trim().replace(/^["']|["']$/g, ''));
    
    // Also try tab split for TSV files
    const tabFields = line.split('\t').map(f => f.trim().replace(/^["']|["']$/g, ''));
    
    // Combine all methods
    const allFields = [...new Set([...fields, ...simpleFields, ...tabFields, line])];
    
    // Search each field for URLs
    allFields.forEach(field => {
      if (!field || field.length < 10) return;
      
      // Find URLs using regex
      let match;
      urlPattern.lastIndex = 0;
      while ((match = urlPattern.exec(field)) !== null) {
        const url = match[0];
        if (isValidURL(url)) {
          urls.push(url);
          debug(`✅ Found URL: ${url}`);
        }
      }
      
      // Also try to extract domain names and construct URLs
      const domainPattern = /\b([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}\b/g;
      let domainMatch;
      while ((domainMatch = domainPattern.exec(field)) !== null) {
        const domain = domainMatch[0];
        if (!urls.some(u => u.includes(domain))) {
          const constructedUrl = `https://${domain}`;
          if (isValidURL(constructedUrl)) {
            urls.push(constructedUrl);
            debug(`✅ Constructed URL: ${constructedUrl}`);
          }
        }
      }
    });
  });
  
  const uniqueUrls = Array.from(new Set(urls));
  debug(`🎯 Total unique URLs found: ${uniqueUrls.length}`);
  return uniqueUrls;
};

// Enhanced CSV row parsing
const parseCSVRow = (row) => {
  const fields = [];
  let currentField = '';
  let inQuotes = false;
  let i = 0;
  
  while (i < row.length) {
    const char = row[i];
    
    if (char === '"') {
      if (inQuotes && i + 1 < row.length && row[i + 1] === '"') {
        currentField += '"';
        i += 2;
      } else {
        inQuotes = !inQuotes;
        i++;
      }
    } else if (char === ',' && !inQuotes) {
      fields.push(currentField.trim());
      currentField = '';
      i++;
    } else {
      currentField += char;
      i++;
    }
  }
  
  if (currentField || fields.length > 0) {
    fields.push(currentField.trim());
  }
  
  return fields;
};

// URL validation
const isValidURL = (url) => {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch (e) {
    return false;
  }
};

export default function BatchJobs() {
  const navigate = useNavigate();
  const { token, isAuthenticated, _user } = useAuth();
  const { tier, refreshSubscriptionStatus, subscriptionStatus } = useSubscription();

  const [urlsText, setUrlsText] = useState('');
  const [parsedUrls, setParsedUrls] = useState([]);
  
  // CONVERTED: Screenshot configuration (instead of download type)
  const [screenshotWidth, setScreenshotWidth] = useState(1920);
  const [screenshotHeight, setScreenshotHeight] = useState(1080);
  const [screenshotFormat, setScreenshotFormat] = useState('png');
  const [fullPage, setFullPage] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [stubMode, setStubMode] = useState(BATCH_STUB_MODE_DEFAULT);
  const [currentJobId, setCurrentJobId] = useState(null);
  
  // Modal states
  const [screenshotModal, setScreenshotModal] = useState({
    isOpen: false,
    screenshot: null
  });

  const timersRef = useRef([]);
  const pollIntervalRef = useRef(null);
  const fileInputRef = useRef(null);

  const canUseBatch = tier === 'pro' || tier === 'business' || tier === 'premium';
  const isPro = tier === 'pro';

  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
  }, [isAuthenticated, navigate]);

  // CONVERTED: Parse URLs from text input
  useEffect(() => {
    const urls = (urlsText || '')
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean)
      .map(extractURL)
      .filter((url) => isValidURL(url));
    setParsedUrls(Array.from(new Set(urls))); // de-dupe
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
          const res = await fetch(`${API_BASE_URL}/api/v1/batch/jobs/${currentJobId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          
          if (res.ok) {
            const jobData = await res.json();
            const items = (jobData.items || []).map((item) => ({
              id: `${jobData.id}_${item.idx}`,
              url: item.url,
              status: item.status === 'completed' ? 'done' : item.status,
              progress: item.status === 'completed' ? 100 : 
                       item.status === 'processing' ? 75 : 
                       item.status === 'queued' ? 25 : 0,
              screenshot_url: item.screenshot_url,
              fileSize: item.file_size,
              dimensions: item.width && item.height ? `${item.width}x${item.height}` : null,
              message: item.message,
            }));
            
            setJobs(items);
            
            // Stop polling if all items are complete or failed
            const allComplete = items.every(item => 
              item.status === 'done' || item.status === 'completed' || item.status === 'failed'
            );
            
            if (allComplete) {
              clearInterval(pollIntervalRef.current);
              setCurrentJobId(null);
              if (refreshSubscriptionStatus) {
                refreshSubscriptionStatus();
              }
            }
          }
        } catch (error) {
          console.error('Error polling job status:', error);
        }
      }, 3000); // Poll every 3 seconds

      return () => {
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
        }
      };
    }
  }, [currentJobId, stubMode, token, refreshSubscriptionStatus]);

  const handleViewScreenshot = (job) => {
    setScreenshotModal({
      isOpen: true,
      screenshot: job
    });
  };

  // CONVERTED: CSV upload handler for URLs
  const handleCsvUpload = async (file) => {
    if (!file) return;
    
    try {
      debug('📁 Reading file:', file.name, `(${file.size} bytes, type: ${file.type})`);
      const text = await file.text();
      debug('📄 File content preview:', text.substring(0, 500) + (text.length > 500 ? '...' : ''));
      
      const isCSV = file.name.toLowerCase().endsWith('.csv') || file.type === 'text/csv';
      const isTXT = file.name.toLowerCase().endsWith('.txt') || file.type === 'text/plain';
      const isTSV = file.name.toLowerCase().endsWith('.tsv') || file.type === 'text/tab-separated-values';
      
      if (!isCSV && !isTXT && !isTSV) {
        toast.error('❌ Please upload a CSV, TXT, or TSV file containing website URLs');
        return;
      }

      const foundUrls = parseCSVForURLs(text);
      
      if (foundUrls.length === 0) {
        toast.error('❌ No valid URLs found in file. Make sure URLs are in format: https://example.com');
        return;
      }
      
      const uniqueUrls = Array.from(new Set(foundUrls));
      
      // Merge with existing URLs
      const existingUrls = urlsText ? urlsText.split(/\r?\n/).filter(Boolean) : [];
      const combinedUrls = [...existingUrls, ...uniqueUrls];
      const allUniqueUrls = Array.from(new Set(combinedUrls));
      
      setUrlsText(allUniqueUrls.join('\n'));
      toast.success(`✅ Successfully imported ${uniqueUrls.length} URLs from ${file.name}`);
      
      debug(`🎯 File Import Summary: Found ${uniqueUrls.length} valid URLs`);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
    } catch (error) {
      console.error('File upload error:', error);
      toast.error('❌ Failed to read file. Please check the file format and try again.');
    }
  };

  const simulateProgress = (items) => {
    const nextJobs = items.map((url, idx) => ({
      id: `${Date.now()}_${idx}`,
      url: url,
      status: 'queued',
      progress: 0,
      screenshot_url: null,
      message: 'Waiting to process...',
    }));
    setJobs(nextJobs);

    nextJobs.forEach((job, i) => {
      const delay = 400 + i * 200;
      setTimeout(() => {
        setJobs((j) => j.map((x) => (x.id === job.id ? { 
          ...x, 
          status: 'processing', 
          message: 'Capturing screenshot...',
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
                return { 
                  ...x, 
                  progress: 100, 
                  status: 'done',
                  message: 'Screenshot ready',
                  screenshot_url: `https://via.placeholder.com/${screenshotWidth}x${screenshotHeight}.${screenshotFormat}`,
                  dimensions: `${screenshotWidth}x${screenshotHeight}`,
                  fileSize: Math.floor(Math.random() * 500000) + 100000
                };
              } else {
                return { ...x, progress: np, status: 'processing' };
              }
            })
          );
        }, 600);
        
        timersRef.current.push(timer);
        
        setTimeout(() => {
          clearInterval(timer);
          setJobs((j) => j.map((x) => (x.id === job.id ? { 
            ...x, 
            progress: 100, 
            status: 'done',
            message: 'Screenshot ready',
          } : x)));
        }, 6000 + Math.random() * 3000);
      }, delay);
    });
  };

  // Usage limit checking
  const checkUsageLimits = (itemCount) => {
    if (tier === 'business' || tier === 'premium') return { canProceed: true };
    
    const usage = subscriptionStatus?.usage || {};
    const limits = subscriptionStatus?.limits || {};
    
    const screenshotsUsed = usage.screenshots || 0;
    const screenshotsLimit = limits.screenshots || 0;
    const remaining = Math.max(0, screenshotsLimit - screenshotsUsed);
    
    if (remaining < itemCount) {
      return {
        canProceed: false,
        message: `Insufficient screenshots remaining. You have ${remaining} remaining, but requested ${itemCount}.`,
        upgradeMessage: 'Upgrade to Business or Premium for more screenshots.'
      };
    }
    
    return { canProceed: true };
  };

  // Usage Limit Warning Component
  const UsageLimitWarning = () => {
    if (tier === 'business' || tier === 'premium' || parsedUrls.length === 0) return null;
    
    const itemCount = isPro ? Math.min(parsedUrls.length, PRO_MAX_LINKS) : parsedUrls.length;
    const usageCheck = checkUsageLimits(itemCount);
    
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
              <h3 className="text-sm font-medium text-red-800">Usage Limit Exceeded</h3>
              <div className="mt-2 text-sm text-red-700">{usageCheck.message}</div>
              {usageCheck.upgradeMessage && (
                <div className="mt-2 text-sm text-red-700 font-medium">{usageCheck.upgradeMessage}</div>
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
    
    return null;
  };

  // CONVERTED: Start batch screenshot processing
  const startBatch = async () => {
    if (!canUseBatch) return toast('Upgrade to Pro to use Batch Jobs.');
    if (parsedUrls.length === 0) return toast.error('Add at least one website URL.');

    let toSubmit = [...parsedUrls];
    if (isPro && parsedUrls.length > PRO_MAX_LINKS) {
      toSubmit = parsedUrls.slice(0, PRO_MAX_LINKS);
      toast(`Pro plan allows up to ${PRO_MAX_LINKS} URLs per batch — submitting the first ${PRO_MAX_LINKS}.`);
    }

    const usageCheck = checkUsageLimits(toSubmit.length);
    if (!usageCheck.canProceed) {
      toast.error(usageCheck.message);
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        urls: toSubmit,
        width: screenshotWidth,
        height: screenshotHeight,
        format: screenshotFormat,
        full_page: fullPage
      };

      const res = await fetch(`${API_BASE_URL}/api/v1/batch/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Backend not ready');
      
      const data = await res.json();
      
      const items = (data.items || []).map((item) => ({
        id: `${data.id}_${item.idx}`,
        url: item.url,
        status: item.status === 'completed' ? 'done' : item.status,
        progress: item.status === 'completed' ? 100 : 
                 item.status === 'processing' ? 50 : 
                 item.status === 'queued' ? 10 : 0,
        screenshot_url: item.screenshot_url,
        fileSize: item.file_size,
        dimensions: item.width && item.height ? `${item.width}x${item.height}` : null,
        message: item.message || (item.status === 'queued' ? 'Waiting to process...' : ''),
      }));

      setStubMode(false);
      setJobs(items);
      setCurrentJobId(data.id);
      toast.success(`Batch submitted with ${data.total} URLs`);

    } catch (e) {
      console.error('Batch submission error:', e);
      setStubMode(true);
      simulateProgress(toSubmit);
      toast('Backend batch endpoint not ready — running in stub mode.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearAll = () => {
    setUrlsText('');
    setParsedUrls([]);
    setJobs([]);
    setCurrentJobId(null);
    setScreenshotModal({ isOpen: false, screenshot: null });
    timersRef.current.forEach((t) => clearInterval(t));
    timersRef.current = [];
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getDisabledStatus = () => {
    if (!canUseBatch || parsedUrls.length === 0 || isSubmitting) return true;
    
    const itemCount = isPro ? Math.min(parsedUrls.length, PRO_MAX_LINKS) : parsedUrls.length;
    const usageCheck = checkUsageLimits(itemCount);
    
    return !usageCheck.canProceed;
  };

  const disabled = getDisabledStatus();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">

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
          <div className="flex justify-center items-center mb-4">
            <div className="text-6xl">📸</div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">⚙️ Batch Screenshot Jobs</h1>
          <p className="text-sm text-gray-600 mb-3">
            Capture screenshots of multiple websites at once. Process up to {PRO_MAX_LINKS} URLs per batch.
          </p>

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

          {!canUseBatch && (
            <div className="text-xs text-red-700 bg-red-50 border border-red-200 px-3 py-2 rounded inline-block">
              Batch Jobs are available on <b>Pro</b>, <b>Business</b>, and <b>Premium</b> plans.
            </div>
          )}
          {isPro && (
            <div className="text-xs text-gray-500">Pro: up to {PRO_MAX_LINKS} URLs per batch.</div>
          )}
        </header>

        {/* Usage Limit Warning */}
        <UsageLimitWarning />

        {/* Screenshot Configuration */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">📐 Screenshot Configuration</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            {/* Dimensions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Dimensions</label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Width (px)</label>
                  <input
                    type="number"
                    value={screenshotWidth}
                    onChange={(e) => setScreenshotWidth(parseInt(e.target.value) || 1920)}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    min="320"
                    max="3840"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Height (px)</label>
                  <input
                    type="number"
                    value={screenshotHeight}
                    onChange={(e) => setScreenshotHeight(parseInt(e.target.value) || 1080)}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    min="240"
                    max="2160"
                  />
                </div>
              </div>
              
              {/* Quick Presets */}
              <div className="mt-3 flex gap-2 flex-wrap">
                <button
                  onClick={() => { setScreenshotWidth(1920); setScreenshotHeight(1080); }}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs"
                >
                  Desktop (1920x1080)
                </button>
                <button
                  onClick={() => { setScreenshotWidth(1366); setScreenshotHeight(768); }}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs"
                >
                  Laptop (1366x768)
                </button>
                <button
                  onClick={() => { setScreenshotWidth(375); setScreenshotHeight(667); }}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs"
                >
                  Mobile (375x667)
                </button>
              </div>
            </div>

            {/* Format & Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
              <select
                value={screenshotFormat}
                onChange={(e) => setScreenshotFormat(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
              >
                <option value="png">PNG (lossless)</option>
                <option value="jpeg">JPEG (smaller file size)</option>
                <option value="webp">WebP (best compression)</option>
              </select>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={fullPage}
                  onChange={(e) => setFullPage(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">Capture full page (scrolling)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Input panel */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website URLs (one per line)
              </label>
              <textarea
                rows={10}
                value={urlsText}
                onChange={(e) => setUrlsText(e.target.value)}
                placeholder="https://example.com&#10;https://google.com&#10;https://github.com"
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm resize-none"
                disabled={isSubmitting}
              />
              <div className="mt-2 text-xs text-gray-600">
                Parsed: <span className="font-semibold">{parsedUrls.length}</span> URL(s)
                {isPro && parsedUrls.length > PRO_MAX_LINKS && (
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
                  Upload any text file containing website URLs. Supports CSV, TXT, TSV formats.
                </p>
                <p className="mt-1 text-xs text-blue-600">
                  We'll automatically detect URLs in any column or format.
                </p>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={startBatch}
                  disabled={disabled}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                    disabled 
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isSubmitting ? '⏳ Starting…' : '📸 Start Batch'}
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
              Screenshot Jobs
            </h2>
          </div>
          
          <div className="p-6">
            {!jobs.length ? (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-2">📸</div>
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
                      <th className="py-3 pr-4 font-medium">Website URL</th>
                      <th className="py-3 pr-4 font-medium">Status</th>
                      <th className="py-3 pr-4 font-medium">Progress</th>
                      <th className="py-3 pr-4 font-medium">Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.map((job, idx) => (
                      <tr key={job.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                        <td className="py-4 pr-4 text-gray-900">{idx + 1}</td>
                        <td className="py-4 pr-4 font-mono text-xs text-gray-900 max-w-xs truncate" title={job.url}>
                          {job.url}
                        </td>
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
                            onViewScreenshot={handleViewScreenshot}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {stubMode && IS_DEVELOPMENT && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="text-xs text-yellow-800">
                      <b>Stub Mode:</b> Simulating batch screenshot processing.
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
          ⚡ Batch screenshot processing • Pro, Business and Premium plans
        </footer>
      </div>

      {/* Screenshot Modal */}
      <ScreenshotModal
        isOpen={screenshotModal.isOpen}
        onClose={() => setScreenshotModal({ isOpen: false, screenshot: null })}
        screenshot={screenshotModal.screenshot}
      />
    </div>
  );
}
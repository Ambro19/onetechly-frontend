// frontend/src/pages/Download.js — Production-ready (limits-aware + helper integration)
// - Still shows subscription limits, next_reset, and handles cloud-only success
// - NEW: If backend responds with needs_local_helper, it will:
//     1) Call the YCD Desktop Helper running on the user's machine
//     2) After success, call /helper/report_usage to keep usage/history in sync
// - YCD Desktop Helper API (expected):
//     POST http://127.0.0.1:17682/ycd-helper/run
//     Body: {
//       type: "transcript" | "audio" | "video",
//       video_id: "XXXXXXXXXXX",
//       clean_transcript?: boolean,
//       format?: "srt" | "vtt" | null,
//       quality?: "high"|"medium"|"low"|"720p"|...,
//     }
//     Response (transcript example):
//       { ok: true, type: "transcript", transcript: "...", format: "txt"|"srt"|"vtt", file_size: 12345 }
//     Response (audio/video example):
//       { ok: true, type: "audio"|"video", download_url: "/files/...", filename: "...", file_size: 123, file_size_mb: 1.2, title, uploader, duration }

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import AppBrand from '../components/AppBrand';
import YcdLogo from '../components/YcdLogo';
import SegmentedRadioGroup from '../components/SegmentedRadioGroup';

const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  process.env.REACT_APP_API_BASE_URL ||
  'http://localhost:8000';

const AUTO_START_DOWNLOAD = true;

// Local helper (desktop app) base URL
const HELPER_BASE_URL =
  process.env.REACT_APP_YCD_HELPER_URL || 'http://127.0.0.1:17682';

const isMobile = () =>
  /android|iphone|ipad|ipod|blackberry|windows phone|mobile/i.test(
    (navigator.userAgent || '').toLowerCase()
  );

export default function DownloadPage() {
  const navigate = useNavigate();
  const { token, user, isAuthenticated, logout } = useAuth();
  const { subscriptionStatus, tier, refreshSubscriptionStatus } = useSubscription();

  const [youtubeInput, setYoutubeInput] = useState('');
  const [downloadType, setDownloadType] = useState('transcript');
  const [transcriptType, setTranscriptType] = useState('clean');
  const [uncleanFormat, setUncleanFormat] = useState('srt');
  const [audioQuality, setAudioQuality] = useState('medium');
  const [videoQuality, setVideoQuality] = useState('720p');

  const [result, setResult] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [videoMetadata, setVideoMetadata] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [videoId, setVideoId] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [downloadCompleted, setDownloadCompleted] = useState(false);
  const [downloadStarted, setDownloadStarted] = useState(false);
  const [isRefreshingSubscription, setIsRefreshingSubscription] = useState(false);

  const autoTriggeredRef = useRef(false);
  const mobileToastShownRef = useRef(false);
  const pollStopRef = useRef(false);

  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (isMobile() && !mobileToastShownRef.current) {
      mobileToastShownRef.current = true;
      toast.success('📱 Mobile device detected – downloads optimized!', { duration: 2200, id: 'mobile-ok' });
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && refreshSubscriptionStatus) {
      refreshSubscriptionStatus().catch(() => {});
    }
  }, [isAuthenticated, refreshSubscriptionStatus]);

  const extractVideoId = (input) => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=)([^&\n?#]+)/,
      /(?:youtu\.be\/)([^&\n?#]+)/,
      /(?:youtube\.com\/embed\/)([^&\n?#]+)/,
      /(?:youtube\.com\/shorts\/)([^&\n?#]+)/,
      /[?&]v=([^&\n?#]+)/,
    ];
    for (const p of patterns) {
      const m = input.match(p);
      if (m && m[1]) return m[1].substring(0, 11);
    }
    return input.trim().substring(0, 11);
  };

  const previewVideoId = extractVideoId(youtubeInput);

  const limits = useMemo(() => subscriptionStatus?.limits || {}, [subscriptionStatus]);
  const usage = useMemo(() => subscriptionStatus?.usage || {}, [subscriptionStatus]);

  const isUnlimited = (limit) => limit === 'unlimited' || limit === Infinity;

  const getUsed = (k) => Number(usage?.[k] ?? 0);
  const getLimit = (k) => limits?.[k];

  const atLimit = (k) => {
    const lim = getLimit(k);
    if (isUnlimited(lim) || lim === undefined || lim === null) return false;
    return getUsed(k) >= Number(lim);
  };

  const actionKey = useMemo(() => {
    if (downloadType === 'transcript') return transcriptType === 'clean' ? 'clean_transcripts' : 'unclean_transcripts';
    if (downloadType === 'audio') return 'audio_downloads';
    if (downloadType === 'video') return 'video_downloads';
    return null;
  }, [downloadType, transcriptType]);

  const safeFormatUsage = (k) => {
    const u = getUsed(k);
    const l = getLimit(k);
    return isUnlimited(l) ? `${u} / ∞` : `${u} / ${l ?? 0}`;
  };

  const getUsageLimitMessage = () => {
    if (!actionKey) return null;
    if (atLimit(actionKey)) {
      const label =
        actionKey === 'clean_transcripts'
          ? 'clean transcripts'
          : actionKey === 'unclean_transcripts'
          ? 'timestamped transcripts'
          : actionKey === 'audio_downloads'
          ? 'audio downloads'
          : actionKey === 'video_downloads'
          ? 'video downloads'
          : 'usage';
      return `Monthly limit reached for ${label}. Please upgrade your plan.`;
    }
    return null;
  };

  const xUiValidId = !!previewVideoId && previewVideoId.length === 11;
  const xUiDisabledReason = () => {
    if (!xUiValidId) return 'Enter a valid YouTube URL or ID';
    if (actionKey && atLimit(actionKey)) return getUsageLimitMessage();
    return '';
  };

  const xUiPrimaryDisabled = isLoading || !xUiValidId || (actionKey && atLimit(actionKey));

  const updateMediaPlayerTitle = (data) => {
    try {
      document.title = `${data.title || 'Unknown Title'} - ${data.uploader || 'Unknown Channel'}`;
      if ('mediaSession' in navigator && 'MediaMetadata' in window) {
        navigator.mediaSession.metadata = new window.MediaMetadata({
          title: data.title || 'Unknown Title',
          artist: data.uploader || 'Unknown Channel',
          album: 'YouTube Content',
        });
      }
    } catch {}
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      toast.success('👋 Logged out successfully!');
      navigate('/login');
    }
  };

  const copyToClipboard = async (text) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        toast.success('📋 Copied to clipboard!');
        return;
      }
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      toast.success('📋 Copied to clipboard!');
    } catch {
      toast.error('Copy failed. Please copy manually.');
    }
  };

  const formatResetDate = useCallback(() => {
    if (!subscriptionStatus?.next_reset) return null;
    const d = new Date(subscriptionStatus.next_reset);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }, [subscriptionStatus]);

  const pollUsageSync = useCallback(
    async (beforeUsageMap, keyToObserve) => {
      const maxTries = 6;
      let tries = 0;

      while (tries < maxTries && !pollStopRef.current) {
        tries += 1;
        try {
          await refreshSubscriptionStatus();
        } catch {}
        await new Promise((res) => setTimeout(res, 400));

        const currentUsed = getUsed(keyToObserve);
        const beforeUsed = Number(beforeUsageMap?.[keyToObserve] ?? 0);

        if (currentUsed > beforeUsed) {
          return true;
        }
      }
      return false;
    },
    [refreshSubscriptionStatus]
  );

  // Report usage to backend when helper completes a download
  const reportHelperUsage = useCallback(
    async ({ usageType, youtubeId, fileFormat, quality, fileSize, processingTime }) => {
      try {
        if (!usageType) return;
        const res = await fetch(`${API_BASE_URL}/helper/report_usage`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            youtube_id: youtubeId,
            usage_type: usageType,
            file_format: fileFormat,
            quality,
            file_size: fileSize,
            processing_time: processingTime,
          }),
        });
        if (!res.ok) {
          const e = await res.json().catch(() => ({}));
          console.warn('[YCD helper] usage report failed:', e.detail || res.status);
        }
      } catch (err) {
        console.warn('[YCD helper] usage report error:', err);
      }
    },
    [token]
  );

  // Run download via local YCD Desktop Helper when backend returns needs_local_helper
  const runWithHelper = useCallback(
    async (helperEnvelope, beforeUsage) => {
      const helperTask = helperEnvelope?.helper_task || {};
      const baseUsageType = helperEnvelope?.usage_type || actionKey;

      const videoIdFromTask = helperTask.youtube_id || helperTask.video_id || extractVideoId(youtubeInput);
      const typeFromTask = helperTask.type || downloadType;

      if (!videoIdFromTask || videoIdFromTask.length !== 11) {
        throw new Error('Desktop helper task is missing a valid YouTube video ID.');
      }

      const effectiveUsageType =
        baseUsageType ||
        (typeFromTask === 'transcript'
          ? transcriptType === 'clean'
            ? 'clean_transcripts'
            : 'unclean_transcripts'
          : typeFromTask === 'audio'
          ? 'audio_downloads'
          : typeFromTask === 'video'
          ? 'video_downloads'
          : null);

      const payload = {
        type: typeFromTask,
        video_id: videoIdFromTask,
        clean_transcript:
          typeFromTask === 'transcript'
            ? helperTask.clean_transcript ?? (transcriptType === 'clean')
            : undefined,
        format:
          typeFromTask === 'transcript'
            ? helperTask.format ?? (transcriptType === 'unclean' ? uncleanFormat : null)
            : undefined,
        quality:
          typeFromTask === 'audio'
            ? helperTask.quality ?? audioQuality
            : typeFromTask === 'video'
            ? helperTask.quality ?? videoQuality
            : undefined,
      };

      const helperUrl = `${HELPER_BASE_URL}/ycd-helper/run`;

      let helperData;
      try {
        const res = await fetch(helperUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          throw new Error(
            'YCD Desktop Helper is not running or refused the request. Please ensure it is installed and running.'
          );
        }

        helperData = await res.json().catch(() => ({}));
      } catch (err) {
        console.error('[YCD helper] request failed:', err);
        throw new Error(
          'Could not reach the YCD Desktop Helper. Please make sure it is installed and running on your device.'
        );
      }

      if (!helperData) {
        throw new Error('YCD Desktop Helper returned an empty response.');
      }

      const okFlag =
        helperData.ok === true ||
        !!helperData.transcript ||
        !!helperData.download_url ||
        !!helperData.direct_download_url;

      if (!okFlag) {
        throw new Error(helperData.error || 'YCD Desktop Helper failed to process this video.');
      }

      // ----- Transcript via helper -----
      if (typeFromTask === 'transcript') {
        const text = helperData.transcript || '';
        if (!text) {
          throw new Error('YCD Desktop Helper did not return any transcript.');
        }

        setVideoId(videoIdFromTask);
        setResult(text);
        setDownloadCompleted(true);
        toast.success('📄 Transcript ready (via desktop helper)');

        await reportHelperUsage({
          usageType: effectiveUsageType,
          youtubeId: videoIdFromTask,
          fileFormat:
            helperData.format ||
            (payload.format || (payload.clean_transcript ? 'txt' : 'txt')),
          quality: 'default',
          fileSize: helperData.file_size || text.length,
          processingTime: helperData.processing_time || 0,
        });

        if (effectiveUsageType) {
          await pollUsageSync(beforeUsage, effectiveUsageType);
        }

        return;
      }

      // ----- Audio / Video via helper -----
      if (typeFromTask === 'audio' || typeFromTask === 'video') {
        const downloadUrlLocal =
          helperData.direct_download_url || helperData.download_url || '';
        if (!downloadUrlLocal) {
          throw new Error('YCD Desktop Helper did not provide a download URL.');
        }

        const href =
          downloadUrlLocal.startsWith('http') || downloadUrlLocal.startsWith('https')
            ? downloadUrlLocal
            : `${HELPER_BASE_URL}${downloadUrlLocal.startsWith('/') ? '' : '/'}${downloadUrlLocal}`;

        const meta = {
          title: helperData.title || 'Unknown Title',
          uploader: helperData.uploader || 'Unknown Channel',
          duration: helperData.duration || 0,
          filename: helperData.filename,
          fileSize: helperData.file_size_mb,
          youtubeId: videoIdFromTask,
        };

        setVideoId(videoIdFromTask);
        setDownloadUrl(href);
        setVideoMetadata(meta);
        setDownloadCompleted(true);

        if (typeFromTask === 'audio') {
          updateMediaPlayerTitle(helperData);
        }

        if (AUTO_START_DOWNLOAD && href && !autoTriggeredRef.current) {
          autoTriggeredRef.current = true;
          try {
            if (isMobile()) {
              window.open(href, '_blank', 'noopener');
            } else {
              const a = document.createElement('a');
              a.href = href;
              a.download = meta.filename || '';
              a.rel = 'noopener';
              a.target = '_self';
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
            }
            setDownloadStarted(true);
            setSuccessMessage('Successfully Downloaded');
            toast.success('💾 File download started (via desktop helper)');
          } catch (err) {
            console.error('[YCD helper] auto-start download failed:', err);
          }
        }

        await reportHelperUsage({
          usageType: effectiveUsageType,
          youtubeId: videoIdFromTask,
          fileFormat: typeFromTask === 'audio' ? 'mp3' : 'mp4',
          quality: payload.quality,
          fileSize: helperData.file_size || 0,
          processingTime: helperData.processing_time || 0,
        });

        if (effectiveUsageType) {
          await pollUsageSync(
            beforeUsage,
            effectiveUsageType === 'audio_downloads' || effectiveUsageType === 'video_downloads'
              ? effectiveUsageType
              : typeFromTask === 'audio'
              ? 'audio_downloads'
              : 'video_downloads'
          );
        }

        return;
      }

      throw new Error('Unsupported helper task type.');
    },
    [
      actionKey,
      audioQuality,
      downloadType,
      pollUsageSync,
      reportHelperUsage,
      transcriptType,
      uncleanFormat,
      videoQuality,
      youtubeInput,
    ]
  );

  const handleTranscriptDownload = async () => {
    if (!result) return toast.error('No transcript available');
    try {
      const ext = transcriptType === 'unclean' ? uncleanFormat : 'txt';
      const blob = new Blob([result], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transcript_${videoId}_${transcriptType}.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('💾 Transcript downloaded!');
    } catch {
      toast.error('Transcript download failed');
    }
  };

  const handleDownload = async () => {
    try {
      setIsLoading(true);
      setError('');
      setResult('');
      setDownloadUrl('');
      setSuccessMessage('');
      setVideoMetadata(null);
      setDownloadCompleted(false);
      setDownloadStarted(false);
      autoTriggeredRef.current = false;
      pollStopRef.current = false;

      const id = extractVideoId(youtubeInput);
      setVideoId(id);
      if (!id || id.length !== 11) throw new Error('Please enter a valid YouTube video ID or URL');

      let endpoint, payload;

      if (downloadType === 'transcript') {
        endpoint = '/download_transcript/';
        payload = {
          youtube_id: id,
          clean_transcript: transcriptType === 'clean',
          format: transcriptType === 'unclean' ? uncleanFormat : null,
        };
      } else if (downloadType === 'audio') {
        endpoint = '/download_audio/';
        payload = { youtube_id: id, quality: audioQuality };
      } else {
        endpoint = '/download_video/';
        payload = { youtube_id: id, quality: videoQuality };
      }

      const beforeUsage = {
        clean_transcripts: getUsed('clean_transcripts'),
        unclean_transcripts: getUsed('unclean_transcripts'),
        audio_downloads: getUsed('audio_downloads'),
        video_downloads: getUsed('video_downloads'),
      };

      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      // If backend says "use local helper", we do that and return early
      if (res.ok && data && data.needs_local_helper) {
        toast('Using YCD Desktop Helper for this video (YouTube is blocking our servers).', {
          icon: '🖥️',
        });
        await runWithHelper(data, beforeUsage);
        return;
      }

      if (!res.ok) {
        const message = data.detail || `${downloadType} download failed`;
        throw new Error(message);
      }

      // Normal cloud-success path
      if (downloadType === 'transcript') {
        setResult(data.transcript || '');
        setDownloadCompleted(true);
        toast.success('📄 Transcript ready');

        await pollUsageSync(
          beforeUsage,
          transcriptType === 'clean' ? 'clean_transcripts' : 'unclean_transcripts'
        );
      } else {
        setDownloadUrl(data.direct_download_url || '');
        const meta = {
          title: data.title || 'Unknown Title',
          uploader: data.uploader || 'Unknown Channel',
          duration: data.duration || 0,
          filename: data.filename,
          fileSize: data.file_size_mb,
          youtubeId: data.youtube_id,
        };
        setVideoMetadata(meta);
        setDownloadCompleted(true);

        if (downloadType === 'audio') updateMediaPlayerTitle(data);

        if (AUTO_START_DOWNLOAD && data.direct_download_url && !autoTriggeredRef.current) {
          autoTriggeredRef.current = true;
          try {
            const href = data.direct_download_url.startsWith('http')
              ? data.direct_download_url
              : `${API_BASE_URL}${data.direct_download_url}`;
            if (isMobile()) {
              window.open(href, '_blank', 'noopener');
            } else {
              const a = document.createElement('a');
              a.href = href;
              a.download = meta.filename || '';
              a.rel = 'noopener';
              a.target = '_self';
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
            }
            setDownloadStarted(true);
            setSuccessMessage('Successfully Downloaded');
            toast.success('💾 File download started');
          } catch {}
        }

        await pollUsageSync(
          beforeUsage,
          downloadType === 'audio' ? 'audio_downloads' : 'video_downloads'
        );
      }
    } catch (err) {
      console.error('Download error', err); // 👈 add this line
      const msg = err?.message || 'Operation failed';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
      try {
        await refreshSubscriptionStatus();
      } catch {}
    }
  };

  const renderTranscript = () => {
    if (!result || downloadType !== 'transcript') return null;

    if (transcriptType === 'clean') {
      const paragraphs = result.split('\n\n').filter((p) => p.trim());
      return (
        <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg overflow-auto max-h-96 text-sm leading-relaxed">
          {paragraphs.map((p, i) => (
            <p key={i} className="mb-3 text-gray-800">
              {p}
            </p>
          ))}
        </div>
      );
    }

    const lines = result.split('\n').filter((l) => l.trim());
    const isVTT = result.startsWith('WEBVTT');
    const isSRT = lines.some((l) => /^\d+$/.test(l)) && lines.some((l) => l.includes('-->'));

    if (isVTT) {
      return (
        <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg overflow-auto max-h-96 text-sm font-mono">
          <div className="mb-2 text-blue-600 font-semibold">🎬 WEBVTT Format</div>
          {lines.map((line, idx) => {
            if (line.startsWith('WEBVTT') || line.startsWith('Kind:') || line.startsWith('Language:')) {
              return (
                <div key={idx} className="text-purple-600 font-semibold">
                  {line}
                </div>
              );
            } else if (line.includes('-->')) {
              return (
                <div key={idx} className="text-blue-600 font-semibold mt-2">
                  {line}
                </div>
              );
            } else if (line.trim()) {
              return (
                <div key={idx} className="text-gray-800 mb-1">
                  {line}
                </div>
              );
            }
            return null;
          })}
        </div>
      );
    }

    if (isSRT) {
      const blocks = [];
      let current = {};
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (/^\d+$/.test(line)) continue;
        if (line.includes('-->')) {
          const start = line.split('-->')[0].trim();
          const m = start.match(/(\d{2}):(\d{2}):(\d{2})/);
          if (m) {
            const hours = parseInt(m[1], 10);
            const minutes = parseInt(m[2], 10);
            const seconds = parseInt(m[3], 10);
            const totalMinutes = hours * 60 + minutes;
            current.timestamp = `[${totalMinutes.toString().padStart(2, '0')}:${seconds
              .toString()
              .padStart(2, '0')}]`;
          }
          continue;
        }
        if (line.trim() && current.timestamp) {
          current.text = line;
          blocks.push({ ...current });
          current = {};
        }
      }
      return (
        <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg overflow-auto max-h-96 text-sm font-mono">
          <div className="mb-2 text-blue-600 font-semibold">🎬 SRT Format</div>
          <div className="grid grid-cols-[80px_1fr] gap-x-4">
            {blocks.map((b, i) => (
              <React.Fragment key={i}>
                <div className="text-blue-600 font-semibold">{b.timestamp}</div>
                <div className="text-gray-800">{b.text}</div>
              </React.Fragment>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg overflow-auto max-h-96 text-sm font-mono">
        <div className="mb-2 text-green-600 font-semibold">🕒 Timestamped Format</div>
        <div className="grid grid-cols-[80px_1fr] gap-x-4">
          {result
            .split('\n')
            .filter(Boolean)
            .map((line, idx) => {
              const m = line.match(/^\[(\d{2}:\d{2})\] (.+)$/);
              return m ? (
                <React.Fragment key={idx}>
                  <div className="text-gray-500 font-semibold">[{m[1]}]</div>
                  <div className="text-gray-800">{m[2]}</div>
                </React.Fragment>
              ) : (
                <div key={idx} className="col-span-2 text-gray-800">
                  {line}
                </div>
              );
            })}
        </div>
      </div>
    );
  };

  const renderAVResult = () => {
    if (downloadType === 'transcript' || !downloadUrl) return null;

    const statusPill = (
      <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
        {downloadStarted ? '✅ Successfully Downloaded' : '✅ Processed'}
      </div>
    );

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="text-center mb-4">
          <div className="text-6xl mb-3">{downloadType === 'audio' ? '🎵' : '🎬'}</div>
          <div className="text-xl font-semibold text-gray-800 mb-2">
            {downloadType === 'audio' ? 'Audio' : 'Video'} Ready
          </div>
          <div className="text-sm text-gray-600 mb-4">
            Quality: {downloadType === 'audio' ? audioQuality : videoQuality} • Video ID: {videoId}
          </div>
          {downloadCompleted && statusPill}
        </div>

        {videoMetadata && (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg mt-4 border border-green-200">
            <div className="font-semibold text-gray-800 mb-1">✅ File Prepared</div>
            <div className="text-sm text-gray-800">Title: {videoMetadata.title}</div>
            <div className="text-sm text-gray-800">Channel: {videoMetadata.uploader}</div>
            <div className="text-sm text-gray-800">
              File: {videoMetadata.filename} ({videoMetadata.fileSize} MB)
            </div>
          </div>
        )}
      </div>
    );
  };

  const audioAtLimit = atLimit('audio_downloads');
  const videoAtLimit = atLimit('video_downloads');
  const timestampedAtLimit = atLimit('unclean_transcripts');

  const primaryBtnClass = `flex-1 py-3 px-6 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
    xUiPrimaryDisabled
      ? 'bg-gray-300 text-gray-600 cursor-not-allowed opacity-70'
      : downloadType === 'transcript'
      ? 'bg-blue-600 enabled:hover:bg-blue-700 text-white focus:ring-blue-500'
      : downloadType === 'audio'
      ? 'bg-green-600 enabled:hover:bg-green-700 text-white focus:ring-green-500'
      : 'bg-purple-600 enabled:hover:bg-purple-700 text-white focus:ring-purple-500'
  }`;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Brand header */}
        <div className="mb-6">
          <AppBrand
            size={32}
            showText={true}
            label="OneTechly — YCD"
            logoSrc="/logo_onetechly.png"
            to="/app/dashboard"
          />
        </div>

        {/* Center header */}
        <div className="text-center mb-6">
          <div className="flex justify-center items-center mb-4">
            <YcdLogo size={56} />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">📺 Download YouTube Content</h1>
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
          {successMessage && (
            <span className="sr-only" aria-live="polite">
              {successMessage}
            </span>
          )}

          {/* Usage status card */}
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
                      : 'bg-purple-100 text-purple-800'
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

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 text-xs">
              <div>📄 Clean: {safeFormatUsage('clean_transcripts')}</div>
              <div>🕒 Timestamped: {safeFormatUsage('unclean_transcripts')}</div>
              <div>🎵 Audio: {safeFormatUsage('audio_downloads')}</div>
              <div>🎬 Video: {safeFormatUsage('video_downloads')}</div>
            </div>
            {subscriptionStatus?.next_reset && (
              <div className="mt-1 text-xs text-gray-500">Resets {formatResetDate()}</div>
            )}
          </div>
        </div>

        {/* Working examples */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 shadow-sm">
          <h3 className="text-green-800 font-semibold mb-2">✅ Try These Working Examples:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="font-medium text-green-700">Rick Astley - Never Gonna Give You Up</div>
              <div className="text-green-600">🎵🎬 Perfect for testing ALL features</div>
              <div className="text-xs text-green-500 font-mono">dQw4w9WgXcQ</div>
            </div>
            <div>
              <div className="font-medium text-green-700">Me at the zoo</div>
              <div className="text-green-600">📺 First YouTube video ever</div>
              <div className="text-xs text-green-500 font-mono">jNQXAC9IVRw</div>
            </div>
          </div>
        </div>

        {/* YouTube input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter YouTube Video ID or URL:
          </label>
          <input
            type="text"
            placeholder="Paste YouTube URL or ID"
            value={youtubeInput}
            onChange={(e) => setYoutubeInput(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        {previewVideoId && previewVideoId.length === 11 && (
          <div className="bg-green-50 border border-green-200 rounded p-2 mb-4">
            <span className="text-green-700 text-sm">✅ Video ID detected: </span>
            <span className="font-bold text-green-800">{previewVideoId}</span>
          </div>
        )}

        {/* Download Type Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <label
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
              downloadType === 'transcript'
                ? 'border-blue-500 bg-blue-50 shadow-sm'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <input
              type="radio"
              value="transcript"
              checked={downloadType === 'transcript'}
              onChange={() => setDownloadType('transcript')}
              className="mr-2"
            />
            <div className="font-bold text-gray-900">📄 Transcript</div>
            <div className="text-sm text-gray-600">Text transcription</div>
          </label>

          <label
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
              downloadType === 'audio'
                ? 'border-green-500 bg-green-50 shadow-sm'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <input
              type="radio"
              value="audio"
              checked={downloadType === 'audio'}
              onChange={() => setDownloadType('audio')}
              className="mr-2"
            />
            <div className="font-bold text-gray-900">🎵 Audio</div>
            <div className="text-sm text-gray-600">Extract MP3</div>
          </label>

          <label
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
              downloadType === 'video'
                ? 'border-purple-500 bg-purple-50 shadow-sm'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <input
              type="radio"
              value="video"
              checked={downloadType === 'video'}
              onChange={() => setDownloadType('video')}
              className="mr-2"
            />
            <div className="font-bold text-gray-900">🎬 Video</div>
            <div className="text-sm text-gray-600">Download MP4</div>
          </label>
        </div>

        {/* Transcript Options */}
        {downloadType === 'transcript' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <label
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                transcriptType === 'clean'
                  ? 'border-blue-500 bg-blue-50 shadow-sm'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                value="clean"
                checked={transcriptType === 'clean'}
                onChange={() => setTranscriptType('clean')}
                className="mr-2"
              />
              <div className="font-bold text-gray-900">📄 Clean Format</div>
              <div className="text-sm text-gray-600">Text only (no timestamps)</div>
              <div className="text-xs text-blue-600 mt-1">
                Usage: {safeFormatUsage('clean_transcripts')}
              </div>
            </label>

            <label
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                transcriptType === 'unclean'
                  ? 'border-blue-500 bg-blue-50 shadow-sm'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                value="unclean"
                checked={transcriptType === 'unclean'}
                onChange={() => setTranscriptType('unclean')}
                className="mr-2"
              />
              <div className="font-bold text-gray-900">🕒 Timestamped Format</div>
              <div className="text-sm text-gray-600 mb-2">With timestamps</div>
              <div className="text-xs text-blue-600 mb-2">
                Usage: {safeFormatUsage('unclean_transcripts')}
              </div>

              {transcriptType === 'unclean' && (
                <div
                  className={`pl-4 mt-2 space-y-2 border-l-2 border-blue-200 ${
                    timestampedAtLimit ? 'opacity-50' : ''
                  }`}
                >
                  {['srt', 'vtt'].map((fmt) => (
                    <label
                      key={fmt}
                      className={`flex items-center ${
                        timestampedAtLimit ? 'cursor-not-allowed' : ''
                      }`}
                    >
                      <input
                        type="radio"
                        name="uncleanFormat"
                        value={fmt}
                        checked={uncleanFormat === fmt}
                        onChange={() => setUncleanFormat(fmt)}
                        className="mr-2"
                        disabled={timestampedAtLimit}
                      />
                      <span className="text-red-600 font-medium">{fmt.toUpperCase()} Format</span>
                    </label>
                  ))}
                </div>
              )}
            </label>
          </div>
        )}

        {/* Audio Quality */}
        {downloadType === 'audio' && (
          <div
            className={`bg-green-50 border border-green-200 rounded-lg p-4 mb-6 shadow-sm ${
              audioAtLimit ? 'opacity-50 pointer-events-none' : ''
            }`}
          >
            <SegmentedRadioGroup
              name="audioQuality"
              legend="🎵 Audio Quality"
              options={[
                { value: 'high', label: 'High' },
                { value: 'medium', label: 'Medium' },
                { value: 'low', label: 'Low' },
              ]}
              value={audioQuality}
              onChange={setAudioQuality}
              disabled={audioAtLimit}
              columns={3}
              variant="green"
              className="text-center"
            />
            <div className="text-xs text-green-600 mt-2 text-center">
              Usage: {safeFormatUsage('audio_downloads')}
            </div>
          </div>
        )}

        {/* Video Quality */}
        {downloadType === 'video' && (
          <div
            className={`bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6 shadow-sm ${
              videoAtLimit ? 'opacity-50 pointer-events-none' : ''
            }`}
          >
            <SegmentedRadioGroup
              name="videoQuality"
              legend="🎬 Video Quality"
              options={[
                { value: '1080p', label: '1080p' },
                { value: '720p', label: '720p' },
                { value: '480p', label: '480p' },
                { value: '360p', label: '360p' },
              ]}
              value={videoQuality}
              onChange={setVideoQuality}
              disabled={videoAtLimit}
              columns={4}
              variant="purple"
              className="text-center"
            />
            <div className="text-xs text-purple-600 mt-2 text-center">
              Usage: {safeFormatUsage('video_downloads')}
            </div>
          </div>
        )}

        {/* Errors / usage limit messages */}
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
            onClick={handleDownload}
            disabled={xUiPrimaryDisabled}
            aria-disabled={xUiPrimaryDisabled}
            title={xUiDisabledReason()}
            className={primaryBtnClass}
          >
            {isLoading
              ? '⏳ Processing…'
              : downloadType === 'transcript'
              ? '📄 Get Transcript'
              : downloadType === 'audio'
              ? '🎵 Download Audio File'
              : '🎬 Download Video File'}
          </button>

          <button
            onClick={() => {
              setYoutubeInput('');
              setResult('');
              setDownloadUrl('');
              setError('');
              setSuccessMessage('');
              setVideoMetadata(null);
              setDownloadCompleted(false);
              setDownloadStarted(false);
              autoTriggeredRef.current = false;
              pollStopRef.current = true;
            }}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            🗑️ Clear
          </button>
        </div>

        {/* Results */}
        {(result || downloadUrl) && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 flex items-center">
              {downloadType === 'transcript'
                ? '📜 Transcript Result'
                : downloadType === 'audio'
                ? '🎵 Audio Result'
                : '🎬 Video Result'}
              {downloadType !== 'transcript' && downloadStarted && (
                <span className="ml-2 text-green-600 text-sm font-normal">✅ Download Complete</span>
              )}
            </h2>

            {downloadType === 'transcript' ? renderTranscript() : renderAVResult()}

            {downloadType === 'transcript' && (
              <div className="mt-4 flex gap-3">
                <button
                  onClick={handleTranscriptDownload}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  💾 Download File
                </button>
                <button
                  onClick={() => copyToClipboard(result)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  📋 Copy Text
                </button>
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
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
              📚 View Complete History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

//==============End Download Module================



////////////////////////////////////////////////////////////////////////////////////////////////////////
// // frontend/src/pages/Download.js — Production-ready (limits-aware + next_reset + robust usage sync)
// // - FIXED: Renamed "Unclean" to "Timestamped" for professional appearance
// // - Displays next reset date to collapse to zero according to upgrated date 
// // - Disables actions when limits are reached (computed locally from subscriptionStatus)
// // - Refreshes + short-polls subscription after successful operations to keep Dashboard in sync
// // - Polished UI with segmented controls, mobile handling, auto-start download
// // - VERIFIED: Correct API payload format for transcript downloads (clean_transcript + format)

// import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
// import { useNavigate } from 'react-router-dom';
// import toast from 'react-hot-toast';
// import { useAuth } from '../contexts/AuthContext';
// import { useSubscription } from '../contexts/SubscriptionContext';
// import AppBrand from '../components/AppBrand';
// import YcdLogo from '../components/YcdLogo';
// import SegmentedRadioGroup from '../components/SegmentedRadioGroup';

// const API_BASE_URL =
//   process.env.REACT_APP_API_URL ||
//   process.env.REACT_APP_API_BASE_URL ||
//   'http://localhost:8000';

// const AUTO_START_DOWNLOAD = true;

// const isMobile = () =>
//   /android|iphone|ipad|ipod|blackberry|windows phone|mobile/i.test(
//     (navigator.userAgent || '').toLowerCase()
//   );

// export default function DownloadPage() {
//   const navigate = useNavigate();
//   const { token, user, isAuthenticated, logout } = useAuth();
//   const { subscriptionStatus, tier, refreshSubscriptionStatus } = useSubscription();

//   const [youtubeInput, setYoutubeInput] = useState('');
//   const [downloadType, setDownloadType] = useState('transcript');
//   const [transcriptType, setTranscriptType] = useState('clean');
//   const [uncleanFormat, setUncleanFormat] = useState('srt');
//   const [audioQuality, setAudioQuality] = useState('medium');
//   const [videoQuality, setVideoQuality] = useState('720p');

//   const [result, setResult] = useState('');
//   const [downloadUrl, setDownloadUrl] = useState('');
//   const [videoMetadata, setVideoMetadata] = useState(null);

//   const [isLoading, setIsLoading] = useState(false);
//   const [videoId, setVideoId] = useState('');
//   const [error, setError] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');
//   const [downloadCompleted, setDownloadCompleted] = useState(false);
//   const [downloadStarted, setDownloadStarted] = useState(false);
//   const [isRefreshingSubscription, setIsRefreshingSubscription] = useState(false);

//   const autoTriggeredRef = useRef(false);
//   const mobileToastShownRef = useRef(false);
//   const pollStopRef = useRef(false);

//   useEffect(() => {
//     if (!isAuthenticated) navigate('/login');
//   }, [isAuthenticated, navigate]);

//   useEffect(() => {
//     if (isMobile() && !mobileToastShownRef.current) {
//       mobileToastShownRef.current = true;
//       toast.success('📱 Mobile device detected – downloads optimized!', { duration: 2200, id: 'mobile-ok' });
//     }
//   }, []);

//   useEffect(() => {
//     if (isAuthenticated && refreshSubscriptionStatus) {
//       refreshSubscriptionStatus().catch(() => {});
//     }
//   }, [isAuthenticated, refreshSubscriptionStatus]);

//   const extractVideoId = (input) => {
//     const patterns = [
//       /(?:youtube\.com\/watch\?v=)([^&\n?#]+)/,
//       /(?:youtu\.be\/)([^&\n?#]+)/,
//       /(?:youtube\.com\/embed\/)([^&\n?#]+)/,
//       /(?:youtube\.com\/shorts\/)([^&\n?#]+)/,
//       /[?&]v=([^&\n?#]+)/
//     ];
//     for (const p of patterns) {
//       const m = input.match(p);
//       if (m && m[1]) return m[1].substring(0, 11);
//     }
//     return input.trim().substring(0, 11);
//   };

//   const previewVideoId = extractVideoId(youtubeInput);

//   const limits = useMemo(() => subscriptionStatus?.limits || {}, [subscriptionStatus]);
//   const usage  = useMemo(() => subscriptionStatus?.usage  || {}, [subscriptionStatus]);

//   const isUnlimited = (limit) => limit === 'unlimited' || limit === Infinity;

//   const getUsed = (k) => Number(usage?.[k] ?? 0);
//   const getLimit = (k) => limits?.[k];

//   const atLimit = (k) => {
//     const lim = getLimit(k);
//     if (isUnlimited(lim) || lim === undefined || lim === null) return false;
//     return getUsed(k) >= Number(lim);
//   };

//   const actionKey = useMemo(() => {
//     if (downloadType === 'transcript') return transcriptType === 'clean' ? 'clean_transcripts' : 'unclean_transcripts';
//     if (downloadType === 'audio') return 'audio_downloads';
//     if (downloadType === 'video') return 'video_downloads';
//     return null;
//   }, [downloadType, transcriptType]);

//   const safeFormatUsage = (k) => {
//     const u = getUsed(k);
//     const l = getLimit(k);
//     return isUnlimited(l) ? `${u} / ∞` : `${u} / ${l ?? 0}`;
//   };

//   const getUsageLimitMessage = () => {
//     if (!actionKey) return null;
//     if (atLimit(actionKey)) {
//       const label =
//         actionKey === 'clean_transcripts' ? 'clean transcripts' :
//         actionKey === 'unclean_transcripts' ? 'timestamped transcripts' :
//         actionKey === 'audio_downloads' ? 'audio downloads' :
//         actionKey === 'video_downloads' ? 'video downloads' : 'usage';
//       return `Monthly limit reached for ${label}. Please upgrade your plan.`;
//     }
//     return null;
//   };

//   const xUiValidId = !!previewVideoId && previewVideoId.length === 11;
//   const xUiDisabledReason = () => {
//     if (!xUiValidId) return 'Enter a valid YouTube URL or ID';
//     if (actionKey && atLimit(actionKey)) return getUsageLimitMessage();
//     return '';
//   };

//   const xUiPrimaryDisabled = isLoading || !xUiValidId || (actionKey && atLimit(actionKey));

//   const updateMediaPlayerTitle = (data) => {
//     try {
//       document.title = `${data.title || 'Unknown Title'} - ${data.uploader || 'Unknown Channel'}`;
//       if ('mediaSession' in navigator && 'MediaMetadata' in window) {
//         navigator.mediaSession.metadata = new window.MediaMetadata({
//           title: data.title || 'Unknown Title',
//           artist: data.uploader || 'Unknown Channel',
//           album: 'YouTube Content'
//         });
//       }
//     } catch {}
//   };

//   const handleLogout = () => {
//     if (window.confirm('Are you sure you want to logout?')) {
//       logout();
//       toast.success('👋 Logged out successfully!');
//       navigate('/login');
//     }
//   };

//   const copyToClipboard = async (text) => {
//     try {
//       if (navigator.clipboard && window.isSecureContext) {
//         await navigator.clipboard.writeText(text);
//         toast.success('📋 Copied to clipboard!');
//         return;
//       }
//       const ta = document.createElement('textarea');
//       ta.value = text;
//       ta.style.position = 'fixed';
//       ta.style.left = '-9999px';
//       document.body.appendChild(ta);
//       ta.select();
//       document.execCommand('copy');
//       document.body.removeChild(ta);
//       toast.success('📋 Copied to clipboard!');
//     } catch {
//       toast.error('Copy failed. Please copy manually.');
//     }
//   };

//   const formatResetDate = useCallback(() => {
//     if (!subscriptionStatus?.next_reset) return null;
//     const d = new Date(subscriptionStatus.next_reset);
//     return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
//   }, [subscriptionStatus]);

//   const pollUsageSync = useCallback(async (beforeUsageMap, keyToObserve) => {
//     const maxTries = 6;
//     let tries = 0;

//     while (tries < maxTries && !pollStopRef.current) {
//       tries += 1;
//       try {
//         await refreshSubscriptionStatus();
//       } catch {}
//       await new Promise((res) => setTimeout(res, 400));

//       const currentUsed = getUsed(keyToObserve);
//       const beforeUsed = Number(beforeUsageMap?.[keyToObserve] ?? 0);

//       if (currentUsed > beforeUsed) {
//         return true;
//       }
//     }
//     return false;
//   }, [refreshSubscriptionStatus, subscriptionStatus]);

//   const handleTranscriptDownload = async () => {
//     if (!result) return toast.error('No transcript available');
//     try {
//       const ext = transcriptType === 'unclean' ? uncleanFormat : 'txt';
//       const blob = new Blob([result], { type: 'text/plain' });
//       const url = URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = `transcript_${videoId}_${transcriptType}.${ext}`;
//       document.body.appendChild(a);
//       a.click();
//       document.body.removeChild(a);
//       URL.revokeObjectURL(url);
//       toast.success('💾 Transcript downloaded!');
//     } catch {
//       toast.error('Transcript download failed');
//     }
//   };

//   const handleDownload = async () => {
//     try {
//       setIsLoading(true);
//       setError('');
//       setResult('');
//       setDownloadUrl('');
//       setSuccessMessage('');
//       setVideoMetadata(null);
//       setDownloadCompleted(false);
//       setDownloadStarted(false);
//       autoTriggeredRef.current = false;
//       pollStopRef.current = false;

//       const id = extractVideoId(youtubeInput);
//       setVideoId(id);
//       if (!id || id.length !== 11) throw new Error('Please enter a valid YouTube video ID or URL');

//       let endpoint, payload;
      
//       // ============ VERIFIED API PAYLOAD FORMAT ============
//       if (downloadType === 'transcript') {
//         endpoint = '/download_transcript/';
//         payload = {
//           youtube_id: id,
//           clean_transcript: transcriptType === 'clean',
//           // Pass 'srt' or 'vtt' when user selected timestamped formats; otherwise null
//           format: transcriptType === 'unclean' ? uncleanFormat : null
//         };
//       } else if (downloadType === 'audio') {
//         endpoint = '/download_audio/';
//         payload = { youtube_id: id, quality: audioQuality };
//       } else {
//         endpoint = '/download_video/';
//         payload = { youtube_id: id, quality: videoQuality };
//       }

//       const beforeUsage = {
//         clean_transcripts: getUsed('clean_transcripts'),
//         unclean_transcripts: getUsed('unclean_transcripts'),
//         audio_downloads: getUsed('audio_downloads'),
//         video_downloads: getUsed('video_downloads'),
//       };

//       const res = await fetch(`${API_BASE_URL}${endpoint}`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
//         body: JSON.stringify(payload)
//       });

//       if (!res.ok) {
//         const e = await res.json().catch(() => ({}));
//         throw new Error(e.detail || `${downloadType} download failed`);
//       }

//       const data = await res.json();

//       if (downloadType === 'transcript') {
//         setResult(data.transcript || '');
//         setDownloadCompleted(true);
//         toast.success('📄 Transcript ready');

//         await pollUsageSync(beforeUsage, transcriptType === 'clean' ? 'clean_transcripts' : 'unclean_transcripts');
//       } else {
//         setDownloadUrl(data.direct_download_url || '');
//         const meta = {
//           title: data.title || 'Unknown Title',
//           uploader: data.uploader || 'Unknown Channel',
//           duration: data.duration || 0,
//           filename: data.filename,
//           fileSize: data.file_size_mb,
//           youtubeId: data.youtube_id
//         };
//         setVideoMetadata(meta);
//         setDownloadCompleted(true);

//         if (downloadType === 'audio') updateMediaPlayerTitle(data);

//         if (AUTO_START_DOWNLOAD && data.direct_download_url && !autoTriggeredRef.current) {
//           autoTriggeredRef.current = true;
//           try {
//             const href = data.direct_download_url.startsWith('http')
//               ? data.direct_download_url
//               : `${API_BASE_URL}${data.direct_download_url}`;
//             if (isMobile()) {
//               window.open(href, '_blank', 'noopener');
//             } else {
//               const a = document.createElement('a');
//               a.href = href;
//               a.download = meta.filename || '';
//               a.rel = 'noopener';
//               a.target = '_self';
//               document.body.appendChild(a);
//               a.click();
//               document.body.removeChild(a);
//             }
//             setDownloadStarted(true);
//             setSuccessMessage('Successfully Downloaded');
//             toast.success('💾 File download started');
//           } catch {}
//         }

//         await pollUsageSync(beforeUsage, downloadType === 'audio' ? 'audio_downloads' : 'video_downloads');
//       }
//     } catch (err) {
//       setError(err.message || 'Operation failed');
//       toast.error(err.message || 'Operation failed');
//     } finally {
//       setIsLoading(false);
//       try {
//         await refreshSubscriptionStatus();
//       } catch {}
//     }
//   };

//   const renderTranscript = () => {
//     if (!result || downloadType !== 'transcript') return null;

//     if (transcriptType === 'clean') {
//       const paragraphs = result.split('\n\n').filter((p) => p.trim());
//       return (
//         <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg overflow-auto max-h-96 text-sm leading-relaxed">
//           {paragraphs.map((p, i) => (
//             <p key={i} className="mb-3 text-gray-800">
//               {p}
//             </p>
//           ))}
//         </div>
//       );
//     }

//     const lines = result.split('\n').filter((l) => l.trim());
//     const isVTT = result.startsWith('WEBVTT');
//     const isSRT = lines.some((l) => /^\d+$/.test(l)) && lines.some((l) => l.includes('-->'));

//     if (isVTT) {
//       return (
//         <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg overflow-auto max-h-96 text-sm font-mono">
//           <div className="mb-2 text-blue-600 font-semibold">🎬 WEBVTT Format</div>
//           {lines.map((line, idx) => {
//             if (line.startsWith('WEBVTT') || line.startsWith('Kind:') || line.startsWith('Language:')) {
//               return (
//                 <div key={idx} className="text-purple-600 font-semibold">
//                   {line}
//                 </div>
//               );
//             } else if (line.includes('-->')) {
//               return (
//                 <div key={idx} className="text-blue-600 font-semibold mt-2">
//                   {line}
//                 </div>
//               );
//             } else if (line.trim()) {
//               return (
//                 <div key={idx} className="text-gray-800 mb-1">
//                   {line}
//                 </div>
//               );
//             }
//             return null;
//           })}
//         </div>
//       );
//     }

//     if (isSRT) {
//       const blocks = [];
//       let current = {};
//       for (let i = 0; i < lines.length; i++) {
//         const line = lines[i];
//         if (/^\d+$/.test(line)) continue;
//         if (line.includes('-->')) {
//           const start = line.split('-->')[0].trim();
//           const m = start.match(/(\d{2}):(\d{2}):(\d{2})/);
//           if (m) {
//             const hours = parseInt(m[1], 10);
//             const minutes = parseInt(m[2], 10);
//             const seconds = parseInt(m[3], 10);
//             const totalMinutes = hours * 60 + minutes;
//             current.timestamp = `[${totalMinutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}]`;
//           }
//           continue;
//         }
//         if (line.trim() && current.timestamp) {
//           current.text = line;
//           blocks.push({ ...current });
//           current = {};
//         }
//       }
//       return (
//         <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg overflow-auto max-h-96 text-sm font-mono">
//           <div className="mb-2 text-blue-600 font-semibold">🎬 SRT Format</div>
//           <div className="grid grid-cols-[80px_1fr] gap-x-4">
//             {blocks.map((b, i) => (
//               <React.Fragment key={i}>
//                 <div className="text-blue-600 font-semibold">{b.timestamp}</div>
//                 <div className="text-gray-800">{b.text}</div>
//               </React.Fragment>
//             ))}
//           </div>
//         </div>
//       );
//     }

//     return (
//       <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg overflow-auto max-h-96 text-sm font-mono">
//         <div className="mb-2 text-green-600 font-semibold">🕒 Timestamped Format</div>
//         <div className="grid grid-cols-[80px_1fr] gap-x-4">
//           {result
//             .split('\n')
//             .filter(Boolean)
//             .map((line, idx) => {
//               const m = line.match(/^\[(\d{2}:\d{2})\] (.+)$/);
//               return m ? (
//                 <React.Fragment key={idx}>
//                   <div className="text-gray-500 font-semibold">[{m[1]}]</div>
//                   <div className="text-gray-800">{m[2]}</div>
//                 </React.Fragment>
//               ) : (
//                 <div key={idx} className="col-span-2 text-gray-800">
//                   {line}
//                 </div>
//               );
//             })}
//         </div>
//       </div>
//     );
//   };

//   const renderAVResult = () => {
//     if (downloadType === 'transcript' || !downloadUrl) return null;

//     const statusPill = (
//       <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
//         {downloadStarted ? '✅ Successfully Downloaded' : '✅ Processed'}
//       </div>
//     );

//     return (
//       <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
//         <div className="text-center mb-4">
//           <div className="text-6xl mb-3">{downloadType === 'audio' ? '🎵' : '🎬'}</div>
//           <div className="text-xl font-semibold text-gray-800 mb-2">
//             {downloadType === 'audio' ? 'Audio' : 'Video'} Ready
//           </div>
//           <div className="text-sm text-gray-600 mb-4">
//             Quality: {downloadType === 'audio' ? audioQuality : videoQuality} • Video ID: {videoId}
//           </div>
//           {downloadCompleted && statusPill}
//         </div>

//         {videoMetadata && (
//           <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg mt-4 border border-green-200">
//             <div className="font-semibold text-gray-800 mb-1">✅ File Prepared</div>
//             <div className="text-sm text-gray-800">Title: {videoMetadata.title}</div>
//             <div className="text-sm text-gray-800">Channel: {videoMetadata.uploader}</div>
//             <div className="text-sm text-gray-800">
//               File: {videoMetadata.filename} ({videoMetadata.fileSize} MB)
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };

//   const audioAtLimit = atLimit('audio_downloads');
//   const videoAtLimit = atLimit('video_downloads');
//   const timestampedAtLimit = atLimit('unclean_transcripts');

//   const primaryBtnClass = `flex-1 py-3 px-6 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
//     xUiPrimaryDisabled
//       ? 'bg-gray-300 text-gray-600 cursor-not-allowed opacity-70'
//       : downloadType === 'transcript'
//       ? 'bg-blue-600 enabled:hover:bg-blue-700 text-white focus:ring-blue-500'
//       : downloadType === 'audio'
//       ? 'bg-green-600 enabled:hover:bg-green-700 text-white focus:ring-green-500'
//       : 'bg-purple-600 enabled:hover:bg-purple-700 text-white focus:ring-purple-500'
//   }`;

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-4xl mx-auto p-6">

//         {/* ============ Professional Brand Header (Top-Left) ============ */}
//         <div className="mb-6">
//           <AppBrand
//             size={32}
//             showText={true}
//             label="OneTechly — YCD"
//             logoSrc="/logo_onetechly.png"
//             to="/app/dashboard"
//           />
//         </div>

//         {/* ============ Centered Page Header with Official YCD Logo ============ */}
//         <div className="text-center mb-6">
//           <div className="flex justify-center items-center mb-4">
//             <YcdLogo size={56} />
//           </div>

//           <h1 className="text-3xl font-bold text-gray-900 mb-2">📺 Download YouTube Content</h1>
//           <div className="text-sm text-gray-600 mb-2">
//             Logged in as{' '}
//             <span className="font-semibold text-blue-600">{user?.username || 'User'}</span> ({user?.email})
//           </div>
//           <button
//             onClick={handleLogout}
//             className="text-sm text-red-600 hover:text-red-800 underline transition-colors"
//           >
//             Logout
//           </button>
//           {successMessage && <span className="sr-only" aria-live="polite">{successMessage}</span>}

//           {/* Usage Status Card */}
//           <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-4 mt-4 shadow-sm">
//             <div className="flex items-center justify-between mb-2">
//               <div className="text-sm">
//                 <span className="font-semibold">Current Plan:</span>{' '}
//                 <span
//                   className={`ml-1 px-2 py-1 rounded text-xs font-medium ${
//                     tier === 'free'
//                       ? 'bg-yellow-100 text-yellow-800'
//                       : tier === 'pro'
//                       ? 'bg-blue-100 text-blue-800'
//                       : 'bg-purple-100 text-purple-800'
//                   }`}
//                 >
//                   {tier?.charAt(0).toUpperCase() + tier?.slice(1) || 'Free'}
//                 </span>
//               </div>
//               <button
//                 onClick={async () => {
//                   setIsRefreshingSubscription(true);
//                   try {
//                     await refreshSubscriptionStatus();
//                     toast.success('Subscription status refreshed!', { duration: 1600 });
//                   } catch {
//                     toast.error('Failed to refresh subscription status');
//                   } finally {
//                     setIsRefreshingSubscription(false);
//                   }
//                 }}
//                 disabled={isRefreshingSubscription}
//                 className="text-xs text-blue-600 hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center transition-colors"
//                 title="Refresh subscription status"
//               >
//                 <svg
//                   className={`w-3 h-3 mr-1 ${isRefreshingSubscription ? 'animate-spin' : ''}`}
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
//                   />
//                 </svg>
//                 {isRefreshingSubscription ? 'Refreshing...' : 'Refresh'}
//               </button>
//             </div>

//             <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 text-xs">
//               <div>📄 Clean: {safeFormatUsage('clean_transcripts')}</div>
//               <div>🕒 Timestamped: {safeFormatUsage('unclean_transcripts')}</div>
//               <div>🎵 Audio: {safeFormatUsage('audio_downloads')}</div>
//               <div>🎬 Video: {safeFormatUsage('video_downloads')}</div>
//             </div>
//             {subscriptionStatus?.next_reset && (
//               <div className="mt-1 text-xs text-gray-500">
//                 Resets {formatResetDate()}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* ============ Working Examples ============ */}
//         <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 shadow-sm">
//           <h3 className="text-green-800 font-semibold mb-2">✅ Try These Working Examples:</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//             <div>
//               <div className="font-medium text-green-700">Rick Astley - Never Gonna Give You Up</div>
//               <div className="text-green-600">🎵🎬 Perfect for testing ALL features</div>
//               <div className="text-xs text-green-500 font-mono">dQw4w9WgXcQ</div>
//             </div>
//             <div>
//               <div className="font-medium text-green-700">Me at the zoo</div>
//               <div className="text-green-600">📺 First YouTube video ever</div>
//               <div className="text-xs text-green-500 font-mono">jNQXAC9IVRw</div>
//             </div>
//           </div>
//         </div>

//         {/* ============ YouTube Input ============ */}
//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Enter YouTube Video ID or URL:
//           </label>
//           <input
//             type="text"
//             placeholder="Paste YouTube URL or ID"
//             value={youtubeInput}
//             onChange={(e) => setYoutubeInput(e.target.value)}
//             className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//           />
//         </div>

//         {previewVideoId && previewVideoId.length === 11 && (
//           <div className="bg-green-50 border border-green-200 rounded p-2 mb-4">
//             <span className="text-green-700 text-sm">✅ Video ID detected: </span>
//             <span className="font-bold text-green-800">{previewVideoId}</span>
//           </div>
//         )}

//         {/* ============ Download Type Selection ============ */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//           <label
//             className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
//               downloadType === 'transcript' ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-gray-200 hover:border-gray-300'
//             }`}
//           >
//             <input
//               type="radio"
//               value="transcript"
//               checked={downloadType === 'transcript'}
//               onChange={() => setDownloadType('transcript')}
//               className="mr-2"
//             />
//             <div className="font-bold text-gray-900">📄 Transcript</div>
//             <div className="text-sm text-gray-600">Text transcription</div>
//           </label>

//           <label
//             className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
//               downloadType === 'audio' ? 'border-green-500 bg-green-50 shadow-sm' : 'border-gray-200 hover:border-gray-300'
//             }`}
//           >
//             <input
//               type="radio"
//               value="audio"
//               checked={downloadType === 'audio'}
//               onChange={() => setDownloadType('audio')}
//               className="mr-2"
//             />
//             <div className="font-bold text-gray-900">🎵 Audio</div>
//             <div className="text-sm text-gray-600">Extract MP3</div>
//           </label>

//           <label
//             className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
//               downloadType === 'video' ? 'border-purple-500 bg-purple-50 shadow-sm' : 'border-gray-200 hover:border-gray-300'
//             }`}
//           >
//             <input
//               type="radio"
//               value="video"
//               checked={downloadType === 'video'}
//               onChange={() => setDownloadType('video')}
//               className="mr-2"
//             />
//             <div className="font-bold text-gray-900">🎬 Video</div>
//             <div className="text-sm text-gray-600">Download MP4</div>
//           </label>
//         </div>

//         {/* ============ Transcript Options ============ */}
//         {downloadType === 'transcript' && (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//             <label
//               className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
//                 transcriptType === 'clean' ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-gray-200 hover:border-gray-300'
//               }`}
//             >
//               <input
//                 type="radio"
//                 value="clean"
//                 checked={transcriptType === 'clean'}
//                 onChange={() => setTranscriptType('clean')}
//                 className="mr-2"
//               />
//               <div className="font-bold text-gray-900">📄 Clean Format</div>
//               <div className="text-sm text-gray-600">Text only (no timestamps)</div>
//               <div className="text-xs text-blue-600 mt-1">Usage: {safeFormatUsage('clean_transcripts')}</div>
//             </label>

//             <label
//               className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
//                 transcriptType === 'unclean' ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-gray-200 hover:border-gray-300'
//               }`}
//             >
//               <input
//                 type="radio"
//                 value="unclean"
//                 checked={transcriptType === 'unclean'}
//                 onChange={() => setTranscriptType('unclean')}
//                 className="mr-2"
//               />
//               <div className="font-bold text-gray-900">🕒 Timestamped Format</div>
//               <div className="text-sm text-gray-600 mb-2">With timestamps</div>
//               <div className="text-xs text-blue-600 mb-2">Usage: {safeFormatUsage('unclean_transcripts')}</div>

//               {transcriptType === 'unclean' && (
//                 <div
//                   className={`pl-4 mt-2 space-y-2 border-l-2 border-blue-200 ${
//                     atLimit('unclean_transcripts') ? 'opacity-50' : ''
//                   }`}
//                 >
//                   {['srt', 'vtt'].map((fmt) => (
//                     <label
//                       key={fmt}
//                       className={`flex items-center ${atLimit('unclean_transcripts') ? 'cursor-not-allowed' : ''}`}
//                     >
//                       <input
//                         type="radio"
//                         name="uncleanFormat"
//                         value={fmt}
//                         checked={uncleanFormat === fmt}
//                         onChange={() => setUncleanFormat(fmt)}
//                         className="mr-2"
//                         disabled={atLimit('unclean_transcripts')}
//                       />
//                       <span className="text-red-600 font-medium">{fmt.toUpperCase()} Format</span>
//                     </label>
//                   ))}
//                 </div>
//               )}
//             </label>
//           </div>
//         )}

//         {/* ============ Audio Quality ============ */}
//         {downloadType === 'audio' && (
//           <div
//             className={`bg-green-50 border border-green-200 rounded-lg p-4 mb-6 shadow-sm ${
//               atLimit('audio_downloads') ? 'opacity-50 pointer-events-none' : ''
//             }`}
//           >
//             <SegmentedRadioGroup
//               name="audioQuality"
//               legend="🎵 Audio Quality"
//               options={[
//                 { value: 'high', label: 'High' },
//                 { value: 'medium', label: 'Medium' },
//                 { value: 'low', label: 'Low' },
//               ]}
//               value={audioQuality}
//               onChange={setAudioQuality}
//               disabled={atLimit('audio_downloads')}
//               columns={3}
//               variant="green"
//               className="text-center"
//             />
//             <div className="text-xs text-green-600 mt-2 text-center">
//               Usage: {safeFormatUsage('audio_downloads')}
//             </div>
//           </div>
//         )}

//         {/* ============ Video Quality ============ */}
//         {downloadType === 'video' && (
//           <div
//             className={`bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6 shadow-sm ${
//               atLimit('video_downloads') ? 'opacity-50 pointer-events-none' : ''
//             }`}
//           >
//             <SegmentedRadioGroup
//               name="videoQuality"
//               legend="🎬 Video Quality"
//               options={[
//                 { value: '1080p', label: '1080p' },
//                 { value: '720p', label: '720p' },
//                 { value: '480p', label: '480p' },
//                 { value: '360p', label: '360p' },
//               ]}
//               value={videoQuality}
//               onChange={setVideoQuality}
//               disabled={atLimit('video_downloads')}
//               columns={4}
//               variant="purple"
//               className="text-center"
//             />
//             <div className="text-xs text-purple-600 mt-2 text-center">
//               Usage: {safeFormatUsage('video_downloads')}
//             </div>
//           </div>
//         )}

//         {/* ============ Error Messages ============ */}
//         {getUsageLimitMessage() && (
//           <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-4 shadow-sm">
//             ⚠️ {getUsageLimitMessage()}
//           </div>
//         )}

//         {error && (
//           <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-4 shadow-sm">
//             ⚠️ {error}
//           </div>
//         )}

//         {/* ============ Action Buttons ============ */}
//         <div className="flex gap-4 mb-6">
//           <button
//             onClick={handleDownload}
//             disabled={xUiPrimaryDisabled}
//             aria-disabled={xUiPrimaryDisabled}
//             title={xUiDisabledReason()}
//             className={primaryBtnClass}
//           >
//             {isLoading
//               ? '⏳ Processing…'
//               : downloadType === 'transcript'
//               ? '📄 Get Transcript'
//               : downloadType === 'audio'
//               ? '🎵 Download Audio File'
//               : '🎬 Download Video File'}
//           </button>

//           <button
//             onClick={() => {
//               setYoutubeInput('');
//               setResult('');
//               setDownloadUrl('');
//               setError('');
//               setSuccessMessage('');
//               setVideoMetadata(null);
//               setDownloadCompleted(false);
//               setDownloadStarted(false);
//               autoTriggeredRef.current = false;
//               pollStopRef.current = true;
//             }}
//             className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
//           >
//             🗑️ Clear
//           </button>
//         </div>

//         {/* ============ Results Display ============ */}
//         {(result || downloadUrl) && (
//           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
//             <h2 className="text-xl font-semibold mb-4 text-gray-900 flex items-center">
//               {downloadType === 'transcript'
//                 ? '📜 Transcript Result'
//                 : downloadType === 'audio'
//                 ? '🎵 Audio Result'
//                 : '🎬 Video Result'}
//               {downloadType !== 'transcript' && downloadStarted && (
//                 <span className="ml-2 text-green-600 text-sm font-normal">✅ Download Complete</span>
//               )}
//             </h2>

//             {downloadType === 'transcript' ? renderTranscript() : renderAVResult()}

//             {downloadType === 'transcript' && (
//               <div className="mt-4 flex gap-3">
//                 <button
//                   onClick={handleTranscriptDownload}
//                   className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
//                 >
//                   💾 Download File
//                 </button>
//                 <button
//                   onClick={() => copyToClipboard(result)}
//                   className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//                 >
//                   📋 Copy Text
//                 </button>
//               </div>
//             )}
//           </div>
//         )}

//         {/* ============ Navigation Buttons ============ */}
//         <div className="text-center mb-6">
//           <div className="flex gap-4 justify-center flex-wrap">
//             <button
//               onClick={() => navigate('/dashboard')}
//               className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
//             >
//               ← Back to Dashboard
//             </button>
//             <button
//               onClick={() => navigate('/history')}
//               className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//             >
//               📚 View Complete History
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// //==============End Download Module================


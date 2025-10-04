// frontend/src/components/BatchResultCell.js
import React from 'react';

const BatchResultCell = ({ item }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return '✅';
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

  const renderCompletedResult = () => {
    const { download_links, file_size, video_title } = item;
    
    if (!download_links) return '—';

    return (
      <div className="flex flex-col gap-1">
        <div className="flex flex-wrap gap-1">
          {download_links.transcript && (
            <a
              href={download_links.transcript}
              className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              📄 Download
            </a>
          )}
          {download_links.view && (
            <a
              href={download_links.view}
              className="inline-flex items-center px-2 py-1 text-xs bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              👁️ View
            </a>
          )}
          {download_links.audio && (
            <a
              href={download_links.audio}
              className="inline-flex items-center px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded hover:bg-purple-200 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              🎵 Audio
            </a>
          )}
          {download_links.video && (
            <a
              href={download_links.video}
              className="inline-flex items-center px-2 py-1 text-xs bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              🎬 Video
            </a>
          )}
          {download_links.direct && (
            <a
              href={download_links.direct}
              className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded hover:bg-gray-200 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              ⬇️ Direct
            </a>
          )}
        </div>
        {file_size && (
          <div className="text-xs text-gray-500">
            {formatFileSize(file_size)}
          </div>
        )}
        {video_title && (
          <div className="text-xs text-gray-600 truncate max-w-[200px]" title={video_title}>
            {video_title}
          </div>
        )}
      </div>
    );
  };

  const renderStatusResult = () => {
    const { status, message } = item;
    
    return (
      <div className="flex items-center gap-2">
        <span className="text-lg">{getStatusIcon(status)}</span>
        <div className="flex flex-col">
          <span className="text-xs font-medium capitalize text-gray-700">
            {status}
          </span>
          {message && (
            <span className="text-xs text-gray-500 truncate max-w-[150px]" title={message}>
              {message}
            </span>
          )}
        </div>
      </div>
    );
  };

  const renderFailedResult = () => {
    const { message } = item;
    
    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1">
          <span className="text-lg">❌</span>
          <span className="text-xs font-medium text-red-700">Failed</span>
        </div>
        {message && (
          <div className="text-xs text-red-600 truncate max-w-[200px]" title={message}>
            {message}
          </div>
        )}
        <button
          onClick={() => window.location.reload()} // Simple retry - could be enhanced
          className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors self-start"
        >
          🔄 Retry
        </button>
      </div>
    );
  };

  // Main render logic
  switch (item.status) {
    case 'completed':
      return renderCompletedResult();
    case 'failed':
      return renderFailedResult();
    case 'processing':
    case 'queued':
      return renderStatusResult();
    default:
      return <span className="text-gray-400">—</span>;
  }
};

export default BatchResultCell;
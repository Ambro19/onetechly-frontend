//TranscriptForm.js

import React from 'react';

const TranscriptForm = ({ 
  youtubeId, 
  setYoutubeId, 
  transcriptType, 
  setTranscriptType, 
  onSubmit, 
  isLoading,
  error
}) => {
  return (
    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-8">
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
        <div className="mb-4">
          <label htmlFor="youtube-id" className="block text-sm font-medium text-gray-700 mb-1">
            YouTube Video ID or URL
          </label>
          <input
            id="youtube-id"
            type="text"
            value={youtubeId}
            onChange={(e) => setYoutubeId(e.target.value)}
            placeholder="Enter YouTube ID (e.g., dQw4w9WgXcQ) or full URL"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            Paste a full YouTube URL or just the video ID (the characters after "v=" in the URL)
          </p>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Transcript Type
          </label>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center">
              <input
                id="unclean-transcript"
                name="transcript-type"
                type="radio"
                checked={transcriptType === 'unclean'}
                onChange={() => setTranscriptType('unclean')}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
              />
              <label htmlFor="unclean-transcript" className="ml-2 block text-sm text-gray-700">
                Unclean Transcript (with timestamps)
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="clean-transcript"
                name="transcript-type"
                type="radio"
                checked={transcriptType === 'clean'}
                onChange={() => setTranscriptType('clean')}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
              />
              <label htmlFor="clean-transcript" className="ml-2 block text-sm text-gray-700">
                Clean Transcript (without timestamps)
              </label>
            </div>
          </div>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
        
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-youtube-red hover:bg-youtube-darkRed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
            isLoading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Downloading...
            </span>
          ) : (
            'Download Transcript'
          )}
        </button>
      </form>
    </div>
  );
};

export default TranscriptForm;
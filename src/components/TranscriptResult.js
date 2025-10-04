import React from 'react';

const TranscriptResult = ({ transcript, onSave }) => {
  return (
    <div className="mt-8 border-t border-gray-200 pt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Transcript Result</h3>
        <button
          onClick={onSave}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <svg className="mr-2 -ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Save to File
        </button>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-md border border-gray-200 max-h-96 overflow-y-auto">
        <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
          {transcript}
        </pre>
      </div>
    </div>
  );
};

export default TranscriptResult;  



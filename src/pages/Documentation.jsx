// ========================================
// DOCUMENTATION PAGE - PIXELPERFECT SCREENSHOT API
// ========================================
// File: frontend/src/pages/Documentation.js
// Author: OneTechly
// Purpose: API documentation and getting started guide
// Created: January 2026

import React from 'react';
import { useNavigate } from 'react-router-dom';
import PixelPerfectLogo from '../components/PixelPerfectLogo';

export default function Documentation() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Logo and Navigation */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* PixelPerfect Logo (Left) */}
            <div className="cursor-pointer" onClick={() => navigate('/')}>
              <PixelPerfectLogo size={40} showText={true} />
            </div>

            {/* Navigation Buttons (Right) */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                Dashboard
              </button>
              <button
                onClick={() => navigate('/register')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-64 flex-shrink-0">
            <nav className="space-y-1">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                API Docs
              </div>
              <a href="#getting-started" className="block px-3 py-2 text-blue-600 bg-blue-50 rounded-lg font-medium">
                Getting Started
              </a>
              <a href="#authentication" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                Authentication
              </a>
              <a href="#endpoints" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                API Endpoints
              </a>
              <a href="#examples" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                Code Examples
              </a>
              <a href="#errors" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                Error Codes
              </a>

              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-6 mb-3">
                Resources
              </div>
              <button
                onClick={() => navigate('/pricing')}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Pricing
              </button>
              <a href="#status" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                API Status
              </a>
              <a href="#support" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                Support
              </a>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 max-w-4xl">
            <div id="getting-started" className="mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Getting Started</h1>
              <p className="text-lg text-gray-600 mb-8">
                Welcome to the PixelPerfect API documentation. Get started capturing pixel-perfect screenshots in minutes.
              </p>

              {/* Quick Start Section */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Start</h2>
                
                {/* Step 1: Get API Key */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">1. Get Your API Key</h3>
                  <p className="text-gray-700 mb-3">
                    Sign up for a free account and grab your API key from the dashboard.
                  </p>
                  <button
                    onClick={() => navigate('/register')}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Get API Key
                  </button>
                </div>

                {/* Step 2: Make Request */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">2. Make your first request</h3>
                  <div className="bg-gray-900 text-white rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm">
                      <code>{`curl -X POST https://api.pixelperfectapi.net/v1/screenshot \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://example.com",
    "format": "png",
    "width": 1920,
    "height": 1080
  }'`}</code>
                    </pre>
                  </div>
                </div>
              </div>

              {/* Success Box */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
                <div className="flex items-center gap-2 text-green-800">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold">Success!</span>
                </div>
                <p className="text-green-700 mt-2">
                  You'll receive a JSON response with the screenshot URL. That's it!
                </p>
              </div>
            </div>

            {/* Authentication Section */}
            <div id="authentication" className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Authentication</h2>
              <p className="text-gray-700 mb-4">
                All API requests require authentication using a Bearer token. Include your API key in the Authorization header:
              </p>
              <div className="bg-gray-900 text-white rounded-lg p-4 mb-4">
                <pre className="text-sm">
                  <code>Authorization: Bearer YOUR_API_KEY</code>
                </pre>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>⚠️ Keep your API key secure!</strong> Never expose it in client-side code or public repositories.
                </p>
              </div>
            </div>

            {/* API Endpoints Section */}
            <div id="endpoints" className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">API Endpoints</h2>
              
              {/* Screenshot Endpoint */}
              <div className="border border-gray-200 rounded-lg p-6 mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded font-mono text-sm font-semibold">
                    POST
                  </span>
                  <code className="text-lg font-mono">/v1/screenshot</code>
                </div>
                <p className="text-gray-700 mb-4">Capture a screenshot of any website.</p>
                
                <h4 className="font-semibold text-gray-900 mb-2">Request Body:</h4>
                <div className="bg-gray-50 rounded p-3 mb-4">
                  <pre className="text-sm text-gray-800">
{`{
  "url": "https://example.com",
  "width": 1920,
  "height": 1080,
  "format": "png",
  "full_page": false,
  "dark_mode": false
}`}
                  </pre>
                </div>

                <h4 className="font-semibold text-gray-900 mb-2">Response:</h4>
                <div className="bg-gray-50 rounded p-3">
                  <pre className="text-sm text-gray-800">
{`{
  "screenshot_id": "abc123",
  "screenshot_url": "https://cdn.pixelperfect.com/abc123.png",
  "width": 1920,
  "height": 1080,
  "format": "png",
  "size_bytes": 245678,
  "created_at": "2026-01-07T12:00:00Z"
}`}
                  </pre>
                </div>
              </div>

              {/* Batch Endpoint */}
              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded font-mono text-sm font-semibold">
                    POST
                  </span>
                  <code className="text-lg font-mono">/v1/batch/submit</code>
                </div>
                <p className="text-gray-700 mb-4">Capture multiple screenshots in one request (Pro+ only).</p>
                
                <h4 className="font-semibold text-gray-900 mb-2">Request Body:</h4>
                <div className="bg-gray-50 rounded p-3">
                  <pre className="text-sm text-gray-800">
{`{
  "urls": [
    "https://example.com",
    "https://github.com",
    "https://google.com"
  ],
  "width": 1920,
  "height": 1080,
  "format": "png"
}`}
                  </pre>
                </div>
              </div>
            </div>

            {/* Code Examples Section */}
            <div id="examples" className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Code Examples</h2>
              
              {/* JavaScript Example */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">JavaScript / Node.js</h3>
                <div className="bg-gray-900 text-white rounded-lg p-4 overflow-x-auto">
                  <pre className="text-sm">
{`const axios = require('axios');

const screenshot = await axios.post(
  'https://api.pixelperfectapi.net/v1/screenshot',
  {
    url: 'https://example.com',
    width: 1920,
    height: 1080,
    format: 'png'
  },
  {
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
      'Content-Type': 'application/json'
    }
  }
);

console.log(screenshot.data.screenshot_url);`}
                  </pre>
                </div>
              </div>

              {/* Python Example */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Python</h3>
                <div className="bg-gray-900 text-white rounded-lg p-4 overflow-x-auto">
                  <pre className="text-sm">
{`import requests

response = requests.post(
    'https://api.pixelperfectapi.net/v1/screenshot',
    json={
        'url': 'https://example.com',
        'width': 1920,
        'height': 1080,
        'format': 'png'
    },
    headers={
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json'
    }
)

data = response.json()
print(data['screenshot_url'])`}
                  </pre>
                </div>
              </div>
            </div>

            {/* Error Codes Section */}
            <div id="errors" className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Error Codes</h2>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">400</td>
                      <td className="px-6 py-4 text-sm text-gray-700">Bad Request - Invalid parameters</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">401</td>
                      <td className="px-6 py-4 text-sm text-gray-700">Unauthorized - Invalid or missing API key</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">429</td>
                      <td className="px-6 py-4 text-sm text-gray-700">Too Many Requests - Rate limit exceeded</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">500</td>
                      <td className="px-6 py-4 text-sm text-gray-700">Internal Server Error - Something went wrong</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            {/* PixelPerfect Logo in Footer */}
            <div className="flex justify-center mb-4">
              <PixelPerfectLogo size={32} showText={true} />
            </div>
            <p className="text-sm text-gray-500">
              Need help? <a href="mailto:support@pixelperfect.com" className="text-blue-600 hover:text-blue-700">Contact support</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

///////////////////////////////////////////////////////////////////
// // ========================================
// // DOCUMENTATION PAGE - PIXELPERFECT SCREENSHOT API
// // ========================================
// // File: frontend/src/pages/Documentation.js
// // Author: OneTechly
// // Purpose: API documentation and getting started guide
// // Created: January 2026

// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import PixelPerfectLogo from '../components/PixelPerfectLogo';

// export default function Documentation() {
//   const navigate = useNavigate();

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header with Logo and Navigation */}
//       <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             {/* PixelPerfect Logo (Left) */}
//             <div className="cursor-pointer" onClick={() => navigate('/')}>
//               <PixelPerfectLogo size={40} showText={true} />
//             </div>

//             {/* Navigation Buttons (Right) */}
//             <div className="flex items-center gap-3">
//               <button
//                 onClick={() => navigate('/dashboard')}
//                 className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
//               >
//                 Dashboard
//               </button>
//               <button
//                 onClick={() => navigate('/register')}
//                 className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm"
//               >
//                 Get Started
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="flex gap-8">
//           {/* Sidebar */}
//           <aside className="w-64 flex-shrink-0">
//             <nav className="space-y-1">
//               <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
//                 API Docs
//               </div>
//               <a href="#getting-started" className="block px-3 py-2 text-blue-600 bg-blue-50 rounded-lg font-medium">
//                 Getting Started
//               </a>
//               <a href="#authentication" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
//                 Authentication
//               </a>
//               <a href="#endpoints" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
//                 API Endpoints
//               </a>
//               <a href="#examples" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
//                 Code Examples
//               </a>
//               <a href="#errors" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
//                 Error Codes
//               </a>

//               <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-6 mb-3">
//                 Resources
//               </div>
//               <button
//                 onClick={() => navigate('/pricing')}
//                 className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
//               >
//                 Pricing
//               </button>
//               <a href="#status" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
//                 API Status
//               </a>
//               <a href="#support" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
//                 Support
//               </a>
//             </nav>
//           </aside>

//           {/* Main Content */}
//           <main className="flex-1 max-w-4xl">
//             <div id="getting-started" className="mb-12">
//               <h1 className="text-4xl font-bold text-gray-900 mb-4">Getting Started</h1>
//               <p className="text-lg text-gray-600 mb-8">
//                 Welcome to the PixelPerfect API documentation. Get started capturing pixel-perfect screenshots in minutes.
//               </p>

//               {/* Quick Start Section */}
//               <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
//                 <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Start</h2>
                
//                 {/* Step 1: Get API Key */}
//                 <div className="mb-6">
//                   <h3 className="text-lg font-semibold text-gray-900 mb-2">1. Get Your API Key</h3>
//                   <p className="text-gray-700 mb-3">
//                     Sign up for a free account and grab your API key from the dashboard.
//                   </p>
//                   <button
//                     onClick={() => navigate('/register')}
//                     className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
//                   >
//                     Get API Key
//                   </button>
//                 </div>

//                 {/* Step 2: Make Request */}
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-900 mb-2">2. Make your first request</h3>
//                   <div className="bg-gray-900 text-white rounded-lg p-4 overflow-x-auto">
//                     <pre className="text-sm">
//                       <code>{`curl -X POST https://api.pixelperfectapi.net/v1/screenshot \\
//   -H "Authorization: Bearer YOUR_API_KEY" \\
//   -H "Content-Type: application/json" \\
//   -d '{
//     "url": "https://example.com",
//     "format": "png",
//     "width": 1920,
//     "height": 1080
//   }'`}</code>
//                     </pre>
//                   </div>
//                 </div>
//               </div>

//               {/* Success Box */}
//               <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
//                 <div className="flex items-center gap-2 text-green-800">
//                   <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                   </svg>
//                   <span className="font-semibold">Success!</span>
//                 </div>
//                 <p className="text-green-700 mt-2">
//                   You'll receive a JSON response with the screenshot URL. That's it!
//                 </p>
//               </div>
//             </div>

//             {/* Authentication Section */}
//             <div id="authentication" className="mb-12">
//               <h2 className="text-3xl font-bold text-gray-900 mb-4">Authentication</h2>
//               <p className="text-gray-700 mb-4">
//                 All API requests require authentication using a Bearer token. Include your API key in the Authorization header:
//               </p>
//               <div className="bg-gray-900 text-white rounded-lg p-4 mb-4">
//                 <pre className="text-sm">
//                   <code>Authorization: Bearer YOUR_API_KEY</code>
//                 </pre>
//               </div>
//               <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
//                 <p className="text-sm text-yellow-800">
//                   <strong>⚠️ Keep your API key secure!</strong> Never expose it in client-side code or public repositories.
//                 </p>
//               </div>
//             </div>

//             {/* API Endpoints Section */}
//             <div id="endpoints" className="mb-12">
//               <h2 className="text-3xl font-bold text-gray-900 mb-4">API Endpoints</h2>
              
//               {/* Screenshot Endpoint */}
//               <div className="border border-gray-200 rounded-lg p-6 mb-4">
//                 <div className="flex items-center gap-3 mb-3">
//                   <span className="bg-green-100 text-green-800 px-3 py-1 rounded font-mono text-sm font-semibold">
//                     POST
//                   </span>
//                   <code className="text-lg font-mono">/v1/screenshot</code>
//                 </div>
//                 <p className="text-gray-700 mb-4">Capture a screenshot of any website.</p>
                
//                 <h4 className="font-semibold text-gray-900 mb-2">Request Body:</h4>
//                 <div className="bg-gray-50 rounded p-3 mb-4">
//                   <pre className="text-sm text-gray-800">
// {`{
//   "url": "https://example.com",
//   "width": 1920,
//   "height": 1080,
//   "format": "png",
//   "full_page": false,
//   "dark_mode": false
// }`}
//                   </pre>
//                 </div>

//                 <h4 className="font-semibold text-gray-900 mb-2">Response:</h4>
//                 <div className="bg-gray-50 rounded p-3">
//                   <pre className="text-sm text-gray-800">
// {`{
//   "screenshot_id": "abc123",
//   "screenshot_url": "https://cdn.pixelperfect.com/abc123.png",
//   "width": 1920,
//   "height": 1080,
//   "format": "png",
//   "size_bytes": 245678,
//   "created_at": "2026-01-07T12:00:00Z"
// }`}
//                   </pre>
//                 </div>
//               </div>

//               {/* Batch Endpoint */}
//               <div className="border border-gray-200 rounded-lg p-6">
//                 <div className="flex items-center gap-3 mb-3">
//                   <span className="bg-green-100 text-green-800 px-3 py-1 rounded font-mono text-sm font-semibold">
//                     POST
//                   </span>
//                   <code className="text-lg font-mono">/v1/batch/submit</code>
//                 </div>
//                 <p className="text-gray-700 mb-4">Capture multiple screenshots in one request (Pro+ only).</p>
                
//                 <h4 className="font-semibold text-gray-900 mb-2">Request Body:</h4>
//                 <div className="bg-gray-50 rounded p-3">
//                   <pre className="text-sm text-gray-800">
// {`{
//   "urls": [
//     "https://example.com",
//     "https://github.com",
//     "https://google.com"
//   ],
//   "width": 1920,
//   "height": 1080,
//   "format": "png"
// }`}
//                   </pre>
//                 </div>
//               </div>
//             </div>

//             {/* Code Examples Section */}
//             <div id="examples" className="mb-12">
//               <h2 className="text-3xl font-bold text-gray-900 mb-4">Code Examples</h2>
              
//               {/* JavaScript Example */}
//               <div className="mb-6">
//                 <h3 className="text-xl font-semibold text-gray-900 mb-3">JavaScript / Node.js</h3>
//                 <div className="bg-gray-900 text-white rounded-lg p-4 overflow-x-auto">
//                   <pre className="text-sm">
// {`const axios = require('axios');

// const screenshot = await axios.post(
//   'https://api.pixelperfectapi.net/v1/screenshot',
//   {
//     url: 'https://example.com',
//     width: 1920,
//     height: 1080,
//     format: 'png'
//   },
//   {
//     headers: {
//       'Authorization': 'Bearer YOUR_API_KEY',
//       'Content-Type': 'application/json'
//     }
//   }
// );

// console.log(screenshot.data.screenshot_url);`}
//                   </pre>
//                 </div>
//               </div>

//               {/* Python Example */}
//               <div className="mb-6">
//                 <h3 className="text-xl font-semibold text-gray-900 mb-3">Python</h3>
//                 <div className="bg-gray-900 text-white rounded-lg p-4 overflow-x-auto">
//                   <pre className="text-sm">
// {`import requests

// response = requests.post(
//     'https://api.pixelperfectapi.net/v1/screenshot',
//     json={
//         'url': 'https://example.com',
//         'width': 1920,
//         'height': 1080,
//         'format': 'png'
//     },
//     headers={
//         'Authorization': 'Bearer YOUR_API_KEY',
//         'Content-Type': 'application/json'
//     }
// )

// data = response.json()
// print(data['screenshot_url'])`}
//                   </pre>
//                 </div>
//               </div>
//             </div>

//             {/* Error Codes Section */}
//             <div id="errors" className="mb-12">
//               <h2 className="text-3xl font-bold text-gray-900 mb-4">Error Codes</h2>
//               <div className="border border-gray-200 rounded-lg overflow-hidden">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     <tr>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">400</td>
//                       <td className="px-6 py-4 text-sm text-gray-700">Bad Request - Invalid parameters</td>
//                     </tr>
//                     <tr>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">401</td>
//                       <td className="px-6 py-4 text-sm text-gray-700">Unauthorized - Invalid or missing API key</td>
//                     </tr>
//                     <tr>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">429</td>
//                       <td className="px-6 py-4 text-sm text-gray-700">Too Many Requests - Rate limit exceeded</td>
//                     </tr>
//                     <tr>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">500</td>
//                       <td className="px-6 py-4 text-sm text-gray-700">Internal Server Error - Something went wrong</td>
//                     </tr>
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </main>
//         </div>
//       </div>

//       {/* Footer */}
//       <footer className="bg-white border-t border-gray-200 mt-12">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           <div className="text-center">
//             {/* PixelPerfect Logo in Footer */}
//             <div className="flex justify-center mb-4">
//               <PixelPerfectLogo size={32} showText={true} />
//             </div>
//             <p className="text-sm text-gray-500">
//               Need help? <a href="mailto:support@pixelperfect.com" className="text-blue-600 hover:text-blue-700">Contact support</a>
//             </p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// } 
// //OneTechly Brand Logo
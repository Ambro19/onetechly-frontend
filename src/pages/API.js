// ========================================
// API PAGE - PIXELPERFECT SCREENSHOT API
// ========================================
// File: frontend/src/pages/API.js
// Author: OneTechly
// Purpose: API playground and interactive documentation
// Created: January 2026

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PixelPerfectLogo from '../components/PixelPerfectLogo';

export default function API() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [selectedEndpoint, setSelectedEndpoint] = useState('screenshot');

  const endpoints = {
    screenshot: {
      method: 'POST',
      path: '/v1/screenshot',
      description: 'Capture a screenshot of any website',
      parameters: {
        url: { type: 'string', required: true, description: 'Website URL to screenshot' },
        width: { type: 'integer', required: false, default: 1920, description: 'Viewport width in pixels' },
        height: { type: 'integer', required: false, default: 1080, description: 'Viewport height in pixels' },
        format: { type: 'string', required: false, default: 'png', enum: ['png', 'jpeg', 'webp', 'pdf'], description: 'Output format' },
        full_page: { type: 'boolean', required: false, default: false, description: 'Capture full page height' },
        dark_mode: { type: 'boolean', required: false, default: false, description: 'Enable dark mode' },
      }
    },
    batch: {
      method: 'POST',
      path: '/v1/batch/submit',
      description: 'Capture multiple screenshots in one request (Pro+ only)',
      parameters: {
        urls: { type: 'array', required: true, description: 'Array of URLs to screenshot' },
        width: { type: 'integer', required: false, default: 1920, description: 'Viewport width' },
        height: { type: 'integer', required: false, default: 1080, description: 'Viewport height' },
        format: { type: 'string', required: false, default: 'png', enum: ['png', 'jpeg', 'webp', 'pdf'], description: 'Output format' },
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="cursor-pointer" onClick={() => navigate('/')}>
              <PixelPerfectLogo size={40} showText={true} />
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <button
                onClick={() => navigate('/docs')}
                className="text-gray-700 hover:text-gray-900 font-medium"
              >
                Documentation
              </button>
              <button
                onClick={() => navigate('/pricing')}
                className="text-gray-700 hover:text-gray-900 font-medium"
              >
                Pricing
              </button>
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                >
                  Dashboard
                </button>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/login')}
                    className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
                  >
                    Sign in
                  </button>
                  <button
                    onClick={() => navigate('/register')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                  >
                    Get API Key
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            PixelPerfect API
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Programmatic screenshot API for developers. Capture any website with full customization.
          </p>

          {!isAuthenticated && (
            <div className="mt-8">
              <button
                onClick={() => navigate('/register')}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 shadow-lg"
              >
                Get Your API Key →
              </button>
            </div>
          )}
        </div>

        {/* API Playground */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Left: Endpoint Selector */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">API Endpoints</h2>

            {/* Endpoint Tabs */}
            <div className="space-y-2 mb-6">
              <button
                onClick={() => setSelectedEndpoint('screenshot')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  selectedEndpoint === 'screenshot'
                    ? 'bg-blue-50 border-2 border-blue-600'
                    : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-mono font-semibold">
                    POST
                  </span>
                  <span className="font-mono text-sm">/v1/screenshot</span>
                </div>
                <p className="text-sm text-gray-600 mt-1 ml-14">
                  Capture a single screenshot
                </p>
              </button>

              <button
                onClick={() => setSelectedEndpoint('batch')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  selectedEndpoint === 'batch'
                    ? 'bg-blue-50 border-2 border-blue-600'
                    : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-mono font-semibold">
                    POST
                  </span>
                  <span className="font-mono text-sm">/v1/batch/submit</span>
                </div>
                <p className="text-sm text-gray-600 mt-1 ml-14">
                  Batch screenshot processing (Pro+)
                </p>
              </button>
            </div>

            {/* Endpoint Details */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {endpoints[selectedEndpoint].description}
              </h3>

              <h4 className="text-sm font-semibold text-gray-700 mb-3">Parameters:</h4>
              <div className="space-y-3">
                {Object.entries(endpoints[selectedEndpoint].parameters).map(([key, param]) => (
                  <div key={key} className="bg-gray-50 p-3 rounded">
                    <div className="flex items-center gap-2 mb-1">
                      <code className="text-sm font-mono text-blue-600">{key}</code>
                      <span className="text-xs text-gray-500">({param.type})</span>
                      {param.required && (
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">
                          required
                        </span>
                      )}
                      {param.default && (
                        <span className="text-xs text-gray-500">
                          default: {param.default}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{param.description}</p>
                    {param.enum && (
                      <p className="text-xs text-gray-500 mt-1">
                        Options: {param.enum.join(', ')}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Code Example */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Code Example</h2>

            {/* Language Tabs */}
            <div className="flex gap-2 mb-4">
              <button className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium">
                cURL
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">
                Python
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">
                JavaScript
              </button>
            </div>

            {/* Code Block */}
            <div className="bg-gray-900 text-white rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm">
                <code>
{selectedEndpoint === 'screenshot' ? `curl -X POST https://api.pixelperfectapi.net/v1/screenshot \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://example.com",
    "format": "png",
    "width": 1920,
    "height": 1080,
    "full_page": false,
    "dark_mode": false
  }'` : `curl -X POST https://api.pixelperfectapi.net/v1/batch/submit \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "urls": [
      "https://example.com",
      "https://github.com",
      "https://google.com"
    ],
    "width": 1920,
    "height": 1080,
    "format": "png"
  }'`}
                </code>
              </pre>
            </div>

            {/* Response Example */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Response:</h3>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <pre className="text-sm text-gray-800">
                  <code>
{`{
  "screenshot_id": "abc123",
  "screenshot_url": "https://cdn.pixelperfect.com/abc123.png",
  "width": 1920,
  "height": 1080,
  "format": "png",
  "size_bytes": 245678,
  "created_at": "2026-01-07T12:00:00Z"
}`}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Lightning Fast</h3>
            <p className="text-gray-600">
              Capture screenshots in under 3 seconds with our optimized infrastructure.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🎨</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Full Customization</h3>
            <p className="text-gray-600">
              Control viewport size, format, full-page capture, dark mode, and more.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🔒</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Enterprise Ready</h3>
            <p className="text-gray-600">
              99.9% uptime SLA, secure API, and dedicated support for enterprise customers.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        {!isAuthenticated && (
          <div className="bg-blue-600 rounded-xl p-8 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-xl mb-6 opacity-90">
              Sign up for free and get 100 screenshots per month.
            </p>
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-3 bg-white text-blue-600 rounded-lg text-lg font-semibold hover:bg-gray-100 shadow-lg"
            >
              Get Your API Key
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
//OneTechly Brand Logo
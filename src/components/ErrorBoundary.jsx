// ========================================
// ERROR BOUNDARY COMPONENT - IMPROVED
// ========================================
// Catches React errors and displays a friendly message
// File: frontend/src/components/ErrorBoundary.jsx
// Author: OneTechly
// Updated: January 2026

import React from 'react';
import { PixelPerfectLogo } from './PixelPerfectLogos';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(_error) {
    // Note: _error is intentionally unused here
    // We just need to return the state update
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleRefresh = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <PixelPerfectLogo size={64} showText={false} />
            </div>

            {/* Error Message */}
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Oops! Something went wrong
            </h1>
            
            <p className="text-gray-600 mb-6">
              We encountered an unexpected error. Please try refreshing the page.
            </p>

            {/* Actions - Using onClick handlers */}
            <div className="space-y-3">
              <button
                onClick={this.handleRefresh}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white 
                          px-6 py-3 rounded-lg font-semibold 
                          hover:from-blue-700 hover:to-blue-900 
                          transition-all shadow-md hover:shadow-lg
                          cursor-pointer"
                type="button"
              >
                Refresh Page
              </button>
              
              <button
                onClick={this.handleGoHome}
                className="w-full bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold 
                          border-2 border-blue-600 hover:bg-blue-50 transition-all
                          cursor-pointer"
                type="button"
              >
                Go to Home
              </button>
            </div>

            {/* Error Details (development only) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 font-semibold">
                  ▸ View Error Details
                </summary>
                <div className="mt-3 p-4 bg-gray-900 rounded-lg">
                  <p className="text-red-400 font-mono text-xs mb-2">
                    {this.state.error.toString()}
                  </p>
                  {this.state.errorInfo && (
                    <pre className="text-green-400 font-mono text-xs overflow-x-auto">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              </details>
            )}

            {/* Help Text */}
            <p className="mt-6 text-xs text-gray-500">
              If this problem persists, please contact support at{' '}
              <a 
                href="mailto:support@pixelperfectapi.net" 
                className="text-blue-600 hover:text-blue-700"
              >
                support@pixelperfectapi.net
              </a>
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
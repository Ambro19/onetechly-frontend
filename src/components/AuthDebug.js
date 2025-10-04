import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

// 🔥 HARDCODED API URL - GUARANTEED TO WORK ON MOBILE
const API_BASE_URL = 'http://192.168.1.185:8000';

const AuthDebug = () => {
  const { user, token, isAuthenticated, isLoading, testConnection, clearAuth, api } = useAuth();
  const [debugInfo, setDebugInfo] = useState({});
  const [testResults, setTestResults] = useState({});
  const [isRunningTests, setIsRunningTests] = useState(false);

  // Gather debug information
  useEffect(() => {
    const gatherDebugInfo = () => {
      const savedToken = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      
      setDebugInfo({
        // Auth Context State
        contextUser: user,
        contextToken: token ? `${token.substring(0, 20)}...` : null,
        contextIsAuthenticated: isAuthenticated,
        contextIsLoading: isLoading,
        
        // localStorage State
        localStorageToken: savedToken ? `${savedToken.substring(0, 20)}...` : null,
        localStorageUser: savedUser ? JSON.parse(savedUser) : null,
        
        // Environment
        apiBaseUrl: API_BASE_URL,
        nodeEnv: process.env.NODE_ENV,
        userAgent: navigator.userAgent.substring(0, 100),
        currentTime: new Date().toISOString(),
        
        // Network
        isOnline: navigator.onLine,
        connectionType: navigator.connection?.effectiveType || 'unknown',
      });
    };

    gatherDebugInfo();
    const interval = setInterval(gatherDebugInfo, 5000); // Update every 5 seconds
    
    return () => clearInterval(interval);
  }, [user, token, isAuthenticated, isLoading]);

  // Run comprehensive tests
  const runDiagnosticTests = async () => {
    setIsRunningTests(true);
    const results = {};
    
    try {
      // Test 1: Basic API connection
      console.log('🔥 Test 1: Basic API connection');
      try {
        const response = await fetch(`${API_BASE_URL}/`, { 
          method: 'GET',
          timeout: 10000 
        });
        results.basicConnection = {
          success: response.ok,
          status: response.status,
          statusText: response.statusText
        };
      } catch (error) {
        results.basicConnection = {
          success: false,
          error: error.message
        };
      }

      // Test 2: CORS check
      console.log('🔥 Test 2: CORS check');
      try {
        const response = await fetch(`${API_BASE_URL}/`, { 
          method: 'OPTIONS',
          headers: {
            'Origin': window.location.origin,
            'Access-Control-Request-Method': 'POST',
            'Access-Control-Request-Headers': 'Content-Type, Authorization'
          }
        });
        results.corsCheck = {
          success: response.ok,
          status: response.status,
          headers: Object.fromEntries(response.headers.entries())
        };
      } catch (error) {
        results.corsCheck = {
          success: false,
          error: error.message
        };
      }

      // Test 3: Token validation (if token exists)
      if (token) {
        console.log('🔥 Test 3: Token validation');
        try {
          const response = await api.get('/users/me');
          results.tokenValidation = {
            success: true,
            user: response.data
          };
        } catch (error) {
          results.tokenValidation = {
            success: false,
            error: error.message,
            status: error.response?.status,
            data: error.response?.data
          };
        }
      }

      // Test 4: Login attempt with test credentials (if user provides them)
      console.log('🔥 Test 4: Ready for manual login test');
      results.loginTest = {
        ready: true,
        message: 'Use the test login function below'
      };

    } catch (error) {
      console.error('🔥 Diagnostic test error:', error);
      results.globalError = error.message;
    }
    
    setTestResults(results);
    setIsRunningTests(false);
  };

  // Test login with specific credentials
  const testLogin = async () => {
    const username = prompt('Enter test username:');
    const password = prompt('Enter test password:');
    
    if (!username || !password) return;
    
    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);

      const response = await api.post('/token', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      alert(`Login test successful! Token: ${response.data.access_token.substring(0, 20)}...`);
    } catch (error) {
      alert(`Login test failed: ${error.response?.data?.detail || error.message}`);
    }
  };

  // Clear all auth data
  const handleClearAuth = () => {
    if (window.confirm('Clear all authentication data?')) {
      clearAuth();
      alert('Authentication data cleared!');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-h-96 overflow-y-auto z-50">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-gray-800">🔧 Auth Debug</h3>
        <button
          onClick={() => document.getElementById('auth-debug').style.display = 'none'}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      {/* Current State */}
      <div className="mb-4">
        <h4 className="font-medium text-gray-700 mb-2">Current State</h4>
        <div className="text-xs space-y-1">
          <div className={`p-2 rounded ${debugInfo.contextIsAuthenticated ? 'bg-green-100' : 'bg-red-100'}`}>
            <strong>Authenticated:</strong> {debugInfo.contextIsAuthenticated ? 'YES' : 'NO'}
          </div>
          <div className="p-2 bg-gray-100 rounded">
            <strong>User:</strong> {debugInfo.contextUser?.username || 'None'}
          </div>
          <div className="p-2 bg-gray-100 rounded">
            <strong>Token:</strong> {debugInfo.contextToken || 'None'}
          </div>
          <div className="p-2 bg-gray-100 rounded">
            <strong>Loading:</strong> {debugInfo.contextIsLoading ? 'YES' : 'NO'}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mb-4 space-y-2">
        <button
          onClick={runDiagnosticTests}
          disabled={isRunningTests}
          className="w-full bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
        >
          {isRunningTests ? 'Running Tests...' : 'Run Diagnostic Tests'}
        </button>
        
        <button
          onClick={testLogin}
          className="w-full bg-green-600 text-white py-2 px-3 rounded text-sm hover:bg-green-700"
        >
          Test Login
        </button>
        
        <button
          onClick={handleClearAuth}
          className="w-full bg-red-600 text-white py-2 px-3 rounded text-sm hover:bg-red-700"
        >
          Clear Auth Data
        </button>
      </div>

      {/* Test Results */}
      {Object.keys(testResults).length > 0 && (
        <div className="mb-4">
          <h4 className="font-medium text-gray-700 mb-2">Test Results</h4>
          <div className="text-xs space-y-1 max-h-40 overflow-y-auto">
            {Object.entries(testResults).map(([test, result]) => (
              <div key={test} className={`p-2 rounded ${result.success ? 'bg-green-100' : 'bg-red-100'}`}>
                <strong>{test}:</strong> {result.success ? 'PASS' : 'FAIL'}
                {result.error && <div className="text-red-600 mt-1">{result.error}</div>}
                {result.message && <div className="text-gray-600 mt-1">{result.message}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Info */}
      <div className="text-xs text-gray-600">
        <div><strong>API:</strong> {debugInfo.apiBaseUrl}</div>
        <div><strong>Online:</strong> {debugInfo.isOnline ? 'YES' : 'NO'}</div>
        <div><strong>Time:</strong> {new Date().toLocaleTimeString()}</div>
      </div>
    </div>
  );
};

// Component to toggle debug panel
export const DebugToggle = () => {
  const [showDebug, setShowDebug] = useState(false);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setShowDebug(!showDebug)}
        className="fixed bottom-4 left-4 bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 z-50"
        title="Toggle Auth Debug Panel"
      >
        🔧
      </button>
      
      {showDebug && (
        <div id="auth-debug">
          <AuthDebug />
        </div>
      )}
    </>
  );
};

export default AuthDebug;
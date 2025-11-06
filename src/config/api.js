// =================================================================================================
// frontend/src/config/api.js - Production-Ready API Configuration
// Handles environment-based API endpoint configuration for dev and production
// =================================================================================================

/**
 * Determine API base URL based on environment
 * 
 * Priority:
 * 1. REACT_APP_API_URL from .env files
 * 2. NODE_ENV-based defaults (production vs development)
 * 3. Fallback to localhost for development
 */
const getAPIBaseURL = () => {
  // Check for explicit environment variable
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // Environment-based defaults
  if (process.env.NODE_ENV === 'production') {
    return 'https://api.onetechly.com';
  }
  
  // Development fallback (check for local network or localhost)
  const localIP = process.env.REACT_APP_LOCAL_IP || '192.168.1.185';
  const useLocalNetwork = process.env.REACT_APP_USE_LOCAL_NETWORK === 'true';
  
  return useLocalNetwork 
    ? `http://${localIP}:8000` 
    : 'http://localhost:8000';
};

// Export base URL
export const API_BASE_URL = getAPIBaseURL();

// Export configuration object for advanced usage
export const API_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // Set to true if using cookies for auth
};

// Helper function to build full API URLs
export const buildAPIURL = (endpoint) => {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${API_BASE_URL}/${cleanEndpoint}`;
};

// Export environment info for debugging
export const ENV_INFO = {
  environment: process.env.NODE_ENV,
  apiURL: API_BASE_URL,
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
};

// Log configuration in development
if (process.env.NODE_ENV === 'development') {
  console.log('🔧 API Configuration:', ENV_INFO);
}

export default API_BASE_URL;

// =================================================================================================
// Usage Examples:
// 
// import { API_BASE_URL, buildAPIURL, API_CONFIG } from './config/api';
// 
// // Simple usage:
// fetch(`${API_BASE_URL}/health`)
// 
// // With helper:
// fetch(buildAPIURL('users/me'))
// 
// // With full config:
// fetch(buildAPIURL('login'), {
//   method: 'POST',
//   headers: API_CONFIG.headers,
//   body: JSON.stringify({ username, password })
// })
// =================================================================================================
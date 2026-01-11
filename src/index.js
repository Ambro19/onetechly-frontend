// ========================================
// INDEX.JS - PIXELPERFECT SCREENSHOT API
// ========================================
// File: frontend/src/index.js
// Author: OneTechly
// Purpose: React app entry point with providers
// Updated: January 2026 - Production-ready

import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./index.css";
import ErrorBoundary from "./components/ErrorBoundary";
import { AuthProvider } from "./contexts/AuthContext";
import { SubscriptionProvider } from "./contexts/SubscriptionContext";
import App from "./App";

const rootEl = document.getElementById("root");
const root = createRoot(rootEl);

/**
 * ========================================
 * PIXELPERFECT REACT APP STRUCTURE
 * ========================================
 * 
 * Provider Hierarchy:
 * 1. React.StrictMode - Development mode checks
 * 2. BrowserRouter - Routing (ONE instance only!)
 * 3. ErrorBoundary - Catches React errors
 * 4. AuthProvider - Authentication state
 * 5. SubscriptionProvider - Subscription/billing state
 * 6. Toaster - Toast notifications (ONE instance only!)
 * 7. App - Main app component with routes
 * 
 * IMPORTANT:
 * - Do NOT add basename to BrowserRouter in production
 *   (Hosts often set PUBLIC_URL to full URL, breaking routing)
 * - Keep BrowserRouter outside providers that use router hooks
 * - Only ONE BrowserRouter instance in entire app
 * - Only ONE Toaster instance in entire app
 */

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <AuthProvider>
          <SubscriptionProvider>
            {/* Toast Notifications - Global instance */}
            <Toaster
              position="top-right"
              toastOptions={{
                // Default options for all toasts
                duration: 4000,
                style: {
                  background: "#363636",
                  color: "#fff",
                  borderRadius: "8px",
                  fontSize: "14px",
                  padding: "12px 16px",
                },
                // Success toasts (green)
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: "#10b981", // Green-500
                    secondary: "#fff",
                  },
                },
                // Error toasts (red)
                error: {
                  duration: 4000,
                  iconTheme: {
                    primary: "#ef4444", // Red-500
                    secondary: "#fff",
                  },
                },
                // Loading toasts
                loading: {
                  duration: Infinity, // Don't auto-dismiss
                },
              }}
            />
            
            {/* Main App Component */}
            <App />
          </SubscriptionProvider>
        </AuthProvider>
      </ErrorBoundary>
    </BrowserRouter>
  </React.StrictMode>
);

/**
 * ========================================
 * PRODUCTION DEPLOYMENT NOTES
 * ========================================
 * 
 * 1. Build Command:
 *    npm run build
 * 
 * 2. Build Output:
 *    build/ directory
 * 
 * 3. Environment Variables:
 *    - Set in .env.production
 *    - Must start with REACT_APP_
 *    - Embedded at build time
 * 
 * 4. Hosting:
 *    - Vercel: vercel.json for SPA routing
 *    - Netlify: _redirects for SPA routing
 *    - All routes must serve index.html
 * 
 * 5. Browser Support:
 *    - Modern browsers (last 2 versions)
 *    - No IE11 support
 * 
 * ========================================
 */
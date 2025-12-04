// src/App.js (UPDATED)
import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { wakeApi } from "./lib/api";
import { updateFavicon } from "./lib/faviconManager";

/* --- Company / Marketing pages --- */
import Home from "./pages/Marketing/Home";
import YCD from "./pages/Marketing/YCD";
import Pricing from "./pages/Marketing/Pricing";
import Contact from "./pages/Marketing/Contact";
import Terms from "./pages/Marketing/Legal/Terms";
import Privacy from "./pages/Marketing/Legal/Privacy";
import DMCA from "./pages/Marketing/Legal/DMCA";
import NotFound from "./pages/Marketing/NotFound";

/* --- App pages (auth) --- */
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/Register";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

/* --- Protected app --- */
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardPage from "./pages/DashboardPage";
import DownloadPage from "./pages/Download";
import HistoryPage from "./pages/History";
import ActivityPage from "./pages/Activity";
import SubscriptionPage from "./pages/SubscriptionPage";
import BatchJobs from "./pages/BatchJobs";

/* --- Blog redirect component --- */
function BlogRedirect() {
  useEffect(() => {
    window.location.href = "https://onetechlyambr19.blogspot.com/";
  }, []);
  return null;
}

/* --- Favicon manager component --- */
function FaviconManager() {
  const location = useLocation();
  
  useEffect(() => {
    updateFavicon(location.pathname);
  }, [location.pathname]);
  
  return null;
}

export default function App() {
  useEffect(() => {
    // best-effort warmup (handles Render cold starts)
    wakeApi();
  }, []);

  return (
    <>
      {/* Dynamic favicon based on route */}
      <FaviconManager />
      
      <Routes>
        {/* ---------- Marketing ---------- */}
        <Route path="/" element={<Home />} />
        <Route path="/ycd" element={<YCD />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/legal/terms" element={<Terms />} />
        <Route path="/legal/privacy" element={<Privacy />} />
        <Route path="/legal/dmca" element={<DMCA />} />
        <Route path="/blog" element={<BlogRedirect />} />

        {/* ---------- Public auth ---------- */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/change-password" element={<ChangePasswordPage />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/reset" element={<ResetPassword />} />

        {/* ---------- Protected app under /app/* ---------- */}
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="download" element={<DownloadPage />} />
          <Route path="history" element={<HistoryPage />} />
          <Route path="activity" element={<ActivityPage />} />
          <Route path="subscription" element={<SubscriptionPage />} />
          <Route path="batch" element={<BatchJobs />} />
        </Route>

        {/* ---------- Back-compat redirects ---------- */}
        <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
        <Route path="/download" element={<Navigate to="/app/download" replace />} />
        <Route path="/history" element={<Navigate to="/app/history" replace />} />
        <Route path="/activity" element={<Navigate to="/app/activity" replace />} />
        <Route path="/subscription" element={<Navigate to="/app/subscription" replace />} />
        <Route path="/batch" element={<Navigate to="/app/batch" replace />} />

        {/* ---------- Final 404 ---------- */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

////////////////////////////////////////////////////////////

// // src/App.js
// import React, { useEffect } from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
// import { wakeApi } from "./lib/api";

// /* --- Company / Marketing pages --- */
// import Home from "./pages/Marketing/Home";
// import YCD from "./pages/Marketing/YCD";
// import Pricing from "./pages/Marketing/Pricing";
// import Contact from "./pages/Marketing/Contact";
// import Terms from "./pages/Marketing/Legal/Terms";
// import Privacy from "./pages/Marketing/Legal/Privacy";
// import DMCA from "./pages/Marketing/Legal/DMCA";
// import NotFound from "./pages/Marketing/NotFound";

// /* --- App pages (auth) --- */
// import LoginPage from "./pages/LoginPage";
// import RegisterPage from "./pages/Register";
// import ChangePasswordPage from "./pages/ChangePasswordPage";
// import ForgotPassword from "./pages/ForgotPassword";
// import ResetPassword from "./pages/ResetPassword";

// /* --- Protected app --- */
// import Layout from "./components/Layout";
// import ProtectedRoute from "./components/ProtectedRoute";
// import DashboardPage from "./pages/DashboardPage";
// import DownloadPage from "./pages/Download";
// import HistoryPage from "./pages/History";
// import ActivityPage from "./pages/Activity";
// import SubscriptionPage from "./pages/SubscriptionPage";
// import BatchJobs from "./pages/BatchJobs";

// /* --- Blog redirect component --- */
// function BlogRedirect() {
//   useEffect(() => {
//     window.location.href = "https://onetechlyambr19.blogspot.com/";
//   }, []);
//   return null;
// }

// export default function App() {
//   useEffect(() => {
//     // best-effort warmup (handles Render cold starts)
//     wakeApi();
//   }, []);

//   return (
//     <Routes>
//       {/* ---------- Marketing ---------- */}
//       <Route path="/" element={<Home />} />
//       <Route path="/ycd" element={<YCD />} />
//       <Route path="/pricing" element={<Pricing />} />
//       <Route path="/contact" element={<Contact />} />
//       <Route path="/legal/terms" element={<Terms />} />
//       <Route path="/legal/privacy" element={<Privacy />} />
//       <Route path="/legal/dmca" element={<DMCA />} />
//       <Route path="/blog" element={<BlogRedirect />} />

//       {/* ---------- Public auth ---------- */}
//       <Route path="/login" element={<LoginPage />} />
//       <Route path="/register" element={<RegisterPage />} />
//       <Route path="/change-password" element={<ChangePasswordPage />} />
//       <Route path="/forgot" element={<ForgotPassword />} />
//       <Route path="/reset" element={<ResetPassword />} />

//       {/* ---------- Protected app under /app/* ---------- */}
//       <Route
//         path="/app"
//         element={
//           <ProtectedRoute>
//             <Layout />
//           </ProtectedRoute>
//         }
//       >
//         <Route index element={<Navigate to="dashboard" replace />} />
//         <Route path="dashboard" element={<DashboardPage />} />
//         <Route path="download" element={<DownloadPage />} />
//         <Route path="history" element={<HistoryPage />} />
//         <Route path="activity" element={<ActivityPage />} />
//         <Route path="subscription" element={<SubscriptionPage />} />
//         <Route path="batch" element={<BatchJobs />} />
//       </Route>

//       {/* ---------- Back-compat redirects ---------- */}
//       <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
//       <Route path="/download" element={<Navigate to="/app/download" replace />} />
//       <Route path="/history" element={<Navigate to="/app/history" replace />} />
//       <Route path="/activity" element={<Navigate to="/app/activity" replace />} />
//       <Route path="/subscription" element={<Navigate to="/app/subscription" replace />} />
//       <Route path="/batch" element={<Navigate to="/app/batch" replace />} />

//       {/* ---------- Final 404 ---------- */}
//       <Route path="*" element={<NotFound />} />
//     </Routes>
//   );
// }


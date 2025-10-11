// src/App.js
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

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

/* --- Protected app --- */
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardPage from "./pages/DashboardPage";
import DownloadPage from "./pages/Download";
import HistoryPage from "./pages/History";
import ActivityPage from "./pages/Activity";
import SubscriptionPage from "./pages/SubscriptionPage";
import BatchJobs from "./pages/BatchJobs";

export default function App() {
  return (
    <Routes>
      {/* ---------- Marketing ---------- */}
      <Route path="/" element={<Home />} />
      <Route path="/ycd" element={<YCD />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/legal/terms" element={<Terms />} />
      <Route path="/legal/privacy" element={<Privacy />} />
      <Route path="/legal/dmca" element={<DMCA />} />

      {/* ---------- Public auth ---------- */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/change-password" element={<ChangePasswordPage />} />

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
  );
}


////////////////////////////////////////////////////////////////////////////
// // src/App.js
// import React from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
// import NotFound from "./pages/Marketing/NotFound";

// /* --- Company / Marketing pages --- */
// import Home from "./pages/Marketing/Home";
// import YCD from "./pages/Marketing/YCD";
// import Pricing from "./pages/Marketing/Pricing";
// import Contact from "./pages/Marketing/Contact";
// import Terms from "./pages/Marketing/Legal/Terms";
// import Privacy from "./pages/Marketing/Legal/Privacy";
// import DMCA from "./pages/Marketing/Legal/DMCA";

// /* --- App pages --- */
// import LoginPage from "./pages/LoginPage";
// import RegisterPage from "./pages/Register";
// import DashboardPage from "./pages/DashboardPage";
// import DownloadPage from "./pages/Download";
// import HistoryPage from "./pages/History";
// import ActivityPage from "./pages/Activity";
// import SubscriptionPage from "./pages/SubscriptionPage";
// import BatchJobs from "./pages/BatchJobs";

// /* --- Change password --- */
// import ChangePasswordPage from "./pages/ChangePasswordPage";

// /* --- Shared layout & guard --- */
// import Layout from "./components/Layout";
// import ProtectedRoute from "./components/ProtectedRoute";

// export default function App() {
//   return (
//     <Routes>
//       {/* ---------- Company / Marketing site ---------- */}
//       <Route path="/" element={<Home />} />
//       <Route path="/ycd" element={<YCD />} />
//       <Route path="/pricing" element={<Pricing />} />
//       <Route path="/contact" element={<Contact />} />
//       <Route path="/legal/terms" element={<Terms />} />
//       <Route path="/legal/privacy" element={<Privacy />} />
//       <Route path="/legal/dmca" element={<DMCA />} />

//       {/* ---------- Public auth routes ---------- */}
//       <Route path="/login" element={<LoginPage />} />
//       <Route path="/register" element={<RegisterPage />} />
//       <Route path="/change-password" element={<ChangePasswordPage />} />

//       {/* ---------- Protected app under /app/* ---------- */}
//       <Route
//         path="/app"
//         element={
//           <ProtectedRoute>
//             <Layout />
//           </ProtectedRoute>
//         }
//       >
//         <Route path="dashboard" element={<DashboardPage />} />
//         <Route path="download" element={<DownloadPage />} />
//         <Route path="history" element={<HistoryPage />} />
//         <Route path="activity" element={<ActivityPage />} />
//         <Route path="subscription" element={<SubscriptionPage />} />
//         <Route path="batch" element={<BatchJobs />} />
//         <Route index element={<Navigate to="dashboard" replace />} />
//       </Route>

//       {/* ---------- Back-compat redirects (old direct links) ---------- */}
//       <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
//       <Route path="/download" element={<Navigate to="/app/download" replace />} />
//       <Route path="/history" element={<Navigate to="/app/history" replace />} />
//       <Route path="/activity" element={<Navigate to="/app/activity" replace />} />
//       <Route path="/subscription" element={<Navigate to="/app/subscription" replace />} />
//       <Route path="/batch" element={<Navigate to="/app/batch" replace />} />

//       {/* ---------- Single wildcard 404 ---------- */}
//       <Route path="*" element={<NotFound />} />
//     </Routes>
//   );
// }


////////////////////////////////////////////////////////////////////
// // src/App.js
// import React from "react";
// import NotFound from './pages/Marketing/NotFound';
// import { Routes, Route, Navigate } from "react-router-dom";

// /* --- Company / Marketing pages --- */
// import Home from "./pages/Marketing/Home";
// import YCD from "./pages/Marketing/YCD";
// import Pricing from "./pages/Marketing/Pricing";
// import Contact from "./pages/Marketing/Contact";
// import Terms from "./pages/Marketing/Legal/Terms";
// import Privacy from "./pages/Marketing/Legal/Privacy";
// import DMCA from "./pages/Marketing/Legal/DMCA";

// /* --- Your existing app pages --- */
// import LoginPage from "./pages/LoginPage";
// import RegisterPage from "./pages/Register";
// import DashboardPage from "./pages/DashboardPage";
// import DownloadPage from "./pages/Download";
// import HistoryPage from "./pages/History";
// import ActivityPage from "./pages/Activity";
// import SubscriptionPage from "./pages/SubscriptionPage";
// import BatchJobs from "./pages/BatchJobs";

// /* --- NEW: Change password page (for must_change_password flow) --- */
// import ChangePasswordPage from "./pages/ChangePasswordPage";

// /* --- Shared layout & guard --- */
// import Layout from "./components/Layout";
// import ProtectedRoute from "./components/ProtectedRoute";

// export default function App() {
//   return (
//     <Routes>
//       {/* ---------- Company / Marketing site ---------- */}
//       <Route path="/" element={<Home />} />
//       <Route path="/ycd" element={<YCD />} />
//       <Route path="/pricing" element={<Pricing />} />
//       <Route path="/contact" element={<Contact />} />
//       <Route path="/legal/terms" element={<Terms />} />
//       <Route path="/legal/privacy" element={<Privacy />} />
//       <Route path="/legal/dmca" element={<DMCA />} />

//       {/* Marketing/public 404 */}
//       <Route path="*" element={<NotFound />} />

//       {/* ---------- Public auth routes (app) ---------- */}
//       <Route path="/login" element={<LoginPage />} />
//       <Route path="/register" element={<RegisterPage />} />

//       {/* ---------- Public: change password (prompted right after login if required) ---------- */}
//       <Route path="/change-password" element={<ChangePasswordPage />} />

//       {/* ---------- Protected app under /app/* ---------- */}
//       <Route
//         path="/app"
//         element={
//           <ProtectedRoute>
//             <Layout />
//           </ProtectedRoute>
//         }
//       >
//         <Route path="dashboard" element={<DashboardPage />} />
//         <Route path="download" element={<DownloadPage />} />
//         <Route path="history" element={<HistoryPage />} />
//         <Route path="activity" element={<ActivityPage />} />
//         <Route path="subscription" element={<SubscriptionPage />} />
//         <Route path="batch" element={<BatchJobs />} />
//         <Route index element={<Navigate to="dashboard" replace />} />
//       </Route>

//       {/* ---------- Back-compat redirects (old direct links) ---------- */}
//       <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
//       <Route path="/download" element={<Navigate to="/app/download" replace />} />
//       <Route path="/history" element={<Navigate to="/app/history" replace />} />
//       <Route path="/activity" element={<Navigate to="/app/activity" replace />} />
//       <Route path="/subscription" element={<Navigate to="/app/subscription" replace />} />
//       <Route path="/batch" element={<Navigate to="/app/batch" replace />} />

//       {/* ---------- Fallback ---------- */}
//       <Route path="*" element={<Navigate to="/" replace />} />
//     </Routes>
//   );
// }


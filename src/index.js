//src/index.js (fixed)
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
 * IMPORTANT:
 * - Do NOT pass `basename={process.env.PUBLIC_URL}` in production.
 *   Hosts often set PUBLIC_URL to a full URL, which breaks React Router.
 * - Keep BrowserRouter outside providers that use router hooks.
 */
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <AuthProvider>
          <SubscriptionProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: { background: "#363636", color: "#fff" },
                success: { duration: 3000, style: { background: "#10b981", color: "#fff" } },
                error: { duration: 4000, style: { background: "#ef4444", color: "#fff" } },
              }}
            />
            <App />
          </SubscriptionProvider>
        </AuthProvider>
      </ErrorBoundary>
    </BrowserRouter>
  </React.StrictMode>
);


/////////////////////////////////////////////////////////////////
// import React from 'react';
// import { createRoot } from 'react-dom/client';
// import { BrowserRouter } from 'react-router-dom';
// import { Toaster } from 'react-hot-toast';

// import './index.css';
// import ErrorBoundary from './components/ErrorBoundary';
// import { AuthProvider } from './contexts/AuthContext';
// import { SubscriptionProvider } from './contexts/SubscriptionContext';
// import App from './App';

// const rootEl = document.getElementById('root');
// const root = createRoot(rootEl);

// root.render(
//   // Keep StrictMode in prod; if your providers do side-effects on mount,
//   // they must be idempotent because StrictMode mounts twice in dev.
//   <React.StrictMode>
//     {/* Router MUST be the outer wrapper for any provider using router hooks */}
//     <BrowserRouter basename={process.env.PUBLIC_URL || '/'}>
//       {/* ErrorBoundary must not remove the Router on fallback */}
//       <ErrorBoundary>
//         <AuthProvider>
//           <SubscriptionProvider>
//             <Toaster
//               position="top-right"
//               toastOptions={{
//                 duration: 4000,
//                 style: { background: '#363636', color: '#fff' },
//                 success: { duration: 3000, style: { background: '#10b981', color: '#fff' } },
//                 error: { duration: 4000, style: { background: '#ef4444', color: '#fff' } },
//               }}
//             />
//             <App />
//           </SubscriptionProvider>
//         </AuthProvider>
//       </ErrorBoundary>
//     </BrowserRouter>
//   </React.StrictMode>
// );


//////////////////////////////////////////////////////////////////
// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import { BrowserRouter } from 'react-router-dom';
// import { Toaster } from 'react-hot-toast';

// import './index.css';
// import ErrorBoundary from './components/ErrorBoundary';
// import { AuthProvider } from './contexts/AuthContext';
// import { SubscriptionProvider } from './contexts/SubscriptionContext';
// import App from './App';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     {/* Router must be OUTSIDE providers that use useNavigate/useLocation */}
//     <BrowserRouter>
//       <ErrorBoundary>
//         <AuthProvider>
//           <SubscriptionProvider>
//             <Toaster
//               position="top-right"
//               toastOptions={{
//                 duration: 4000,
//                 style: { background: '#363636', color: '#fff' },
//                 success: { duration: 3000, style: { background: '#10b981', color: '#fff' } },
//                 error: { duration: 4000, style: { background: '#ef4444', color: '#fff' } },
//               }}
//             />
//             <App />
//           </SubscriptionProvider>
//         </AuthProvider>
//       </ErrorBoundary>
//     </BrowserRouter>
//   </React.StrictMode>
// );


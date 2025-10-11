// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import './index.css';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider } from './contexts/AuthContext';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import App from './App';

// ---- pick the safest Router for where we're running ----
// Use HashRouter on production domains to avoid server rewrite issues
const isProdHost =
  typeof window !== 'undefined' &&
  /onetechly\.com$/i.test(window.location.hostname);

const Router = isProdHost ? HashRouter : BrowserRouter;
// --------------------------------------------------------

const rootEl = document.getElementById('root');
if (!rootEl) {
  throw new Error('Root element #root not found');
}

const root = ReactDOM.createRoot(rootEl);

root.render(
  // NOTE: StrictMode is fine; it double-invokes some effects in dev only.
  <React.StrictMode>
    <Router>
      <ErrorBoundary>
        <AuthProvider>
          <SubscriptionProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: { background: '#363636', color: '#fff' },
                success: { duration: 3000, style: { background: '#10b981', color: '#fff' } },
                error: { duration: 4000, style: { background: '#ef4444', color: '#fff' } },
              }}
            />
            <App />
          </SubscriptionProvider>
        </AuthProvider>
      </ErrorBoundary>
    </Router>
  </React.StrictMode>
);


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


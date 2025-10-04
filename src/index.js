import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import './index.css';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider } from './contexts/AuthContext';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* Router must be OUTSIDE providers that use useNavigate/useLocation */}
    <BrowserRouter>
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
    </BrowserRouter>
  </React.StrictMode>
);


// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function FullPageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-sm text-gray-500">Loading…</div>
    </div>
  );
}

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth(); // Fixed: isLoading instead of loading

  if (isLoading) return <FullPageLoader />;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}
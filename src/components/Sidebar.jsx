// frontend/src/components/Sidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PixelPerfectLogo } from './PixelPerfectLogos';

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="w-64 bg-white h-screen shadow-lg">
      
      {/* Logo in sidebar */}
      <div className="p-6 border-b border-gray-200">
        <Link to="/dashboard">
          <PixelPerfectLogo size={40} showText={true} />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <Link
          to="/dashboard"
          className={`flex items-center space-x-3 px-4 py-3 rounded-lg 
                     ${location.pathname === '/dashboard' 
                       ? 'bg-blue-50 text-blue-600' 
                       : 'text-gray-700 hover:bg-gray-100'}`}
        >
          <span className="text-xl">🏠</span>
          <span className="font-medium">Dashboard</span>
        </Link>

        <Link
          to="/api-keys"
          className={`flex items-center space-x-3 px-4 py-3 rounded-lg mt-2
                     ${location.pathname === '/api-keys' 
                       ? 'bg-blue-50 text-blue-600' 
                       : 'text-gray-700 hover:bg-gray-100'}`}
        >
          <span className="text-xl">🔑</span>
          <span className="font-medium">API Keys</span>
        </Link>

        {/* More nav items... */}
      </nav>
    </div>
  );
}
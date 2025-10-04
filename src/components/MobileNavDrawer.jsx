// MobileNavDrawer.jsx — tiny, dependency-free drawer
import React from 'react';
import { Link } from 'react-router-dom';

export default function MobileNavDrawer({ open, onClose }) {
  return (
    <div
      className={`fixed inset-0 z-40 ${open ? '' : 'pointer-events-none'}`}
      aria-hidden={!open}
    >
      {/* backdrop */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/40 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`}
      />

      {/* panel */}
      <div
        className={`absolute left-0 top-0 h-full w-72 bg-white shadow-xl transform transition-transform
                    ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-4 border-b flex items-center justify-between">
          <div className="text-base font-semibold">Menu</div>
          <button
            onClick={onClose}
            className="p-2 rounded hover:bg-gray-100"
            aria-label="Close navigation"
          >
            ✕
          </button>
        </div>

        <nav className="p-3 space-y-1">
          <Link onClick={onClose} to="/dashboard" className="block px-3 py-2 rounded hover:bg-gray-100">🏠 Dashboard</Link>
          <Link onClick={onClose} to="/download" className="block px-3 py-2 rounded hover:bg-gray-100">⬇️ Download</Link>
          <Link onClick={onClose} to="/subscription" className="block px-3 py-2 rounded hover:bg-gray-100">⭐ Subscription</Link>
          <Link onClick={onClose} to="/history" className="block px-3 py-2 rounded hover:bg-gray-100">🗂️ History</Link>
          <Link onClick={onClose} to="/activity" className="block px-3 py-2 rounded hover:bg-gray-100">📜 Recent Activity</Link>
        </nav>
      </div>
    </div>
  );
}


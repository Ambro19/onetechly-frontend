// Header.js - MOBILE-OPTIMIZED with Professional UI
// 🔥 FEATURES:
// - ✅ Professional mobile navigation
// - ✅ Responsive design matching login/register
// - ✅ User menu and logout functionality
// - ✅ Mobile-friendly touch targets

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { tier } = useSubscription();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/login');
    }
    setIsMenuOpen(false);
  };

  const isActivePage = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { path: '/download', label: 'Download', icon: '📥' },
    { path: '/subscription', label: 'Subscription', icon: '⭐' },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <Link to="/dashboard" className="flex items-center space-x-3">
            <div className="bg-red-600 rounded-lg p-2">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <div className="font-bold text-gray-900 text-lg">YouTube Content</div>
              <div className="text-xs text-gray-600 -mt-1">Downloader</div>
            </div>
          </Link>

          {/* User Info and Menu Toggle */}
          <div className="flex items-center space-x-3">
            {/* User Info */}
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">{user?.username}</div>
              <div className={`text-xs px-2 py-1 rounded-full font-medium ${
                tier === 'free' ? 'bg-yellow-100 text-yellow-800' : 
                tier === 'pro' ? 'bg-blue-100 text-blue-800' : 
                'bg-purple-100 text-purple-800'
              }`}>
                {tier?.charAt(0).toUpperCase() + tier?.slice(1) || 'Free'}
              </div>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              <svg 
                className={`w-6 h-6 text-gray-600 transition-transform ${isMenuOpen ? 'rotate-90' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="mt-4 pb-3 border-t border-gray-200 pt-4">
            <nav className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                    isActivePage(item.path)
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.label}</span>
                  {isActivePage(item.path) && (
                    <div className="ml-auto w-2 h-2 bg-red-600 rounded-full"></div>
                  )}
                </Link>
              ))}
              
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                <span className="text-xl">🚪</span>
                <span>Logout</span>
              </button>
            </nav>

            {/* User Details in Menu */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="px-4">
                <div className="text-sm text-gray-600">Logged in as:</div>
                <div className="font-medium text-gray-900">{user?.username}</div>
                <div className="text-xs text-gray-500">{user?.email}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

//=========================================
// //Header.js - Updated with custom logo

// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';
// import { useSubscription } from '../contexts/SubscriptionContext';
// import Logo from '../components/Logo';

// const Header = () => {
//   const { user, logout } = useAuth();
//   const { tier } = useSubscription();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   return (
//     <header className="bg-white shadow-sm">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16">
//           <div className="flex">
//             <div className="flex-shrink-0 flex items-center">
//               <Link to="/dashboard" className="flex items-center">
//                 <Logo className="h-8 w-8" showText={true} textSize="text-lg" />
//               </Link>
//             </div>
//             <nav className="ml-6 flex space-x-8">
//               <Link
//                 to="/dashboard"
//                 className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
//               >
//                 Dashboard
//               </Link>
//               <Link
//                 to="/subscription"
//                 className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
//               >
//                 Subscription
//               </Link>
//             </nav>
//           </div>
//           <div className="flex items-center">
//             {user && (
//               <div className="flex items-center ml-4 md:ml-6">
//                 {/* Subscription badge */}
//                 {tier !== 'free' && (
//                   <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-4 ${
//                     tier === 'premium' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
//                   }`}>
//                     {tier === 'premium' ? 'Premium' : 'Basic'}
//                   </span>
//                 )}
               
//                 <div className="ml-3 relative flex items-center">
//                   <div className="text-right mr-4">
//                     <div className="text-sm font-medium text-gray-700">
//                       {user.username}
//                     </div>
//                     <div className="text-xs text-gray-500">
//                       {user.email}
//                     </div>
//                   </div>
//                   <button
//                     onClick={handleLogout}
//                     className="ml-2 inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
//                   >
//                     Logout
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;
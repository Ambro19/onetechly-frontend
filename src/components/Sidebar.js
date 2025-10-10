// components/Sidebar.jsx – App sidebar (product shell)
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import AppBrand from "./AppBrand";

const useActive = (to) => {
  const { pathname } = useLocation();
  return pathname === to || pathname.startsWith(`${to}/`);
};

const Item = ({ to, icon, label, onClick }) => {
  const active = useActive(to);
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors
        ${active ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-50"}`}
    >
      <span className="text-lg leading-none">{icon}</span>
      <span>{label}</span>
    </Link>
  );
};

export const SidebarPanel = ({ onNavigate }) => (
  <nav className="p-3 space-y-1">
    <Item to="/app/dashboard" icon="🏠" label="Dashboard" onClick={onNavigate} />
    <Item to="/app/download"  icon="⬇️" label="Download"  onClick={onNavigate} />
    <Item to="/app/subscription" icon="⭐" label="Subscription" onClick={onNavigate} />
    <Item to="/app/history" icon="🗂️" label="History" onClick={onNavigate} />
  </nav>
);

export default function Sidebar() {
  const { user } = useAuth();

  return (
    <aside className="hidden md:flex md:flex-col md:w-64 bg-white border-r border-gray-200 shrink-0">
      {/* Brand header (YCD) */}
      <div className="h-16 flex items-center justify-center border-b">
        <AppBrand size={28} />
      </div>

      <div className="flex-1 overflow-y-auto">
        <SidebarPanel />
      </div>

      <div className="p-4 mt-auto border-t bg-gray-50">
        <div className="text-xs text-gray-500">Logged in as:</div>
        <div className="text-sm font-medium text-gray-900 leading-tight">{user?.username || "User"}</div>
        <div className="text-xs text-gray-700 truncate">{user?.email}</div>
      </div>
    </aside>
  );
}

////////////////////////////////////////////////////////////////////////
// // components/Sidebar.js
// // Desktop sidebar + reusable panel for the mobile drawer
// import React from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';
// import AppBrand from './AppBrand';

// const useActive = (to) => {
//   const { pathname } = useLocation();
//   return pathname === to || pathname.startsWith(`${to}/`);
// };

// const Item = ({ to, icon, label, onClick }) => {
//   const active = useActive(to);
//   return (
//     <Link
//       to={to}
//       onClick={onClick}
//       className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors
//         ${active ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
//     >
//       <span className="text-lg leading-none">{icon}</span>
//       <span>{label}</span>
//     </Link>
//   );
// };

// /** Panel content reused by desktop sidebar and mobile drawer */
// export const SidebarPanel = ({ onNavigate }) => {
//   return (
//     <nav className="p-3 space-y-1">
//       <Item to="/dashboard"    icon="🏠" label="Dashboard"    onClick={onNavigate} />
//       <Item to="/download"     icon="⬇️" label="Download"     onClick={onNavigate} />
//       <Item to="/subscription" icon="⭐" label="Subscription" onClick={onNavigate} />
//       <Item to="/history"      icon="🗂️" label="History"      onClick={onNavigate} />
//     </nav>
//   );
// };

// const Sidebar = () => {
//   const { user } = useAuth();

//   return (
//     <aside className="hidden md:flex md:flex-col md:w-64 bg-white border-r border-gray-200 shrink-0">
//       {/* Brand (YCD) */}
//       <div className="h-16 flex items-center justify-center border-b">
//         <AppBrand to="/dashboard" />
//       </div>

//       <div className="flex-1 overflow-y-auto">
//         <SidebarPanel />
//       </div>

//       <div className="p-4 mt-auto border-t bg-gray-50">
//         <div className="text-xs text-gray-500">Logged in as:</div>
//         <div className="text-sm font-medium text-gray-900 leading-tight">{user?.username || 'User'}</div>
//         <div className="text-xs text-gray-700 truncate">{user?.email}</div>
//       </div>
//     </aside>
//   );
// };

// export default Sidebar;

////////////////////////////////////////////////////////////////////
// // components/Sidebar.js
// // Desktop sidebar + reusable panel for the mobile drawer
// import React from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';
// import Logo from './Logo';

// const useActive = (to) => {
//   const { pathname } = useLocation();
//   return pathname === to || pathname.startsWith(`${to}/`);
// };

// const Item = ({ to, icon, label, onClick }) => {
//   const active = useActive(to);
//   return (
//     <Link
//       to={to}
//       onClick={onClick}
//       className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors
//         ${active ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
//     >
//       <span className="text-lg leading-none">{icon}</span>
//       <span>{label}</span>
//     </Link>
//   );
// };

// /** Panel content reused by desktop sidebar and mobile drawer */
// export const SidebarPanel = ({ onNavigate }) => {
//   return (
//     <nav className="p-3 space-y-1">
//       <Item to="/dashboard" icon="🏠" label="Dashboard" onClick={onNavigate} />
//       <Item to="/download" icon="⬇️" label="Download" onClick={onNavigate} />
//       <Item to="/subscription" icon="⭐" label="Subscription" onClick={onNavigate} />
//       <Item to="/history" icon="🗂️" label="History" onClick={onNavigate} />
//     </nav>
//   );
// };

// const Sidebar = () => {
//   const { user } = useAuth();

//   return (
//     <aside className="hidden md:flex md:flex-col md:w-64 bg-white border-r border-gray-200 shrink-0">
//       <div className="h-16 flex items-center justify-center border-b">
//         <Logo variant="compact" />
//       </div>

//       <div className="flex-1 overflow-y-auto">
//         <SidebarPanel />
//       </div>

//       <div className="p-4 mt-auto border-t bg-gray-50">
//         <div className="text-xs text-gray-500">Logged in as:</div>
//         <div className="text-sm font-medium text-gray-900 leading-tight">{user?.username || 'User'}</div>
//         <div className="text-xs text-gray-700 truncate">{user?.email}</div>
//       </div>
//     </aside>
//   );
// };

// export default Sidebar;

// // File: frontend/src/components/Sidebar.js
// // Purpose: Ensure the bottom-left “Logged in as” shows a real email using helper
// // Notes: Drop-in replacement if your project already has Sidebar; keep links.
// // ============================================================================

// import React from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';
// import Logo from './Logo';
// import { getDisplayEmail, getDisplayName } from '../utils/userDisplay';

// const NavLink = ({ to, children }) => {
//   const { pathname } = useLocation();
//   const active = pathname.startsWith(to);
//   return (
//     <Link
//       to={to}
//       className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
//                  ${active ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
//     >
//       {children}
//     </Link>
//   );
// };

// const Sidebar = () => {
//   const { user } = useAuth();
//   const email = getDisplayEmail(user);
//   const name = getDisplayName(user);

//   return (
//     <aside className="hidden md:flex md:flex-col md:w-64 bg-white border-r border-gray-200">
//       <div className="h-16 flex items-center justify-center border-b">
//         <Logo variant="compact" />
//       </div>

//       <nav className="flex-1 p-3 space-y-1">
//         <NavLink to="/dashboard">🏠 Dashboard</NavLink>
//         <NavLink to="/download">⬇️ Download</NavLink>
//         <NavLink to="/subscription">⭐ Subscription</NavLink>
//         <NavLink to="/history">🗂️ History</NavLink>
//       </nav>

//       {/* Bottom user block */}
//       <div className="p-4 mt-auto border-t bg-gray-50">
//         <div className="text-xs text-gray-500">Logged in as:</div>
//         <div className="text-sm font-medium text-gray-900 leading-tight">{name}</div>
//         <div className="text-xs text-gray-600 truncate" title={email}>{email}</div>
//       </div>
//     </aside>
//   );
// };

// export default Sidebar;
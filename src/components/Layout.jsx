// src/components/Layout.jsx – product shell: sticky mobile header + desktop top bar
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Sidebar from "./Sidebar";
import AppBrand from "./AppBrand";
import MobileNavDrawer from "./MobileNavDrawer";

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Mobile header (product brand) */}
      <header className="sticky top-0 z-30 bg-white border-b md:hidden">
        <div className="h-14 px-3 flex items-center justify-between">
          <button
            onClick={() => setOpen(true)}
            className="p-2 rounded hover:bg-gray-100"
            aria-label="Open navigation"
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="18" x2="20" y2="18" />
            </svg>
          </button>

          <AppBrand showText={false} size={28} />

          <div className="text-xs text-gray-500 truncate max-w-[40%] text-right">
            {user?.email}
          </div>
        </div>
      </header>

      {/* Drawer for mobile */}
      <MobileNavDrawer open={open} onClose={() => setOpen(false)} />

      {/* Desktop layout */}
      <div className="md:flex md:min-h-screen">
        <Sidebar />

        {/* Main content */}
        <main className="flex-1">
          {/* Desktop top bar with YCD brand */}
          <div className="hidden md:flex items-center justify-between bg-white border-b h-16 px-6">
            <div className="flex items-center gap-3">
              <AppBrand />
              <span className="text-sm text-gray-600">
                Logged in as{" "}
                <span className="font-medium text-gray-900">{user?.username || "User"}</span>
                {" — "}{user?.email}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="text-sm text-red-600 hover:text-red-700 underline"
            >
              Logout
            </button>
          </div>

          {/* Page outlet (centered, max width) */}
          <div className="p-4 md:p-6">
            <div className="max-w-6xl mx-auto">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}


///////////////////////////////////////////////////////////////////////////////////////////
// // src/components/Layout.jsx — sticky mobile header, desktop sidebar, centered content
// import { useState } from 'react';
// import { Outlet, useNavigate } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';
// import Sidebar from './Sidebar';
// import MobileNavDrawer from './MobileNavDrawer';
// import AppBrand from './AppBrand';
// import YcdLogo from './YcdLogo';

// export default function Layout() {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   const [open, setOpen] = useState(false);

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 text-gray-900">
//       {/* Mobile header */}
//       <header className="sticky top-0 z-30 bg-white border-b md:hidden">
//         <div className="h-14 px-3 flex items-center justify-between">
//           <button
//             onClick={() => setOpen(true)}
//             className="p-2 rounded hover:bg-gray-100"
//             aria-label="Open navigation"
//           >
//             <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"
//                  strokeLinecap="round" strokeLinejoin="round">
//               <line x1="4" y1="6" x2="20" y2="6" />
//               <line x1="4" y1="12" x2="20" y2="12" />
//               <line x1="4" y1="18" x2="20" y2="18" />
//             </svg>
//           </button>

//           {/* YCD icon in the middle on mobile */}
//           <YcdLogo size={28} />

//           <div className="text-xs text-gray-500 truncate max-w-[40%] text-right">
//             {user?.email}
//           </div>
//         </div>
//       </header>

//       {/* Drawer for mobile */}
//       <MobileNavDrawer open={open} onClose={() => setOpen(false)} />

//       {/* Desktop layout */}
//       <div className="md:flex md:min-h-screen">
//         <Sidebar />

//         {/* Main content */}
//         <main className="flex-1">
//           {/* Desktop top bar */}
//           <div className="hidden md:flex items-center justify-between bg-white border-b h-16 px-6">
//             <div className="flex items-center gap-3">
//               {/* YCD brand in the top bar */}
//               <AppBrand to="/dashboard" size={28} />
//               <span className="text-sm text-gray-600">
//                 Logged in as <span className="font-medium text-gray-900">{user?.username || 'User'}</span> — {user?.email}
//               </span>
//             </div>

//             <button
//               onClick={handleLogout}
//               className="text-sm text-red-600 hover:text-red-700 underline"
//             >
//               Logout
//             </button>
//           </div>

//           {/* Page outlet (centered, max width) */}
//           <div className="p-4 md:p-6">
//             <div className="max-w-6xl mx-auto">
//               <Outlet />
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }


/////////////////////////////////////////////////////////////
// ------------------- OneTechly Official Logo ---------------------
// // src/components/Layout.jsx — sticky mobile header, desktop sidebar, centered content
// import { useState } from 'react';
// import { Outlet, useNavigate } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';
// import Sidebar from './Sidebar';
// import Logo from './Logo';
// import MobileNavDrawer from './MobileNavDrawer';

// export default function Layout() {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   const [open, setOpen] = useState(false);

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 text-gray-900">
//       {/* Mobile header */}
//       <header className="sticky top-0 z-30 bg-white border-b md:hidden">
//         <div className="h-14 px-3 flex items-center justify-between">
//           <button
//             onClick={() => setOpen(true)}
//             className="p-2 rounded hover:bg-gray-100"
//             aria-label="Open navigation"
//           >
//             <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"
//                  strokeLinecap="round" strokeLinejoin="round">
//               <line x1="4" y1="6" x2="20" y2="6" />
//               <line x1="4" y1="12" x2="20" y2="12" />
//               <line x1="4" y1="18" x2="20" y2="18" />
//             </svg>
//           </button>

//           <Logo variant="compact" showText={false} />

//           <div className="text-xs text-gray-500 truncate max-w-[40%] text-right">
//             {user?.email}
//           </div>
//         </div>
//       </header>

//       {/* Drawer for mobile */}
//       <MobileNavDrawer open={open} onClose={() => setOpen(false)} />

//       {/* Desktop layout */}
//       <div className="md:flex md:min-h-screen">
//         <Sidebar />

//         {/* Main content */}
//         <main className="flex-1">
//           {/* Desktop top bar */}
//           <div className="hidden md:flex items-center justify-between bg-white border-b h-16 px-6">
//             <div className="flex items-center gap-3">
//               <Logo variant="compact" />
//               <span className="text-sm text-gray-600">
//                 Logged in as <span className="font-medium text-gray-900">{user?.username || 'User'}</span> — {user?.email}
//               </span>
//             </div>

//             <button
//               onClick={handleLogout}
//               className="text-sm text-red-600 hover:text-red-700 underline"
//             >
//               Logout
//             </button>
//           </div>

//           {/* Page outlet (centered, max width) */}
//           <div className="p-4 md:p-6">
//             <div className="max-w-6xl mx-auto">
//               <Outlet />
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }

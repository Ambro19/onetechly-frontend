// src/pages/LoginPage.js — uses AuthContext.login (form-urlencoded) + clean errors
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext.js';
import Logo from '../components/Logo.js';
import YcdLogo from '../components/YcdLogo.jsx'; // <- use YCD logo

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) return toast.error('Enter username and password');
    try {
      setLoading(true);
      const result = await login(username, password); // calls /token as form-urlencoded
      toast.success('Welcome back!');
      if (result?.mustChange) {
        toast('Please set a new password to continue', { icon: '🔐' });
        navigate('/change-password', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      const msg =
        err?.message ||
        err?.detail ||
        (typeof err === 'string' ? err : 'Login failed');
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="mx-auto mb-4">
            <Logo />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Sign in to your account</h1>
          <p className="text-sm text-gray-600 mt-1">Access your YouTube Content Downloader</p>
        </div>

        <form onSubmit={onSubmit} className="bg-white rounded-2xl shadow-xl border p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Enter your username"
              autoComplete="username"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <div className="mt-1 relative">
              <input
                type={show ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-lg border-gray-300 pr-10 focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="absolute inset-y-0 right-0 px-3 text-gray-500 hover:text-gray-700"
                aria-label={show ? 'Hide password' : 'Show password'}
              >
                {show ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-lg font-semibold text-white
                       bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700
                       disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>

          <div className="text-center pt-2">
            <div className="text-xs text-gray-500">New to YouTube Content Downloader?</div>
            <Link
              to="/register"
              className="inline-flex mt-2 items-center justify-center w-full h-10 rounded-lg font-semibold text-white
                         bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600
                         transition-all duration-200"
            >
              Create new account
            </Link>
          </div>
        </form>

        <div className="mt-6">
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 text-sm text-indigo-800">
            <div className="font-medium mb-1">🎉 What you can do:</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Download transcripts (clean & timestamped)</li>
              <li>Extract audio files (MP3)</li>
              <li>Download videos (multiple qualities)</li>
              <li>Batch processing (Pro/Premium)</li>
              <li>Full mobile support</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}


// /////////////////////////// GOOD ONE ////////////////////////////////////////////
// // src/pages/LoginPage.js — Only show success on real success
// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import toast from 'react-hot-toast';
// import { useAuth } from '../contexts/AuthContext';
// import Logo from '../components/Logo';

// export default function LoginPage() {
//   const { login } = useAuth();
//   const navigate = useNavigate();
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [show, setShow] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     if (!username || !password) return toast.error('Enter username and password');
//     try {
//       setLoading(true);
//       const result = await login(username, password); // returns { mustChange }
//       toast.success('Welcome back!');
//       if (result?.mustChange) {
//         toast('Please set a new password to continue', { icon: '🔐' });
//         navigate('/change-password', { replace: true });
//       } else {
//         navigate('/dashboard', { replace: true });
//       }
//     } catch (err) {
//       toast.error(err?.message || 'Login failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="auth-page">
//       <div className="w-full max-w-md">
//         <div className="text-center mb-6">
//           <div className="mx-auto mb-4">
//             <Logo />
//           </div>
//           <h1 className="text-3xl font-extrabold tracking-tight">Sign in to your account</h1>
//           <p className="text-sm text-gray-600 mt-1">Access your YouTube Content Downloader</p>
//         </div>

//         <form onSubmit={onSubmit} className="bg-white rounded-2xl shadow-xl border p-6 space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Username</label>
//             <input
//               type="text"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               className="mt-1 block w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
//               placeholder="Enter your username"
//               autoComplete="username"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">Password</label>
//             <div className="mt-1 relative">
//               <input
//                 type={show ? 'text' : 'password'}
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="block w-full rounded-lg border-gray-300 pr-10 focus:border-indigo-500 focus:ring-indigo-500"
//                 placeholder="Enter your password"
//                 autoComplete="current-password"
//                 required
//               />
//               <button
//                 type="button"
//                 onClick={() => setShow((s) => !s)}
//                 className="absolute inset-y-0 right-0 px-3 text-gray-500 hover:text-gray-700"
//                 aria-label={show ? 'Hide password' : 'Show password'}
//               >
//                 {show ? '🙈' : '👁️'}
//               </button>
//             </div>
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full h-11 rounded-lg font-semibold text-white
//                        bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700
//                        disabled:opacity-60 disabled:cursor-not-allowed"
//           >
//             {loading ? 'Signing in…' : 'Sign in'}
//           </button>

//           <div className="text-center pt-2">
//             <div className="text-xs text-gray-500">New to YouTube Content Downloader?</div>
//             <Link
//               to="/register"
//               className="inline-flex mt-2 items-center justify-center w-full h-10 rounded-lg font-semibold text-white
//                          bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600
//                          transition-all duration-200"
//             >
//               Create new account
//             </Link>
//           </div>
//         </form>

//         <div className="mt-6">
//           <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 text-sm text-indigo-800">
//             <div className="font-medium mb-1">🎉 What you can do:</div>
//             <ul className="list-disc pl-5 space-y-1">
//               <li>Download transcripts (clean & timestamped)</li>
//               <li>Extract audio files (MP3)</li>
//               <li>Download videos (multiple qualities)</li>
//               <li>Batch processing (Pro/Premium)</li>
//               <li>Full mobile support</li>
//             </ul>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


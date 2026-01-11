// ========================================
// REGISTER PAGE - PIXELPERFECT SCREENSHOT API
// ========================================
// File: frontend/src/pages/Register.js
// Author: OneTechly
// Purpose: User registration page with auto-login
// Updated: January 2026 - Production-ready (password caps + better error safety)

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import PixelPerfectLogo from '../components/PixelPerfectLogo';

const API_BASE =
  process.env.REACT_APP_API_URL ||
  process.env.REACT_APP_API_BASE_URL ||
  'http://localhost:8000';

// Password constraints (frontend guardrail)
const PASSWORD_MIN_LEN = Number(process.env.REACT_APP_PASSWORD_MIN_LEN || 6);
const PASSWORD_MAX_LEN = Number(process.env.REACT_APP_PASSWORD_MAX_LEN || 128);

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Hard-stop super long paste on password fields (UX + safety)
    if ((name === 'password' || name === 'confirmPassword') && value.length > PASSWORD_MAX_LEN) {
      setFormData((prev) => ({
        ...prev,
        [name]: value.slice(0, PASSWORD_MAX_LEN),
      }));
      setError(`Password must be at most ${PASSWORD_MAX_LEN} characters`);
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const username = formData.username.trim();
    const email = formData.email.trim();
    const password = formData.password;
    const confirmPassword = formData.confirmPassword;

    // Frontend validation
    if (!username || !email || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (username.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }

    if (password.length < PASSWORD_MIN_LEN) {
      setError(`Password must be at least ${PASSWORD_MIN_LEN} characters`);
      return;
    }

    if (password.length > PASSWORD_MAX_LEN) {
      setError(`Password must be at most ${PASSWORD_MAX_LEN} characters`);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      // 1) Register user
      const registerResponse = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      let registerData = null;
      try {
        registerData = await registerResponse.json();
      } catch {
        // backend might return non-JSON on errors; handle gracefully
      }

      if (!registerResponse.ok) {
        const detail = registerData?.detail;

        if (typeof detail === 'string') throw new Error(detail);
        if (Array.isArray(detail) && detail[0]?.msg) throw new Error(detail[0].msg);

        throw new Error('Registration failed. Please try again.');
      }

      toast.success('Account created successfully!');

      // 2) Auto-login after successful registration
      try {
        await login(username, password);
        toast.success('Logged in successfully!');
        navigate('/dashboard');
      } catch (loginError) {
        console.error('Auto-login failed:', loginError);
        toast.error('Account created! Please login.');
        navigate('/login');
      }
    } catch (err) {
      console.error('Registration error:', err);

      const msg = err?.message || 'Registration failed';

      if (msg.toLowerCase().includes('username') && msg.toLowerCase().includes('exists')) {
        setError('Username already exists. Please choose another.');
      } else if (msg.toLowerCase().includes('email') && msg.toLowerCase().includes('exists')) {
        setError('Email already registered. Please login instead.');
      } else if (msg.toLowerCase().includes('validation')) {
        setError('Invalid input. Please check your information.');
      } else {
        setError(msg);
      }

      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header with Logo */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* PixelPerfect Logo (Left) - clickable to home */}
            <div className="cursor-pointer" onClick={() => navigate('/')}>
              <PixelPerfectLogo size={40} showText={true} />
            </div>

            {/* Navigation (Right) */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Already have an account?</span>
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Sign in
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-md">
          {/* Registration Form Card */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            {/* Logo & Title */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <PixelPerfectLogo size={64} showText={false} />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Create your account</h1>
              <p className="text-gray-600">Start capturing perfect screenshots today</p>
            </div>

            {/* Feature Highlights */}
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <p className="text-sm font-semibold text-gray-900 mb-2">Free tier includes:</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  100 screenshots per month
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  All formats (PNG, JPEG, WebP, PDF)
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Standard viewports
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Basic options
                </li>
              </ul>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Choose a username"
                  required
                  disabled={isLoading}
                  autoComplete="username"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="you@example.com"
                  required
                  disabled={isLoading}
                  autoComplete="email"
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    maxLength={PASSWORD_MAX_LEN}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                    placeholder={`At least ${PASSWORD_MIN_LEN} characters`}
                    required
                    disabled={isLoading}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Max {PASSWORD_MAX_LEN} characters.
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    maxLength={PASSWORD_MAX_LEN}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                    placeholder="Confirm your password"
                    required
                    disabled={isLoading}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  'Create account'
                )}
              </button>
            </form>

            {/* Sign In Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <button
                  onClick={() => navigate('/login')}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Sign in
                </button>
              </p>
            </div>
          </div>

          {/* Terms */}
          <p className="text-center text-xs text-gray-500 mt-6">
            By creating an account, you agree to our{' '}
            <a href="#terms" className="text-blue-600 hover:text-blue-700">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#privacy" className="text-blue-600 hover:text-blue-700">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

///////////////////////////////////////////////////////////
// // ========================================
// // REGISTER PAGE - PIXELPERFECT SCREENSHOT API
// // ========================================
// // File: frontend/src/pages/Register.js
// // Author: OneTechly
// // Purpose: User registration page with auto-login
// // Updated: January 2026 - Fully wired with navigation

// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';
// import toast from 'react-hot-toast';
// import PixelPerfectLogo from '../components/PixelPerfectLogo';

// const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// export default function Register() {
//   const navigate = useNavigate();
//   const { login } = useAuth();

//   const [formData, setFormData] = useState({
//     username: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//   });
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//     setError(''); // Clear error when user types
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');

//     // Frontend validation
//     if (!formData.username.trim() || !formData.email.trim() || !formData.password) {
//       setError('All fields are required');
//       return;
//     }

//     if (formData.username.length < 3) {
//       setError('Username must be at least 3 characters');
//       return;
//     }

//     if (formData.password.length < 6) {
//       setError('Password must be at least 6 characters');
//       return;
//     }

//     if (formData.password !== formData.confirmPassword) {
//       setError('Passwords do not match');
//       return;
//     }

//     // Email validation
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(formData.email)) {
//       setError('Please enter a valid email address');
//       return;
//     }

//     setIsLoading(true);

//     try {
//       // 1. Register user
//       const registerResponse = await fetch(`${API_BASE}/register`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           username: formData.username.trim(),
//           email: formData.email.trim(),
//           password: formData.password,
//         }),
//       });

//       const registerData = await registerResponse.json();

//       if (!registerResponse.ok) {
//         // Handle specific error messages from backend
//         if (registerData.detail) {
//           if (typeof registerData.detail === 'string') {
//             throw new Error(registerData.detail);
//           } else if (Array.isArray(registerData.detail)) {
//             throw new Error(registerData.detail[0].msg || 'Registration failed');
//           } else {
//             throw new Error('Registration failed');
//           }
//         } else {
//           throw new Error('Registration failed. Please try again.');
//         }
//       }

//       toast.success('Account created successfully!');

//       // 2. Auto-login after successful registration
//       try {
//         await login(formData.username.trim(), formData.password);
//         toast.success('Logged in successfully!');
//         navigate('/dashboard');
//       } catch (loginError) {
//         console.error('Auto-login failed:', loginError);
//         toast.error('Account created! Please login.');
//         navigate('/login');
//       }
//     } catch (error) {
//       console.error('Registration error:', error);
      
//       // More specific error messages
//       const errorMessage = error.message || 'Registration failed';
      
//       if (errorMessage.includes('username') && errorMessage.includes('exists')) {
//         setError('Username already exists. Please choose another.');
//       } else if (errorMessage.includes('email') && errorMessage.includes('exists')) {
//         setError('Email already registered. Please login instead.');
//       } else if (errorMessage.includes('validation')) {
//         setError('Invalid input. Please check your information.');
//       } else {
//         setError(errorMessage);
//       }
      
//       toast.error(error.message || 'Registration failed');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col">
//       {/* Header with Logo */}
//       <header className="bg-white border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             {/* PixelPerfect Logo (Left) - clickable to home */}
//             <div className="cursor-pointer" onClick={() => navigate('/')}>
//               <PixelPerfectLogo size={40} showText={true} />
//             </div>

//             {/* Navigation (Right) */}
//             <div className="flex items-center gap-4">
//               <span className="text-sm text-gray-600">Already have an account?</span>
//               <button
//                 onClick={() => navigate('/login')}
//                 className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
//               >
//                 Sign in
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
//         <div className="w-full max-w-md">
//           {/* Registration Form Card */}
//           <div className="bg-white rounded-xl shadow-lg p-8">
//             {/* Logo & Title */}
//             <div className="text-center mb-8">
//               <div className="flex justify-center mb-4">
//                 <PixelPerfectLogo size={64} showText={false} />
//               </div>
//               <h1 className="text-2xl font-bold text-gray-900 mb-2">
//                 Create your account
//               </h1>
//               <p className="text-gray-600">
//                 Start capturing perfect screenshots today
//               </p>
//             </div>

//             {/* Feature Highlights */}
//             <div className="bg-blue-50 rounded-lg p-4 mb-6">
//               <p className="text-sm font-semibold text-gray-900 mb-2">
//                 Free tier includes:
//               </p>
//               <ul className="text-sm text-gray-700 space-y-1">
//                 <li className="flex items-center gap-2">
//                   <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                   </svg>
//                   100 screenshots per month
//                 </li>
//                 <li className="flex items-center gap-2">
//                   <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                   </svg>
//                   All formats (PNG, JPEG, WebP, PDF)
//                 </li>
//                 <li className="flex items-center gap-2">
//                   <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                   </svg>
//                   Standard viewports
//                 </li>
//                 <li className="flex items-center gap-2">
//                   <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                   </svg>
//                   Basic options
//                 </li>
//               </ul>
//             </div>

//             {/* Error Message */}
//             {error && (
//               <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
//                 <p className="text-sm text-red-600">{error}</p>
//               </div>
//             )}

//             {/* Registration Form */}
//             <form onSubmit={handleSubmit} className="space-y-4">
//               {/* Username */}
//               <div>
//                 <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
//                   Username
//                 </label>
//                 <input
//                   type="text"
//                   id="username"
//                   name="username"
//                   value={formData.username}
//                   onChange={handleChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   placeholder="Choose a username"
//                   required
//                   disabled={isLoading}
//                 />
//               </div>

//               {/* Email */}
//               <div>
//                 <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
//                   Email
//                 </label>
//                 <input
//                   type="email"
//                   id="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   placeholder="you@example.com"
//                   required
//                   disabled={isLoading}
//                 />
//               </div>

//               {/* Password */}
//               <div>
//                 <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
//                   Password
//                 </label>
//                 <div className="relative">
//                   <input
//                     type={showPassword ? 'text' : 'password'}
//                     id="password"
//                     name="password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
//                     placeholder="At least 6 characters"
//                     required
//                     disabled={isLoading}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
//                   >
//                     {showPassword ? '👁️' : '👁️‍🗨️'}
//                   </button>
//                 </div>
//               </div>

//               {/* Confirm Password */}
//               <div>
//                 <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
//                   Confirm Password
//                 </label>
//                 <div className="relative">
//                   <input
//                     type={showConfirmPassword ? 'text' : 'password'}
//                     id="confirmPassword"
//                     name="confirmPassword"
//                     value={formData.confirmPassword}
//                     onChange={handleChange}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
//                     placeholder="Confirm your password"
//                     required
//                     disabled={isLoading}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
//                   >
//                     {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
//                   </button>
//                 </div>
//               </div>

//               {/* Submit Button */}
//               <button
//                 type="submit"
//                 disabled={isLoading}
//                 className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
//               >
//                 {isLoading ? (
//                   <span className="flex items-center justify-center gap-2">
//                     <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
//                     </svg>
//                     Creating account...
//                   </span>
//                 ) : (
//                   'Create account'
//                 )}
//               </button>
//             </form>

//             {/* Sign In Link */}
//             <div className="mt-6 text-center">
//               <p className="text-sm text-gray-600">
//                 Already have an account?{' '}
//                 <button
//                   onClick={() => navigate('/login')}
//                   className="text-blue-600 hover:text-blue-700 font-medium"
//                 >
//                   Sign in
//                 </button>
//               </p>
//             </div>
//           </div>

//           {/* Terms */}
//           <p className="text-center text-xs text-gray-500 mt-6">
//             By creating an account, you agree to our{' '}
//             <a href="#terms" className="text-blue-600 hover:text-blue-700">
//               Terms of Service
//             </a>{' '}
//             and{' '}
//             <a href="#privacy" className="text-blue-600 hover:text-blue-700">
//               Privacy Policy
//             </a>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }


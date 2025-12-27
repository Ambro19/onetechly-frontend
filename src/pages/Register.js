import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";
import { apiPostJson } from "../lib/api";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth(); // auto-login after successful registration

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [showPw, setShowPw] = useState(false);
  const [showCp, setShowCp] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();

    const username = form.username.trim();
    const email = form.email.trim();
    const password = form.password;

    if (!username || !email || !password) {
      toast.error("Fill all fields");
      return;
    }
    if (password !== form.confirm) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await apiPostJson("/register", { username, email, password });
      toast.success("Account created successfully!");
      await login(username, password);
      navigate("/app/dashboard", { replace: true });
    } catch (err) {
      // ✅ BULLETPROOF ERROR HANDLING - catches ALL error structures
      console.error('Registration error:', err); // Debug logging
      
      let errorMessage = "Registration failed. Please try again.";
      
      // Check for HTTP status codes
      const status = err?.response?.status || err?.status || 0;
      
      if (status === 400 || status === 409) {
        // Parse backend detail for specific issues
        const detail = (err?.response?.data?.detail || err?.detail || '').toLowerCase();
        
        if (detail.includes('username') && (detail.includes('exist') || detail.includes('taken') || detail.includes('already'))) {
          errorMessage = "Username already taken. Please choose another.";
        } else if (detail.includes('email') && (detail.includes('exist') || detail.includes('registered') || detail.includes('already'))) {
          errorMessage = "Email already registered. Please sign in instead.";
        } else if (detail.includes('invalid email') || detail.includes('email format')) {
          errorMessage = "Invalid email address format";
        } else if (detail.includes('password')) {
          errorMessage = "Password doesn't meet requirements (min 6 characters)";
        } else {
          errorMessage = "Username or email already exists";
        }
      } else if (status === 422) {
        errorMessage = "Invalid data. Check your inputs.";
      } else if (status === 429) {
        errorMessage = "Too many registration attempts. Please wait a moment.";
      } else if (status >= 500) {
        errorMessage = "Server error. Please try again later.";
      } else {
        // Parse error message text (fallback)
        const msg = (err?.message || err?.detail || String(err)).toLowerCase();
        
        // Check for common registration error patterns
        if (msg.includes('username') && (msg.includes('exist') || msg.includes('taken') || msg.includes('already'))) {
          errorMessage = "Username already taken. Please choose another.";
        } else if (msg.includes('email') && (msg.includes('exist') || msg.includes('registered') || msg.includes('already'))) {
          errorMessage = "Email already registered. Please sign in instead.";
        } else if (msg.includes('invalid email') || msg.includes('email format')) {
          errorMessage = "Invalid email address format";
        } else if (msg.includes('password') && (msg.includes('short') || msg.includes('length') || msg.includes('characters'))) {
          errorMessage = "Password must be at least 6 characters";
        } else if (msg.includes('429') || msg.includes('too many') || msg.includes('rate limit')) {
          errorMessage = "Too many registration attempts. Please wait a moment.";
        } else if (msg.includes('500') || msg.includes('502') || msg.includes('503') || msg.includes('server')) {
          errorMessage = "Server error. Please try again later.";
        } else if (msg.includes('network') || msg.includes('fetch') || msg.includes('connection')) {
          errorMessage = "Connection error. Check your internet.";
        } else if (msg && msg.length > 0 && msg.length < 100 && !msg.includes('error')) {
          // Use the actual error message if it's short and user-friendly
          errorMessage = err.message || err.detail || String(err);
        }
      }
      
      toast.error(errorMessage, { duration: 5000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="w-full max-w-md">
        {/* Small circular YCD logo ABOVE the title (same as YCD.jsx) */}
        <div className="text-center mb-6">
          <div className="mx-auto mb-4 flex justify-center">
            <span
              className="inline-flex items-center justify-center rounded-2xl overflow-hidden ring-2 ring-blue-100 shadow-sm bg-white"
              style={{ width: 56, height: 56 }}
            >
              <img
                src="/favicon_io/android-chrome-192x192.png"
                alt="YouTube Content Downloader"
                className="block w-[115%] h-[115%] object-contain -m-[7%]"
                loading="eager"
                decoding="async"
              />
            </span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight">Create your account</h1>
          <p className="text-sm text-gray-600 mt-1">Join YouTube Content Downloader today</p>
        </div>

        <form onSubmit={onSubmit} className="bg-white rounded-2xl shadow-xl border p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              value={form.username}
              onChange={set("username")}
              className="mt-1 block w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Choose a username"
              autoComplete="username"
              required
              minLength={3}
            />
            <p className="mt-1 text-xs text-gray-500">At least 3 characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={set("email")}
              className="mt-1 block w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <div className="mt-1 relative">
              <input
                type={showPw ? "text" : "password"}
                value={form.password}
                onChange={set("password")}
                className="block w-full rounded-lg border-gray-300 pr-10 focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Create a password"
                autoComplete="new-password"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                className="absolute inset-y-0 right-0 px-3 text-gray-500 hover:text-gray-700"
                aria-label={showPw ? "Hide password" : "Show password"}
              >
                {showPw ? "🙈" : "👁️"}
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500">At least 6 characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <div className="mt-1 relative">
              <input
                type={showCp ? "text" : "password"}
                value={form.confirm}
                onChange={set("confirm")}
                className="block w-full rounded-lg border-gray-300 pr-10 focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Confirm your password"
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowCp((s) => !s)}
                className="absolute inset-y-0 right-0 px-3 text-gray-500 hover:text-gray-700"
                aria-label={showCp ? "Hide password" : "Show password"}
              >
                {showCp ? "🙈" : "👁️"}
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
            {loading ? "Creating account…" : "Create account"}
          </button>

          <div className="text-center pt-2 text-sm text-gray-600">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="font-semibold text-indigo-600 hover:text-indigo-500"
            >
              Sign in
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 text-sm text-indigo-800">
            <div className="font-medium mb-1">✨ Free tier includes:</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>5 clean transcripts per month</li>
              <li>3 unclean transcripts per month</li>
              <li>2 audio &amp; 1 video download per month</li>
              <li>All formats (TXT, SRT, VTT, MP3, MP4)</li>
              <li>Mobile-optimized interface</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
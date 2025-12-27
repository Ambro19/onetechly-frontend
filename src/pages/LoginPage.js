import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ username: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) return toast.error("Enter username and password");
    
    try {
      setLoading(true);
      await login(form.username, form.password);
      navigate("/app/dashboard");
    } catch (err) {
      // ✅ BULLETPROOF ERROR HANDLING - catches ALL error structures
      console.error('Login error:', err); // Debug logging
      
      let errorMessage = "Login failed. Please try again.";
      
      // Check for HTTP status codes (from fetch responses)
      const status = err?.response?.status || err?.status || 0;
      
      if (status === 401) {
        errorMessage = "Invalid username or password";
      } else if (status === 400) {
        errorMessage = "Invalid login request";
      } else if (status === 429) {
        errorMessage = "Too many attempts. Please wait a moment.";
      } else if (status >= 500) {
        errorMessage = "Server error. Please try again later.";
      } else {
        // Parse error message text (fallback)
        const msg = (err?.message || err?.detail || String(err)).toLowerCase();
        
        // Check for common auth error patterns
        if (msg.includes('401') || msg.includes('unauthorized') || 
            msg.includes('invalid') || msg.includes('incorrect') ||
            msg.includes('wrong password') || msg.includes('wrong username')) {
          errorMessage = "Invalid username or password";
        } else if (msg.includes('429') || msg.includes('too many') || msg.includes('rate limit')) {
          errorMessage = "Too many attempts. Please wait a moment.";
        } else if (msg.includes('500') || msg.includes('502') || msg.includes('503') || msg.includes('server')) {
          errorMessage = "Server error. Please try again later.";
        } else if (msg.includes('network') || msg.includes('fetch') || msg.includes('connection')) {
          errorMessage = "Connection error. Check your internet.";
        } else if (msg && msg.length > 0 && msg.length < 100 && !msg.includes('error')) {
          // Use the actual error message if it's short and user-friendly
          errorMessage = err.message || err.detail || String(err);
        }
      }
      
      toast.error(errorMessage, { duration: 4000 });
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

          <h1 className="text-3xl font-extrabold tracking-tight">Sign in to your account</h1>
          <p className="text-sm text-gray-600 mt-1">Access your YouTube Content Downloader</p>
        </div>

        <form onSubmit={onSubmit} className="bg-white rounded-2xl shadow-xl border p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              value={form.username}
              onChange={set("username")}
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
                type={showPw ? "text" : "password"}
                value={form.password}
                onChange={set("password")}
                className="block w-full rounded-lg border-gray-300 pr-10 focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Enter your password"
                autoComplete="current-password"
                required
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

            {/* Forgot link — requested placement */}
            <div className="text-right -mt-1 mb-2">
              <button
                type="button"
                onClick={() => navigate("/forgot")}
                className="text-sm text-indigo-600 hover:text-indigo-500"
              >
                Forgot your password?
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-lg font-semibold text-white
                       bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700
                       disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>

          <div className="text-center pt-2 text-sm text-gray-600">
            New to YouTube Content Downloader?{" "}
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="font-semibold text-indigo-600 hover:text-indigo-500"
            >
              Create new account
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 text-sm text-indigo-800">
            <div className="font-medium mb-1">🎉 What you can do:</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Download transcripts (clean &amp; timestamped)</li>
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
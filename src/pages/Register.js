// src/pages/Register.js — uses throwing auth APIs
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import Logo from '../components/Logo';
import YcdLogo from '../components/YcdLogo.jsx';
//import YcdLogo from '../components/YcdLogo';  // <- use YCD logo

export default function RegisterPage() {
  const { register: doRegister, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [showCp, setShowCp] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.email || !form.password) return toast.error('Fill all fields');
    if (form.password !== form.confirm) return toast.error('Passwords do not match');

    try {
      setLoading(true);
      await doRegister(form.username, form.email, form.password); // will throw on fail
      toast.success('Account created!');
      await login(form.username, form.password); // will throw on fail
      navigate('/dashboard');
    } catch (err) {
      toast.error(err?.message || 'Registration failed');
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
          <h1 className="text-3xl font-extrabold tracking-tight">Create your account</h1>
          <p className="text-sm text-gray-600 mt-1">Join YouTube Content Downloader today</p>
        </div>

        <form onSubmit={onSubmit} className="bg-white rounded-2xl shadow-xl border p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              value={form.username}
              onChange={set('username')}
              className="mt-1 block w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Choose a username"
              autoComplete="username"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email address</label>
            <input
              type="email"
              value={form.email}
              onChange={set('email')}
              className="mt-1 block w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Enter your email"
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <div className="mt-1 relative">
              <input
                type={showPw ? 'text' : 'password'}
                value={form.password}
                onChange={set('password')}
                className="block w-full rounded-lg border-gray-300 pr-10 focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Create a password"
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                className="absolute inset-y-0 right-0 px-3 text-gray-500 hover:text-gray-700"
                aria-label={showPw ? 'Hide password' : 'Show password'}
              >
                {showPw ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <div className="mt-1 relative">
              <input
                type={showCp ? 'text' : 'password'}
                value={form.confirm}
                onChange={set('confirm')}
                className="block w-full rounded-lg border-gray-300 pr-10 focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Confirm your password"
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowCp((s) => !s)}
                className="absolute inset-y-0 right-0 px-3 text-gray-500 hover:text-gray-700"
                aria-label={showCp ? 'Hide password' : 'Show password'}
              >
                {showCp ? '🙈' : '👁️'}
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
            {loading ? 'Creating account…' : 'Create account'}
          </button>

          <div className="text-center text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
              Sign in instead
            </Link>
          </div>
        </form>

        <div className="mt-6">
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 text-sm text-indigo-800">
            <div className="font-medium mb-1">🎁 What you’ll get:</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Free transcripts (5 clean + 3 timestamped/month)</li>
              <li>Free audio downloads (2/month)</li>
              <li>Free video download (1/month)</li>
              <li>Full mobile support</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}


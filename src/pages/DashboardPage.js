
// ========================================
// DASHBOARD PAGE - PIXELPERFECT SCREENSHOT API
// ========================================
// File: frontend/src/pages/DashboardPage.js
// Author: OneTechly
// Purpose: Main dashboard landing page after login
// Updated: January 2026 - Converted from YCD to PixelPerfect

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import { getDisplayEmail, getDisplayName } from '../utils/userDisplay';
import AppBrand from '../components/AppBrand';
import toast from 'react-hot-toast';
// import DeleteAccountButton from '../components/DeleteAccountButton';  // TODO: Convert from YCD

const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  process.env.REACT_APP_API_BASE_URL ||
  'http://localhost:8000';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, token, logout, isAuthenticated } = useAuth();
  const { subscriptionStatus, tier, refreshSubscriptionStatus } = useSubscription();

  const [recentActivity, setRecentActivity] = useState([]);
  const [isLoadingActivity, setIsLoadingActivity] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const userEmail = getDisplayEmail(user);
  const userName = getDisplayName(user);
  const planTier = (tier || 'free').toLowerCase();
  const isActive = planTier !== 'free';

  const clampCount = (usage, limit) => {
    if (limit === 'unlimited' || limit === Infinity || limit == null) return usage ?? 0;
    return Math.min(Number(usage || 0), Number(limit || 0));
  };

  const fetchRecentActivity = useCallback(async () => {
    if (!token) return;
    try {
      // CONVERTED: Screenshot activity endpoints
      const response = await fetch(`${API_BASE_URL}/api/v1/user/recent-activity`, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        const data = await response.json();
        setRecentActivity(data.activities || []);
      }
    } catch (error) {
      console.error('Error fetching recent activity:', error);
    } finally {
      setIsLoadingActivity(false);
    }
  }, [token]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    (async () => {
      await refreshSubscriptionStatus({ force: true, sync: false });
      fetchRecentActivity();
    })();
  }, [isAuthenticated, navigate, refreshSubscriptionStatus, fetchRecentActivity, user?.username]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([fetchRecentActivity(), refreshSubscriptionStatus({ force: true, sync: true })]);
      toast.success('Dashboard refreshed!');
    } catch (e) {
      console.error('Error in Dashboard refresh:', e);
      toast.error('Failed to refresh dashboard');
    } finally {
      setIsRefreshing(false);
    }
  };

  // CONVERTED: Simplified usage formatting for screenshots
  const formatUsage = () => {
    const usage = subscriptionStatus?.usage?.screenshots ?? 0;
    const limit = subscriptionStatus?.limits?.screenshots;
    if (limit === 'unlimited' || limit === Infinity) return `${usage} / ∞`;
    return `${clampCount(usage, limit)} / ${limit ?? 0}`;
  };

  const getUsageColor = () => {
    const usage = subscriptionStatus?.usage?.screenshots ?? 0;
    const limit = subscriptionStatus?.limits?.screenshots;
    if (limit === 'unlimited' || limit === Infinity) return 'text-green-600';
    const safe = clampCount(usage, limit);
    const percentage = (Number(limit || 1) === 0) ? 0 : (safe / Number(limit || 1)) * 100;
    if (percentage >= 100) return 'text-red-600';
    if (percentage >= 80) return 'text-yellow-600';
    return 'text-green-600';
  };

  const formatResetDate = () => {
    if (!subscriptionStatus || !subscriptionStatus.next_reset) return null;
    const d = new Date(subscriptionStatus.next_reset);
    const opts = { month: 'short', day: 'numeric' };
    return d.toLocaleDateString(undefined, opts);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">

        {/* ============ Professional Brand Header (Top-Left) ============ */}
        <div className="mb-6">
          <AppBrand
            size={32}
            showText={true}
            label="PixelPerfect API"
            logoSrc="/logo_pixelperfect.png"
            to="/dashboard"
          />
        </div>

        {/* ============ Centered Page Header ============ */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="text-6xl mb-4">📸</div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">📊 Dashboard</h1>
          <p className="text-sm text-gray-600">
            Logged in as: <span className="font-medium text-blue-700">{userName}</span>{' '}
            (<span className="font-mono">{userEmail}</span>)
          </p>

          {/* Account Actions */}
          <div className="mt-3 flex flex-col sm:flex-row gap-2 items-center">
            <button
              onClick={logout}
              className="text-indigo-600 hover:text-indigo-800 transition-colors text-sm font-medium"
            >
              Logout
            </button>
            {/* 
            <span className="hidden sm:inline text-gray-400">•</span>
            <DeleteAccountButton
              className="text-red-500 hover:text-red-700 transition-colors text-sm font-medium"
              onDeleted={() => {
                toast.success('Account deleted. Logging out…', { duration: 3000 });
                logout();
                navigate('/');
              }}
            />
            */}
          </div>
        </div>

        {/* ============ Subscription Status ============ */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Subscription Status</h2>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="text-blue-600 hover:text-blue-800 transition-colors text-sm disabled:opacity-50 flex items-center gap-1"
            >
              <svg
                className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className="text-sm text-gray-600">
                  Email: <span className="font-mono">{userEmail}</span>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Current Plan:{' '}
                  <span className="font-semibold capitalize text-blue-600">{planTier || 'free'}</span>
                </div>
                <div className={`text-sm mt-1 ${isActive ? 'text-green-600' : 'text-gray-600'}`}>
                  {isActive ? '✅ Active Subscription' : 'Inactive'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-2">Usage Overview</div>
                <div className="text-xs space-y-1">
                  {/* CONVERTED: Single screenshot usage counter */}
                  <div>
                    📸 <span className={getUsageColor()}>Screenshots: {formatUsage()}</span>
                  </div>
                </div>
                {subscriptionStatus?.next_reset && (
                  <div className="mt-2 text-xs text-gray-500">Resets {formatResetDate()}</div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ============ Quick Actions (CONVERTED) ============ */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/screenshot')}
              className="bg-blue-600 text-white p-4 rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
            >
              <div className="text-2xl mb-2">📸</div>
              <div className="font-semibold">Capture Screenshot</div>
              <div className="text-sm opacity-90">Take a screenshot of any website</div>
            </button>
            <button
              onClick={() => navigate('/history')}
              className="bg-green-600 text-white p-4 rounded-xl hover:bg-green-700 transition-colors shadow-sm"
            >
              <div className="text-2xl mb-2">📚</div>
              <div className="font-semibold">History</div>
              <div className="text-sm opacity-90">View your screenshot history</div>
            </button>
            <button
              onClick={() => navigate('/subscription')}
              className="bg-orange-600 text-white p-4 rounded-xl hover:bg-orange-700 transition-colors shadow-sm"
            >
              <div className="text-2xl mb-2">💳</div>
              <div className="font-semibold">Subscription</div>
              <div className="text-sm opacity-90">Manage your plan and billing</div>
            </button>
          </div>

          {(planTier === 'pro' || planTier === 'business' || planTier === 'premium') && (
            <div className="mt-4">
              <button
                onClick={() => navigate('/batch')}
                className="w-full bg-indigo-600 text-white p-4 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
              >
                <div className="text-2xl mb-2">⚙️</div>
                <div className="font-semibold">Batch Screenshots</div>
                <div className="text-sm opacity-90">Process multiple website screenshots at once</div>
              </button>
            </div>
          )}
        </section>

        {/* ============ Recent Activity (CONVERTED) ============ */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-5 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
              <button
                onClick={() => navigate('/activity')}
                className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
              >
                View All
              </button>
            </div>
          </div>
          <div className="p-5">
            {isLoadingActivity ? (
              <div className="text-center py-8">
                <div className="text-2xl mb-2">⏳</div>
                <div className="text-sm text-gray-600">Loading recent activity...</div>
              </div>
            ) : recentActivity.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">📸</div>
                <div className="text-sm text-gray-600">No recent activity</div>
                <div className="text-xs text-gray-500 mt-1">Start capturing screenshots to see your activity here</div>
              </div>
            ) : (
              <div className="space-y-3">
                {recentActivity.slice(0, 5).map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg">{activity.icon || '📸'}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 text-sm">{activity.action || 'Activity'}</div>
                      <div className="text-xs text-gray-600 truncate">{activity.description}</div>
                      <div className="text-xs text-gray-500 mt-1">{activity.timestamp || 'Just now'}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ============ Footer ============ */}
        <footer className="text-center mt-8 text-sm text-gray-500">
          🚀 Ready to capture? • {planTier === 'premium' ? 'Unlimited' : planTier === 'pro' ? 'Pro' : planTier === 'business' ? 'Business' : 'Free'} Plan
        </footer>
      </div>
    </div>
  );
}
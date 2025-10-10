import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import { getDisplayEmail, getDisplayName } from '../utils/userDisplay';
import Logo from '../components/Logo';
import toast from 'react-hot-toast';
import DeleteAccountButton from '../components/DeleteAccountButton';
import AppPageTitle from "../components/AppPageTitle";

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
      const response = await fetch(`${API_BASE_URL}/user/recent-activity`, {
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
    // **Force** a fresh status read on first load for this user
    (async () => {
      await refreshSubscriptionStatus({ force: true, sync: false });
      fetchRecentActivity();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const formatUsage = (key) => {
    const usage = subscriptionStatus?.usage?.[key] ?? 0;
    const limit = subscriptionStatus?.limits?.[key];
    if (limit === 'unlimited' || limit === Infinity) return `${usage} / ∞`;
    return `${clampCount(usage, limit)} / ${limit ?? 0}`;
  };

  const getUsageColor = (key) => {
    const usage = subscriptionStatus?.usage?.[key] ?? 0;
    const limit = subscriptionStatus?.limits?.[key];
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

  return (                     /*<AppPageTitle title="Dashboard" />* <== to place this inside the return?/ */
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <Logo variant="xlarge" showText={false} />
          <h1 className="mt-3 text-3xl font-bold text-gray-900">📊 Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">
            Logged in as: <span className="font-medium text-blue-700">{userName}</span>{' '}
            (<span className="font-mono">{userEmail}</span>)
          </p>

          {/* Account Management */}
          <div className="mt-3 flex flex-col sm:flex-row gap-2 items-center">
            <button onClick={logout} className="text-indigo-600 hover:text-indigo-800 transition-colors text-sm">
              Logout
            </button>
            <span className="hidden sm:inline text-gray-400">•</span>
            <DeleteAccountButton
              className="text-red-500 hover:text-red-700 transition-colors text-sm font-medium"
              onDeleted={() => {
                toast.success('Account deleted. Logging out…', { duration: 3000 });
                logout();
                navigate('/');
              }}
            />
          </div>
        </div>

        {/* Subscription Status */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Subscription Status</h2>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="text-blue-600 hover:text-blue-800 transition-colors text-sm disabled:opacity-50"
            >
              {isRefreshing ? '🔄 Refreshing...' : '🔄 Refresh'}
            </button>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className="text-sm text-gray-600">Email: <span className="font-mono">{userEmail}</span></div>
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
                  <div>📄 <span className={getUsageColor('clean_transcripts')}>Clean Transcripts: {formatUsage('clean_transcripts')}</span></div>
                  <div>🕒 <span className={getUsageColor('unclean_transcripts')}>Unclean Transcripts: {formatUsage('unclean_transcripts')}</span></div>
                  <div>🎵 <span className={getUsageColor('audio_downloads')}>Audio Downloads: {formatUsage('audio_downloads')}</span></div>
                  <div>🎬 <span className={getUsageColor('video_downloads')}>Video Downloads: {formatUsage('video_downloads')}</span></div>
                </div>
                {subscriptionStatus?.next_reset && (
                  <div className="mt-2 text-xs text-gray-500">Resets {formatResetDate()}</div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <button onClick={() => navigate('/download')} className="bg-blue-600 text-white p-4 rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
              <div className="text-2xl mb-2">📥</div>
              <div className="font-semibold">Start a New Download</div>
              <div className="text-sm opacity-90">Download videos, audio, or transcripts</div>
            </button>
            <button onClick={() => navigate('/history')} className="bg-green-600 text-white p-4 rounded-xl hover:bg-green-700 transition-colors shadow-sm">
              <div className="text-2xl mb-2">📚</div>
              <div className="font-semibold">History</div>
              <div className="text-sm opacity-90">View your download history</div>
            </button>
            <button onClick={() => navigate('/subscription')} className="bg-orange-600 text-white p-4 rounded-xl hover:bg-orange-700 transition-colors shadow-sm">
              <div className="text-2xl mb-2">💳</div>
              <div className="font-semibold">Subscription</div>
              <div className="text-sm opacity-90">Manage your plan and billing</div>
            </button>
          </div>

          {(planTier === 'pro' || planTier === 'premium') && (
            <div className="mt-4">
              <button onClick={() => navigate('/batch')} className="w-full bg-indigo-600 text-white p-4 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm">
                <div className="text-2xl mb-2">⚙️</div>
                <div className="font-semibold">Batch Jobs (Beta)</div>
                <div className="text-sm opacity-90">Process multiple videos at once</div>
              </button>
            </div>
          )}
        </section>

        {/* Recent Activity */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-5 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
              <button onClick={() => navigate('/history')} className="text-blue-600 hover:text-blue-800 transition-colors text-sm">
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
                <div className="text-4xl mb-2">📭</div>
                <div className="text-sm text-gray-600">No recent activity</div>
                <div className="text-xs text-gray-500 mt-1">Start downloading to see your activity here</div>
              </div>
            ) : (
              <div className="space-y-3">
                {recentActivity.slice(0, 5).map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg">{activity.icon || '📁'}</div>
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
        
        {/* Header */}
        <AppPageTitle
          title="Dashboard"
          subtitle={
            <>
              Logged in as: <span className="font-medium text-blue-700">{userName}</span>{" "}
              (<span className="font-mono">{userEmail}</span>)
            </>
          }
          right={
            <div className="mt-3 flex flex-col sm:flex-row gap-2 items-center justify-center">
              <button
                onClick={logout}
                className="text-indigo-600 hover:text-indigo-800 transition-colors text-sm"
              >
                Logout
              </button>
              <span className="hidden sm:inline text-gray-400">•</span>
              <DeleteAccountButton
                className="text-red-500 hover:text-red-700 transition-colors text-sm font-medium"
                onDeleted={() => {
                  toast.success('Account deleted. Logging out…', { duration: 3000 });
                  logout();
                  navigate('/');
                }}
              />
            </div>
          }
        />

        {/* Footer */}
        <footer className="text-center mt-8 text-sm text-gray-500">
          🚀 Ready to download? • {planTier === 'premium' ? 'Unlimited' : planTier === 'pro' ? 'Pro' : 'Free'} Plan
        </footer>
      </div>
    </div>
  );
}


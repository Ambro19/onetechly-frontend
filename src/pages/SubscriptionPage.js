// ========================================
// SUBSCRIPTION PAGE - PIXELPERFECT SCREENSHOT API
// ========================================
// File: frontend/src/pages/SubscriptionPage.js
// Author: OneTechly
// Purpose: Subscription management and billing
// Updated: January 2026 - Converted from YCD to PixelPerfect

import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import { getDisplayEmail } from '../utils/userDisplay';
import AppBrand from '../components/AppBrand';
import ConfirmModal from '../components/ConfirmModal';

const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  process.env.REACT_APP_API_BASE_URL ||
  'http://localhost:8000';

const defaultBilling = {
  mode: 'test',
  is_demo: false,
  prices: { pro: null, business: null, premium: null },
  source: {},
};

async function fetchBillingConfig() {
  try {
    const res = await fetch(`${API_BASE_URL}/billing/config`);
    if (!res.ok) return defaultBilling;
    const json = await res.json();
    return {
      mode: json.mode || 'test',
      is_demo: !!json.is_demo,
      prices: { 
        pro: json.pro_price_id || null, 
        business: json.business_price_id || null,
        premium: json.premium_price_id || null 
      },
      source: json,
    };
  } catch {
    return defaultBilling;
  }
}

export default function SubscriptionPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { logout } = useAuth();
  const { token, user, isAuthenticated } = useAuth();
  const { subscriptionStatus, tier, refreshSubscriptionStatus, startCheckout } = useSubscription();

  const [billing, setBilling] = useState(defaultBilling);
  const [loadingAction, setLoadingAction] = useState(false);
  const [lastError, setLastError] = useState(null);
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);
  const [paymentProcessed, setPaymentProcessed] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const mountedRef = useRef(true);
  const pollTimeoutRef = useRef(null);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (pollTimeoutRef.current) clearTimeout(pollTimeoutRef.current);
    };
  }, []);

  const email = useMemo(() => getDisplayEmail(user), [user]);

  const planTier = (tier || 'free').toLowerCase();
  const isActive = planTier !== 'free';

  // ✅ CONVERTED: Single screenshot usage counter
  const clamp = (u, l) => (l === 'unlimited' || l === Infinity || l == null ? Number(u || 0) : Math.min(Number(u || 0), Number(l || 0)));
  
  const percent = (u, l) => {
    if (l === 'unlimited' || l === Infinity) return 0;
    const L = Number(l || 0);
    if (L <= 0) return 0;
    const s = clamp(u, l);
    return Math.max(0, Math.min(100, Math.round((s / L) * 100)));
  };

  const bar = (u, l, colorClass) => (
    <div className="w-full bg-gray-200/70 h-2 rounded overflow-hidden">
      <div
        className={`h-2 ${colorClass}`}
        style={{ width: `${percent(u, l)}%` }}
      />
    </div>
  );

  // ✅ CONVERTED: Single screenshot usage formatter
  const fmtUsage = () => {
    const u = subscriptionStatus?.usage?.screenshots ?? 0;
    const l = subscriptionStatus?.limits?.screenshots;
    if (l === 'unlimited' || l === Infinity) return `${u} / ∞`;
    const clamped = clamp(u, l);
    return `${clamped} / ${l ?? 0}`;
  };

  const checkPaymentSuccess = useCallback(() => {
    const checkout = searchParams.get('checkout');
    const sessionId = searchParams.get('session_id');
    if (checkout === 'success' && sessionId && !paymentProcessed) {
      setIsCheckingPayment(true);
      setPaymentProcessed(true);
      toast.loading('Processing your payment...', { id: 'payment-processing' });

      let retries = 0;
      const maxRetries = 20;
      const checkInterval = 2000;

      const poll = async () => {
        try {
          const res = await fetch(`${API_BASE_URL}/subscription_status?sync=1`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!res.ok) throw new Error('status check failed');

          const js = await res.json();
          const currentTier = (js?.tier || 'free').toLowerCase();

          if (currentTier !== 'free') {
            toast.dismiss('payment-processing');
            toast.success(`🎉 Welcome to ${currentTier[0].toUpperCase() + currentTier.slice(1)}!`, { duration: 5000 });
            await refreshSubscriptionStatus({ force: true, sync: false });
            if (mountedRef.current) setSearchParams({}, { replace: true });
            if (mountedRef.current) setIsCheckingPayment(false);
            return;
          }

          if (++retries < maxRetries) {
            pollTimeoutRef.current = setTimeout(poll, checkInterval);
          } else {
            toast.dismiss('payment-processing');
            toast.error('Payment succeeded, but upgrade is still propagating. Try refresh in a moment.');
            if (mountedRef.current) setIsCheckingPayment(false);
          }
        } catch {
          if (++retries < maxRetries) {
            pollTimeoutRef.current = setTimeout(poll, checkInterval);
          } else {
            toast.dismiss('payment-processing');
            toast.error('Unable to verify payment status. Please refresh.');
            if (mountedRef.current) setIsCheckingPayment(false);
          }
        }
      };

      poll();
    }
  }, [searchParams, paymentProcessed, token, refreshSubscriptionStatus, setSearchParams]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    (async () => {
      fetchBillingConfig().then(setBilling);
      await refreshSubscriptionStatus({ force: true, sync: false });
      checkPaymentSuccess();
    })();
  }, [isAuthenticated, navigate, refreshSubscriptionStatus, checkPaymentSuccess, user?.username]);

  const canUpgradeToPro = planTier === 'free';
  const canUpgradeToBusiness = planTier === 'free' || planTier === 'pro';
  const canUpgradeToPremium = planTier !== 'premium';

  const openBillingPortal = async () => {
    try {
      setLoadingAction(true);
      setLastError(null);

      const res = await fetch(`${API_BASE_URL}/billing/create_portal_session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (res.ok && data?.url) {
        window.location.assign(data.url);
      } else {
        let errorMsg = 'Billing portal is not configured. Please contact support.';
        if (data?.detail?.includes?.('configuration') || data?.detail?.includes?.('portal')) {
          errorMsg = 'Billing portal is being set up. Try again shortly or contact support.';
        } else if (data?.detail?.includes?.('subscription')) {
          errorMsg = 'No active subscription found. Please upgrade first.';
        } else if (data?.detail?.includes?.('customer')) {
          errorMsg = 'Customer account not found. Contact support.';
        } else if (data?.detail?.includes?.('default configuration')) {
          errorMsg = 'Billing portal configuration incomplete. Contact support.';
        } else if (data?.detail) {
          errorMsg = data.detail;
        }
        setLastError(errorMsg);
        toast.error(errorMsg, { duration: 6000 });
      }
    } catch {
      const errorMsg = 'Could not open billing portal. Please try again or contact support.';
      setLastError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoadingAction(false);
    }
  };

  const handleSmartUpgrade = async (planType) => {
    if (!token) return toast.error('Please log in to upgrade your subscription');

    if (planTier !== 'free') {
      toast.loading('Opening billing portal for subscription changes...', { duration: 2000 });
      await openBillingPortal();
      return;
    }

    try {
      setLoadingAction(true);
      setLastError(null);
      const loadingToast = toast.loading(`Setting up ${planType} plan checkout...`);
      await startCheckout(planType);
      toast.dismiss(loadingToast);
    } catch (error) {
      toast.dismiss();
      const msg = error?.message || 'Failed to start checkout. Please try again.';
      setLastError(msg);
      toast.error(msg, { duration: 5000 });
    } finally {
      setLoadingAction(false);
    }
  };

  const cancelSubscription = () => {
    if (planTier === 'free') return toast('You are on the Free plan — nothing to cancel.');
    setShowCancelModal(true);
  };

  const performCancelSubscription = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/subscription/cancel`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.detail || 'Cancellation failed');

      toast.success('Subscription cancelled. You will keep access until the current period ends.');
      await refreshSubscriptionStatus({ force: true, sync: false });
      setShowCancelModal(false);
    } catch (e) {
      const msg = e?.message || 'Could not cancel subscription. Please try again.';
      toast.error(msg, { duration: 5000 });
    }
  };

  const getSmartButtonText = (planType) =>
    (planTier === 'free'
      ? `Upgrade to ${planType[0].toUpperCase() + planType.slice(1)}`
      : `Switch to ${planType[0].toUpperCase() + planType.slice(1)}`);

  const getBillingButtonText = () =>
    (planTier === 'free' ? 'View Billing Options' : 'Manage Billing & Payments');

  // CONVERTED: Screenshot-focused plan descriptions
  const plans = useMemo(
    () => [
      { id: 'free', name: 'Free', price: 0, popular: false, features: [
        '100 screenshots per month',
        'All formats (PNG, JPEG, WebP, PDF)',
        'Standard viewport sizes',
        'Basic screenshot options',
        'Community support',
      ]},
      { id: 'pro', name: 'Pro', price: 49, popular: true, features: [
        '5,000 screenshots per month',
        'All formats + faster processing',
        'Custom viewport dimensions',
        'Full-page screenshots',
        'Priority support (<4h weekdays)',
        'Batch processing (up to 50 URLs)',
      ]},
      { id: 'business', name: 'Business', price: 199, popular: false, features: [
        '50,000 screenshots per month',
        'All Pro features',
        'Advanced screenshot options',
        'Dark mode screenshots',
        'Element removal (CSS selectors)',
        'Priority support (<2h weekdays)',
        'Batch processing (up to 100 URLs)',
      ]},
      { id: 'premium', name: 'Premium', price: 499, popular: false, features: [
        'Unlimited screenshots',
        'All Business features',
        'API access with webhooks',
        'Custom integrations (S3, Slack, SSO)',
        'Dedicated support (<1h 24/7)',
        'Unlimited batch processing',
        'White-label options',
      ]},
    ],
    []
  );

  const canUpgrade = (plan) =>
    (plan.id === 'pro' && canUpgradeToPro) ||
    (plan.id === 'business' && canUpgradeToBusiness) ||
    (plan.id === 'premium' && canUpgradeToPremium);

  const getPlanButton = (plan) => {
    const current = planTier;
    const isCurrent = current === plan.id;
    const isFreeCardDowngradeBlocked = plan.id === 'free' && current !== 'free';
    const isProCardDowngradeBlocked = plan.id === 'pro' && (current === 'business' || current === 'premium');
    const isBusinessCardDowngradeBlocked = plan.id === 'business' && current === 'premium';
    const base =
      'w-full py-3 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed';

    if (isCurrent) {
      return <button disabled className={`${base} bg-green-100 text-green-800 border border-green-200`}>✓ Current Plan</button>;
    }
    if (isFreeCardDowngradeBlocked || isProCardDowngradeBlocked || isBusinessCardDowngradeBlocked) {
      return <button disabled className={`${base} bg-gray-100 text-gray-500 border border-gray-200`}>No Downgrade Available</button>;
    }

    if (canUpgrade(plan)) {
      const isPro = plan.id === 'pro';
      const isBusiness = plan.id === 'business';
      return (
        <button
          onClick={() => handleSmartUpgrade(plan.id)}
          disabled={loadingAction || isCheckingPayment}
          className={`${base} ${
            isPro ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500' : 
            isBusiness ? 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-500' :
            'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
          } text-white ${(loadingAction || isCheckingPayment) ? 'opacity-75 cursor-wait' : ''}`}
        >
          {loadingAction ? 'Setting up...' : isCheckingPayment ? 'Processing...' : getSmartButtonText(plan.id)}
        </button>
      );
    }
    return <button disabled className={`${base} bg-green-100 text-green-800 border border-green-200`}>✓ Current Plan</button>;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8 py-6">

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
        <header className="mb-6 text-center">
          <div className="flex justify-center items-center mb-4">
            <div className="text-6xl">📸</div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">💳 Subscription</h1>
          <div className="text-sm text-gray-600">
            Logged in as: <span className="font-semibold text-blue-600">{user?.username || 'User'}</span>{' '}
            (<span className="font-mono">{user?.email}</span>)
          </div>

          {/* Navigation Actions */}
          <div className="mt-4 flex gap-4 justify-center flex-wrap">
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              ← Back to Dashboard
            </button>
            <button
              onClick={logout}
              className="text-sm text-red-600 hover:text-red-800 underline transition-colors"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Payment Processing Indicator */}
        {isCheckingPayment && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Processing Your Payment</h3>
                <div className="mt-2 text-sm text-blue-700">
                  We're verifying your payment and upgrading your account. This usually takes a few seconds...
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Error Display */}
        {lastError && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-red-800">
                  {lastError.includes('configuration') || lastError.includes('portal') ? 'Billing Portal Setup Required' : 'Payment Setup Issue'}
                </h3>
                <div className="mt-2 text-sm text-red-700">{lastError}</div>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => setLastError(null)}
                    className="bg-red-100 text-red-800 px-3 py-1 rounded text-sm hover:bg-red-200 transition-colors"
                  >
                    Dismiss
                  </button>
                  {(lastError.includes('configuration') || lastError.includes('portal')) && (
                    <button
                      onClick={() => window.open('https://dashboard.stripe.com/test/settings/billing/portal', '_blank')}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm hover:bg-blue-200 transition-colors"
                    >
                      Open Stripe Dashboard
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Current Status */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Status</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <div className="text-sm text-gray-700">Account</div>
              <div className="text-gray-900 text-sm">{email}</div>
              <div className="text-sm text-gray-600">
                Plan: <span className="font-semibold capitalize">{planTier || 'free'}</span>
              </div>
              <div className={`inline-flex items-center mt-1 text-sm px-2 py-0.5 rounded-full ${isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>
                {isActive ? '✅ Active' : 'Inactive'}
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-sm text-gray-700">Usage This Month</div>

              {/* CONVERTED: Single screenshot usage counter */}
              <div>
                <div className="flex items-center justify-between text-xs">
                  <div>📸 Screenshots: {fmtUsage()}</div>
                </div>
                {bar(
                  subscriptionStatus?.usage?.screenshots ?? 0,
                  subscriptionStatus?.limits?.screenshots,
                  'bg-blue-500'
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h3 className="text-md font-semibold text-gray-900 mb-3">Quick Actions</h3>

          {planTier === 'free' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <button
                onClick={() => handleSmartUpgrade('pro')}
                disabled={loadingAction || isCheckingPayment}
                className={`w-full py-3 rounded-lg font-medium transition-all ${
                  !loadingAction && !isCheckingPayment
                    ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                {loadingAction ? 'Setting up...' : isCheckingPayment ? 'Processing...' : 'Upgrade to Pro'}
              </button>
              <button
                onClick={() => handleSmartUpgrade('business')}
                disabled={loadingAction || isCheckingPayment}
                className={`w-full py-3 rounded-lg font-medium transition-all ${
                  !loadingAction && !isCheckingPayment
                    ? 'bg-purple-600 text-white hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                {loadingAction ? 'Setting up...' : isCheckingPayment ? 'Processing...' : 'Upgrade to Business'}
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={openBillingPortal}
              disabled={loadingAction || isCheckingPayment}
              className={`group w-full py-3 px-4 rounded-lg font-medium border transition-all duration-200 focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed ${
                planTier === 'free'
                  ? 'border-blue-300 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 hover:from-blue-100 hover:to-indigo-100 focus:ring-blue-500 shadow-sm'
                  : 'border-green-300 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 hover:from-green-100 hover:to-emerald-100 focus:ring-green-500 shadow-sm'
              }`}
              title={loadingAction || isCheckingPayment ? 'Processing...' : 'Manage your billing and payment methods'}
            >
              <div className="flex items-center justify-center">
                <svg className="w-4 h-4 mr-2 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                {getBillingButtonText()}
              </div>
            </button>

            <button
              onClick={cancelSubscription}
              disabled={planTier === 'free' || loadingAction || isCheckingPayment}
              className={`w-full py-3 rounded-lg font-medium transition-colors ${
                planTier === 'free'
                  ? 'bg-red-100 text-red-400 cursor-not-allowed'
                  : 'bg-red-50 text-red-700 hover:bg-red-100 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-60'
              }`}
              title={planTier === 'free' ? 'No subscription to cancel' : 'Cancel your subscription'}
            >
              Cancel Subscription
            </button>

            <button
              onClick={() =>
                (planTier === 'pro' || planTier === 'business' || planTier === 'premium')
                  ? navigate('/batch')
                  : toast('Upgrade to Pro to use Batch Screenshots.')
              }
              disabled={!(planTier === 'pro' || planTier === 'business' || planTier === 'premium')}
              className={`w-full py-3 rounded-lg font-medium transition-colors ${
                (planTier === 'pro' || planTier === 'business' || planTier === 'premium')
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
              title={(planTier === 'pro' || planTier === 'business' || planTier === 'premium')
                ? 'Open Batch Screenshots'
                : 'Batch Screenshots available on Pro and above'}
            >
              Batch Screenshots
            </button>
          </div>
        </div>

        {/* Plans */}
        <section className="mb-10 mt-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Available Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {plans.map((p) => (
              <div
                key={p.id}
                className={`relative bg-white rounded-xl shadow-sm border transition-all hover:shadow-md ${
                  p.popular ? 'border-blue-400 ring-1 ring-blue-400' : 'border-gray-200'
                } ${p.id === planTier ? 'ring-2 ring-green-500' : ''}`}
              >
                {(p.id === planTier || p.popular) && (
                  <div
                    className={`absolute top-0 left-0 right-0 text-center py-1 text-xs font-medium rounded-t-xl ${
                      p.id === planTier ? 'bg-green-500 text-white' : 'bg-blue-600 text-white'
                    }`}
                  >
                    {p.id === planTier ? 'CURRENT PLAN' : 'MOST POPULAR'}
                  </div>
                )}
                <div className={`p-6 ${(p.popular || p.id === planTier) ? 'pt-10' : ''}`}>
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{p.name}</h3>
                    <div className="mt-1">
                      <span className="text-3xl font-bold text-gray-900">${p.price}</span>
                      {p.price > 0 && <span className="text-gray-600">/month</span>}
                    </div>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {p.features.map((f, i) => (
                      <li key={i} className="flex items-start text-sm">
                        <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" clipRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                        </svg>
                        <span className="ml-2 text-gray-700">{f}</span>
                      </li>
                    ))}
                  </ul>
                  {getPlanButton(p)}
                </div>
              </div>
            ))}
          </div>
        </section>

        <footer className="text-center mt-8 text-sm text-gray-500">
          💳 {billing.is_demo
            ? 'Demo payments for development'
            : billing.mode === 'live'
              ? 'Secure payments processed by Stripe • Cancel anytime • No hidden fees'
              : 'Secure payments processed by Stripe • Cancel anytime • No hidden fees'}
        </footer>
      </div>

      {/* Modal: Cancel Subscription */}
      <ConfirmModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={performCancelSubscription}
        title="Cancel Your Subscription"
        emoji="⚠️"
        bullets={[
          'No further charges after the current period.',
          'Access remains active until the period ends.',
          'You can re-subscribe anytime from this page.',
          'Your account stays intact (history & settings preserved).',
        ]}
        expectedText="CANCEL MY SUBSCRIPTION"
        confirmLabel="🛑 Cancel Subscription"
        cancelLabel="Keep Subscription"
        accent="amber"
        subtitle={
          <>
            This will cancel <span className="font-semibold">{(planTier || 'free').toUpperCase()}</span> for{' '}
            <span className="font-mono">{email}</span>. You'll keep access until the end of the current billing period.
          </>
        }
      />
    </div>
  );
}
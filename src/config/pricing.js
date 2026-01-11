// ========================================
// PRICING CONFIGURATION - PIXELPERFECT FRONTEND
// ========================================
// Production-ready pricing display configuration
// File: frontend/src/config/pricing.js
// Author: OneTechly
// Created: January 2026

/**
 * Centralized pricing configuration for PixelPerfect frontend
 * 
 * This should match backend/config/pricing.py exactly
 */

export const PRICING_TIERS = {
  FREE: 'free',
  PRO: 'pro',
  BUSINESS: 'business'
};

export const PRICING_CONFIG = {
  tiers: {
    free: {
      id: 'free',
      name: 'Free',
      price: {
        monthly: 0,
        yearly: 0,
        displayMonthly: '$0',
        displayYearly: '$0'
      },
      description: 'Perfect for trying out PixelPerfect',
      screenshots: 100,
      badge: null,
      features: [
        '100 screenshots/month',
        'Basic customization',
        'Community support'
      ],
      cta: 'Get Started Free',
      highlighted: false,
      limits: {
        screenshotsPerMonth: 100,
        screenshotsPerDay: 10,
        screenshotsPerHour: 5,
        batchSize: 5,
        maxWidth: 1920,
        maxHeight: 1080,
        formats: ['PNG', 'JPEG']
      }
    },
    pro: {
      id: 'pro',
      name: 'Pro',
      price: {
        monthly: 49,
        yearly: 490, // ~$41/month (16% savings)
        displayMonthly: '$49',
        displayYearly: '$490',
        savingsPercent: 16
      },
      description: 'For professionals and small teams',
      screenshots: 5000,
      badge: 'MOST POPULAR',
      features: [
        '5,000 screenshots/month',
        'Full customization',
        'Batch processing',
        'Priority support'
      ],
      cta: 'Start Pro Trial',
      highlighted: true,
      limits: {
        screenshotsPerMonth: 5000,
        screenshotsPerDay: 500,
        screenshotsPerHour: 100,
        batchSize: 50,
        maxWidth: 3840,
        maxHeight: 2160,
        formats: ['PNG', 'JPEG', 'WebP']
      }
    },
    business: {
      id: 'business',
      name: 'Business',
      price: {
        monthly: 199,
        yearly: 1990, // ~$166/month (16% savings)
        displayMonthly: '$199',
        displayYearly: '$1,990',
        savingsPercent: 16
      },
      description: 'For agencies and large teams',
      screenshots: 50000,
      badge: null,
      features: [
        '50,000 screenshots/month',
        'Everything in Pro',
        'Webhooks & change detection',
        'Dedicated support'
      ],
      cta: 'Start Business Trial',
      highlighted: false,
      limits: {
        screenshotsPerMonth: 50000,
        screenshotsPerDay: 5000,
        screenshotsPerHour: 500,
        batchSize: 100,
        maxWidth: 3840,
        maxHeight: 2160,
        formats: ['PNG', 'JPEG', 'WebP']
      }
    }
  },
  
  overage: {
    pricePerScreenshot: 0.002,
    minimumCharge: 5.00,
    description: 'Pay-as-you-go for overages'
  },
  
  billingCycles: {
    monthly: {
      id: 'monthly',
      name: 'Monthly',
      description: 'Billed monthly'
    },
    yearly: {
      id: 'yearly',
      name: 'Yearly',
      description: 'Billed annually (save 16%)'
    }
  }
};

/**
 * Get pricing for a specific tier
 */
export function getTierPricing(tierId, billingCycle = 'monthly') {
  const tier = PRICING_CONFIG.tiers[tierId];
  if (!tier) return null;
  
  return {
    ...tier,
    currentPrice: billingCycle === 'yearly' ? tier.price.yearly : tier.price.monthly,
    currentPriceDisplay: billingCycle === 'yearly' ? tier.price.displayYearly : tier.price.displayMonthly
  };
}

/**
 * Get all tier IDs
 */
export function getTierIds() {
  return Object.keys(PRICING_CONFIG.tiers);
}

/**
 * Get comparison of all tiers
 */
export function getTierComparison() {
  return getTierIds().map(id => PRICING_CONFIG.tiers[id]);
}

/**
 * Format price for display
 */
export function formatPrice(amount) {
  if (amount === 0) return '$0';
  return `$${amount}`;
}

/**
 * Calculate savings for yearly billing
 */
export function calculateYearlySavings(tierId) {
  const tier = PRICING_CONFIG.tiers[tierId];
  if (!tier || tier.price.monthly === 0) return null;
  
  const monthlyAnnual = tier.price.monthly * 12;
  const yearlyPrice = tier.price.yearly;
  const savings = monthlyAnnual - yearlyPrice;
  const savingsPercent = Math.round((savings / monthlyAnnual) * 100);
  
  return {
    amount: savings,
    percentage: savingsPercent,
    display: `Save ${formatPrice(savings)} (${savingsPercent}%)`
  };
}

/**
 * Check if user has access to a feature based on tier
 */
export function hasFeatureAccess(userTier, feature) {
  const features = {
    batchProcessing: ['pro', 'business'],
    webhooks: ['business'],
    changeDetection: ['business'],
    prioritySupport: ['pro', 'business'],
    darkMode: ['pro', 'business'],
    elementRemoval: ['pro', 'business'],
    customDelays: ['pro', 'business']
  };
  
  const allowedTiers = features[feature];
  return allowedTiers ? allowedTiers.includes(userTier) : false;
}

/**
 * Get feature comparison matrix
 */
export const FEATURE_COMPARISON = {
  'Screenshots per month': {
    free: '100',
    pro: '5,000',
    business: '50,000'
  },
  'Resolution': {
    free: 'Up to 1920x1080',
    pro: 'Up to 4K (3840x2160)',
    business: 'Up to 4K (3840x2160)'
  },
  'Image formats': {
    free: 'PNG, JPEG',
    pro: 'PNG, JPEG, WebP',
    business: 'PNG, JPEG, WebP'
  },
  'Batch processing': {
    free: '❌',
    pro: '✅ Up to 50 URLs',
    business: '✅ Up to 100 URLs'
  },
  'Webhooks': {
    free: '❌',
    pro: '❌',
    business: '✅'
  },
  'Change detection': {
    free: '❌',
    pro: '❌',
    business: '✅'
  },
  'Dark mode screenshots': {
    free: '❌',
    pro: '✅',
    business: '✅'
  },
  'Element removal': {
    free: '❌',
    pro: '✅',
    business: '✅'
  },
  'Support': {
    free: 'Community',
    pro: 'Priority',
    business: 'Dedicated'
  },
  'Rate limits': {
    free: '10/min',
    pro: '100/min',
    business: '500/min'
  },
  'SLA': {
    free: '❌',
    pro: '99% uptime',
    business: '99.9% uptime'
  }
};

/**
 * Marketing copy for each tier
 */
export const TIER_MARKETING = {
  free: {
    headline: 'Get started for free',
    subheadline: 'Perfect for testing and small projects',
    benefits: [
      'No credit card required',
      'Full API access',
      'Community support'
    ]
  },
  pro: {
    headline: 'Best for professionals',
    subheadline: 'Everything you need to build great products',
    benefits: [
      '5,000 screenshots per month',
      'Priority support',
      'Advanced features',
      '14-day free trial'
    ]
  },
  business: {
    headline: 'Scale with confidence',
    subheadline: 'For teams that need enterprise features',
    benefits: [
      '50,000 screenshots per month',
      'Webhooks & monitoring',
      'Dedicated support',
      '99.9% uptime SLA',
      '14-day free trial'
    ]
  }
};

/**
 * FAQ about pricing
 */
export const PRICING_FAQ = [
  {
    question: 'Can I change my plan anytime?',
    answer: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we\'ll prorate the charges.'
  },
  {
    question: 'What happens if I exceed my limit?',
    answer: 'You\'ll be charged $0.002 per additional screenshot (minimum $5). You can also upgrade to a higher tier to avoid overage charges.'
  },
  {
    question: 'Do you offer annual billing?',
    answer: 'Yes! Save 16% by paying annually. For example, Pro is $490/year instead of $588 ($49/month × 12).'
  },
  {
    question: 'Is there a free trial?',
    answer: 'Pro and Business plans include a 14-day free trial. No credit card required to start the Free plan.'
  },
  {
    question: 'Can I get a refund?',
    answer: 'Yes, we offer a 30-day money-back guarantee. If you\'re not satisfied, we\'ll refund your payment in full.'
  },
  {
    question: 'Do you offer custom enterprise plans?',
    answer: 'Absolutely! Contact sales@pixelperfectapi.net for custom pricing and enterprise features.'
  }
];

export default PRICING_CONFIG;
//SubscriptionBanner.js

import React from 'react';

const SubscriptionBanner = ({ subscriptionStatus, onUpgradeClick }) => {
  // If no subscription data yet, show loading
  if (!subscriptionStatus) {
    return (
      <div className="bg-gray-200 rounded-lg animate-pulse p-4 mb-6">
        <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      </div>
    );
  }

  const { tier, usage, limits, remaining } = subscriptionStatus;

  // Different banner styles based on subscription tier
  let bannerStyles = {
    free: {
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-700',
      buttonColor: 'bg-youtube-red hover:bg-youtube-darkRed',
      borderColor: 'border-gray-200'
    },
    basic: {
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      buttonColor: 'bg-blue-600 hover:bg-blue-700',
      borderColor: 'border-blue-100'
    },
    premium: {
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      buttonColor: 'bg-purple-600 hover:bg-purple-700',
      borderColor: 'border-purple-100'
    }
  };

  const styles = bannerStyles[tier] || bannerStyles.free;
  
  // Check if user is close to reaching limits
  const isCloseToLimit = (type) => {
    if (limits[type] === 'unlimited' || remaining[type] === 'unlimited') return false;
    return remaining[type] <= Math.max(3, limits[type] * 0.1); // Less than 10% remaining or 3 left
  };

  const nearingLimitUnclean = isCloseToLimit('unclean');
  const nearingLimitClean = isCloseToLimit('clean');

  return (
    <div className={`rounded-lg border ${styles.bgColor} ${styles.borderColor} p-4 mb-6 shadow-soft`}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h2 className={`text-lg font-medium ${styles.textColor}`}>
            {tier === 'free' ? 'Free Plan' : tier === 'basic' ? 'Basic Plan' : 'Premium Plan'}
          </h2>
          
          <div className="mt-2 text-sm text-gray-600">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <span className="font-medium">Unclean Transcripts:</span>{' '}
                {usage.unclean} / {limits.unclean === 'unlimited' ? '∞' : limits.unclean}
                {nearingLimitUnclean && (
                  <span className="ml-2 text-yellow-600 font-medium">
                    (Running low!)
                  </span>
                )}
              </div>
              <div>
                <span className="font-medium">Clean Transcripts:</span>{' '}
                {usage.clean} / {limits.clean === 'unlimited' ? '∞' : limits.clean}
                {nearingLimitClean && (
                  <span className="ml-2 text-yellow-600 font-medium">
                    (Running low!)
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {tier === 'free' && (
          <button
            onClick={onUpgradeClick}
            className={`mt-3 md:mt-0 px-4 py-2 rounded-md text-white font-medium text-sm ${styles.buttonColor} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
          >
            Upgrade Now
          </button>
        )}
        
        {tier === 'basic' && (
          <button
            onClick={onUpgradeClick}
            className={`mt-3 md:mt-0 px-4 py-2 rounded-md text-white font-medium text-sm ${styles.buttonColor} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
          >
            Upgrade to Premium
          </button>
        )}
      </div>
    </div>
  );
};

export default SubscriptionBanner;
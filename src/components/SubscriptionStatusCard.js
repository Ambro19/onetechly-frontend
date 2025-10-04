//SubcriptionStatusCsrd.js 

import React from 'react';

const SubscriptionStatusCard = ({ status, className = '' }) => {
  const { tier, usage, limits, expiry_date } = status;
  
  // Format expiry date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  // Calculate progress percentages
  const calcProgress = (used, limit) => {
    if (!limit || limit === 'unlimited') return 0;
    return Math.min(100, Math.round((used / limit) * 100));
  };
  
  const uncleanProgress = calcProgress(usage.unclean, limits.unclean);
  const cleanProgress = calcProgress(usage.clean, limits.clean);
  
  // Determine status colors
  const getTierColor = () => {
    switch(tier) {
      case 'premium': return 'text-purple-700';
      case 'basic': return 'text-blue-700';
      default: return 'text-gray-700';
    }
  };
  
  const getProgressColor = (percent) => {
    if (percent > 90) return 'bg-red-500';
    if (percent > 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };
  
  return (
    <div className={`bg-white rounded-lg shadow-soft overflow-hidden ${className}`}>
      <div className="px-6 py-5 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Your Subscription</h3>
      </div>
      
      <div className="px-6 py-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-sm font-medium text-gray-500">Current Plan</h4>
            <p className={`text-xl font-semibold ${getTierColor()}`}>
              {tier === 'free' 
                ? 'Free Plan' 
                : tier === 'basic' 
                  ? 'Basic Plan' 
                  : 'Premium Plan'}
            </p>
          </div>
          
          {expiry_date && tier !== 'free' && (
            <div className="text-right">
              <h4 className="text-sm font-medium text-gray-500">Renews On</h4>
              <p className="text-base font-medium text-gray-900">{formatDate(expiry_date)}</p>
            </div>
          )}
        </div>
        
        <div className="space-y-6 mt-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium text-gray-700">
                Unclean Transcripts Usage
              </h4>
              <span className="text-sm text-gray-500">
                {usage.unclean} / {limits.unclean === 'unlimited' ? 'Unlimited' : limits.unclean}
              </span>
            </div>
            
            {limits.unclean !== 'unlimited' && (
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${getProgressColor(uncleanProgress)}`} 
                  style={{ width: `${uncleanProgress}%` }}
                ></div>
              </div>
            )}
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium text-gray-700">
                Clean Transcripts Usage
              </h4>
              <span className="text-sm text-gray-500">
                {usage.clean} / {limits.clean === 'unlimited' ? 'Unlimited' : limits.clean}
              </span>
            </div>
            
            {limits.clean !== 'unlimited' && (
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${getProgressColor(cleanProgress)}`} 
                  style={{ width: `${cleanProgress}%` }}
                ></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionStatusCard;
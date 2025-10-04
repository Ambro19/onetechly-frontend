//SubscriptionPlanCard.js

import React from 'react';

const SubscriptionPlanCard = ({ plan, isCurrentPlan, onSelect }) => {
  const { id, name, price, features, recommended } = plan;
  
  return (
    <div className={`rounded-lg shadow-soft overflow-hidden ${
      recommended ? 'border-2 border-youtube-red' : 'border border-gray-200'
    }`}>
      {recommended && (
        <div className="bg-youtube-red py-1 text-white text-center text-sm font-medium">
          Recommended
        </div>
      )}
      
      <div className="p-6 bg-white">
        <h3 className="text-center text-xl font-semibold text-gray-900">
          {name}
        </h3>
        
        <div className="mt-4 flex justify-center">
          <span className="text-4xl font-extrabold text-gray-900">{price}</span>
          <span className="text-base font-medium text-gray-500 ml-1 mt-auto">/mo</span>
        </div>
        
        <ul className="mt-6 space-y-4">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="ml-3 text-sm text-gray-700">{feature}</p>
            </li>
          ))}
        </ul>
        
        <div className="mt-8">
          <button
            onClick={() => onSelect(id)}
            disabled={isCurrentPlan}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
              isCurrentPlan 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-youtube-red hover:bg-youtube-darkRed'
            }`}
          >
            {isCurrentPlan ? 'Current Plan' : 'Select Plan'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlanCard;
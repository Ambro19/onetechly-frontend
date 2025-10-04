// src/config/config.js - Frontend Configuration

const config = {
  // API Base URL
  API_BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000',

  // Stripe Configuration
  //STRIPE_PUBLISHABLE_KEY: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_51RPdJYGg8JIA2Tvtgd05fcpqJP7I1GEGLBjy16m2u6jIr8k04nkOQNhMYQIcRvHaUg88yjuST0ZcfRsRWEkra4Fo00l4peuvKS',
  
  // 🔧 FIXED: Use your standardized environment variable names
  STRIPE_PUBLISHABLE_KEY: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_51RPdJYGg8JIA2Tvtgd05fcpqJP7I1GEGLBjy16m2u6jIr8k04nkOQNhMYQIcRvHaUg88yjuST0ZcfRsRWEkra4Fo00l4peuvKS',

  // Stripe Price IDs (from your Stripe Dashboard)
  PRO_PRICE_ID: process.env.REACT_APP_PRO_PRICE_ID || 'price_1RTZOEGg8JIA2Tvt7LYf6EB5',
  //PRO_PRICE_ID: process.env.PRO_PRICE_ID || 'price_1RTZOEGg8JIA2Tvt7LYf6EB5',

  PREMIUM_PRICE_ID: process.env.REACT_APP_PREMIUM_PRICE_ID || 'price_1RTZSiGg8JIA2Tvt3HizenTM',
  //PREMIUM_PRICE_ID: process.env.PREMIUM_PRICE_ID || 'price_1RTZSiGg8JIA2Tvt3HizenTM',

  // Plan Configuration
  PLANS: {
    free: {
      name: 'Free',
      price: 0,
      priceId: null,
      limits: {
        clean_transcripts: 5,
        unclean_transcripts: 3,
        audio_downloads: 2,
        video_downloads: 1
      },
      features: [
        '5 transcript downloads',
        'Basic formats (TXT, SRT,VTT)',  //'Basic formats (TXT, SRT) Added:VTT'
        'Community support',
        'No priority processing'
      ]
    },
    pro: {
      name: 'Pro',
      price: 9.99,
      priceId: process.env.REACT_APP_PRO_PRICE_ID || 'price_1RTZOEGg8JIA2Tvt7LYf6EB5',
      limits: {
        clean_transcripts: 100,
        unclean_transcripts: 50,
        audio_downloads: 50,
        video_downloads: 20
      },
      features: [
        '100 transcript downloads',
        'All formats (TXT, SRT, VTT)',
        'Priority processing',
        'Email support',
        'Advanced transcript cleaning'
      ]
    },
    premium: {
      name: 'Premium',
      price: 19.99,
      priceId: process.env.REACT_APP_PREMIUM_PRICE_ID || 'price_1RTZSiGg8JIA2Tvt3HizenTM',
      limits: {
        clean_transcripts: Infinity,
        unclean_transcripts: Infinity,
        audio_downloads: Infinity,
        video_downloads: Infinity
      },
      features: [
        'Unlimited downloads',
        'All formats + API access',
        'Fastest processing',
        'Priority support',
        'Batch processing',
        'Custom integrations'
      ]
    }
  },

  // Development settings
  NODE_ENV: process.env.NODE_ENV || 'development',

  // Development settings
  //DEV_MODE: process.env.NODE_ENV === 'development',
  
  // Feature flags
  FEATURES: {
    STRIPE_ENABLED: true,
    ANALYTICS_ENABLED: false,
    BETA_FEATURES: process.env.NODE_ENV === 'development'
  }
};

export default config;


// frontend/src/pages/Landing.jsx
import React from 'react';
import { PixelPerfectLogo } from '../components/PixelPerfectLogos';
import Header from '../components/Header';

export default function Landing() {
  return (
    <>
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            
            {/* Large Logo for Hero */}
            <div className="mb-8 flex justify-center">
              <PixelPerfectLogo size={80} showText={true} />
            </div>

            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Pixel-Perfect Screenshots,
              <br />
              <span className="text-blue-600">Every Time</span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Lightning-fast screenshot API for developers. 
              Capture any website with full customization in under 3 seconds.
            </p>

            <div className="flex justify-center gap-4">
              <button className="bg-gradient-to-r from-blue-600 to-blue-800 
                                text-white px-8 py-4 rounded-lg text-lg font-semibold 
                                hover:from-blue-700 hover:to-blue-900 transition-all 
                                shadow-lg hover:shadow-xl">
                Get Started Free
              </button>
              <button className="bg-white text-blue-600 px-8 py-4 rounded-lg 
                                text-lg font-semibold border-2 border-blue-600 
                                hover:bg-blue-50 transition-all">
                View Documentation
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features, etc. */}
    </>
  );
}
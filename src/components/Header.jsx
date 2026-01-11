// ========================================
// HEADER COMPONENT - PIXELPERFECT
// ========================================
// Reusable header component with responsive navigation
// File: frontend/src/components/Header.jsx
// Author: OneTechly
// Created: January 2026

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ResponsiveLogo } from './ResponsiveLogo';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Check if current route is active
  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <ResponsiveLogo textColor="text-gray-900" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a 
              href="#features" 
              className={`font-medium transition-colors ${
                isActive('/#features') 
                  ? 'text-blue-600' 
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Features
            </a>
            <a 
              href="#pricing" 
              className={`font-medium transition-colors ${
                isActive('/#pricing') 
                  ? 'text-blue-600' 
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Pricing
            </a>
            <Link 
              to="/docs" 
              className={`font-medium transition-colors ${
                isActive('/docs') 
                  ? 'text-blue-600' 
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Documentation
            </Link>
            <Link 
              to="/api" 
              className={`font-medium transition-colors ${
                isActive('/api') 
                  ? 'text-blue-600' 
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              API
            </Link>
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/login"
              className="text-gray-700 hover:text-blue-600 font-semibold transition-colors"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className="bg-gradient-to-r from-blue-600 to-blue-800 text-white 
                        px-6 py-2.5 rounded-lg font-semibold 
                        hover:from-blue-700 hover:to-blue-900 
                        transition-all shadow-md hover:shadow-lg
                        transform hover:-translate-y-0.5"
            >
              Get Started Free
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              ) : (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 6h16M4 12h16M4 18h16" 
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="space-y-4">
              <a 
                href="#features" 
                className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 
                          rounded-lg transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </a>
              <a 
                href="#pricing" 
                className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 
                          rounded-lg transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </a>
              <Link 
                to="/docs" 
                className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 
                          rounded-lg transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Documentation
              </Link>
              <Link 
                to="/api" 
                className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 
                          rounded-lg transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                API
              </Link>
              
              {/* Mobile CTA Buttons */}
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <Link
                  to="/login"
                  className="block w-full px-4 py-2 text-center text-gray-700 
                            hover:bg-gray-100 rounded-lg font-semibold transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="block w-full bg-gradient-to-r from-blue-600 to-blue-800 
                            text-white px-4 py-2 text-center rounded-lg font-semibold 
                            hover:from-blue-700 hover:to-blue-900 transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started Free
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
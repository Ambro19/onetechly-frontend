// ========================================
// APPBRAND COMPONENT - PIXELPERFECT
// ========================================
// File: frontend/src/components/AppBrand.js
// Purpose: Brand logo/header used across all pages
// Created: January 2026

import React from 'react';
import { Link } from 'react-router-dom';

/**
 * AppBrand Component
 * Displays the PixelPerfect logo and brand name
 * 
 * @param {number} size - Logo size in pixels (default: 32)
 * @param {boolean} showText - Show text label next to logo (default: true)
 * @param {string} label - Text label to display (default: "PixelPerfect API")
 * @param {string} logoSrc - Path to logo image (default: "/logo_pixelperfect.png")
 * @param {string} to - Navigation link destination (default: "/dashboard")
 */
export default function AppBrand({ 
  size = 32, 
  showText = true, 
  label = "PixelPerfect API",
  logoSrc = "/logo_pixelperfect.png",
  to = "/dashboard"
}) {
  return (
    <Link 
      to={to} 
      className="inline-flex items-center gap-3 hover:opacity-80 transition-opacity"
    >
      {/* Logo Image */}
      <img 
        src={logoSrc}
        alt="PixelPerfect Logo" 
        className="rounded-lg"
        style={{ 
          width: `${size}px`, 
          height: `${size}px`,
          objectFit: 'contain'
        }}
        onError={(e) => {
          // Fallback if logo image doesn't exist
          e.target.style.display = 'none';
          e.target.parentElement.querySelector('.logo-fallback').style.display = 'flex';
        }}
      />
      
      {/* Fallback logo (emoji) if image doesn't load */}
      <div 
        className="logo-fallback rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center"
        style={{ 
          width: `${size}px`, 
          height: `${size}px`,
          display: 'none'
        }}
      >
        <span className="text-white" style={{ fontSize: `${size * 0.5}px` }}>📸</span>
      </div>
      
      {/* Text Label */}
      {showText && (
        <div className="flex flex-col">
          <span className="font-bold text-gray-900 text-lg leading-tight">
            {label}
          </span>
          <span className="text-xs text-gray-500">
            by OneTechly
          </span>
        </div>
      )}
    </Link>
  );
}

// ========================================
// USAGE EXAMPLES:
// ========================================
//
// Basic usage:
// <AppBrand />
//
// Custom size:
// <AppBrand size={48} />
//
// Logo only (no text):
// <AppBrand showText={false} />
//
// Custom label:
// <AppBrand label="PixelPerfect Screenshots" />
//
// Custom destination:
// <AppBrand to="/" />
//
// Full customization:
// <AppBrand 
//   size={40}
//   showText={true}
//   label="My Screenshot API"
//   logoSrc="/custom-logo.png"
//   to="/home"
// />
// ========================================
// PIXELPERFECT LOGO COMPONENT
// ========================================
// Official PixelPerfect Screenshot API Logo
// Camera Shutter Design - Professional & Memorable
// Created: January 2026
// Author: OneTechly

import React from 'react';

// ========================================
// CAMERA SHUTTER LOGO (OFFICIAL PIXELPERFECT LOGO)
// ========================================

export const PixelPerfectLogo = ({ 
  size = 48, 
  showText = true, 
  textColor = "text-gray-900",
  className = "" 
}) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Camera Shutter Icon */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer circle - gradient blue */}
        <circle cx="100" cy="100" r="95" fill="url(#gradient1)" />
        
        {/* Shutter blades - creating aperture effect */}
        <g opacity="0.9">
          {/* 6 shutter blades in a circular pattern */}
          <path d="M100,40 L120,70 L100,100 L80,70 Z" fill="white" opacity="0.95" />
          <path d="M140,60 L150,90 L120,110 L110,80 Z" fill="white" opacity="0.9" />
          <path d="M160,100 L150,130 L120,130 L130,100 Z" fill="white" opacity="0.85" />
          <path d="M140,140 L120,150 L100,120 L110,100 Z" fill="white" opacity="0.8" />
          <path d="M100,160 L80,150 L80,120 L100,120 Z" fill="white" opacity="0.75" />
          <path d="M60,140 L50,110 L80,90 L90,120 Z" fill="white" opacity="0.7" />
        </g>
        
        {/* Center circle - represents perfect focus */}
        <circle cx="100" cy="100" r="25" fill="white" />
        <circle cx="100" cy="100" r="20" fill="url(#gradient2)" />
        
        {/* Pixel accent - small square in center */}
        <rect x="95" y="95" width="10" height="10" fill="white" rx="2" />
        
        {/* Gradients */}
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Text */}
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold text-xl ${textColor} leading-tight`}>
            PixelPerfect
          </span>
          <span className="text-xs text-gray-500 font-medium">
            Screenshot API
          </span>
        </div>
      )}
    </div>
  );
};

export default PixelPerfectLogo;
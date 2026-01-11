// ========================================
// PIXELPERFECT LOGO COMPONENTS
// ========================================
// Professional logos for PixelPerfect Screenshot API
// Created: January 2026
// Author: OneTechly

import React from 'react';

// ========================================
// 1. CAMERA SHUTTER LOGO (RECOMMENDED - PRIMARY LOGO)
// ========================================
// This represents precision, capture, and professionalism
// Works great at all sizes, memorable, unique

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


// ========================================
// 2. PIXEL GRID LOGO (ALTERNATIVE)
// ========================================
// Represents pixel-perfect accuracy with a modern grid pattern

export const PixelGridLogo = ({ 
  size = 48, 
  showText = true, 
  textColor = "text-gray-900",
  className = "" 
}) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Pixel Grid Icon */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background */}
        <rect width="200" height="200" rx="40" fill="url(#pixelGradient)" />
        
        {/* Perfect pixel grid - 5x5 grid with center highlighted */}
        <g>
          {/* Grid lines */}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <React.Fragment key={i}>
              <line 
                x1={50 + i * 20} 
                y1="50" 
                x2={50 + i * 20} 
                y2="150" 
                stroke="white" 
                strokeWidth="2" 
                opacity="0.3" 
              />
              <line 
                x1="50" 
                y1={50 + i * 20} 
                x2="150" 
                y2={50 + i * 20} 
                stroke="white" 
                strokeWidth="2" 
                opacity="0.3" 
              />
            </React.Fragment>
          ))}
          
          {/* Center perfect pixel - highlighted */}
          <rect x="90" y="90" width="20" height="20" fill="white" rx="3" />
          
          {/* Surrounding pixels with varying opacity for depth */}
          <rect x="70" y="90" width="18" height="18" fill="white" opacity="0.7" rx="2" />
          <rect x="110" y="90" width="18" height="18" fill="white" opacity="0.7" rx="2" />
          <rect x="90" y="70" width="18" height="18" fill="white" opacity="0.7" rx="2" />
          <rect x="90" y="110" width="18" height="18" fill="white" opacity="0.7" rx="2" />
          
          {/* Corner pixels */}
          <rect x="70" y="70" width="16" height="16" fill="white" opacity="0.5" rx="2" />
          <rect x="110" y="70" width="16" height="16" fill="white" opacity="0.5" rx="2" />
          <rect x="70" y="110" width="16" height="16" fill="white" opacity="0.5" rx="2" />
          <rect x="110" y="110" width="16" height="16" fill="white" opacity="0.5" rx="2" />
        </g>
        
        <defs>
          <linearGradient id="pixelGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#6366F1" />
          </linearGradient>
        </defs>
      </svg>
      
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


// ========================================
// 3. BROWSER FRAME LOGO (ALTERNATIVE)
// ========================================
// Represents web screenshots with a browser window

export const BrowserFrameLogo = ({ 
  size = 48, 
  showText = true, 
  textColor = "text-gray-900",
  className = "" 
}) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Browser Frame Icon */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Main browser window */}
        <rect x="20" y="30" width="160" height="140" rx="12" fill="url(#browserGradient)" />
        
        {/* Browser top bar */}
        <rect x="20" y="30" width="160" height="35" rx="12" fill="white" opacity="0.2" />
        
        {/* Browser dots (close, minimize, maximize) */}
        <circle cx="40" cy="47" r="5" fill="#EF4444" />
        <circle cx="58" cy="47" r="5" fill="#F59E0B" />
        <circle cx="76" cy="47" r="5" fill="#10B981" />
        
        {/* Screenshot representation inside browser */}
        <g opacity="0.9">
          {/* Image placeholder */}
          <rect x="35" y="80" width="60" height="60" rx="6" fill="white" opacity="0.8" />
          {/* Image icon */}
          <circle cx="65" cy="105" r="8" fill="url(#browserGradient)" opacity="0.5" />
          <path d="M35,130 L50,115 L65,125 L80,110 L95,125 L95,140 L35,140 Z" 
                fill="url(#browserGradient)" opacity="0.5" />
          
          {/* Text lines */}
          <rect x="105" y="85" width="60" height="8" rx="4" fill="white" opacity="0.7" />
          <rect x="105" y="100" width="50" height="8" rx="4" fill="white" opacity="0.6" />
          <rect x="105" y="115" width="55" height="8" rx="4" fill="white" opacity="0.5" />
        </g>
        
        {/* Camera/capture icon overlay */}
        <circle cx="160" cy="150" r="22" fill="white" />
        <circle cx="160" cy="150" r="18" fill="url(#browserGradient)" />
        <circle cx="160" cy="150" r="10" fill="white" opacity="0.9" />
        <rect x="157" y="147" width="6" height="6" fill="url(#browserGradient)" rx="1" />
        
        <defs>
          <linearGradient id="browserGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>
        </defs>
      </svg>
      
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


// ========================================
// 4. MINIMALIST ICON (FOR FAVICON/SMALL USE)
// ========================================
// Ultra-simple, works at tiny sizes

export const PixelPerfectIcon = ({ 
  size = 32, 
  variant = "blue" // blue, purple, cyan
}) => {
  const gradients = {
    blue: { start: "#3B82F6", end: "#1D4ED8" },
    purple: { start: "#8B5CF6", end: "#6366F1" },
    cyan: { start: "#06B6D4", end: "#0284C7" }
  };
  
  const colors = gradients[variant] || gradients.blue;
  
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Simple rounded square background */}
      <rect width="100" height="100" rx="20" fill={`url(#iconGradient-${variant})`} />
      
      {/* "PP" monogram or pixel symbol */}
      <text 
        x="50" 
        y="65" 
        fontSize="50" 
        fontWeight="bold" 
        fill="white" 
        textAnchor="middle"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        PP
      </text>
      
      <defs>
        <linearGradient id={`iconGradient-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors.start} />
          <stop offset="100%" stopColor={colors.end} />
        </linearGradient>
      </defs>
    </svg>
  );
};


// ========================================
// USAGE EXAMPLES
// ========================================

export const LogoExamples = () => {
  return (
    <div className="p-8 space-y-12 bg-gray-50">
      
      {/* Header Section */}
      <div>
        <h1 className="text-3xl font-bold mb-2">PixelPerfect Logo Options</h1>
        <p className="text-gray-600">Choose your favorite design for the PixelPerfect Screenshot API</p>
      </div>

      {/* Option 1: Camera Shutter (RECOMMENDED) */}
      <div className="bg-white p-8 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Option 1: Camera Shutter Logo ⭐ RECOMMENDED</h2>
        <div className="space-y-6">
          {/* Large with text */}
          <div>
            <p className="text-sm text-gray-600 mb-2">Large - With text (for header)</p>
            <PixelPerfectLogo size={64} showText={true} />
          </div>
          
          {/* Medium without text */}
          <div>
            <p className="text-sm text-gray-600 mb-2">Medium - Icon only (for sidebar)</p>
            <PixelPerfectLogo size={48} showText={false} />
          </div>
          
          {/* Small */}
          <div>
            <p className="text-sm text-gray-600 mb-2">Small - Icon only (for buttons)</p>
            <PixelPerfectLogo size={32} showText={false} />
          </div>
          
          {/* On dark background */}
          <div className="bg-gray-900 p-6 rounded-lg">
            <p className="text-sm text-gray-400 mb-2">On dark background</p>
            <PixelPerfectLogo size={64} showText={true} textColor="text-white" />
          </div>
        </div>
      </div>

      {/* Option 2: Pixel Grid */}
      <div className="bg-white p-8 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Option 2: Pixel Grid Logo</h2>
        <div className="space-y-6">
          <PixelGridLogo size={64} showText={true} />
          <PixelGridLogo size={48} showText={false} />
          <div className="bg-gray-900 p-6 rounded-lg">
            <PixelGridLogo size={64} showText={true} textColor="text-white" />
          </div>
        </div>
      </div>

      {/* Option 3: Browser Frame */}
      <div className="bg-white p-8 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Option 3: Browser Frame Logo</h2>
        <div className="space-y-6">
          <BrowserFrameLogo size={64} showText={true} />
          <BrowserFrameLogo size={48} showText={false} />
          <div className="bg-gray-900 p-6 rounded-lg">
            <BrowserFrameLogo size={64} showText={true} textColor="text-white" />
          </div>
        </div>
      </div>

      {/* Option 4: Minimalist Icons */}
      <div className="bg-white p-8 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Option 4: Minimalist Icons (Favicon)</h2>
        <div className="flex gap-6 items-center">
          <div>
            <p className="text-sm text-gray-600 mb-2">Blue</p>
            <PixelPerfectIcon size={64} variant="blue" />
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Purple</p>
            <PixelPerfectIcon size={64} variant="purple" />
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Cyan</p>
            <PixelPerfectIcon size={64} variant="cyan" />
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Favicon size (32px)</p>
            <PixelPerfectIcon size={32} variant="blue" />
          </div>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="bg-white p-8 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Side-by-Side Comparison</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <PixelPerfectLogo size={80} showText={false} className="justify-center mb-2" />
            <p className="font-medium">Camera Shutter</p>
            <p className="text-xs text-gray-600">Professional, unique</p>
          </div>
          <div className="text-center">
            <PixelGridLogo size={80} showText={false} className="justify-center mb-2" />
            <p className="font-medium">Pixel Grid</p>
            <p className="text-xs text-gray-600">Tech-focused, precise</p>
          </div>
          <div className="text-center">
            <BrowserFrameLogo size={80} showText={false} className="justify-center mb-2" />
            <p className="font-medium">Browser Frame</p>
            <p className="text-xs text-gray-600">Literal, clear purpose</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default PixelPerfectLogo;
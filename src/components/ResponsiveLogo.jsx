// ========================================
// RESPONSIVE LOGO COMPONENT
// ========================================
// Automatically adjusts logo size and text visibility based on screen size
// File: frontend/src/components/ResponsiveLogo.jsx
// Author: OneTechly
// Created: January 2026

import React from 'react';
import { PixelPerfectLogo } from './PixelPerfectLogos';

/**
 * ResponsiveLogo Component
 * 
 * Automatically adapts logo display based on screen size:
 * - Mobile (< 768px): Icon only, smaller size
 * - Tablet (768px - 1024px): Icon only, medium size
 * - Desktop (> 1024px): Full logo with text
 * 
 * @param {string} textColor - Text color (default: "text-gray-900")
 * @param {string} className - Additional CSS classes
 * @param {string} linkTo - Optional link destination (default: "/")
 * 
 * @example
 * // In your header
 * <ResponsiveLogo />
 * 
 * @example
 * // On dark background
 * <ResponsiveLogo textColor="text-white" />
 * 
 * @example
 * // With custom link
 * <ResponsiveLogo linkTo="/dashboard" />
 */
export const ResponsiveLogo = ({ 
  textColor = "text-gray-900",
  className = "",
  linkTo = "/"
}) => {
  return (
    <div className={className}>
      {/* Mobile: Icon only, 32px */}
      <div className="sm:hidden">
        <PixelPerfectLogo 
          size={32} 
          showText={false} 
          textColor={textColor}
        />
      </div>

      {/* Tablet: Icon only, 40px */}
      <div className="hidden sm:block md:hidden">
        <PixelPerfectLogo 
          size={40} 
          showText={false} 
          textColor={textColor}
        />
      </div>

      {/* Desktop: Full logo with text, 48px */}
      <div className="hidden md:block">
        <PixelPerfectLogo 
          size={48} 
          showText={true} 
          textColor={textColor}
        />
      </div>
    </div>
  );
};

/**
 * ResponsiveLogoWithLink Component
 * Same as ResponsiveLogo but wrapped in a clickable link
 * 
 * @example
 * <ResponsiveLogoWithLink to="/" />
 */
export const ResponsiveLogoWithLink = ({ 
  to = "/",
  textColor = "text-gray-900",
  className = ""
}) => {
  // Using regular anchor tag
  return (
    <a href={to} className={`inline-block ${className}`}>
      <ResponsiveLogo textColor={textColor} />
    </a>
  );
};

/**
 * CompactLogo Component
 * Always shows compact version (icon only) - useful for sidebars
 * 
 * @example
 * <CompactLogo size={40} />
 */
export const CompactLogo = ({ 
  size = 40,
  textColor = "text-gray-900",
  className = ""
}) => {
  return (
    <PixelPerfectLogo 
      size={size} 
      showText={false} 
      textColor={textColor}
      className={className}
    />
  );
};

/**
 * FullLogo Component
 * Always shows full version (icon + text) - useful for hero sections
 * 
 * @example
 * <FullLogo size={80} />
 */
export const FullLogo = ({ 
  size = 64,
  textColor = "text-gray-900",
  className = ""
}) => {
  return (
    <PixelPerfectLogo 
      size={size} 
      showText={true} 
      textColor={textColor}
      className={className}
    />
  );
};

export default ResponsiveLogo;
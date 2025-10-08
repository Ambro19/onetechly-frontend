// src/components/YcdLogo.jsx
import React from "react";

/**
 * Circle-styled YCD brand mark.
 * Props:
 *  - size: tailwind h/w size (default 56px -> h-14 w-14)
 *  - className: extra classes
 */
export default function YcdLogo({ size = "h-14 w-14", className = "" }) {
  return (
    <img
      src="/ycd_logo.png"          // <-- place your YCD logo at public/ycd_logo.png
      alt="YouTube Content Downloader"
      className={`${size} rounded-full shadow-sm ${className}`}
      decoding="async"
      loading="eager"
    />
  );
}

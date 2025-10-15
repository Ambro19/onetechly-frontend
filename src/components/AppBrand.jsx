// src/components/AppBrand.jsx
import React from "react";
import { Link } from "react-router-dom";

/**
 * AppBrand
 * - Renders a perfectly centered, crisp logo (SVG/PNG)
 * - Consistent sizing across mobile and desktop
 * - Optional text next to the logo (defaults to "YCD")
 */
export default function AppBrand({
  size = 28,                 // pixel size of the square logo
  showText = true,           // render text next to the logo
  label = "YouTube Content Downloader",             // ✅ default short product name
  to = "/app/dashboard",
  title = "YouTube Content Downloader",
  logoSrc = "/favicon_io/android-chrome-192x192.png", // YCD mark
}) {
  const px = typeof size === "number" ? `${size}px` : size;

  return (
    <Link
      to={to}
      className="flex items-center gap-2 select-none"
      aria-label={title}
    >
      <span
        className="inline-flex items-center justify-center rounded-xl overflow-hidden bg-white ring-1 ring-gray-200 shadow-sm"
        style={{ width: px, height: px }}
      >
        {/* Overfill to hide any transparent padding and keep the glyph centered */}
        <img
          src={logoSrc}
          alt=""
          loading="eager"
          decoding="async"
          className="block w-[115%] h-[115%] object-contain -m-[7%]"
          style={{ imageRendering: "auto" }}
        />
      </span>

      {showText && (
        <span className="font-semibold tracking-tight text-gray-900">
          {label}
        </span>
      )}
    </Link>
  );
}


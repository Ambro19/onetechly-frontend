// src/components/AppBrand.jsx
import React from "react";
import { Link } from "react-router-dom";

/**
 * AppBrand
 * - Always renders a perfectly centered, crisp logo (SVG/PNG)
 * - Keeps consistent sizing across mobile and desktop
 * - Optional text next to the logo
 */
export default function AppBrand({
  size = 28,            // pixel size of the square logo
  showText = true,      // render "YouTube Content Downloader" text
  to = "/app/dashboard",// click navigates here
  title = "YouTube Content Downloader",
  logoSrc = "/favicon_io/android-chrome-192x192.png", // fallback logo path
}) {
  const px = typeof size === "number" ? `${size}px` : size;

  return (
    <Link
      to={to}
      className="flex items-center gap-2 select-none"
      aria-label={title}
    >
      <span
        className="inline-flex items-center justify-center rounded-xl overflow-hidden bg-white"
        style={{ width: px, height: px }}
      >
        {/* The image is contained (not stretched), centered, and crisp */}
        <img
          src={logoSrc}
          alt=""
          loading="eager"
          decoding="async"
          className="block w-full h-full object-contain"
          style={{
            imageRendering: "auto",
          }}
        />
      </span>

      {showText && (
        <span className="font-semibold tracking-tight text-gray-900">
          YouTube Content Downloader
        </span>
      )}
    </Link>
  );
}

////////////////////////////////////////////////////////////////////////////
// // AppBrand.jsx – product-only brand (logo + name) for the app shell
// import React from "react";
// import YcdLogo from "./YcdLogo";

// export default function AppBrand({ showText = true, size = 32 }) {
//   return (
//     <div className="flex items-center gap-2">
//       <YcdLogo size={size} />
//       {showText && (
//         <span className="font-semibold tracking-tight">
//           YouTube Content Downloader
//         </span>
//       )}
//     </div>
//   );
// }



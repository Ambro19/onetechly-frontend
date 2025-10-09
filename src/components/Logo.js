// src/components/Logo.jsx
import React from "react";

export default function Logo({ showText = true, variant = "default" }) {
  const size =
    variant === "compact" ? "h-8 w-8" : variant === "hero" ? "h-14 w-14" : "h-6 w-6";

  return (
    <div className="flex items-center gap-2">
      <img
        src="/logo_onetechly.png"
        alt="OneTechly"
        className={`${size} rounded-xl shadow-sm`}
      />
      {showText && (
        <span className="text-base font-semibold tracking-tight text-gray-900">
          OneTechly
        </span>
      )}
    </div>
  );
}


////////////////////////////////////////////////////////////////

// // src/components/Logo.jsx
// import React from "react";
// import { Link } from "react-router-dom";

// /**
//  * Reusable brand logo.
//  * - brand: "onetechly" | "ycd"
//  * - size:  "sm" | "md" | "lg"
//  * - withText: show brand name next to the mark
//  * - to: optional Link target (omit for plain <div>)
//  */
// export default function Logo({
//   brand = "onetechly",
//   size = "md",
//   withText = true,
//   to = "/",
//   className = "",
// }) {
//   const src =
//     brand === "ycd" ? "/ycd-logo.png" : "/logo_onetechly.png"; // put your assets in /public
//   const text =
//     brand === "ycd" ? "YouTube Content Downloader" : "OneTechly";

//   const dim =
//     size === "lg" ? "h-10 w-10" : size === "sm" ? "h-7 w-7" : "h-8 w-8";

//   const Img = (
//     <img
//       src={src}
//       alt={text}
//       className={`${dim} object-cover rounded-xl ring-1 ring-indigo-100 shadow-sm`}
//       loading="lazy"
//       width={40}
//       height={40}
//     />
//   );

//   const Content = (
//     <div className={`inline-flex items-center gap-2 ${className}`}>
//       {Img}
//       {withText && (
//         <span className="font-semibold tracking-tight">
//           {text}
//         </span>
//       )}
//     </div>
//   );

//   return to ? <Link to={to}>{Content}</Link> : Content;
// }

//////////////// ----  A GOOD LOGO FILE. KEEP IT ----- /////////////////////////
// // ============================================================================
// // File: frontend/src/components/Logo.js
// // Purpose: Official brand logo (used everywhere). Variants for sizing.
// // ============================================================================
// import React from 'react';

// const Logo = ({
//   className = 'h-8 w-8',
//   showText = true,
//   textSize = 'text-lg',
//   textColor = 'text-gray-800',
//   variant = 'default', // compact | default | large | xlarge
// }) => {
//   const size = {
//     compact: 'h-6 w-6',
//     default: 'h-8 w-8',
//     large: 'h-12 w-12',
//     xlarge: 'h-16 w-16',
//   }[variant] || className;

//   return (
//     <div className="flex items-center">
//       {/* official logo */}
//       <svg viewBox="0 0 400 400" className={size} xmlns="http://www.w3.org/2000/svg" aria-hidden>
//         <circle cx="200" cy="200" r="180" fill="#F5F7FA" stroke="#C7D2FE" strokeWidth="10" />
//         <rect x="115" y="120" width="170" height="110" rx="20" ry="20" fill="#FF0000" />
//         <polygon points="185,145 185,205 230,175" fill="white" />
//         <rect x="130" y="245" width="140" height="10" rx="5" ry="5" fill="#4B5563" />
//         <rect x="150" y="265" width="100" height="10" rx="5" ry="5" fill="#6B7280" />
//         <rect x="130" y="285" width="140" height="10" rx="5" ry="5" fill="#4B5563" />
//         <path d="M200,235 L200,320 M170,290 L200,320 L230,290" stroke="#3B82F6" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none" />
//         <circle cx="200" cy="200" r="180" fill="none" stroke="#93C5FD" strokeWidth="8" strokeOpacity="0.5" />
//       </svg>
//       {showText && (
//         <span className={`ml-2 ${textSize} font-bold ${textColor}`}>YouTube Content Downloader</span>
//       )}
//     </div>
//   );
// };

// export default Logo;
// export const LogoCompact = (p) => <Logo variant="compact" showText={false} {...p} />;
// export const LogoLarge = (p) => <Logo variant="large" {...p} />;
// export const LogoXLarge = (p) => <Logo variant="xlarge" {...p} />;

// src/components/YcdLogo.jsx
import React from "react";

export default function YcdLogo({ className = "h-12 w-12" }) {
  return (
    <img
      src="/ycd_logo.png"
      alt="YouTube Content Downloader"
      className={`rounded-full shadow-sm ${className}`}
      decoding="async"
      loading="lazy"
    />
  );
}



// // src/components/YcdLogo.jsx
// import React from "react";

// export default function YcdLogo({ className = "h-12 w-12" }) {
//   return (
//     <img
//       src="/ycd_logo.png"     // file lives in /public/ycd_logo.png
//       alt="YouTube Content Downloader"
//       className={`rounded-full shadow-sm ${className}`}
//       decoding="async"
//       loading="lazy"
//     />
//   );
// }
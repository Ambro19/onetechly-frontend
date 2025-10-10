// YcdLogo.jsx – 48x48 rounded YCD mark with accessible alt text
import React from "react";

export default function YcdLogo({ size = 40, className = "" }) {
  return (
    <img
      src="/ycd_logo.png"
      width={size}
      height={size}
      alt="YouTube Content Downloader"
      className={`rounded-2xl shadow-sm select-none ${className}`}
      draggable={false}
    />
  );
}




// // src/components/YcdLogo.jsx
// import React from "react";

// /**
//  * YcdLogo
//  * size: "sm" | "md" | "lg"
//  */
// export default function YcdLogo({ size = "md", className = "" }) {
//   const sizes = {
//     sm: "h-10 w-10",
//     md: "h-14 w-14",
//     lg: "h-16 w-16 sm:h-20 sm:w-20",
//   };
//   return (
//     <img
//       src="/ycd_logo.png"
//       alt="YouTube Content Downloader"
//       className={`${sizes[size]} rounded-full shadow-sm ${className}`}
//       width={80}
//       height={80}
//       loading="eager"
//       decoding="async"
//     />
//   );
// }



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


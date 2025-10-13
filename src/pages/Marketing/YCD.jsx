// src/pages/Marketing/YCD.jsx
import React from "react";
import { Link } from "react-router-dom";
import MarketingHeader from "../../components/MarketingHeader";
import MarketingFooter from "../../components/MarketingFooter";

export default function YCD() {
  return (
    <>
      <MarketingHeader />

      <main className="py-10 sm:py-14">
        <div className="mx-auto max-w-screen-lg px-4 sm:px-6">
          {/* Small circular YCD logo ABOVE the headline */}
          <div className="mx-auto mb-5 flex items-center justify-center">
            <span
              className="inline-flex items-center justify-center rounded-2xl overflow-hidden ring-2 ring-blue-100 shadow-sm bg-white"
              style={{ width: 56, height: 56 }}
            >
              {/* Overfill slightly to hide the source image's padding */}
              <img
                src="/favicon_io/android-chrome-192x192.png"
                alt="YouTube Content Downloader"
                className="block w-[115%] h-[115%] object-contain -m-[7%]"
                loading="eager"
                decoding="async"
              />
            </span>
          </div>

          {/* Hero */}
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              YouTube Content Downloader
            </h1>
            <p className="mt-3 text-gray-600">
              Transcripts (clean &amp; timestamped), MP3 audio, and video—mobile-ready.
            </p>

            {/* Primary CTAs */}
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/login"
                className="inline-flex h-11 items-center justify-center rounded-xl
                           bg-gradient-to-r from-indigo-600 to-blue-600 px-6 font-semibold text-white
                           hover:from-indigo-700 hover:to-blue-700"
              >
                Sign in to start
              </Link>

              <Link
                to="/register"
                className="inline-flex h-11 items-center justify-center rounded-xl
                           bg-gradient-to-r from-indigo-600 to-blue-600 px-6 font-semibold text-white
                           hover:from-indigo-700 hover:to-blue-700"
              >
                Create account
              </Link>
            </div>
          </div>

          {/* (Optional) Features section stays as you like */}
          <section className="mt-10 sm:mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {/* …your feature cards/content… */}
          </section>
        </div>
      </main>

      <MarketingFooter />
    </>
  );
}


//////////////////////////////////////////////////////////
// // src/pages/Marketing/YCD.jsx
// import React from "react";
// import { Link } from "react-router-dom";
// import MarketingHeader from "../../components/MarketingHeader";
// import MarketingFooter from "../../components/MarketingFooter";
// import AppBrand from "../../components/AppBrand"; // ✅ ensure AppBrand is imported

// export default function YCD() {
//   return (
//     <>
//       <MarketingHeader />

//       <main className="py-10 sm:py-14">
//         <div className="mx-auto max-w-screen-lg px-4 sm:px-6">
//           {/* Hero section without top logo */}
//           <div className="mx-auto max-w-3xl text-center">
//             <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
//               YouTube Content Downloader
//             </h1>
//             <p className="mt-3 text-gray-600">
//               Transcripts (clean & timestamped), MP3 audio, and video—mobile-ready.
//             </p>

//             {/* Primary CTAs */}
//             <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
//               <Link
//                 to="/login"
//                 className="inline-flex h-11 items-center justify-center rounded-xl
//                            bg-gradient-to-r from-indigo-600 to-blue-600 px-6 font-semibold text-white
//                            hover:from-indigo-700 hover:to-blue-700"
//               >
//                 Sign in to start
//               </Link>

//               <Link
//                 to="/register"
//                 className="inline-flex h-11 items-center justify-center rounded-xl
//                            bg-gradient-to-r from-indigo-600 to-blue-600 px-6 font-semibold text-white
//                            hover:from-indigo-700 hover:to-blue-700"
//               >
//                 Create account
//               </Link>
//             </div>
//           </div>

//           {/* ✅ Keep only the clean circular logo below buttons */}
//           <div className="mx-auto mt-8 mb-4 flex justify-center">
//             <AppBrand
//               showText={false}
//               size={68} // tweak between 56–84 for taste/responsiveness
//               to="/ycd"
//               title="YouTube Content Downloader"
//               logoSrc="/favicon_io/android-chrome-192x192.png"
//             />
//           </div>

//           {/* Optional: additional features or sections */}
//           <section className="mt-10 sm:mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
//             {/* ... keep your existing feature cards/content here ... */}
//           </section>
//         </div>
//       </main>

//       <MarketingFooter />
//     </>
//   );
// }


////////////////////////////////////////////////////////////////////////



/////////////////////////////////////////////////////////////////
// // src/pages/Marketing/YCD.jsx
// import React from "react";
// import { Link } from "react-router-dom";
// import MarketingHeader from "../../components/MarketingHeader";
// import MarketingFooter from "../../components/MarketingFooter";

// export default function YCD() {
//   return (
//     <>
//       <MarketingHeader />

//       <main className="py-10 sm:py-14">
//         <div className="mx-auto max-w-screen-lg px-4 sm:px-6">
//           {/* Brand hero */}
//           <div className="mx-auto max-w-3xl text-center">
//             {/* Circular, centered, professional logo — mobile & desktop */}
//             <div className="mx-auto mb-6 sm:mb-8 flex items-center justify-center">
//               <span className="inline-flex rounded-full overflow-hidden ring-1 ring-gray-200 shadow-sm bg-white
//                                 w-24 h-24 sm:w-28 sm:h-28">
//                 {/* Overfill to hide extra padding while keeping the mark centered */}
//                 <img
//                   src="/favicon_io/android-chrome-192x192.png"
//                   alt="YouTube Content Downloader"
//                   className="block w-[115%] h-[115%] object-contain -m-[7%]"
//                 />
//               </span>
//             </div>

//             <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
//               YouTube Content Downloader
//             </h1>
//             <p className="mt-3 text-gray-600">
//               Transcripts (clean & timestamped), MP3 audio, and video—mobile-ready.
//             </p>

//             {/* Primary CTAs */}
//             <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
//               <Link
//                 to="/login"
//                 className="inline-flex h-11 items-center justify-center rounded-xl
//                            bg-gradient-to-r from-indigo-600 to-blue-600 px-6 font-semibold text-white
//                            hover:from-indigo-700 hover:to-blue-700"
//               >
//                 Sign in to start
//               </Link>

//               {/* Make Create account the same blue primary style */}
//               <Link
//                 to="/register"
//                 className="inline-flex h-11 items-center justify-center rounded-xl
//                            bg-gradient-to-r from-indigo-600 to-blue-600 px-6 font-semibold text-white
//                            hover:from-indigo-700 hover:to-blue-700"
//               >
//                 Create account
//               </Link>
//             </div>
//           </div>

//           {/* Your existing feature cards/content below */}
//           <section className="mt-10 sm:mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
//             {/* ... keep whatever you already have here ... */}
//           </section>
//         </div>
//       </main>

//       <MarketingFooter />
//     </>
//   );
// }



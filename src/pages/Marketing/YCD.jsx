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
          {/* Brand hero */}
          <div className="mx-auto max-w-3xl text-center">
            {/* Circular, centered, professional logo — mobile & desktop */}
            <div className="mx-auto mb-6 sm:mb-8 flex items-center justify-center">
              <span className="inline-flex rounded-full overflow-hidden ring-1 ring-gray-200 shadow-sm bg-white
                                w-24 h-24 sm:w-28 sm:h-28">
                {/* Overfill to hide extra padding while keeping the mark centered */}
                <img
                  src="/favicon_io/android-chrome-192x192.png"
                  alt="YouTube Content Downloader"
                  className="block w-[115%] h-[115%] object-contain -m-[7%]"
                />
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              YouTube Content Downloader
            </h1>
            <p className="mt-3 text-gray-600">
              Transcripts (clean & timestamped), MP3 audio, and video—mobile-ready.
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

              {/* Make Create account the same blue primary style */}
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

          {/* Your existing feature cards/content below */}
          <section className="mt-10 sm:mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {/* ... keep whatever you already have here ... */}
          </section>
        </div>
      </main>

      <MarketingFooter />
    </>
  );
}


// // src/pages/Marketing/YCD.jsx
// import React from "react";
// import { Link } from "react-router-dom";
// import MarketingHeader from "../../components/MarketingHeader";
// import MarketingFooter from "../../components/MarketingFooter";
// import YcdLogo from "../../components/YcdLogo";

// export default function YCD() {
//   return (
//     <>
//       <MarketingHeader />

//       <main className="py-12 sm:py-16">
//         <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
//           {/* HERO */}
//           <header className="mx-auto max-w-3xl text-center">
//             <YcdLogo size="lg" className="mx-auto mb-4" />
//             <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
//               YouTube Content Downloader
//             </h1>
//             <p className="mt-3 text-gray-600 text-base sm:text-lg">
//               Transcripts (clean &amp; timestamped), MP3 audio, and video—mobile-ready.
//             </p>

//             <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
//               <Link
//                 to="/login"
//                 className="inline-flex items-center justify-center h-11 rounded-xl px-6 font-semibold text-white
//                            bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
//               >
//                 Sign in to start
//               </Link>
//               <Link
//                 to="/register"
//                 className="inline-flex items-center justify-center h-11 rounded-xl px-6 font-semibold border hover:bg-gray-50"
//               >
//                 Create account
//               </Link>
//             </div>
//           </header>

//           {/* FEATURE GRID */}
//           <section className="mt-12 sm:mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//             {[
//               ["Clean transcripts", "Readable paragraphs with punctuation. Great for notes and summaries."],
//               ["Timestamped transcripts", "SRT/VTT for editing/subtitles workflows."],
//               ["Audio & Video", "MP3 (quality tiers) and MP4 (common resolutions)."],
//               ["Batch jobs", "Pro/Premium can process multiple links at once."],
//               ["Mobile-friendly", "Direct download endpoints tailored for phones."],
//               ["Usage limits", "Fair monthly caps on the free tier; upgrade when ready."],
//             ].map(([title, body]) => (
//               <article key={title} className="rounded-2xl border shadow-sm p-6 bg-white/70">
//                 <h3 className="text-lg font-semibold">{title}</h3>
//                 <p className="mt-2 text-gray-600 text-sm">{body}</p>
//               </article>
//             ))}
//           </section>

//           {/* COPYRIGHT (centered, like Pricing) */}
//           <p className="mx-auto mt-8 max-w-5xl text-center text-xs text-gray-500">
//             © 2025 OneTechly. All rights reserved.
//           </p>
//         </div>
//       </main>

//       <MarketingFooter />
//     </>
//   );
// }


///////////////////////////////////////////////////


// // src/pages/Marketing/YCD.jsx
// import React from "react";
// import { Link } from "react-router-dom";
// import MarketingHeader from "../../components/MarketingHeader";
// import MarketingFooter from "../../components/MarketingFooter";
// import YcdLogo from "../../components/YcdLogo";

// export default function YCD() {
//   return (
//     <>
//       <MarketingHeader />

//       <main className="py-12 sm:py-16">
//         <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
//           {/* HERO */}
//           <header className="mx-auto max-w-3xl text-center">
//             <YcdLogo size="lg" className="mx-auto mb-4" />
//             <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
//               YouTube Content Downloader
//             </h1>
//             <p className="mt-3 text-gray-600 text-base sm:text-lg">
//               Transcripts (clean &amp; timestamped), MP3 audio, and video—mobile-ready.
//             </p>

//             <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
//               <Link
//                 to="/login"
//                 className="inline-flex items-center justify-center h-11 rounded-xl px-6 font-semibold text-white
//                            bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
//               >
//                 Sign in to start
//               </Link>
//               <Link
//                 to="/register"
//                 className="inline-flex items-center justify-center h-11 rounded-xl px-6 font-semibold border hover:bg-gray-50"
//               >
//                 Create account
//               </Link>
//             </div>
//           </header>

//           {/* FEATURE GRID */}
//           <section className="mt-12 sm:mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//             {[
//               ["Clean transcripts", "Readable paragraphs with punctuation. Great for notes and summaries."],
//               ["Timestamped transcripts", "SRT/VTT for editing/subtitles workflows."],
//               ["Audio & Video", "MP3 (quality tiers) and MP4 (common resolutions)."],
//               ["Batch jobs", "Pro/Premium can process multiple links at once."],
//               ["Mobile-friendly", "Direct download endpoints tailored for phones."],
//               ["Usage limits", "Fair monthly caps on the free tier; upgrade when ready."],
//             ].map(([title, body]) => (
//               <article key={title} className="rounded-2xl border shadow-sm p-6 bg-white/70">
//                 <h3 className="text-lg font-semibold">{title}</h3>
//                 <p className="mt-2 text-gray-600 text-sm">{body}</p>
//               </article>
//             ))}
//           </section>

//           {/* COPYRIGHT (centered, like Pricing) */}
//           <p className="mx-auto mt-8 max-w-5xl text-center text-xs text-gray-500">
//             © 2025 OneTechly. All rights reserved.
//           </p>
//         </div>
//       </main>

//       <MarketingFooter />
//     </>
//   );
// }


////////////////----- #2------////////////////////////////////

// // src/pages/Marketing/YCD.jsx
// import React from "react";
// import { Link } from "react-router-dom";
// import MarketingHeader from "../../components/MarketingHeader";
// import MarketingFooter from "../../components/MarketingFooter";
// import YcdLogo from "../../components/YcdLogo";

// export default function YCD() {
//   return (
//     <>
//       <MarketingHeader />
//       <main className="py-14 sm:py-20">
//         <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
//           <div className="mx-auto max-w-3xl text-center">
//             <YcdLogo className="mx-auto mb-4" />
//             <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
//               YouTube Content Downloader
//             </h1>
//             <p className="mt-4 text-gray-600 text-lg">
//               Transcripts (clean &amp; timestamped), MP3 audio, and video—mobile-ready.
//             </p>
//             <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
//               <Link
//                 to="/login"
//                 className="inline-flex items-center justify-center h-11 rounded-xl px-6 font-semibold text-white
//                            bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
//               >
//                 Sign in to start
//               </Link>
//               <Link
//                 to="/register"
//                 className="inline-flex items-center justify-center h-11 rounded-xl px-6 font-semibold border hover:bg-gray-50"
//               >
//                 Create account
//               </Link>
//             </div>
//           </div>
//           <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//             {[
//               ["Clean transcripts", "Readable paragraphs with punctuation. Great for notes and summaries."],
//               ["Timestamped transcripts", "SRT/VTT for editing/subtitles workflows."],
//               ["Audio & Video", "MP3 (quality tiers) and MP4 (common resolutions)."],
//               ["Batch jobs", "Pro/Premium can process multiple links at once."],
//               ["Mobile-friendly", "Direct download endpoints tailored for phones."],
//               ["Usage limits", "Fair monthly caps on the free tier; upgrade when ready."],
//             ].map(([title, body]) => (
//               <div key={title} className="rounded-2xl border shadow-sm p-6 bg-white/70">
//                 <h3 className="text-lg font-semibold">{title}</h3>
//                 <p className="mt-2 text-gray-600 text-sm">{body}</p>
//               </div>
//             ))}
//           </div>
//           <p className="mx-auto mt-8 max-w-5xl text-center text-xs text-gray-500">
//             © 2025 OneTechly. All rights reserved.
//           </p>
//         </div>
//       </main>
//       <MarketingFooter />
//     </>
//   );
// }


////////////////----- #3 ------////////////////////////////////

// // src/pages/Marketing/YCD.jsx
// import React from "react";
// import { Link } from "react-router-dom";
// import MarketingHeader from "../../components/MarketingHeader";
// import MarketingFooter from "../../components/MarketingFooter";
// import YcdLogo from "../../components/YcdLogo";

// export default function YCD() {
//   return (
//     <>
//       <MarketingHeader />
//       <main className="py-14 sm:py-20">
//         <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
//           <div className="mx-auto max-w-3xl text-center">
//             <YcdLogo className="mx-auto mb-4" />
//             <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
//               YouTube Content Downloader
//             </h1>
//             <p className="mt-4 text-gray-600 text-lg">
//               Transcripts (clean &amp; timestamped), MP3 audio, and video—mobile-ready.
//             </p>
//             <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
//               <Link
//                 to="/login"
//                 className="inline-flex items-center justify-center h-11 rounded-xl px-6 font-semibold text-white
//                            bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
//               >
//                 Sign in to start
//               </Link>
//               <Link
//                 to="/register"
//                 className="inline-flex items-center justify-center h-11 rounded-xl px-6 font-semibold border hover:bg-gray-50"
//               >
//                 Create account
//               </Link>
//             </div>
//           </div>
//           <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//             {[
//               ["Clean transcripts", "Readable paragraphs with punctuation. Great for notes and summaries."],
//               ["Timestamped transcripts", "SRT/VTT for editing/subtitles workflows."],
//               ["Audio & Video", "MP3 (quality tiers) and MP4 (common resolutions)."],
//               ["Batch jobs", "Pro/Premium can process multiple links at once."],
//               ["Mobile-friendly", "Direct download endpoints tailored for phones."],
//               ["Usage limits", "Fair monthly caps on the free tier; upgrade when ready."],
//             ].map(([title, body]) => (
//               <div key={title} className="rounded-2xl border shadow-sm p-6 bg-white/70">
//                 <h3 className="text-lg font-semibold">{title}</h3>
//                 <p className="mt-2 text-gray-600 text-sm">{body}</p>
//               </div>
//             ))}
//           </div>
//           <p className="mx-auto mt-8 max-w-5xl text-center text-xs text-gray-500">
//             © 2025 OneTechly. All rights reserved.
//           </p>
//         </div>
//       </main>
//       <MarketingFooter />
//     </>
//   );
// }

////////////////////////////////////////////////////////////////////////////////////

// import React from "react";
// import { Link } from "react-router-dom";
// import MarketingHeader from "../../components/MarketingHeader";
// import MarketingFooter from "../../components/MarketingFooter";
// import YcdLogo from "../components/YcdLogo"; // <-- fixed path

// export default function YCD() {
//   return (
//     <>
//       <MarketingHeader />

//       <main className="py-14 sm:py-20">
//         <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
//           <div className="mx-auto max-w-3xl text-center">
//             {/* YCD logo up top */}
//             <YcdLogo className="mx-auto mb-4" />

//             <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
//               YouTube Content Downloader
//             </h1>

//             <p className="mt-4 text-gray-600 text-lg">
//               Transcripts (clean &amp; timestamped), MP3 audio, and video—mobile-ready.
//             </p>

//             <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
//               <Link
//                 to="/login"
//                 className="inline-flex items-center justify-center h-11 rounded-xl px-6 font-semibold text-white
//                            bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
//               >
//                 Sign in to start
//               </Link>
//               <Link
//                 to="/register"
//                 className="inline-flex items-center justify-center h-11 rounded-xl px-6 font-semibold border hover:bg-gray-50"
//               >
//                 Create account
//               </Link>
//             </div>
//           </div>

//           <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//             {[
//               ["Clean transcripts", "Readable paragraphs with punctuation. Great for notes and summaries."],
//               ["Timestamped transcripts", "SRT/VTT for editing/subtitles workflows."],
//               ["Audio & Video", "MP3 (quality tiers) and MP4 (common resolutions)."],
//               ["Batch jobs", "Pro/Premium can process multiple links at once."],
//               ["Mobile-friendly", "Direct download endpoints tailored for phones."],
//               ["Usage limits", "Fair monthly caps on the free tier; upgrade when ready."],
//             ].map(([title, body]) => (
//               <div key={title} className="rounded-2xl border shadow-sm p-6 bg-white/70">
//                 <h3 className="text-lg font-semibold">{title}</h3>
//                 <p className="mt-2 text-gray-600 text-sm">{body}</p>
//               </div>
//             ))}
//           </div>

//           {/* centered copyright line */}
//           <p className="mx-auto mt-8 max-w-5xl text-center text-xs text-gray-500">
//             © 2025 OneTechly. All rights reserved.
//           </p>
//         </div>
//       </main>

//       <MarketingFooter />
//     </>
//   );
// }



//////////////////////////////////////////////////////////
// // src/pages/Marketing/YCD.jsx
// import React from "react";
// import { Link } from "react-router-dom";
// import MarketingHeader from "../../components/MarketingHeader";
// import MarketingFooter from "../../components/MarketingFooter";
// import Logo from "../../components/Logo";

// export default function YCD() {
//   return (
//     <>
//       <MarketingHeader />

//       <main className="py-14 sm:py-20">
//         <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
//           <div className="mx-auto max-w-3xl text-center">
//             {/* NEW: YCD round logo */}
//             <div className="flex justify-center mb-4">
//               <Logo brand="ycd" size="lg" withText={false} to="" />
//             </div>

//             <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
//               YouTube Content Downloader
//             </h1>
//             <p className="mt-4 text-gray-600 text-lg">
//               Transcripts (clean & timestamped), MP3 audio, and video—mobile-ready.
//             </p>

//             <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
//               <Link
//                 to="/login"
//                 className="inline-flex items-center justify-center h-11 rounded-xl px-6 font-semibold text-white
//                            bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
//               >
//                 Sign in to start
//               </Link>
//               <Link
//                 to="/register"
//                 className="inline-flex items-center justify-center h-11 rounded-xl px-6 font-semibold border hover:bg-gray-50"
//               >
//                 Create account
//               </Link>
//             </div>
//           </div>

//           <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//             {[
//               ["Clean transcripts", "Readable paragraphs with punctuation. Great for notes and summaries."],
//               ["Timestamped transcripts", "SRT/VTT for editing/subtitles workflows."],
//               ["Audio & Video", "MP3 (quality tiers) and MP4 (common resolutions)."],
//               ["Batch jobs", "Pro/Premium can process multiple links at once."],
//               ["Mobile-friendly", "Direct download endpoints tailored for phones."],
//               ["Usage limits", "Fair monthly caps on the free tier; upgrade when ready."],
//             ].map(([title, body]) => (
//               <div key={title} className="rounded-2xl border shadow-sm p-6 bg-white/70">
//                 <h3 className="text-lg font-semibold">{title}</h3>
//                 <p className="mt-2 text-gray-600 text-sm">{body}</p>
//               </div>
//             ))}
//           </div>

//           {/* Centered copyright like the Stripe line on Pricing */}
//           <p className="mx-auto mt-10 max-w-5xl text-center text-xs text-gray-500">
//             © 2025 OneTechly. All rights reserved.
//           </p>
//         </div>
//       </main>

//       <MarketingFooter />
//     </>
//   );
// }

///////////////////////////////////////////////
// import React from "react";
// import { Link } from "react-router-dom";
// import MarketingHeader from "../../components/MarketingHeader";
// import MarketingFooter from "../../components/MarketingFooter";
// import Logo from "../../components/Logo";
// export default function YCD() {
//   return (
//     <>
//       <MarketingHeader />

//       <main className="py-14 sm:py-20">
//         <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
//           <div className="mx-auto max-w-3xl text-center">
//             <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
//               YouTube Content Downloader
//             </h1>
//             <p className="mt-4 text-gray-600 text-lg">
//               Transcripts (clean & timestamped), MP3 audio, and video—mobile-ready.
//             </p>
//             <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
//               <Link
//                 to="/login"
//                 className="inline-flex items-center justify-center h-11 rounded-xl px-6 font-semibold text-white
//                            bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
//               >
//                 Sign in to start
//               </Link>
//               <Link to="/register" className="inline-flex items-center justify-center h-11 rounded-xl px-6 font-semibold border hover:bg-gray-50">
//                 Create account
//               </Link>
//             </div>
//           </div>

//           <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//             {[
//               ["Clean transcripts", "Readable paragraphs with punctuation. Great for notes and summaries."],
//               ["Timestamped transcripts", "SRT/VTT for editing/subtitles workflows."],
//               ["Audio & Video", "MP3 (quality tiers) and MP4 (common resolutions)."],
//               ["Batch jobs", "Pro/Premium can process multiple links at once."],
//               ["Mobile-friendly", "Direct download endpoints tailored for phones."],
//               ["Usage limits", "Fair monthly caps on the free tier; upgrade when ready."],
//             ].map(([title, body]) => (
//               <div key={title} className="rounded-2xl border shadow-sm p-6 bg-white/70">
//                 <h3 className="text-lg font-semibold">{title}</h3>
//                 <p className="mt-2 text-gray-600 text-sm">{body}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </main>

//       <MarketingFooter />
//     </>
//   );
// }



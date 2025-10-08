import React from "react";
import { Link } from "react-router-dom";
import MarketingHeader from "../../components/MarketingHeader";
import MarketingFooter from "../../components/MarketingFooter";
//import YcdLogo from "../../components/YcdLogo";
import YcdLogo from '../components/YcdLogo.jsx';

export default function YCD() {
  return (
    <>
      <MarketingHeader />

      <main className="py-14 sm:py-20">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            {/* YCD logo up top */}
            <YcdLogo className="mx-auto mb-4" />

            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              YouTube Content Downloader
            </h1>

            <p className="mt-4 text-gray-600 text-lg">
              Transcripts (clean &amp; timestamped), MP3 audio, and video—mobile-ready.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/login"
                className="inline-flex items-center justify-center h-11 rounded-xl px-6 font-semibold text-white
                           bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
              >
                Sign in to start
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center h-11 rounded-xl px-6 font-semibold border hover:bg-gray-50"
              >
                Create account
              </Link>
            </div>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["Clean transcripts", "Readable paragraphs with punctuation. Great for notes and summaries."],
              ["Timestamped transcripts", "SRT/VTT for editing/subtitles workflows."],
              ["Audio & Video", "MP3 (quality tiers) and MP4 (common resolutions)."],
              ["Batch jobs", "Pro/Premium can process multiple links at once."],
              ["Mobile-friendly", "Direct download endpoints tailored for phones."],
              ["Usage limits", "Fair monthly caps on the free tier; upgrade when ready."],
            ].map(([title, body]) => (
              <div key={title} className="rounded-2xl border shadow-sm p-6 bg-white/70">
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-gray-600 text-sm">{body}</p>
              </div>
            ))}
          </div>

          {/* centered copyright line */}
          <p className="mx-auto mt-8 max-w-5xl text-center text-xs text-gray-500">
            © 2025 OneTechly. All rights reserved.
          </p>
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



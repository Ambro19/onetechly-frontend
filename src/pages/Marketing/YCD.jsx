import React from "react";
import { Link } from "react-router-dom";
import MarketingHeader from "../../components/MarketingHeader";
import MarketingFooter from "../../components/MarketingFooter";

export default function YCD() {
  return (
    <>
      <MarketingHeader />

      <main className="py-14 sm:py-20">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              YouTube Content Downloader
            </h1>
            <p className="mt-4 text-gray-600 text-lg">
              Transcripts (clean & timestamped), MP3 audio, and video—mobile-ready.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/login"
                className="inline-flex items-center justify-center h-11 rounded-xl px-6 font-semibold text-white
                           bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
              >
                Sign in to start
              </Link>
              <Link to="/register" className="inline-flex items-center justify-center h-11 rounded-xl px-6 font-semibold border hover:bg-gray-50">
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
        </div>
      </main>

      <MarketingFooter />
    </>
  );
}


///////////////////////////////////////////////////////////////////////////////

// import MarketingHeader from "../../components/MarketingHeader";
// import MarketingFooter from "../../components/MarketingFooter";
// import CTAButton from "../../components/CTAButton";
// import Site from "../../site.config";

// export default function YCD() {
//   return (
//     <div className="min-h-screen flex flex-col">
//       <MarketingHeader />
//       <main className="flex-1">
//         <section className="mx-auto max-w-6xl px-4 py-16 grid gap-8 md:grid-cols-2 items-center">
//           <div>
//             <img src={Site.product.logo} alt={Site.product.name} className="h-16 w-16" />
//             <h1 className="mt-6 text-3xl md:text-4xl font-semibold">{Site.product.name}</h1>
//             <p className="mt-4 text-neutral-700">
//               Download transcripts and permitted media efficiently, with plan-based limits and compliance guardrails.
//             </p>
//             <ul className="mt-6 list-disc pl-6 text-neutral-700 space-y-2">
//               <li>Transcript & subtitle downloads (where available)</li>
//               <li>Batch jobs (per-plan caps) and usage dashboard</li>
//               <li>Licensing attestation + DMCA policy</li>
//             </ul>
//             <div className="mt-8 flex gap-3">
//               <CTAButton href="/pricing">View Pricing</CTAButton>
//               <a href={Site.app.register} className="inline-flex items-center rounded-xl px-4 py-2 bg-black text-white hover:opacity-90">
//                 Start Free
//               </a>
//             </div>
//           </div>
//           <div className="rounded-2xl border p-6">
//             <h3 className="font-semibold">Compliance Snapshot</h3>
//             <ul className="mt-3 text-sm text-neutral-700 space-y-2">
//               <li>• Users must confirm they have rights to download/use content.</li>
//               <li>• Private/DRM/restricted content is blocked.</li>
//               <li>• DMCA takedown channel available for rights owners.</li>
//             </ul>
//             <div className="mt-6">
//               <a href={Site.app.dashboard} className="underline">Go to Dashboard</a>
//             </div>
//           </div>
//         </section>
//       </main>
//       <MarketingFooter />
//     </div>
//   );
// }

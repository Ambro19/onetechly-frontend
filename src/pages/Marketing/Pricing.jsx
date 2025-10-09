import React from "react";
import { Link } from "react-router-dom";
import MarketingHeader from "../../components/MarketingHeader";
import MarketingFooter from "../../components/MarketingFooter";

const tiers = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    cadence: "",
    highlight: false,
    cta: { label: "Get started free", to: "/register" },
    features: [
      "5 clean transcript downloads / month",
      "3 timestamped transcript downloads / month",
      "2 audio downloads + 1 video download / month",
      "Basic formats (TXT, SRT, VTT)",
      "Community support",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$9.99",
    cadence: "/month",
    highlight: true,
    cta: { label: "Upgrade to Pro", to: "/login" },
    features: [
      "100 clean transcript downloads / month",
      "50 timestamped + 50 audio + 20 video / month",
      "All formats · faster processing",
      "Priority support (≤4h weekdays)",
      "Batch processing (multi-URL / CSV) — up to 3 links per batch",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    price: "$19.99",
    cadence: "/month",
    highlight: false,
    cta: { label: "Go Premium", to: "/login" },
    features: [
      "Unlimited transcripts, audio & video",
      "All formats · API access",
      "Fastest processing",
      "Priority support (≤2h weekdays)",
      "Batch processing (bigger caps + higher concurrency)",
      "Custom integrations (webhooks, S3, Slack, SSO)",
    ],
  },
];

export default function Pricing() {
  return (
    <>
      <MarketingHeader />

      <main className="px-6 py-14 sm:py-20">
        <section className="mx-auto max-w-5xl text-center">
          <img
            src="/logo_onetechly.png"
            alt="OneTechly"
            className="mx-auto mb-5 h-14 w-14 rounded-xl shadow-sm"
          />
          <h1 className="text-4xl font-extrabold tracking-tight">Pricing</h1>
          <p className="mt-3 text-gray-600">
            Simple, transparent plans for the YouTube Content Downloader.
          </p>
        </section>

        <section className="mx-auto mt-10 grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tiers.map((t) => (
            <article
              key={t.id}
              className={`rounded-2xl border bg-white p-6 shadow-sm ${
                t.highlight ? "ring-2 ring-indigo-600" : ""
              }`}
            >
              {t.highlight && (
                <div className="mb-3 inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                  MOST POPULAR
                </div>
              )}
              <h3 className="text-xl font-bold">{t.name}</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <div className="text-4xl font-extrabold">{t.price}</div>
                <div className="text-gray-500">{t.cadence}</div>
              </div>

              <ul className="mt-5 space-y-2 text-sm text-gray-700">
                {t.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-0.5">✅</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6">
                <Link
                  to={t.cta.to}
                  className="inline-flex h-11 w-full items-center justify-center rounded-lg
                             bg-indigo-600 px-4 font-semibold text-white hover:bg-indigo-700"
                >
                  {t.cta.label}
                </Link>
              </div>
            </article>
          ))}
        </section>

        <p className="mx-auto mt-6 max-w-5xl text-center text-xs text-gray-500">
          Secure payments processed by Stripe · Cancel anytime · No hidden fees
        </p>
      </main>

      <MarketingFooter />
    </>
  );
}

////////////////////////////////////////////////////////////////
// // src/pages/Marketing/Pricing.jsx
// import { Link } from "react-router-dom";

// const tiers = [
//   {
//     id: "free",
//     name: "Free",
//     price: "$0",
//     cadence: "",
//     highlight: false,
//     // CTA goes straight to Registration
//     cta: { label: "Get started free", to: "/register" },
//     features: [
//       "5 clean transcript downloads / month",
//       "3 timestamped transcript downloads / month",
//       "2 audio downloads + 1 video download / month",
//       "Basic formats (TXT, SRT, VTT)",
//       "Community support",
//     ],
//   },
//   {
//     id: "pro",
//     name: "Pro",
//     price: "$9.99",
//     cadence: "/month",
//     highlight: true, // most popular
//     cta: { label: "Upgrade to Pro", to: "/login" },
//     features: [
//       "100 clean transcript downloads / month",
//       "50 timestamped + 50 audio + 20 video / month",
//       "All formats · faster processing",
//       "Priority support (≤4h weekdays)",
//       "Batch processing (multi-URL / CSV) — up to 3 links per batch",
//     ],
//   },
//   {
//     id: "premium",
//     name: "Premium",
//     price: "$19.99",
//     cadence: "/month",
//     highlight: false,
//     cta: { label: "Go Premium", to: "/login" },
//     features: [
//       "Unlimited transcripts, audio & video",
//       "All formats · API access",
//       "Fastest processing",
//       "Priority support (≤2h weekdays)",
//       "Batch processing (bigger caps + higher concurrency)",
//       "Custom integrations (webhooks, S3, Slack, SSO)",
//     ],
//   },
// ];

// export default function Pricing() {
//   return (
//     <main className="px-6 py-16">
//       <section className="mx-auto max-w-5xl text-center">
//         <img
//           src="/logo_onetechly.png"
//           alt="OneTechly"
//           className="mx-auto mb-5 h-14 w-14 rounded-xl ring-1 ring-indigo-100 shadow-sm"
//         />
//         <h1 className="text-4xl font-extrabold tracking-tight">Pricing</h1>
//         <p className="mt-3 text-gray-600">
//           Simple, transparent plans for the YouTube Content Downloader.
//         </p>
//       </section>

//       <section className="mx-auto mt-10 grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
//         {tiers.map((t) => (
//           <article
//             key={t.id}
//             className={`rounded-2xl border p-6 shadow-sm ${
//               t.highlight ? "ring-2 ring-indigo-600" : ""
//             }`}
//           >
//             {t.highlight && (
//               <div className="mb-3 inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
//                 MOST POPULAR
//               </div>
//             )}
//             <h3 className="text-xl font-bold">{t.name}</h3>
//             <div className="mt-2 flex items-baseline gap-1">
//               <div className="text-4xl font-extrabold">{t.price}</div>
//               <div className="text-gray-500">{t.cadence}</div>
//             </div>

//             <ul className="mt-5 space-y-2 text-sm text-gray-700">
//               {t.features.map((f, i) => (
//                 <li key={i} className="flex items-start gap-2">
//                   <span className="mt-0.5">✅</span>
//                   <span>{f}</span>
//                 </li>
//               ))}
//             </ul>

//             <div className="mt-6">
//               <Link
//                 to={t.cta.to}
//                 className="inline-flex h-11 items-center justify-center w-full rounded-lg px-4 font-semibold
//                            bg-indigo-600 text-white hover:bg-indigo-700"
//               >
//                 {t.cta.label}
//               </Link>
//             </div>
//           </article>
//         ))}
//       </section>

//       <p className="mx-auto mt-6 max-w-5xl text-center text-xs text-gray-500">
//         Secure payments processed by Stripe · Cancel anytime · No hidden fees
//       </p>
//     </main>
//   );
// }

/////////////////////////////////////////////////////
// import { Link } from "react-router-dom";

// const tiers = [
//   {
//     id: "free",
//     name: "Free",
//     price: "$0",
//     cadence: "",
//     highlight: false,
//     cta: { label: "Get started", to: "/register" },
//     features: [
//       "5 clean transcript downloads / month",
//       "3 timestamped transcript downloads / month",
//       "2 audio downloads + 1 video download / month",
//       "Basic formats (TXT, SRT, VTT)",
//       "Community support",
//     ],
//     footnote: "No downgrade available",
//     disabled: true,
//   },
//   {
//     id: "pro",
//     name: "Pro",
//     price: "$9.99",
//     cadence: "/month",
//     highlight: true, // most popular
//     cta: { label: "Upgrade to Pro", to: "/login" },
//     features: [
//       "100 clean transcript downloads / month",
//       "50 timestamped + 50 audio + 20 video / month",
//       "All formats · faster processing",
//       "Priority support (≤4h weekdays)",
//       "Batch processing (multi-URL / CSV) — up to 3 links per batch",
//     ],
//   },
//   {
//     id: "premium",
//     name: "Premium",
//     price: "$19.99",
//     cadence: "/month",
//     highlight: false,
//     cta: { label: "Go Premium", to: "/login" },
//     features: [
//       "Unlimited transcripts, audio & video",
//       "All formats · API access",
//       "Fastest processing",
//       "Priority support (≤2h weekdays)",
//       "Batch processing (bigger caps + higher concurrency)",
//       "Custom integrations (webhooks, S3, Slack, SSO)",
//     ],
//   },
// ];

// export default function Pricing() {
//   return (
//     <main className="px-6 py-16">
//       <section className="mx-auto max-w-5xl text-center">
//         <img
//           src="/logo_onetechly.png"
//           alt="OneTechly"
//           className="mx-auto mb-5 h-14 w-14 rounded-lg shadow-sm"
//         />
//         <h1 className="text-4xl font-extrabold tracking-tight">Pricing</h1>
//         <p className="mt-3 text-gray-600">
//           Simple, transparent plans for the YouTube Content Downloader.
//         </p>
//       </section>

//       <section className="mx-auto mt-10 grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
//         {tiers.map((t) => (
//           <article
//             key={t.id}
//             className={`rounded-2xl border p-6 shadow-sm ${
//               t.highlight ? "ring-2 ring-indigo-600" : ""
//             }`}
//           >
//             {t.highlight && (
//               <div className="mb-3 inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
//                 MOST POPULAR
//               </div>
//             )}
//             <h3 className="text-xl font-bold">{t.name}</h3>
//             <div className="mt-2 flex items-baseline gap-1">
//               <div className="text-4xl font-extrabold">{t.price}</div>
//               <div className="text-gray-500">{t.cadence}</div>
//             </div>

//             <ul className="mt-5 space-y-2 text-sm text-gray-700">
//               {t.features.map((f, i) => (
//                 <li key={i} className="flex items-start gap-2">
//                   <span className="mt-0.5">✅</span>
//                   <span>{f}</span>
//                 </li>
//               ))}
//             </ul>

//             <div className="mt-6">
//               <Link
//                 to={t.cta.to}
//                 className={`inline-flex h-11 items-center justify-center w-full rounded-lg px-4 font-semibold ${
//                   t.disabled
//                     ? "bg-gray-200 text-gray-500 cursor-not-allowed"
//                     : "bg-indigo-600 text-white hover:bg-indigo-700"
//                 }`}
//                 onClick={(e) => t.disabled && e.preventDefault()}
//               >
//                 {t.disabled ? t.footnote : t.cta.label}
//               </Link>
//             </div>
//           </article>
//         ))}
//       </section>

//       <p className="mx-auto mt-6 max-w-5xl text-center text-xs text-gray-500">
//         Secure payments processed by Stripe · Cancel anytime · No hidden fees
//       </p>
//     </main>
//   );
// }



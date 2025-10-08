import { Link } from "react-router-dom";

const tiers = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    cadence: "",
    highlight: false,
    cta: { label: "Get started", to: "/register" },
    features: [
      "5 clean transcript downloads / month",
      "3 timestamped transcript downloads / month",
      "2 audio downloads + 1 video download / month",
      "Basic formats (TXT, SRT, VTT)",
      "Community support",
    ],
    footnote: "No downgrade available",
    disabled: true,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$9.99",
    cadence: "/month",
    highlight: true, // most popular
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
    <main className="px-6 py-16">
      <section className="mx-auto max-w-5xl text-center">
        <img
          src="/logo_onetechly.png"
          alt="OneTechly"
          className="mx-auto mb-5 h-14 w-14 rounded-lg shadow-sm"
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
            className={`rounded-2xl border p-6 shadow-sm ${
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
                className={`inline-flex h-11 items-center justify-center w-full rounded-lg px-4 font-semibold ${
                  t.disabled
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
                onClick={(e) => t.disabled && e.preventDefault()}
              >
                {t.disabled ? t.footnote : t.cta.label}
              </Link>
            </div>
          </article>
        ))}
      </section>

      <p className="mx-auto mt-6 max-w-5xl text-center text-xs text-gray-500">
        Secure payments processed by Stripe · Cancel anytime · No hidden fees
      </p>
    </main>
  );
}


/////////////////////////////////////////////////////////////////////////////
// import MarketingHeader from "../../components/MarketingHeader";
// import MarketingFooter from "../../components/MarketingFooter";
// import Site from "../../site.config";

// const PLANS = [
//   {name:"Free", price:"$0", bullets:["10 transcripts/day","No batch","Community support"], priceId:null},
//   {name:"Pro", price:"$9.99/mo", bullets:["200 transcripts/day","Batch up to 25 URLs","Email support"], priceId:"price_PRO_REPLACE"},
//   {name:"Premium", price:"$19.99/mo", bullets:["1000 transcripts/day","Batch up to 200 URLs","Priority support"], priceId:"price_PREMIUM_REPLACE"},
// ];

// export default function Pricing() {
//   const goCheckout = async (priceId) => {
//     if (!priceId) { window.location.href = Site.app.register; return; }
//     // If your frontend is the same origin as backend:
//     window.location.href = `${Site.app.pricingCheckoutEndpoint}?price_id=${encodeURIComponent(priceId)}`;
//     // Or: replace with your existing checkout link/flow.
//   };

//   return (
//     <div className="min-h-screen flex flex-col">
//       <MarketingHeader />
//       <main className="flex-1 mx-auto max-w-6xl px-4 py-16">
//         <h1 className="text-3xl font-semibold text-center">Simple pricing</h1>
//         <p className="mt-2 text-center text-neutral-600">Choose a plan that scales with you.</p>
//         <div className="mt-10 grid gap-6 md:grid-cols-3">
//           {PLANS.map((p)=>(
//             <div key={p.name} className="border rounded-2xl p-6">
//               <h3 className="font-semibold">{p.name}</h3>
//               <div className="text-3xl mt-2">{p.price}</div>
//               <ul className="mt-4 space-y-2 text-sm text-neutral-700">
//                 {p.bullets.map((b,i)=><li key={i}>• {b}</li>)}
//               </ul>
//               <button onClick={()=>goCheckout(p.priceId)} className="mt-6 w-full rounded-xl border px-4 py-2 hover:shadow">
//                 {p.priceId ? "Continue to Checkout" : "Start Free"}
//               </button>
//             </div>
//           ))}
//         </div>
//         <p className="mt-8 text-xs text-neutral-500 text-center">
//           Billed by OneTechly. Cancel anytime. Taxes may apply.
//         </p>
//       </main>
//       <MarketingFooter />
//     </div>
//   );
// }

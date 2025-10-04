import MarketingHeader from "../../components/MarketingHeader";
import MarketingFooter from "../../components/MarketingFooter";
import Site from "../../site.config";

const PLANS = [
  {name:"Free", price:"$0", bullets:["10 transcripts/day","No batch","Community support"], priceId:null},
  {name:"Pro", price:"$9.99/mo", bullets:["200 transcripts/day","Batch up to 25 URLs","Email support"], priceId:"price_PRO_REPLACE"},
  {name:"Premium", price:"$19.99/mo", bullets:["1000 transcripts/day","Batch up to 200 URLs","Priority support"], priceId:"price_PREMIUM_REPLACE"},
];

export default function Pricing() {
  const goCheckout = async (priceId) => {
    if (!priceId) { window.location.href = Site.app.register; return; }
    // If your frontend is the same origin as backend:
    window.location.href = `${Site.app.pricingCheckoutEndpoint}?price_id=${encodeURIComponent(priceId)}`;
    // Or: replace with your existing checkout link/flow.
  };

  return (
    <div className="min-h-screen flex flex-col">
      <MarketingHeader />
      <main className="flex-1 mx-auto max-w-6xl px-4 py-16">
        <h1 className="text-3xl font-semibold text-center">Simple pricing</h1>
        <p className="mt-2 text-center text-neutral-600">Choose a plan that scales with you.</p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {PLANS.map((p)=>(
            <div key={p.name} className="border rounded-2xl p-6">
              <h3 className="font-semibold">{p.name}</h3>
              <div className="text-3xl mt-2">{p.price}</div>
              <ul className="mt-4 space-y-2 text-sm text-neutral-700">
                {p.bullets.map((b,i)=><li key={i}>• {b}</li>)}
              </ul>
              <button onClick={()=>goCheckout(p.priceId)} className="mt-6 w-full rounded-xl border px-4 py-2 hover:shadow">
                {p.priceId ? "Continue to Checkout" : "Start Free"}
              </button>
            </div>
          ))}
        </div>
        <p className="mt-8 text-xs text-neutral-500 text-center">
          Billed by OneTechly. Cancel anytime. Taxes may apply.
        </p>
      </main>
      <MarketingFooter />
    </div>
  );
}

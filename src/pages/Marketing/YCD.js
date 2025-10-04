import MarketingHeader from "../../components/MarketingHeader";
import MarketingFooter from "../../components/MarketingFooter";
import CTAButton from "../../components/CTAButton";
import Site from "../../site.config";

export default function YCD() {
  return (
    <div className="min-h-screen flex flex-col">
      <MarketingHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-4 py-16 grid gap-8 md:grid-cols-2 items-center">
          <div>
            <img src={Site.product.logo} alt={Site.product.name} className="h-16 w-16" />
            <h1 className="mt-6 text-3xl md:text-4xl font-semibold">{Site.product.name}</h1>
            <p className="mt-4 text-neutral-700">
              Download transcripts and permitted media efficiently, with plan-based limits and compliance guardrails.
            </p>
            <ul className="mt-6 list-disc pl-6 text-neutral-700 space-y-2">
              <li>Transcript & subtitle downloads (where available)</li>
              <li>Batch jobs (per-plan caps) and usage dashboard</li>
              <li>Licensing attestation + DMCA policy</li>
            </ul>
            <div className="mt-8 flex gap-3">
              <CTAButton href="/pricing">View Pricing</CTAButton>
              <a href={Site.app.register} className="inline-flex items-center rounded-xl px-4 py-2 bg-black text-white hover:opacity-90">
                Start Free
              </a>
            </div>
          </div>
          <div className="rounded-2xl border p-6">
            <h3 className="font-semibold">Compliance Snapshot</h3>
            <ul className="mt-3 text-sm text-neutral-700 space-y-2">
              <li>• Users must confirm they have rights to download/use content.</li>
              <li>• Private/DRM/restricted content is blocked.</li>
              <li>• DMCA takedown channel available for rights owners.</li>
            </ul>
            <div className="mt-6">
              <a href={Site.app.dashboard} className="underline">Go to Dashboard</a>
            </div>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </div>
  );
}

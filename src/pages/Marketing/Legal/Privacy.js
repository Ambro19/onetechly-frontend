import MarketingHeader from "../../../components/MarketingHeader";
import MarketingFooter from "../../../components/MarketingFooter";
import Site from "../../../site.config";

export default function Privacy() {
  return (
    <div className="min-h-screen flex flex-col">
      <MarketingHeader />
      <main className="flex-1 mx-auto max-w-3xl px-4 py-16 prose">
        <h1>Privacy Policy</h1>
        <p><strong>Controller:</strong> OneTechly ({Site.company.email}).</p>
        <h2>Data We Collect</h2>
        <ul>
          <li>Account info (email, name), authentication data.</li>
          <li>Subscription & billing (via Stripe).</li>
          <li>Usage logs (time, operation type, hashed video IDs).</li>
        </ul>
        <h2>How We Use Data</h2>
        <p>To operate {Site.product.short}, enforce plan limits, provide support, detect abuse, and comply with law.</p>
        <h2>Processors</h2>
        <p>Stripe (payments), hosting (Render/AWS or equivalent), analytics (if enabled).</p>
        <h2>Rights</h2>
        <p>You can request access/deletion where applicable by contacting us at {Site.company.email}.</p>
        <p>Last updated: {Site.legal.lastUpdated}</p>
      </main>
      <MarketingFooter />
    </div>
  );
}

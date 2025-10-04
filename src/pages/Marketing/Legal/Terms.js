import MarketingHeader from "../../../components/MarketingHeader";
import MarketingFooter from "../../../components/MarketingFooter";
import Site from "../../../site.config";

export default function Terms() {
  return (
    <div className="min-h-screen flex flex-col">
      <MarketingHeader />
      <main className="flex-1 mx-auto max-w-3xl px-4 py-16 prose">
        <h1>Terms of Service</h1>
        <p><strong>Entity:</strong> OneTechly (“we”, “us”).</p>
        <p><strong>Product:</strong> {Site.product.name} (“{Site.product.short}”).</p>
        <h2>Acceptable Use</h2>
        <p>
          By using {Site.product.short}, you represent and warrant that you have all required rights and permissions
          to download and use the content. You may not use {Site.product.short} to infringe any third-party rights,
          bypass technical protection measures, or access private, age-restricted, or DRM-protected content.
        </p>
        <h2>Subscriptions</h2>
        <p>Plans are billed by OneTechly via Stripe. Usage limits and features vary by plan. We may throttle or block usage that exceeds limits or violates these Terms.</p>
        <h2>DMCA</h2>
        <p>We respect intellectual property rights and respond to DMCA notices. See our <a href="/legal/dmca">DMCA Policy</a> for details.</p>
        <h2>Disclaimer</h2>
        <p>{Site.product.short} is provided “as is.” To the extent permitted by law, we disclaim all warranties and limit our liability.</p>
        <p>Last updated: {Site.legal.lastUpdated}</p>
      </main>
      <MarketingFooter />
    </div>
  );
}

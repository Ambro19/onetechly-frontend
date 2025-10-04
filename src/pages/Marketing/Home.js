import MarketingHeader from "../../components/MarketingHeader";
import MarketingFooter from "../../components/MarketingFooter";
import CTAButton from "../../components/CTAButton";
import Site from "../../site.config";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <MarketingHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-7xl px-4 py-20 text-center">
          <img src={Site.company.logoLight} alt="OneTechly" className="h-16 w-16 mx-auto" />
          <h1 className="mt-6 text-4xl md:text-5xl font-semibold">OneTechly</h1>
          <p className="mt-4 text-neutral-600">{Site.company.tagline} — and SaaS you can rely on.</p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <CTAButton href="/ycd">Explore YouTube Content Downloader</CTAButton>
            <a className="underline" href={Site.company.blogUrl} target="_blank" rel="noreferrer">
              Visit the Blog
            </a>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 grid gap-6 md:grid-cols-3">
          {[
            {t:"Secure", d:"Encryption, rate limits, and strict compliance guardrails."},
            {t:"Scalable", d:"Cloud-native deployment with observability from day one."},
            {t:"Accessible", d:"WCAG-minded UI with clear flows and docs."},
          ].map((c,i)=>(
            <div key={i} className="rounded-2xl border p-6 text-left">
              <h3 className="font-semibold">{c.t}</h3>
              <p className="mt-2 text-neutral-600">{c.d}</p>
            </div>
          ))}
        </section>
      </main>
      <MarketingFooter />
    </div>
  );
}

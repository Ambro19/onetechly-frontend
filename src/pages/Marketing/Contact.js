import MarketingHeader from "../../components/MarketingHeader";
import MarketingFooter from "../../components/MarketingFooter";
import Site from "../../site.config";

export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col">
      <MarketingHeader />
      <main className="flex-1 mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl font-semibold">Contact OneTechly</h1>
        <p className="mt-3 text-neutral-700">Email: {Site.company.email}</p>
        <p className="mt-1 text-neutral-700">
          Blog: <a className="underline" href={Site.company.blogUrl} target="_blank" rel="noreferrer">{Site.company.blogUrl}</a>
        </p>
        <p className="mt-6 text-neutral-600 text-sm">We aim to reply within 1–2 business days.</p>
      </main>
      <MarketingFooter />
    </div>
  );
}

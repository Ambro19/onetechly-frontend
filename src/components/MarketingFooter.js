import { Link } from "react-router-dom";
import Site from "../site.config";

export default function MarketingFooter() {
  return (
    <footer className="border-t mt-16">
      <div className="mx-auto max-w-7xl px-4 py-8 grid gap-6 md:grid-cols-3 text-sm">
        <div>
          <div className="flex items-center gap-2">
            <img src={Site.company.logoLight} alt="OneTechly" className="h-8 w-8" />
            <span className="font-semibold">OneTechly</span>
          </div>
          <p className="mt-2 text-neutral-600">{Site.company.tagline}</p>
          <p className="mt-1 text-neutral-600">{Site.company.email}</p>
        </div>
        <div>
          <h4 className="font-semibold">Company</h4>
          <ul className="mt-2 space-y-1">
            <li><Link to="/ycd" className="hover:underline">YouTube Content Downloader</Link></li>
            <li><Link to="/pricing" className="hover:underline">Pricing</Link></li>
            <li>
              <a className="hover:underline" href={Site.company.blogUrl} target="_blank" rel="noreferrer">
                Blog
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold">Legal</h4>
          <ul className="mt-2 space-y-1">
            <li><Link to="/legal/terms" className="hover:underline">Terms of Service</Link></li>
            <li><Link to="/legal/privacy" className="hover:underline">Privacy Policy</Link></li>
            <li><Link to="/legal/dmca" className="hover:underline">DMCA Policy</Link></li>
          </ul>
        </div>
      </div>
      <div className="text-center text-xs text-neutral-500 pb-6">
        © {new Date().getFullYear()} OneTechly. All rights reserved.
      </div>
    </footer>
  );
}

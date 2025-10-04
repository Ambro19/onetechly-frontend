import { Link, NavLink } from "react-router-dom";
import Site from "../site.config";

export default function MarketingHeader() {
  return (
    <header className="w-full border-b bg-white/70 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={Site.company.logoLight} alt="OneTechly" className="h-9 w-9" />
          <span className="font-semibold text-lg">OneTechly</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <NavLink to="/ycd" className="hover:underline">Product</NavLink>
          <NavLink to="/pricing" className="hover:underline">Pricing</NavLink>
          <NavLink to="/contact" className="hover:underline">Contact</NavLink>
          <NavLink to="/legal/terms" className="hover:underline">Legal</NavLink>
          <a href={Site.app.login} className="px-3 py-1 rounded-lg border">Sign in</a>
        </nav>
      </div>
    </header>
  );
}


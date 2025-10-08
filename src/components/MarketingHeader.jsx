import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";

export default function MarketingHeader() {
  const [open, setOpen] = useState(false);

  const NavItem = ({ to, children }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition
         ${isActive ? "text-indigo-700" : "text-gray-700"}`
      }
      onClick={() => setOpen(false)}
    >
      {children}
    </NavLink>
  );

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b">
      <nav className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/logo_onetechly.png" 
            alt="OneTechly"
            className="h-8 w-8 rounded-lg shadow"
          />
          <span className="text-base sm:text-lg font-semibold tracking-tight">
            OneTechly
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          <NavItem to="/ycd">Product</NavItem>
          <NavItem to="/pricing">Pricing</NavItem>
          <NavItem to="/contact">Contact</NavItem>
          <NavItem to="/legal/terms">Legal</NavItem>
          <Link
            to="/login"
            className="ml-2 inline-flex items-center h-9 rounded-xl px-4 text-sm font-semibold text-white
                       bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
          >
            Sign in
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-lg
                     hover:bg-gray-100 focus:outline-none"
          aria-label="Open menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="text-2xl">{open ? "✖" : "☰"}</span>
        </button>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden border-t bg-white">
          <div className="mx-auto max-w-screen-xl px-4 sm:px-6 py-3 flex flex-col gap-1">
            <NavItem to="/ycd">Product</NavItem>
            <NavItem to="/pricing">Pricing</NavItem>
            <NavItem to="/contact">Contact</NavItem>
            <NavItem to="/legal/terms">Legal</NavItem>
            <Link
              to="/login"
              className="mt-1 inline-flex items-center justify-center h-10 rounded-xl px-4 text-sm font-semibold text-white
                         bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
              onClick={() => setOpen(false)}
            >
              Sign in
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}



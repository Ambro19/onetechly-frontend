import React from "react";
import { Link } from "react-router-dom";

export default function MarketingFooter() {
  return (
    <footer className="border-t bg-gray-50 py-10 mt-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {/* OneTechly Logo + description */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <img
              src="/logo_onetechly.png"
              alt="OneTechly"
              className="h-10 w-10 rounded-xl shadow-sm"
            />
            <span className="text-base font-semibold text-gray-900">OneTechly</span>
          </div>
          <p className="text-sm text-gray-600 leading-snug">
            Tech Tips and Troubleshooting — and SaaS you can rely on.
          </p>
          <p className="mt-2 text-sm text-indigo-600">
            <a href="mailto:onetechly@gmail.com" className="hover:underline">
              onetechly@gmail.com
            </a>
          </p>
        </div>

        {/* Company Links */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Company</h3>
          <ul className="space-y-1 text-sm text-gray-700">
            <li><Link to="/ycd" className="hover:text-indigo-600">YouTube Content Downloader</Link></li>
            <li><Link to="/pricing" className="hover:text-indigo-600">Pricing</Link></li>
            <li><Link to="/blog" className="hover:text-indigo-600">Blog</Link></li>
          </ul>
        </div>

        {/* Product Links */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Product</h3>
          <ul className="space-y-1 text-sm text-gray-700">
            <li><Link to="/login" className="hover:text-indigo-600">Sign in</Link></li>
            <li><Link to="/register" className="hover:text-indigo-600">Create account</Link></li>
          </ul>
        </div>

        {/* Legal Links — ✅ UPDATED to /legal/* paths */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Legal</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/legal/terms" className="hover:underline">Terms of Service</Link></li>
            <li><Link to="/legal/privacy" className="hover:underline">Privacy Policy</Link></li>
            <li><Link to="/legal/dmca" className="hover:underline">DMCA Policy</Link></li>
          </ul>
        </div>
      </div>

      <p className="mt-10 text-center text-xs text-gray-500">
        © 2025 OneTechly. All rights reserved.
      </p>
    </footer>
  );
}


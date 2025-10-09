// src/components/AppBrand.jsx
import React from "react";
import { Link } from "react-router-dom";
import YcdLogo from "./YcdLogo";

/** Brand block for the app shell (header + sidebar) */
export default function AppBrand({ to = "/dashboard", stacked = false, size = 32 }) {
  return (
    <Link to={to} className="flex items-center gap-2 shrink-0">
      <YcdLogo size={size} />
      <div className={stacked ? "leading-tight" : ""}>
        <div className="text-sm font-semibold text-gray-900">YouTube Content</div>
        <div className="text-[11px] -mt-0.5 text-gray-600">Downloader</div>
      </div>
    </Link>
  );
}

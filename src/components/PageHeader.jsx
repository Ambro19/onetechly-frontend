// src/components/PageHeader.jsx
// Uniform page header used by Dashboard, Download, Subscription, History.

import React from "react";

export default function PageHeader({ title, subtitle, actions, tight = false }) {
  return (
    <div className="bg-white border rounded-2xl shadow-sm p-5 sm:p-6">
      <div className={`flex items-center justify-between ${tight ? "" : "flex-wrap gap-4"}`}>
        {/* Left: icon + title + subtitle */}
        <div className="flex items-center gap-4">
          <img
            src="/ycd_logo.png"
            alt="YouTube Content Downloader"
            className="h-12 w-12 rounded-full ring-2 ring-indigo-100"
          />
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-gray-600">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Right: actions (optional) */}
        {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
      </div>
    </div>
  );
}

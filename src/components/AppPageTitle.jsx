// AppPageTitle.jsx – shared YCD title header for app pages
import React from "react";
import YcdLogo from "./YcdLogo";

export default function AppPageTitle({ title, subtitle, right }) {
  return (
    <header className="text-center mb-6">
      <div className="flex items-center justify-center gap-3">
        <YcdLogo size={44} />
        <h1 className="text-3xl font-extrabold tracking-tight">{title}</h1>
      </div>
      {subtitle && <p className="mt-2 text-gray-600">{subtitle}</p>}
      {right && <div className="mt-3">{right}</div>}
    </header>
  );
}

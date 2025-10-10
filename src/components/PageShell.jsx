// src/components/PageShell.jsx
// Reusable shell so all app pages look consistent.

import React from "react";

export default function PageShell({ header, children }) {
  return (
    <div className="space-y-6">
      {/* Header slot */}
      {header}

      {/* Content container */}
      <div className="bg-white border rounded-2xl shadow-sm">
        <div className="p-5 sm:p-6">{children}</div>
      </div>
    </div>
  );
}

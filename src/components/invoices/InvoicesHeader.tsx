"use client";

import React from "react";

export const InvoicesHeader: React.FC = () => {
  return (
    <div className="w-full flex flex-col gap-2 pb-2">
      <h1
        className="text-zinc-900 font-bold font-['Onest'] tracking-tight"
        style={{ fontSize: "clamp(1.75rem, 3.2vw, 2.5rem)" }}
      >
        Invoices
      </h1>
      <p
        className="text-zinc-600 font-medium font-['Onest'] leading-relaxed max-w-3xl"
        style={{ fontSize: "clamp(0.875rem, 1.2vw, 1rem)" }}
      >
        Every invoice for your pool service, with what&apos;s settled and what&apos;s still outstanding.
      </p>
    </div>
  );
};

export default InvoicesHeader;


"use client";

import React from "react";

export const HelpCenterHeader: React.FC = () => {
  return (
    <div className="w-full flex flex-col gap-2 pb-2">
      <h1
        className="text-zinc-900 font-bold font-['Onest'] tracking-tight"
        style={{ fontSize: "clamp(1.75rem, 3.2vw, 2.5rem)" }}
      >
        Help Center
      </h1>
      <p
        className="text-zinc-600 font-medium font-['Onest'] leading-relaxed max-w-3xl"
        style={{ fontSize: "clamp(0.875rem, 1.2vw, 1rem)" }}
      >
        Reach the Madrid team by phone, message or email — and see the answers to the questions we get most.
      </p>
    </div>
  );
};

export default HelpCenterHeader;


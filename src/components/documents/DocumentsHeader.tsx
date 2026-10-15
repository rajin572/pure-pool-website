"use client";

import React from "react";

export const DocumentsHeader: React.FC = () => {
  return (
    <div className="w-full flex flex-col gap-2 pb-2">
      <h1 className="text-zinc-900 text-3xl sm:text-4xl lg:text-[40px] font-bold font-['Onest'] tracking-tight">
        Documents
      </h1>
      <p className="text-zinc-600 text-sm sm:text-base font-medium font-['Onest'] leading-relaxed max-w-3xl">
        Warranties, manuals and certificates for everything installed at your pool. Download anything, any time.
      </p>
    </div>
  );
};

export default DocumentsHeader;


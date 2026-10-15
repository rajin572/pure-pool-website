"use client";

import React from "react";
import { QuoteRecord } from "@/service/QuotesService/QuotesServiceApi";

interface QuoteTechnicianNotesCardProps {
  quote: QuoteRecord;
}

export const QuoteTechnicianNotesCard: React.FC<QuoteTechnicianNotesCardProps> = ({
  quote,
}) => {
  const notes =
    quote.notes ||
    "“The motor bearing has failed. It's still running but will seize within a few weeks. Replacing it now avoids an emergency callout and the extra charge that comes with one.”";

  const technician = quote.technician || {
    name: "Álvaro Ruiz",
    initials: "AR",
    role: "Senior technician",
    date: "12 May 2026, 10:24",
    location: "Madrid",
  };

  return (
    <div className="w-full p-5 sm:p-6 bg-white rounded-2xl border border-gray-200 flex flex-col justify-start items-start gap-4 shadow-2xs">
      <h2 className="text-zinc-900 text-lg font-bold leading-6">
        Notes From Technician
      </h2>

      {/* Quote speech container matching Figma */}
      <div className="w-full px-5 py-4 bg-gray-50 rounded-xl flex flex-col justify-start items-start border border-gray-100">
        <p className="text-zinc-900 text-sm sm:text-base font-medium leading-7 italic">
          {notes}
        </p>
      </div>

      {/* Technician profile footer matching Figma */}
      <div className="w-full flex items-center gap-3 pt-1">
        <div className="size-10 bg-gradient-to-br from-sky-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm sm:text-base font-bold shadow-xs shrink-0">
          {technician.initials || "AR"}
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <div className="text-zinc-900 text-sm sm:text-base font-semibold leading-tight">
            {technician.name}
          </div>
          <div className="text-zinc-400 text-xs sm:text-sm font-medium leading-normal mt-0.5">
            {technician.role} · {technician.date || "12 May 2026, 10:24"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteTechnicianNotesCard;


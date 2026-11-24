"use client";

import React from "react";
import { QuoteRecord } from "@/service/QuotesService/QuotesServiceApi";
import { resolveImageUrl } from "@/helpers/config/envConfig";

interface QuoteTechnicianNotesCardProps {
  quote: QuoteRecord;
}

export const QuoteTechnicianNotesCard: React.FC<QuoteTechnicianNotesCardProps> = ({ quote }) => {
  if (!quote.customerNote && !quote.technician) return null;

  const initials = quote.technician?.name
    ?.split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

  return (
    <div className="w-full p-5 sm:p-6 bg-white rounded-2xl border border-gray-200 flex flex-col justify-start items-start gap-4 shadow-2xs">
      <h2 className="text-zinc-900 text-lg font-bold leading-6">Notes From Technician</h2>

      {quote.customerNote && (
        <div className="w-full px-5 py-4 bg-gray-50 rounded-xl flex flex-col justify-start items-start border border-gray-100">
          <p className="text-zinc-900 text-sm sm:text-base font-medium leading-7 italic">&ldquo;{quote.customerNote}&rdquo;</p>
        </div>
      )}

      {quote.technician && (
        <div className="w-full flex items-center gap-3 pt-1">
          {quote.technician.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={resolveImageUrl(quote.technician.avatarUrl)} alt={quote.technician.name} className="size-10 rounded-full object-cover shrink-0" />
          ) : (
            <div className="size-10 bg-gradient-to-br from-sky-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm sm:text-base font-bold shadow-xs shrink-0">
              {initials}
            </div>
          )}
          <div className="flex-1 flex flex-col justify-center">
            <div className="text-zinc-900 text-sm sm:text-base font-semibold leading-tight">{quote.technician.name}</div>
            <div className="text-zinc-400 text-xs sm:text-sm font-medium leading-normal mt-0.5">
              {[quote.technician.jobTitle, quote.technician.area].filter(Boolean).join(" · ")}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuoteTechnicianNotesCard;

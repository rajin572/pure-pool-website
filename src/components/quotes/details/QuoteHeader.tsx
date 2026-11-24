"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { QuoteRecord } from "@/service/QuotesService/QuotesServiceApi";

interface QuoteHeaderProps {
  quote: QuoteRecord;
}

export const QuoteHeader: React.FC<QuoteHeaderProps> = ({ quote }) => {
  const status = quote.status;

  return (
    <div className="w-full flex flex-col gap-4 pb-2">
      <nav aria-label="Breadcrumb" className="inline-flex items-center gap-2">
        <Link href="/quotes" className="text-zinc-400 hover:text-zinc-600 text-sm sm:text-base font-medium transition-colors">
          Quotes &amp; Proposals
        </Link>
        <ChevronRight className="w-4 h-4 text-zinc-400 stroke-[2]" />
        <span className="text-zinc-900 text-sm sm:text-base font-semibold">{quote.number || quote._id}</span>
      </nav>

      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
        <h1 className="text-zinc-900 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">{quote.title || quote.kind}</h1>

        {status === "SENT" && (
          <span className="px-3.5 py-1.5 bg-amber-50 border border-amber-200/70 rounded-full text-amber-700 text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            Awaiting your decision
          </span>
        )}

        {status === "ACCEPTED" && (
          <span className="px-3.5 py-1.5 bg-emerald-50 border border-emerald-200/80 rounded-full text-green-700 text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-600" />
            Accepted
          </span>
        )}

        {status === "DECLINED" && (
          <span className="px-3.5 py-1.5 bg-red-50 border border-red-200/80 rounded-full text-red-600 text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-600" />
            Declined
          </span>
        )}

        {(status === "EXPIRED" || status === "CANCELLED") && (
          <span className="px-3.5 py-1.5 bg-gray-100 border border-gray-200 rounded-full text-gray-700 text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5">
            {status === "EXPIRED" ? "Expired" : "Cancelled"}
          </span>
        )}
      </div>

      <p className="text-zinc-600 text-sm sm:text-base font-medium leading-relaxed">
        Quote {quote.number || quote._id}
        {quote.sentAt ? ` · Sent ${new Date(quote.sentAt).toLocaleDateString()}` : ""}
        {quote.validUntil ? ` · Valid until ${new Date(quote.validUntil).toLocaleDateString()}` : ""}
      </p>
    </div>
  );
};

export default QuoteHeader;

"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { QuoteRecord } from "@/service/QuotesService/QuotesServiceApi";

interface QuoteHeaderProps {
  quote: QuoteRecord;
  currentStatus: QuoteRecord["status"];
  onStatusChange: (status: QuoteRecord["status"]) => void;
}

export const QuoteHeader: React.FC<QuoteHeaderProps> = ({
  quote,
  currentStatus,
  onStatusChange,
}) => {
  return (
    <div className="w-full flex flex-col gap-4 pb-2">
      {/* Top Breadcrumb & Status Switcher Row */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3">
        {/* Breadcrumb matching Figma */}
        <nav aria-label="Breadcrumb" className="inline-flex items-center gap-2">
          <Link
            href="/quotes"
            className="text-zinc-400 hover:text-zinc-600 text-sm sm:text-base font-medium transition-colors"
          >
            Quotes &amp; Proposals
          </Link>
          <ChevronRight className="w-4 h-4 text-zinc-400 stroke-[2]" />
          <span className="text-zinc-900 text-sm sm:text-base font-semibold">
            {quote.reference}
          </span>
        </nav>

        {/* State Preview Switcher for design inspection */}
        <div className="inline-flex items-center p-1 bg-white border border-gray-200/90 rounded-full shadow-2xs">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider px-2 hidden sm:inline">
            Preview
          </span>
          {(["Pending Review", "Accepted", "Declined"] as const).map((st) => {
            const isActive = currentStatus === st;
            return (
              <button
                key={st}
                type="button"
                onClick={() => onStatusChange(st)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? st === "Accepted"
                      ? "bg-emerald-600 text-white shadow-xs"
                      : st === "Declined"
                        ? "bg-red-600 text-white shadow-xs"
                        : "bg-blue-600 text-white shadow-xs"
                    : "text-zinc-600 hover:text-zinc-900 hover:bg-gray-100/70"
                }`}
              >
                {st === "Pending Review" ? "Pending" : st}
              </button>
            );
          })}
        </div>
      </div>

      {/* Title & Status Badge Row */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
        <h1 className="text-zinc-900 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
          {quote.forService}
        </h1>

        {/* Dynamic Status Badge matching Figma */}
        {currentStatus === "Pending Review" && (
          <span className="px-3.5 py-1.5 bg-amber-50 border border-amber-200/70 rounded-full text-amber-700 text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            Awaiting your decision
          </span>
        )}

        {currentStatus === "Accepted" && (
          <span className="px-3.5 py-1.5 bg-emerald-50 border border-emerald-200/80 rounded-full text-green-700 text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-600" />
            Accepted
          </span>
        )}

        {currentStatus === "Declined" && (
          <span className="px-3.5 py-1.5 bg-red-50 border border-red-200/80 rounded-full text-red-600 text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-600" />
            Declined
          </span>
        )}

        {currentStatus === "Expired" && (
          <span className="px-3.5 py-1.5 bg-gray-100 border border-gray-200 rounded-full text-gray-700 text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5">
            Expired
          </span>
        )}
      </div>

      {/* Subtitle / Details info row */}
      <p className="text-zinc-600 text-sm sm:text-base font-medium leading-relaxed">
        {quote.poolName} · Quote {quote.reference} · Sent {quote.sentDate} · Valid until {quote.validUntil}
      </p>
    </div>
  );
};

export default QuoteHeader;


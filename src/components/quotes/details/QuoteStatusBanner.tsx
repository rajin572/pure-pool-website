"use client";

import React from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { QuoteRecord } from "@/service/QuotesService/QuotesServiceApi";

interface QuoteStatusBannerProps {
  status: QuoteRecord["status"];
  quote: QuoteRecord;
}

export const QuoteStatusBanner: React.FC<QuoteStatusBannerProps> = ({
  status,
  quote,
}) => {
  if (status === "Accepted") {
    return (
      <div className="w-full px-5 sm:px-6 py-5 bg-emerald-50 rounded-2xl border border-emerald-200 inline-flex justify-start items-start gap-4 transition-all animate-fadeIn">
        <div className="size-6 text-green-700 shrink-0 mt-0.5">
          <CheckCircle2 className="w-6 h-6 stroke-[2.2]" />
        </div>
        <div className="flex-1 flex flex-col justify-start items-start gap-1">
          <h3 className="text-green-700 text-base sm:text-lg font-bold leading-6">
            Quote accepted on {quote.acceptedDate || "15 May 2026"}
          </h3>
          <p className="text-green-700 text-sm sm:text-base font-medium leading-relaxed">
            The work is scheduled for{" "}
            <span className="font-semibold">
              {quote.scheduledDate || "Thursday 22 May, 09:00 – 11:00"}
            </span>
            .{" "}
            {quote.scheduledTechnician ||
              (quote.technician?.name ?? "Álvaro Ruiz")}{" "}
            will carry it out and you&apos;ll be invoiced after completion.
          </p>
        </div>
      </div>
    );
  }

  if (status === "Declined") {
    return (
      <div className="w-full px-5 sm:px-6 py-5 bg-red-50 rounded-2xl border border-red-200 inline-flex justify-start items-start gap-4 transition-all animate-fadeIn">
        <div className="size-6 text-red-600 shrink-0 mt-0.5">
          <AlertCircle className="w-6 h-6 stroke-[2.2]" />
        </div>
        <div className="flex-1 flex flex-col justify-start items-start gap-1">
          <h3 className="text-red-600 text-base sm:text-lg font-bold leading-6">
            Quote declined on {quote.declinedDate || "15 May 2026"} · Reason:{" "}
            {quote.declinedReason || "Getting another quote"}
          </h3>
          <p className="text-red-600 text-sm sm:text-base font-medium leading-relaxed">
            Changed your mind? You can reopen this quote any time until{" "}
            <span className="font-semibold">{quote.validUntil || "26 May 2026"}</span> and
            it stays at the same price.
          </p>
        </div>
      </div>
    );
  }

  return null;
};

export default QuoteStatusBanner;


"use client";

import React from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { QuoteRecord } from "@/service/QuotesService/QuotesServiceApi";

const DECLINE_REASON_LABEL: Record<string, string> = {
  TOO_EXPENSIVE: "Too expensive",
  ANOTHER_QUOTE: "Getting another quote",
  NOT_NEEDED_NOW: "Not needed right now",
  DISCUSS_FIRST: "Wants to discuss first",
  OTHER: "Other",
};

interface QuoteStatusBannerProps {
  quote: QuoteRecord;
}

export const QuoteStatusBanner: React.FC<QuoteStatusBannerProps> = ({ quote }) => {
  if (quote.status === "ACCEPTED") {
    return (
      <div className="w-full px-5 sm:px-6 py-5 bg-emerald-50 rounded-2xl border border-emerald-200 inline-flex justify-start items-start gap-4 transition-all animate-fadeIn">
        <div className="size-6 text-green-700 shrink-0 mt-0.5">
          <CheckCircle2 className="w-6 h-6 stroke-[2.2]" />
        </div>
        <div className="flex-1 flex flex-col justify-start items-start gap-1">
          <h3 className="text-green-700 text-base sm:text-lg font-bold leading-6">
            Quote accepted{quote.acceptedAt ? ` on ${new Date(quote.acceptedAt).toLocaleDateString()}` : ""}
          </h3>
          <p className="text-green-700 text-sm sm:text-base font-medium leading-relaxed">
            {quote.kind === "INSTALLATION"
              ? "Next, sign the contract below to confirm your maintenance plan."
              : quote.signatureRequired && quote.repairBillingStatus === "AWAITING_SIGNATURE"
                ? "Sign below to confirm the work and get your invoice."
                : "An invoice has been issued for this work."}
          </p>
        </div>
      </div>
    );
  }

  if (quote.status === "DECLINED") {
    return (
      <div className="w-full px-5 sm:px-6 py-5 bg-red-50 rounded-2xl border border-red-200 inline-flex justify-start items-start gap-4 transition-all animate-fadeIn">
        <div className="size-6 text-red-600 shrink-0 mt-0.5">
          <AlertCircle className="w-6 h-6 stroke-[2.2]" />
        </div>
        <div className="flex-1 flex flex-col justify-start items-start gap-1">
          <h3 className="text-red-600 text-base sm:text-lg font-bold leading-6">
            Quote declined{quote.declinedAt ? ` on ${new Date(quote.declinedAt).toLocaleDateString()}` : ""}
            {quote.declineReason ? ` · Reason: ${DECLINE_REASON_LABEL[quote.declineReason] || quote.declineReason}` : ""}
          </h3>
          <p className="text-red-600 text-sm sm:text-base font-medium leading-relaxed">
            Changed your mind? You can reopen this quote
            {quote.validUntil ? (
              <>
                {" "}
                any time until <span className="font-semibold">{new Date(quote.validUntil).toLocaleDateString()}</span> and it stays at the same price.
              </>
            ) : (
              "."
            )}
          </p>
        </div>
      </div>
    );
  }

  return null;
};

export default QuoteStatusBanner;

"use client";

import React from "react";
import { QuoteRecord } from "@/service/QuotesService/QuotesServiceApi";
import { Check } from "lucide-react";

interface QuoteNextStepsCardProps {
  quote: QuoteRecord;
}

export const QuoteNextStepsCard: React.FC<QuoteNextStepsCardProps> = ({ quote }) => {
  const isAccepted = quote.status === "ACCEPTED";
  const needsSignature = quote.kind === "INSTALLATION" || (quote.signatureRequired && quote.repairBillingStatus !== "NOT_APPLICABLE");

  const step2 = needsSignature
    ? { title: "You sign", body: quote.kind === "INSTALLATION" ? "Sign the contract to confirm your plan." : "Sign to confirm the work." }
    : { title: "We schedule", body: "Your visit is scheduled and you'll be notified." };

  return (
    <div className="w-full p-5 sm:p-6 bg-white rounded-2xl border border-gray-200 flex flex-col justify-start items-start gap-4 shadow-2xs">
      <h2 className="text-zinc-900 text-lg font-bold leading-6">What happens next</h2>

      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-5 pt-1">
        <div className="flex flex-col justify-start items-start gap-2.5">
          <div
            className={`size-8 rounded-xl flex items-center justify-center transition-colors ${
              isAccepted ? "bg-green-700 text-white shadow-2xs" : quote.status === "SENT" ? "bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-2xs" : "bg-sky-50 text-blue-600"
            }`}
          >
            {isAccepted ? <Check className="w-4 h-4 stroke-[3]" /> : <span className="text-base font-bold leading-5">1</span>}
          </div>
          <div className="text-zinc-900 text-base font-semibold leading-6">You accept</div>
          <p className="text-zinc-600 text-sm font-medium leading-5">Approve the quote here in the portal.</p>
        </div>

        <div className="flex flex-col justify-start items-start gap-2.5">
          <div className={`size-8 rounded-xl flex items-center justify-center transition-colors ${isAccepted ? "bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-2xs" : "bg-sky-50 text-blue-600"}`}>
            <span className="text-base font-bold leading-5">2</span>
          </div>
          <div className="text-zinc-900 text-base font-semibold leading-6">{step2.title}</div>
          <p className="text-zinc-600 text-sm font-medium leading-5">{step2.body}</p>
        </div>

        <div className="flex flex-col justify-start items-start gap-2.5">
          <div className="size-8 bg-sky-50 text-blue-600 rounded-xl flex items-center justify-center">
            <span className="text-base font-bold leading-5">3</span>
          </div>
          <div className="text-zinc-900 text-base font-semibold leading-6">Work completed</div>
          <p className="text-zinc-600 text-sm font-medium leading-5">We invoice only after the job is done.</p>
        </div>
      </div>
    </div>
  );
};

export default QuoteNextStepsCard;

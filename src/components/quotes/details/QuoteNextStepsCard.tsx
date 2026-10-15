"use client";

import React from "react";
import { QuoteRecord } from "@/service/QuotesService/QuotesServiceApi";
import { Check } from "lucide-react";

interface QuoteNextStepsCardProps {
  status: QuoteRecord["status"];
}

export const QuoteNextStepsCard: React.FC<QuoteNextStepsCardProps> = ({ status }) => {
  const isAccepted = status === "Accepted";

  return (
    <div className="w-full p-5 sm:p-6 bg-white rounded-2xl border border-gray-200 flex flex-col justify-start items-start gap-4 shadow-2xs">
      <h2 className="text-zinc-900 text-lg font-bold leading-6">What happens next</h2>

      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-5 pt-1">
        {/* Step 1: You accept */}
        <div className="flex flex-col justify-start items-start gap-2.5">
          <div
            className={`size-8 rounded-xl flex items-center justify-center transition-colors ${
              isAccepted
                ? "bg-green-700 text-white shadow-2xs"
                : status === "Pending Review"
                  ? "bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-2xs"
                  : "bg-sky-50 text-blue-600"
            }`}
          >
            {isAccepted ? (
              <Check className="w-4 h-4 stroke-[3]" />
            ) : (
              <span className="text-base font-bold leading-5">1</span>
            )}
          </div>
          <div className="text-zinc-900 text-base font-semibold leading-6">
            You accept
          </div>
          <p className="text-zinc-600 text-sm font-medium leading-5">
            Approve the quote here in the portal.
          </p>
        </div>

        {/* Step 2: We schedule */}
        <div className="flex flex-col justify-start items-start gap-2.5">
          <div
            className={`size-8 rounded-xl flex items-center justify-center transition-colors ${
              isAccepted
                ? "bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-2xs"
                : "bg-sky-50 text-blue-600"
            }`}
          >
            <span className="text-base font-bold leading-5">2</span>
          </div>
          <div className="text-zinc-900 text-base font-semibold leading-6">
            We schedule
          </div>
          <p className="text-zinc-600 text-sm font-medium leading-5">
            You&apos;ll get a date and a two-hour window.
          </p>
        </div>

        {/* Step 3: Work completed */}
        <div className="flex flex-col justify-start items-start gap-2.5">
          <div className="size-8 bg-sky-50 text-blue-600 rounded-xl flex items-center justify-center">
            <span className="text-base font-bold leading-5">3</span>
          </div>
          <div className="text-zinc-900 text-base font-semibold leading-6">
            Work completed
          </div>
          <p className="text-zinc-600 text-sm font-medium leading-5">
            We invoice only after the job is done.
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuoteNextStepsCard;


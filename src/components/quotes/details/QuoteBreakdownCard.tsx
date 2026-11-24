"use client";

import React from "react";
import { QuoteRecord } from "@/service/QuotesService/QuotesServiceApi";

interface QuoteBreakdownCardProps {
  quote: QuoteRecord;
}

export const QuoteBreakdownCard: React.FC<QuoteBreakdownCardProps> = ({ quote }) => {
  const items = quote.items || [];
  const subtotal = quote.subtotal ?? 0;
  const taxRate = quote.taxRate ?? 21;
  const taxAmount = quote.taxAmount ?? 0;
  const total = quote.total ?? 0;

  return (
    <div className="w-full p-5 sm:p-6 bg-white rounded-2xl border border-gray-200 flex flex-col justify-start items-start gap-4 shadow-2xs">
      <h2 className="text-zinc-900 text-lg font-bold leading-6">Quote Breakdown</h2>

      {items.length === 0 ? (
        <p className="text-sm text-zinc-500">Pricing is not available yet.</p>
      ) : (
        <div className="w-full flex flex-col">
          <div className="w-full pb-2.5 flex justify-between items-center text-zinc-400 text-xs font-semibold tracking-wider uppercase">
            <span>ITEM</span>
            <span>AMOUNT</span>
          </div>
          <div className="w-full h-px bg-gray-200" />

          {items.map((item, idx) => (
            <React.Fragment key={idx}>
              <div className="w-full py-3.5 flex justify-between items-start gap-4">
                <div className="flex flex-col">
                  <span className="text-zinc-900 text-sm sm:text-base font-medium leading-6">{item.description}</span>
                  {item.details && <span className="text-zinc-500 text-xs leading-normal mt-0.5">{item.details}</span>}
                </div>
                <span className="text-zinc-900 text-sm sm:text-base font-semibold leading-6 shrink-0">€{item.total.toFixed(2)}</span>
              </div>
              <div className="w-full h-px bg-gray-200" />
            </React.Fragment>
          ))}
        </div>
      )}

      <div className="w-full flex flex-col">
        <div className="w-full py-2 flex justify-between items-center">
          <span className="text-zinc-600 text-sm sm:text-base font-medium leading-6">Subtotal</span>
          <span className="text-zinc-900 text-sm sm:text-base font-semibold leading-6">€{subtotal.toFixed(2)}</span>
        </div>

        <div className="w-full py-2 flex justify-between items-center">
          <span className="text-zinc-600 text-sm sm:text-base font-medium leading-6">VAT {taxRate}%</span>
          <span className="text-zinc-900 text-sm sm:text-base font-semibold leading-6">€{taxAmount.toFixed(2)}</span>
        </div>

        <div className="w-full h-px bg-gray-200 my-1" />

        <div className="w-full pt-3 pb-1 flex justify-between items-center">
          <span className="text-zinc-900 text-base sm:text-lg font-bold leading-6">Total</span>
          <span className="text-blue-600 text-xl sm:text-2xl font-bold leading-8">€{total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default QuoteBreakdownCard;

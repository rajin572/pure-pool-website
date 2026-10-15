"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Clock,
  Download,
  HelpCircle,
  Calendar,
  MessageSquare,
  FileText,
  RotateCcw,
} from "lucide-react";
import { QuoteRecord } from "@/service/QuotesService/QuotesServiceApi";

interface QuoteSummarySidebarProps {
  quote: QuoteRecord;
  status: QuoteRecord["status"];
  onAccept: () => void;
  onOpenDeclineModal: () => void;
  onReopen: () => void;
  onDownloadPdf: () => void;
  onMessageTechnician: () => void;
  onAskQuestion: () => void;
  onDownloadReceipt: () => void;
}

export const QuoteSummarySidebar: React.FC<QuoteSummarySidebarProps> = ({
  quote,
  status,
  onAccept,
  onOpenDeclineModal,
  onReopen,
  onDownloadPdf,
  onMessageTechnician,
  onAskQuestion,
  onDownloadReceipt,
}) => {
  const [downloading, setDownloading] = useState(false);

  const technician = quote.technician || {
    name: "Álvaro Ruiz",
    initials: "AR",
    role: "Senior technician",
    location: "Madrid",
  };

  const handlePdfClick = async () => {
    setDownloading(true);
    try {
      await onDownloadPdf();
    } finally {
      setTimeout(() => setDownloading(false), 800);
    }
  };

  return (
    <aside className="w-full lg:w-[400px] flex flex-col gap-6 shrink-0">
      {/* 1. Main Quote Total & Actions Card */}
      <div className="w-full p-6 bg-white rounded-2xl border border-gray-200 flex flex-col gap-4 shadow-2xs">
        {/* Total Label */}
        <div className="text-zinc-600 text-sm sm:text-base font-medium">
          {status === "Pending Review" ? "Total to approve" : "Quote total"}
        </div>

        {/* Big Amount */}
        <div className="text-blue-600 text-3xl sm:text-4xl font-bold tracking-tight">
          {quote.amount || "€411.40"}
        </div>

        {/* Subtotal & VAT Breakdown */}
        <div className="w-full flex flex-col gap-1.5 pt-1">
          <div className="w-full flex justify-between items-center text-sm sm:text-base">
            <span className="text-zinc-600 font-medium">Subtotal</span>
            <span className="text-zinc-900 font-semibold">
              {quote.subtotal || "€340.00"}
            </span>
          </div>
          <div className="w-full flex justify-between items-center text-sm sm:text-base">
            <span className="text-zinc-600 font-medium">
              VAT {quote.vatRate || "21%"}
            </span>
            <span className="text-zinc-900 font-semibold">
              {quote.vatAmount || "€71.40"}
            </span>
          </div>
        </div>

        <div className="w-full h-px bg-gray-200" />

        {/* Validity Countdown matching Figma */}
        <div className="flex items-center gap-2.5 text-zinc-400 text-sm font-medium">
          <Clock className="w-4 h-4 shrink-0 text-zinc-400" />
          <span>
            {status === "Pending Review"
              ? `Valid until ${quote.validUntil || "26 May"} · 11 days left`
              : `Valid until ${quote.validUntil || "26 May 2026"}`}
          </span>
        </div>

        {/* Dynamic Buttons based on status */}
        <div className="w-full flex flex-col gap-3 pt-1">
          {status === "Pending Review" && (
            <>
              {/* Accept Quote */}
              <button
                type="button"
                onClick={onAccept}
                className="w-full py-4 bg-gradient-to-br from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 active:scale-[0.99] text-white text-base font-bold rounded-2xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                Accept quote
              </button>

              {/* Decline */}
              <button
                type="button"
                onClick={onOpenDeclineModal}
                className="w-full py-4 bg-white border border-red-200 hover:bg-red-50 text-red-600 active:scale-[0.99] text-base font-bold rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                Decline
              </button>
            </>
          )}

          {status === "Accepted" && (
            <>
              {/* View scheduled visit */}
              <Link
                href="/service-history"
                className="w-full py-4 bg-gradient-to-br from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 active:scale-[0.99] text-white text-base font-bold rounded-2xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2 text-center"
              >
                <Calendar className="w-5 h-5 text-white" />
                <span>View scheduled visit</span>
              </Link>

              {/* Download receipt */}
              <button
                type="button"
                onClick={onDownloadReceipt}
                className="w-full py-4 bg-white border border-gray-200 hover:bg-gray-50 active:scale-[0.99] text-zinc-900 text-base font-bold rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <FileText className="w-5 h-5 text-zinc-700" />
                <span>Download receipt</span>
              </button>
            </>
          )}

          {status === "Declined" && (
            <>
              {/* Reopen quote */}
              <button
                type="button"
                onClick={onReopen}
                className="w-full py-4 bg-gradient-to-br from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 active:scale-[0.99] text-white text-base font-bold rounded-2xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5 text-white" />
                <span>Reopen quote</span>
              </button>
            </>
          )}
        </div>

        <div className="w-full h-px bg-gray-200 my-1" />

        {/* Utility Links matching Figma */}
        <div className="w-full flex flex-col gap-2">
          {/* Download PDF */}
          <button
            type="button"
            onClick={handlePdfClick}
            disabled={downloading}
            className="w-full py-1.5 flex items-center gap-2.5 text-blue-600 hover:text-blue-700 text-sm sm:text-base font-semibold transition-colors cursor-pointer text-left"
          >
            <Download className="w-5 h-5 shrink-0" />
            <span>{downloading ? "Preparing PDF…" : "Download PDF"}</span>
          </button>

          {/* Ask a question about this quote */}
          <button
            type="button"
            onClick={onAskQuestion}
            className="w-full py-1.5 flex items-center gap-2.5 text-blue-600 hover:text-blue-700 text-sm sm:text-base font-semibold transition-colors cursor-pointer text-left"
          >
            <HelpCircle className="w-5 h-5 shrink-0" />
            <span>Ask a question about this quote</span>
          </button>
        </div>
      </div>

      {/* 2. Your Technician Card matching Figma */}
      <div className="w-full p-6 bg-white rounded-2xl border border-gray-200 flex flex-col gap-4 shadow-2xs">
        <div className="text-zinc-600 text-sm sm:text-base font-medium">
          Your technician
        </div>

        <div className="w-full flex items-center gap-3">
          <div className="size-11 bg-gradient-to-br from-sky-500 to-blue-600 rounded-full flex items-center justify-center text-white text-base font-bold shadow-xs shrink-0">
            {technician.initials || "AR"}
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <div className="text-zinc-900 text-base font-semibold leading-tight">
              {technician.name}
            </div>
            <div className="text-zinc-400 text-xs sm:text-sm font-medium leading-normal mt-0.5">
              {technician.role} · {technician.location || "Madrid"}
            </div>
          </div>
        </div>

        {/* Message Álvaro button matching Figma */}
        <button
          type="button"
          onClick={onMessageTechnician}
          className="w-full py-3.5 bg-white border border-gray-200 hover:bg-gray-50 active:scale-[0.99] text-zinc-900 text-sm sm:text-base font-bold rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <MessageSquare className="w-5 h-5 text-blue-600" />
          <span>Message {technician.name.split(" ")[0]}</span>
        </button>
      </div>
    </aside>
  );
};

export default QuoteSummarySidebar;


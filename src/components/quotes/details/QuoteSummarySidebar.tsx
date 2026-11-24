"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Clock, Download, HelpCircle, FileText, RotateCcw, ArrowRight } from "lucide-react";
import { QuoteRecord, respondToQuote, reopenQuote, signRepairQuote } from "@/service/QuotesService/QuotesServiceApi";
import { downloadPdf } from "@/lib/apiFiles";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface QuoteSummarySidebarProps {
  quote: QuoteRecord;
  onOpenDeclineModal: () => void;
  onRefresh: () => void;
}

export const QuoteSummarySidebar: React.FC<QuoteSummarySidebarProps> = ({ quote, onOpenDeclineModal, onRefresh }) => {
  const router = useRouter();
  const [downloading, setDownloading] = useState(false);
  const [accepting, setAccepting] = useState(false);
  const [reopening, setReopening] = useState(false);
  const [signerName, setSignerName] = useState("");
  const [signing, setSigning] = useState(false);

  const daysLeft = quote.daysLeft;

  const handleAccept = async () => {
    setAccepting(true);
    const res = await respondToQuote(quote._id, true);
    setAccepting(false);
    if (!res.success) {
      toast.error(res.error.message);
      return;
    }
    toast.success("Quote accepted!");
    if (res.data.nextStep === "SIGN_CONTRACT" && res.data.contractId) {
      router.push(`/contracts/${res.data.contractId}`);
      return;
    }
    if (res.data.nextStep === "PAY_INVOICE") {
      router.push("/invoices");
      return;
    }
    onRefresh();
  };

  const handleReopen = async () => {
    setReopening(true);
    const res = await reopenQuote(quote._id);
    setReopening(false);
    if (!res.success) {
      toast.error(res.error.message);
      return;
    }
    toast.success("Quote reopened. You can now accept or review changes.");
    onRefresh();
  };

  const handleSignRepair = async () => {
    if (!signerName.trim()) {
      toast.error("Enter your full name to sign.");
      return;
    }
    setSigning(true);
    const res = await signRepairQuote(quote._id, signerName.trim());
    setSigning(false);
    if (!res.success) {
      toast.error(res.error.message);
      return;
    }
    toast.success("Signed — your invoice is ready.");
    router.push("/invoices");
  };

  const handlePdfClick = async () => {
    setDownloading(true);
    try {
      await downloadPdf(`/quotes/${quote._id}/pdf`, { fileName: `${quote.number || quote._id}.pdf` });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not download the PDF");
    } finally {
      setDownloading(false);
    }
  };

  const needsRepairSignature = quote.status === "ACCEPTED" && quote.signatureRequired && quote.repairBillingStatus === "AWAITING_SIGNATURE";

  return (
    <aside className="w-full lg:w-[400px] flex flex-col gap-6 shrink-0">
      <div className="w-full p-6 bg-white rounded-2xl border border-gray-200 flex flex-col gap-4 shadow-2xs">
        <div className="text-zinc-600 text-sm sm:text-base font-medium">{quote.status === "SENT" ? "Total to approve" : "Quote total"}</div>

        <div className="text-blue-600 text-3xl sm:text-4xl font-bold tracking-tight">€{(quote.total ?? 0).toFixed(2)}</div>

        <div className="w-full flex flex-col gap-1.5 pt-1">
          <div className="w-full flex justify-between items-center text-sm sm:text-base">
            <span className="text-zinc-600 font-medium">Subtotal</span>
            <span className="text-zinc-900 font-semibold">€{(quote.subtotal ?? 0).toFixed(2)}</span>
          </div>
          <div className="w-full flex justify-between items-center text-sm sm:text-base">
            <span className="text-zinc-600 font-medium">VAT {quote.taxRate ?? 21}%</span>
            <span className="text-zinc-900 font-semibold">€{(quote.taxAmount ?? 0).toFixed(2)}</span>
          </div>
        </div>

        <div className="w-full h-px bg-gray-200" />

        {quote.validUntil && (
          <div className="flex items-center gap-2.5 text-zinc-400 text-sm font-medium">
            <Clock className="w-4 h-4 shrink-0 text-zinc-400" />
            <span>
              Valid until {new Date(quote.validUntil).toLocaleDateString()}
              {daysLeft !== null && daysLeft >= 0 ? ` · ${daysLeft} day${daysLeft === 1 ? "" : "s"} left` : ""}
            </span>
          </div>
        )}

        <div className="w-full flex flex-col gap-3 pt-1">
          {quote.status === "SENT" && (
            <>
              <button
                type="button"
                onClick={handleAccept}
                disabled={accepting}
                className="w-full py-4 bg-gradient-to-br from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 active:scale-[0.99] text-white text-base font-bold rounded-2xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {accepting ? "Accepting..." : "Accept quote"}
              </button>

              <button
                type="button"
                onClick={onOpenDeclineModal}
                disabled={accepting}
                className="w-full py-4 bg-white border border-red-200 hover:bg-red-50 text-red-600 active:scale-[0.99] text-base font-bold rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                Decline
              </button>
            </>
          )}

          {needsRepairSignature && (
            <div className="w-full flex flex-col gap-2.5 p-4 bg-sky-50 rounded-2xl border border-sky-100">
              <p className="text-sm font-semibold text-zinc-900">Sign to confirm the work</p>
              <input
                type="text"
                value={signerName}
                onChange={(e) => setSignerName(e.target.value)}
                placeholder="Your full name"
                className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={handleSignRepair}
                disabled={signing}
                className="w-full py-3 bg-gradient-to-br from-sky-500 to-blue-600 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {signing ? "Signing..." : "Sign & get invoice"} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {quote.status === "ACCEPTED" && !needsRepairSignature && quote.invoiceId && (
            <Link
              href="/invoices"
              className="w-full py-4 bg-gradient-to-br from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 active:scale-[0.99] text-white text-base font-bold rounded-2xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2 text-center"
            >
              <FileText className="w-5 h-5 text-white" />
              <span>View invoice</span>
            </Link>
          )}

          {quote.status === "DECLINED" && (
            <button
              type="button"
              onClick={handleReopen}
              disabled={reopening}
              className="w-full py-4 bg-gradient-to-br from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 active:scale-[0.99] text-white text-base font-bold rounded-2xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <RotateCcw className="w-5 h-5 text-white" />
              <span>{reopening ? "Reopening..." : "Reopen quote"}</span>
            </button>
          )}
        </div>

        <div className="w-full h-px bg-gray-200 my-1" />

        <div className="w-full flex flex-col gap-2">
          <button
            type="button"
            onClick={handlePdfClick}
            disabled={downloading}
            className="w-full py-1.5 flex items-center gap-2.5 text-blue-600 hover:text-blue-700 text-sm sm:text-base font-semibold transition-colors cursor-pointer text-left"
          >
            <Download className="w-5 h-5 shrink-0" />
            <span>{downloading ? "Preparing PDF…" : "Download PDF"}</span>
          </button>

          <Link
            href="/help-center"
            className="w-full py-1.5 flex items-center gap-2.5 text-blue-600 hover:text-blue-700 text-sm sm:text-base font-semibold transition-colors cursor-pointer text-left"
          >
            <HelpCircle className="w-5 h-5 shrink-0" />
            <span>Ask a question about this quote</span>
          </Link>
        </div>
      </div>

      {quote.technician && (
        <div className="w-full p-6 bg-white rounded-2xl border border-gray-200 flex flex-col gap-4 shadow-2xs">
          <div className="text-zinc-600 text-sm sm:text-base font-medium">Your technician</div>

          <div className="w-full flex items-center gap-3">
            <div className="size-11 bg-gradient-to-br from-sky-500 to-blue-600 rounded-full flex items-center justify-center text-white text-base font-bold shadow-xs shrink-0">
              {quote.technician.name
                .split(/\s+/)
                .slice(0, 2)
                .map((p) => p[0]?.toUpperCase())
                .join("")}
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <div className="text-zinc-900 text-base font-semibold leading-tight">{quote.technician.name}</div>
              <div className="text-zinc-400 text-xs sm:text-sm font-medium leading-normal mt-0.5">
                {[quote.technician.jobTitle, quote.technician.area].filter(Boolean).join(" · ")}
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default QuoteSummarySidebar;

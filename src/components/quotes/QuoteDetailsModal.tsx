"use client";

import React, { useState } from "react";
import ReusableModal from "@/components/ui/CustomUi/ReuseableModal";
import ReusableGradientButton from "@/components/ui/CustomUi/ReusableGradientButton";
import { Button } from "@/components/ui/button";
import { QuoteRecord, acceptQuote, declineQuote, downloadQuotePdf } from "@/service/QuotesService/QuotesServiceApi";
import { CheckCircle2, Download, XCircle, Calendar, ShieldCheck } from "lucide-react";

interface QuoteDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quote: QuoteRecord | null;
  onStatusChange?: (newStatus: QuoteRecord["status"]) => void;
}

export const QuoteDetailsModal: React.FC<QuoteDetailsModalProps> = ({
  open,
  onOpenChange,
  quote,
  onStatusChange,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!quote) return null;

  const handleAccept = async () => {
    setIsSubmitting(true);
    const res = await acceptQuote(quote.id);
    if (res.success) {
      setSuccessMessage("Quote accepted! Our scheduling team will contact you.");
      if (onStatusChange) onStatusChange("Accepted");
      setTimeout(() => {
        setSuccessMessage(null);
        setIsSubmitting(false);
        onOpenChange(false);
      }, 1500);
    } else {
      setIsSubmitting(false);
    }
  };

  const handleDecline = async () => {
    setIsSubmitting(true);
    const res = await declineQuote(quote.id);
    if (res.success) {
      setSuccessMessage("Quote declined.");
      if (onStatusChange) onStatusChange("Declined");
      setTimeout(() => {
        setSuccessMessage(null);
        setIsSubmitting(false);
        onOpenChange(false);
      }, 1500);
    } else {
      setIsSubmitting(false);
    }
  };

  const handleDownload = async () => {
    const res = await downloadQuotePdf(quote.id);
    if (res.success) {
      alert(`Downloading official quote estimate for ${quote.reference}...`);
    }
  };

  const isPending = quote.status === "Pending Review";
  const isAccepted = quote.status === "Accepted";

  return (
    <ReusableModal
      open={open}
      onOpenChange={onOpenChange}
      title={`Estimate ${quote.reference}`}
      description={`For ${quote.forService} · ${quote.poolName}`}
      maxWidth="sm:max-w-xl md:max-w-2xl"
    >
      <div className="flex flex-col gap-6 text-gray-900 pb-2">
        {/* Status & Validity Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium">Status:</span>
            <span
              className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-bold ${isAccepted
                  ? "text-emerald-700 bg-emerald-100/80 border border-emerald-300"
                  : isPending
                    ? "text-amber-700 bg-amber-100/80 border border-amber-300"
                    : "text-gray-600 bg-gray-200/80 border border-gray-300"
                }`}
            >
              {quote.status}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            <span>Sent: {quote.sentDate}</span>
            <span>·</span>
            <span className="font-semibold text-gray-700">Valid until: {quote.validUntil}</span>
          </div>
        </div>

        {/* Total Cost Highlight Card */}
        <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-sky-50 border border-sky-200 shadow-xs text-center">
          <span className="text-xs font-bold tracking-wider text-sky-800 uppercase">
            ESTIMATED TOTAL COST
          </span>
          <span className="text-4xl sm:text-5xl font-extrabold text-sky-600 my-1">
            {quote.amount}
          </span>
          <span className="text-xs font-medium text-gray-500 flex items-center gap-1 mt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            Fixed price guarantee with 2-year warranty on OEM parts
          </span>
        </div>

        {/* Itemized Parts & Labor */}
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">
            Itemized Scope of Work
          </h3>

          <div className="p-4 rounded-xl border border-gray-200 bg-white flex flex-col divide-y divide-gray-100 text-sm">
            {quote.items && quote.items.length > 0 ? (
              quote.items.map((item, idx) => (
                <div key={idx} className="py-3 flex justify-between items-start gap-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-900">{item.name}</span>
                    {item.description && (
                      <span className="text-xs text-gray-500 mt-0.5">{item.description}</span>
                    )}
                  </div>
                  <span className="font-bold text-gray-900 shrink-0">{item.amount}</span>
                </div>
              ))
            ) : (
              <div className="py-3 flex justify-between items-center gap-4">
                <span className="font-medium text-gray-800">{quote.forService}</span>
                <span className="font-bold text-gray-900">{quote.amount}</span>
              </div>
            )}

            {quote.subtotal && (
              <div className="py-2.5 flex justify-between items-center gap-4 text-gray-500 text-xs sm:text-sm">
                <span>Subtotal (excl. VAT)</span>
                <span className="font-medium text-gray-700">{quote.subtotal}</span>
              </div>
            )}

            {quote.vatAmount && (
              <div className="py-2.5 flex justify-between items-center gap-4 text-gray-500 text-xs sm:text-sm">
                <span>VAT ({quote.vatRate || "21%"})</span>
                <span className="font-medium text-gray-700">{quote.vatAmount}</span>
              </div>
            )}

            <div className="pt-3 flex justify-between items-center gap-4 font-bold text-base text-gray-900">
              <span>Total Estimate</span>
              <span className="text-sky-600 text-lg">{quote.amount}</span>
            </div>
          </div>
        </div>

        {/* Technician Notes */}
        {quote.notes && (
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 text-xs sm:text-sm text-gray-600 leading-relaxed italic">
            &ldquo;{quote.notes}&rdquo;
          </div>
        )}

        {/* Actions */}
        {successMessage ? (
          <div className="w-full py-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-700 flex items-center justify-center gap-2 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            {successMessage}
          </div>
        ) : (
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleDownload}
              className="w-full sm:w-auto flex items-center gap-2 font-bold cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </Button>

            {isPending && (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button
                  type="button"
                  variant="ghost"
                  disabled={isSubmitting}
                  onClick={handleDecline}
                  className="flex-1 sm:flex-none text-red-600 hover:text-red-700 hover:bg-red-50 font-bold cursor-pointer"
                >
                  <XCircle className="w-4 h-4 mr-1.5" />
                  Decline
                </Button>

                <ReusableGradientButton
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleAccept}
                  className="flex-1 sm:flex-none px-6 h-10 text-sm font-bold flex items-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Accept Quote
                </ReusableGradientButton>
              </div>
            )}
          </div>
        )}
      </div>
    </ReusableModal>
  );
};

export default QuoteDetailsModal;


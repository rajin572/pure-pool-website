"use client";

import React, { useState } from "react";
import { Download, CreditCard, CheckCircle2, FileText } from "lucide-react";
import ReusableModal from "@/components/ui/CustomUi/ReuseableModal";
import ReusableGradientButton from "@/components/ui/CustomUi/ReusableGradientButton";
import { InvoiceRecord, payInvoice, downloadInvoicePdf } from "@/service/BillingService/BillingServiceApi";

interface InvoiceViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: InvoiceRecord | null;
  onPaymentSuccess?: () => void;
}

export const InvoiceViewModal: React.FC<InvoiceViewModalProps> = ({
  open,
  onOpenChange,
  invoice,
  onPaymentSuccess,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  if (!invoice) return null;

  const handlePay = async () => {
    setIsProcessing(true);
    try {
      /**
       * In live mode:
       * await payInvoice(invoice.id);
       */
      const res = await payInvoice(invoice.id);
      if (res.success) {
        setIsPaid(true);
        setTimeout(() => {
          setIsPaid(false);
          setIsProcessing(false);
          onOpenChange(false);
          if (onPaymentSuccess) onPaymentSuccess();
        }, 1200);
      }
    } catch {
      setIsProcessing(false);
    }
  };

  const handleDownload = async () => {
    const res = await downloadInvoicePdf(invoice.id);
    if (res.success && res.downloadUrl) {
      alert(`Downloading official tax receipt for ${invoice.invoiceNumber}...`);
    }
  };

  const isOutstanding = invoice.status === "Outstanding" && !isPaid;

  return (
    <ReusableModal
      open={open}
      onOpenChange={onOpenChange}
      title={invoice.invoiceNumber}
      maxWidth="sm:max-w-lg md:max-w-xl"
    >
      <div className="flex flex-col gap-6 text-zinc-900 pb-2">
        {/* Header Summary */}
        <div className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center shrink-0 text-sky-600">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-zinc-900 text-base">{invoice.service}</h3>
              <p className="text-xs sm:text-sm text-zinc-500">{invoice.period || `Issued: ${invoice.date}`}</p>
            </div>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              invoice.status === "Paid" || isPaid
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-amber-50 text-amber-700 border border-amber-200"
            }`}
          >
            {isPaid ? "Paid" : invoice.status}
          </span>
        </div>

        {/* Invoice Key Dates & Amount */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl border border-zinc-200 bg-white">
            <span className="text-xs text-zinc-400 block font-medium">Issue Date</span>
            <span className="text-sm font-bold text-zinc-900 mt-0.5 block">{invoice.date}</span>
          </div>
          <div className="p-3.5 rounded-xl border border-zinc-200 bg-white">
            <span className="text-xs text-zinc-400 block font-medium">Due Date</span>
            <span className="text-sm font-bold text-zinc-900 mt-0.5 block">{invoice.dueDate}</span>
          </div>
          <div className="p-3.5 rounded-xl border border-zinc-200 bg-white col-span-2 sm:col-span-1">
            <span className="text-xs text-zinc-400 block font-medium">Total (incl. VAT)</span>
            <span className="text-sm sm:text-base font-extrabold text-sky-600 mt-0.5 block">
              {invoice.amount}
            </span>
          </div>
        </div>

        {/* Line Items */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
            Breakdown & Line Items
          </span>
          <div className="p-4 rounded-xl border border-zinc-200 bg-white divide-y divide-zinc-100 text-sm">
            {invoice.lineItems && invoice.lineItems.length > 0 ? (
              invoice.lineItems.map((item, idx) => (
                <div key={idx} className="py-2.5 flex justify-between items-center gap-4">
                  <span className="text-zinc-700 font-medium">{item.description}</span>
                  <span className="font-semibold text-zinc-900 shrink-0">{item.amount}</span>
                </div>
              ))
            ) : (
              <div className="py-2.5 flex justify-between items-center gap-4">
                <span className="text-zinc-700 font-medium">{invoice.service}</span>
                <span className="font-semibold text-zinc-900 shrink-0">{invoice.subtotal || invoice.amount}</span>
              </div>
            )}

            {invoice.subtotal && (
              <div className="py-2.5 flex justify-between items-center gap-4 text-zinc-500">
                <span>Subtotal (excl. VAT)</span>
                <span className="font-medium text-zinc-700">{invoice.subtotal}</span>
              </div>
            )}

            {invoice.vatAmount && (
              <div className="py-2.5 flex justify-between items-center gap-4 text-zinc-500">
                <span>VAT ({invoice.vatRate || "21%"})</span>
                <span className="font-medium text-zinc-700">{invoice.vatAmount}</span>
              </div>
            )}

            <div className="pt-3 flex justify-between items-center gap-4 font-bold text-base text-zinc-900">
              <span>Total Payable</span>
              <span className="text-sky-600 text-lg">{invoice.amount}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleDownload}
            className="w-full sm:flex-1 h-11 px-4 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-800 text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-zinc-600" />
            Download PDF
          </button>

          {isOutstanding && (
            <ReusableGradientButton
              type="button"
              onClick={handlePay}
              disabled={isProcessing}
              className="w-full sm:flex-1 h-11 text-sm font-bold flex items-center justify-center gap-2 cursor-pointer"
            >
              <CreditCard className="w-4 h-4" />
              {isProcessing ? "Processing..." : "Pay Now"}
            </ReusableGradientButton>
          )}

          {isPaid && (
            <div className="w-full sm:flex-1 h-11 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-700 flex items-center justify-center gap-2 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Paid
            </div>
          )}
        </div>
      </div>
    </ReusableModal>
  );
};

export default InvoiceViewModal;


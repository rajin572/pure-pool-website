"use client";

import React, { useState } from "react";
import ReusableModal from "@/components/ui/CustomUi/ReuseableModal";
import ReusableGradientButton from "@/components/ui/CustomUi/ReusableGradientButton";
import { InvoiceRecord, payInvoice } from "@/service/BillingService/BillingServiceApi";
import { CreditCard, CheckCircle2 } from "lucide-react";

interface PayInvoiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: InvoiceRecord | null;
  onPaymentSuccess?: () => void;
}

export const PayInvoiceModal: React.FC<PayInvoiceModalProps> = ({
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
       * Design phase ready:
       * Trigger live payment action or RTK query mutation here:
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

  return (
    <ReusableModal
      open={open}
      onOpenChange={onOpenChange}
      title={`Pay Invoice ${invoice.invoiceNumber}`}
      maxWidth="sm:max-w-md md:max-w-lg"
    >
      <div className="flex flex-col gap-6 text-gray-900 pb-2">
        {/* Total Amount Highlight Card */}
        <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-amber-500/10 border border-amber-400/80 shadow-xs text-center">
          <span className="text-xs font-bold tracking-wider text-gray-700 uppercase">
            TOTAL AMOUNT
          </span>
          <span className="text-4xl sm:text-5xl font-extrabold text-amber-600 my-1">
            {invoice.amount}
          </span>
          <span className="text-sm font-medium text-gray-500">
            Due {invoice.dueDate}
          </span>
        </div>

        {/* Line Items Container */}
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-bold text-sky-700 uppercase tracking-wide">
            Line Items
          </h3>

          <div className="p-4 rounded-xl border border-gray-200 bg-white flex flex-col divide-y divide-gray-100 text-sm">
            {invoice.lineItems && invoice.lineItems.length > 0 ? (
              invoice.lineItems.map((item, idx) => (
                <div key={idx} className="py-2.5 flex justify-between items-center gap-4">
                  <span className="text-gray-700 font-medium">{item.description}</span>
                  <span className="font-semibold text-gray-900 shrink-0">{item.amount}</span>
                </div>
              ))
            ) : (
              <div className="py-2.5 flex justify-between items-center gap-4">
                <span className="text-gray-700 font-medium">{invoice.service}</span>
                <span className="font-semibold text-gray-900 shrink-0">{invoice.subtotal || invoice.amount}</span>
              </div>
            )}

            {invoice.subtotal && (
              <div className="py-2.5 flex justify-between items-center gap-4 text-gray-500">
                <span>Subtotal (excl. VAT)</span>
                <span className="font-medium text-gray-700">{invoice.subtotal}</span>
              </div>
            )}

            {invoice.vatAmount && (
              <div className="py-2.5 flex justify-between items-center gap-4 text-gray-500">
                <span>VAT ({invoice.vatRate || "21%"})</span>
                <span className="font-medium text-gray-700">{invoice.vatAmount}</span>
              </div>
            )}

            <div className="pt-3 flex justify-between items-center gap-4 font-bold text-base text-gray-900">
              <span className="text-gray-900">Total</span>
              <span className="text-sky-600 text-lg">{invoice.amount}</span>
            </div>
          </div>
        </div>

        {/* Payment Action */}
        <div className="pt-2 flex flex-col gap-3">
          {isPaid ? (
            <div className="w-full py-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-700 flex items-center justify-center gap-2 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              Payment Successful!
            </div>
          ) : (
            <ReusableGradientButton
              type="button"
              onClick={handlePay}
              disabled={isProcessing}
              className="w-full h-12 text-base font-bold flex items-center justify-center gap-2"
            >
              <CreditCard className="w-5 h-5" />
              {isProcessing ? "Connecting to Gateway..." : "Continue to payment"}
            </ReusableGradientButton>
          )}

          <p className="text-center text-xs text-gray-400">
            Encrypted with 256-bit SSL · Compliant with EU PSD2 Strong Customer Authentication
          </p>
        </div>
      </div>
    </ReusableModal>
  );
};

export default PayInvoiceModal;


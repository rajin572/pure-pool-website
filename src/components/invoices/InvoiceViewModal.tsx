"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Download, FileText, Clock } from "lucide-react";
import ReusableModal from "@/components/ui/CustomUi/ReuseableModal";
import { InvoiceRecord } from "@/service/BillingService/BillingServiceApi";
import { downloadPdf } from "@/lib/apiFiles";

interface InvoiceViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: InvoiceRecord | null;
}

const money = (n: number, currency = "EUR") => new Intl.NumberFormat("en-IE", { style: "currency", currency }).format(n || 0);

const EVENT_LABEL: Record<string, string> = {
  ISSUED: "Invoice sent",
  VIEWED: "Viewed",
  REMINDER_SENT: "Reminder sent",
  PAID: "Payment received",
  VOIDED: "Voided",
};

export const InvoiceViewModal: React.FC<InvoiceViewModalProps> = ({ open, onOpenChange, invoice }) => {
  const [downloading, setDownloading] = useState(false);

  if (!invoice) return null;

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadPdf(`/invoices/${invoice._id}/pdf`, { fileName: `${invoice.number}.pdf` });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not download the PDF");
    } finally {
      setDownloading(false);
    }
  };

  const isOutstanding = invoice.status === "ISSUED";

  return (
    <ReusableModal open={open} onOpenChange={onOpenChange} title={invoice.number} maxWidth="sm:max-w-lg md:max-w-xl">
      <div className="flex flex-col gap-6 text-zinc-900 pb-2">
        <div className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center shrink-0 text-sky-600">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-zinc-900 text-base">{invoice.whatFor.replace("_", " ")}</h3>
              <p className="text-xs sm:text-sm text-zinc-500">Issued: {invoice.issuedAt ? new Date(invoice.issuedAt).toLocaleDateString() : "—"}</p>
            </div>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              invoice.displayStatus === "PAID"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : invoice.displayStatus === "OVERDUE"
                ? "bg-red-50 text-red-700 border border-red-200"
                : "bg-amber-50 text-amber-700 border border-amber-200"
            }`}
          >
            {invoice.displayStatus}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl border border-zinc-200 bg-white">
            <span className="text-xs text-zinc-400 block font-medium">Issue Date</span>
            <span className="text-sm font-bold text-zinc-900 mt-0.5 block">{invoice.issuedAt ? new Date(invoice.issuedAt).toLocaleDateString() : "—"}</span>
          </div>
          <div className="p-3.5 rounded-xl border border-zinc-200 bg-white">
            <span className="text-xs text-zinc-400 block font-medium">Due Date</span>
            <span className="text-sm font-bold text-zinc-900 mt-0.5 block">{invoice.dueAt ? new Date(invoice.dueAt).toLocaleDateString() : "—"}</span>
          </div>
          <div className="p-3.5 rounded-xl border border-zinc-200 bg-white col-span-2 sm:col-span-1">
            <span className="text-xs text-zinc-400 block font-medium">Total (incl. VAT)</span>
            <span className="text-sm sm:text-base font-extrabold text-sky-600 mt-0.5 block">{money(invoice.total, invoice.currency)}</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Breakdown &amp; Line Items</span>
          <div className="p-4 rounded-xl border border-zinc-200 bg-white divide-y divide-zinc-100 text-sm">
            {invoice.lineItems.length > 0 ? (
              invoice.lineItems.map((item, idx) => (
                <div key={idx} className="py-2.5 flex justify-between items-center gap-4">
                  <span className="text-zinc-700 font-medium">
                    {item.description}
                    {item.quantity > 1 ? ` × ${item.quantity}` : ""}
                  </span>
                  <span className="font-semibold text-zinc-900 shrink-0">{money(item.total, invoice.currency)}</span>
                </div>
              ))
            ) : (
              <div className="py-2.5 text-zinc-500">No line items recorded.</div>
            )}

            <div className="py-2.5 flex justify-between items-center gap-4 text-zinc-500">
              <span>Subtotal (excl. VAT)</span>
              <span className="font-medium text-zinc-700">{money(invoice.subtotal, invoice.currency)}</span>
            </div>
            <div className="py-2.5 flex justify-between items-center gap-4 text-zinc-500">
              <span>VAT</span>
              <span className="font-medium text-zinc-700">{money(invoice.taxAmount, invoice.currency)}</span>
            </div>
            <div className="pt-3 flex justify-between items-center gap-4 font-bold text-base text-zinc-900">
              <span>Total Payable</span>
              <span className="text-sky-600 text-lg">{money(invoice.total, invoice.currency)}</span>
            </div>
          </div>
        </div>

        {invoice.events.length > 0 && (
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">History</span>
            <div className="flex flex-col gap-2.5">
              {invoice.events.map((ev, i) => (
                <div key={i} className="flex items-center gap-2.5 text-sm text-zinc-600">
                  <Clock className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <span>
                    {EVENT_LABEL[ev.type] || ev.type} · {new Date(ev.at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {isOutstanding && (
          <p className="text-xs text-zinc-500 bg-zinc-50 border border-zinc-200 rounded-xl p-3">
            Online card payment isn&apos;t available yet — please contact the office to settle this invoice.
          </p>
        )}

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="w-full h-11 px-4 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-800 text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-60"
          >
            <Download className="w-4 h-4 text-zinc-600" />
            {downloading ? "Preparing PDF…" : "Download PDF"}
          </button>
        </div>
      </div>
    </ReusableModal>
  );
};

export default InvoiceViewModal;

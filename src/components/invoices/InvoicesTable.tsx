"use client";

import React, { useState } from "react";
import { Download, Eye } from "lucide-react";
import { toast } from "sonner";
import ReusableTable, { Column } from "@/components/ui/CustomUi/ReuseableTable";
import { InvoiceRecord } from "@/service/BillingService/BillingServiceApi";
import { downloadPdf } from "@/lib/apiFiles";

interface InvoicesTableProps {
  data: InvoiceRecord[];
  onViewClick: (invoice: InvoiceRecord) => void;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  total?: number;
}

const STATUS_STYLE: Record<string, string> = {
  PAID: "text-emerald-700 bg-emerald-50 border border-emerald-200",
  WAITING: "text-amber-700 bg-amber-50 border border-amber-200",
  OVERDUE: "text-red-700 bg-red-50 border border-red-200",
  VOID: "text-zinc-600 bg-zinc-100 border border-zinc-200",
};

const money = (n: number, currency = "EUR") => new Intl.NumberFormat("en-IE", { style: "currency", currency }).format(n || 0);
const poolName = (p: InvoiceRecord["poolId"]) => (p && typeof p === "object" ? p.name : "—");

export const InvoicesTable: React.FC<InvoicesTableProps> = ({ data, onViewClick, currentPage = 1, onPageChange = () => {}, total = data.length }) => {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownload = async (invoice: InvoiceRecord) => {
    setDownloadingId(invoice._id);
    try {
      await downloadPdf(`/invoices/${invoice._id}/pdf`, { fileName: `${invoice.number}.pdf` });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not download the PDF");
    } finally {
      setDownloadingId(null);
    }
  };

  const columns: Column<InvoiceRecord>[] = [
    {
      header: "INVOICE",
      accessorKey: "number",
      headerClassName: "text-xs font-bold text-zinc-500 uppercase tracking-wider py-4 px-6",
      cellClassName: "font-bold text-zinc-900 text-sm py-4 px-6",
      render: (val: string, record) => (
        <span onClick={() => onViewClick(record)} className="text-zinc-900 hover:text-sky-600 transition-colors cursor-pointer font-bold">
          {val}
        </span>
      ),
    },
    {
      header: "ISSUED",
      accessorKey: "issuedAt",
      headerClassName: "text-xs font-bold text-zinc-500 uppercase tracking-wider py-4 px-6",
      cellClassName: "text-sm text-zinc-600 font-medium py-4 px-6",
      render: (val) => <span>{val ? new Date(val as string).toLocaleDateString() : "—"}</span>,
    },
    {
      header: "WHAT FOR",
      accessorKey: "whatFor",
      headerClassName: "text-xs font-bold text-zinc-500 uppercase tracking-wider py-4 px-6",
      cellClassName: "text-sm text-zinc-700 font-medium py-4 px-6",
      render: (val: string, record) => <span className="text-zinc-700 font-medium">{val.replace("_", " ")} · {poolName(record.poolId)}</span>,
    },
    {
      header: "AMOUNT",
      accessorKey: "total",
      headerClassName: "text-xs font-bold text-zinc-500 uppercase tracking-wider py-4 px-6",
      cellClassName: "text-sm font-bold text-zinc-900 py-4 px-6",
      render: (val: number, record) => <span>{money(val, record.currency)}</span>,
    },
    {
      header: "STATUS",
      accessorKey: "displayStatus",
      headerClassName: "text-xs font-bold text-zinc-500 uppercase tracking-wider py-4 px-6",
      cellClassName: "py-4 px-6",
      render: (status: string) => (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${STATUS_STYLE[status] || STATUS_STYLE.WAITING}`}>{status}</span>
      ),
    },
    {
      header: "ACTIONS",
      accessorKey: "_id",
      headerClassName: "text-xs font-bold text-zinc-500 uppercase tracking-wider py-4 px-6 text-right",
      cellClassName: "py-4 px-6 text-right",
      render: (_, record) => (
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => onViewClick(record)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            title="View Invoice Details"
          >
            <Eye className="w-3.5 h-3.5 text-zinc-500" />
            <span>View</span>
          </button>
          <button
            type="button"
            onClick={() => handleDownload(record)}
            disabled={downloadingId === record._id}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer disabled:opacity-60"
            title="Download Invoice"
          >
            <Download className="w-3.5 h-3.5 text-zinc-500" />
            <span>{downloadingId === record._id ? "Preparing…" : "Download"}</span>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-zinc-200/90 shadow-2xs overflow-hidden">
      <ReusableTable<InvoiceRecord> columns={columns} data={data} scroll={true} pagination={total > 10} currentPage={currentPage} setCurrentPage={onPageChange} limit={10} total={total} />
    </div>
  );
};

export default InvoicesTable;

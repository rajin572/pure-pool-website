"use client";

import React from "react";
import { Download, Eye } from "lucide-react";
import ReusableTable, { Column } from "@/components/ui/CustomUi/ReuseableTable";
import { InvoiceRecord } from "@/service/BillingService/BillingServiceApi";

interface InvoicesTableProps {
  data: InvoiceRecord[];
  onViewClick: (invoice: InvoiceRecord) => void;
  onDownloadClick: (invoice: InvoiceRecord) => void;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  total?: number;
}

export const InvoicesTable: React.FC<InvoicesTableProps> = ({
  data,
  onViewClick,
  onDownloadClick,
  currentPage = 1,
  onPageChange = () => {},
  total = data.length,
}) => {
  const columns: Column<InvoiceRecord>[] = [
    {
      header: "INVOICE",
      accessorKey: "invoiceNumber",
      headerClassName: "text-xs font-bold text-zinc-500 uppercase tracking-wider py-4 px-6",
      cellClassName: "font-bold text-zinc-900 text-sm py-4 px-6",
      render: (val: string, record) => (
        <span
          onClick={() => onViewClick(record)}
          className="text-zinc-900 hover:text-sky-600 transition-colors cursor-pointer font-bold"
        >
          {val}
        </span>
      ),
    },
    {
      header: "ISSUED",
      accessorKey: "date",
      headerClassName: "text-xs font-bold text-zinc-500 uppercase tracking-wider py-4 px-6",
      cellClassName: "text-sm text-zinc-600 font-medium py-4 px-6",
    },
    {
      header: "PERIOD",
      accessorKey: "period",
      headerClassName: "text-xs font-bold text-zinc-500 uppercase tracking-wider py-4 px-6",
      cellClassName: "text-sm text-zinc-700 font-medium py-4 px-6",
      render: (val: string, record) => (
        <span className="text-zinc-700 font-medium">
          {val || record.service}
        </span>
      ),
    },
    {
      header: "AMOUNT",
      accessorKey: "amount",
      headerClassName: "text-xs font-bold text-zinc-500 uppercase tracking-wider py-4 px-6",
      cellClassName: "text-sm font-bold text-zinc-900 py-4 px-6",
    },
    {
      header: "STATUS",
      accessorKey: "status",
      headerClassName: "text-xs font-bold text-zinc-500 uppercase tracking-wider py-4 px-6",
      cellClassName: "py-4 px-6",
      render: (status: string) => {
        const isPaid = status === "Paid";
        return (
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
              isPaid
                ? "text-emerald-700 bg-emerald-50 border border-emerald-200"
                : "text-amber-700 bg-amber-50 border border-amber-200"
            }`}
          >
            {status}
          </span>
        );
      },
    },
    {
      header: "ACTIONS",
      accessorKey: "id",
      headerClassName: "text-xs font-bold text-zinc-500 uppercase tracking-wider py-4 px-6 text-right",
      cellClassName: "py-4 px-6 text-right",
      render: (_, record) => {
        return (
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
              onClick={() => onDownloadClick(record)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
              title="Download Invoice"
            >
              <Download className="w-3.5 h-3.5 text-zinc-500" />
              <span>Download</span>
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-zinc-200/90 shadow-2xs overflow-hidden">
      <ReusableTable<InvoiceRecord>
        columns={columns}
        data={data}
        scroll={true}
        pagination={total > 10}
        currentPage={currentPage}
        setCurrentPage={onPageChange}
        limit={10}
        total={total}
      />
    </div>
  );
};

export default InvoicesTable;


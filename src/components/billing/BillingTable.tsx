"use client";

import React from "react";
import { Download, CreditCard } from "lucide-react";
import ReusableTable, { Column } from "@/components/ui/CustomUi/ReuseableTable";
import { InvoiceRecord } from "@/service/BillingService/BillingServiceApi";

interface BillingTableProps {
  data: InvoiceRecord[];
  onPayClick: (invoice: InvoiceRecord) => void;
  onDownloadClick: (invoice: InvoiceRecord) => void;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  total?: number;
}

export const BillingTable: React.FC<BillingTableProps> = ({
  data,
  onPayClick,
  onDownloadClick,
  currentPage = 1,
  onPageChange,
  total = data.length,
}) => {
  const columns: Column<InvoiceRecord>[] = [
    {
      header: "Invoice",
      accessorKey: "invoiceNumber",
      cellClassName: "font-semibold text-gray-900 text-sm py-4",
    },
    {
      header: "Service",
      accessorKey: "service",
      cellClassName: "text-sm text-gray-700 font-medium py-4 max-w-xs",
    },
    {
      header: "Date & Due",
      accessorKey: "date",
      cellClassName: "py-4",
      render: (_, record) => (
        <div className="flex flex-col text-xs sm:text-sm">
          <span className="font-medium text-gray-900">{record.date}</span>
          <span className="text-gray-400 text-xs mt-0.5">Due {record.dueDate}</span>
        </div>
      ),
    },
    {
      header: "Amount (incl. VAT)",
      accessorKey: "amount",
      cellClassName: "text-sm font-bold text-gray-900 py-4",
    },
    {
      header: "Status",
      accessorKey: "status",
      cellClassName: "py-4",
      render: (status: string) => {
        const isPaid = status === "Paid";
        return (
          <span
            className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold ${isPaid
                ? "text-emerald-700 bg-emerald-50 border border-emerald-300"
                : "text-amber-700 bg-amber-50 border border-amber-300"
              }`}
          >
            {status}
          </span>
        );
      },
    },
    {
      header: "Action",
      accessorKey: "id",
      cellClassName: "py-4",
      render: (_, record) => {
        if (record.status === "Outstanding") {
          return (
            <button
              type="button"
              onClick={() => onPayClick(record)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <CreditCard className="w-3.5 h-3.5" />
              Pay
            </button>
          );
        }
        return (
          <button
            type="button"
            onClick={() => onDownloadClick(record)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
            title="Download PDF Invoice"
          >
            <Download className="w-3.5 h-3.5" />
            Invoice
          </button>
        );
      },
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
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

export default BillingTable;


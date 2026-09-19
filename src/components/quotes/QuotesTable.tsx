"use client";

import React from "react";
import { Eye } from "lucide-react";
import ReusableTable, { Column } from "@/components/ui/CustomUi/ReuseableTable";
import { QuoteRecord } from "@/service/QuotesService/QuotesServiceApi";

interface QuotesTableProps {
  data: QuoteRecord[];
  onViewQuote: (quote: QuoteRecord) => void;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  total?: number;
}

export const QuotesTable: React.FC<QuotesTableProps> = ({
  data,
  onViewQuote,
  currentPage = 1,
  onPageChange,
  total = data.length,
}) => {
  const columns: Column<QuoteRecord>[] = [
    {
      header: "Reference",
      accessorKey: "reference",
      cellClassName: "font-semibold text-gray-900 text-sm py-4",
    },
    {
      header: "For",
      accessorKey: "forService",
      cellClassName: "text-sm text-gray-800 font-medium py-4 max-w-xs",
    },
    {
      header: "Pool",
      accessorKey: "poolName",
      cellClassName: "text-sm text-gray-600 font-medium py-4",
    },
    {
      header: "Sent",
      accessorKey: "sentDate",
      cellClassName: "text-sm text-gray-600 py-4",
    },
    {
      header: "Valid Until",
      accessorKey: "validUntil",
      cellClassName: "text-sm text-gray-600 py-4",
    },
    {
      header: "Amount",
      accessorKey: "amount",
      cellClassName: "text-sm font-bold text-gray-900 py-4",
    },
    {
      header: "Status",
      accessorKey: "status",
      cellClassName: "py-4",
      render: (status: QuoteRecord["status"]) => {
        let badgeClass = "text-gray-700 bg-gray-100 border border-gray-300";
        if (status === "Pending Review") {
          badgeClass = "text-amber-700 bg-amber-50 border border-amber-300";
        } else if (status === "Accepted") {
          badgeClass = "text-emerald-700 bg-emerald-50 border border-emerald-300";
        } else if (status === "Expired" || status === "Declined") {
          badgeClass = "text-red-700 bg-red-50 border border-red-200";
        }

        return (
          <span
            className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold ${badgeClass}`}
          >
            {status}
          </span>
        );
      },
    },
    {
      header: "Action",
      accessorKey: "id",
      cellClassName: "py-4 text-center",
      render: (_, record) => (
        <button
          type="button"
          onClick={() => onViewQuote(record)}
          className="p-1.5 rounded-lg text-gray-500 hover:text-sky-600 hover:bg-sky-50 transition-colors cursor-pointer"
          title="Inspect Proposal"
          aria-label="Inspect proposal"
        >
          <Eye className="w-5 h-5" />
        </button>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
      <ReusableTable<QuoteRecord>
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

export default QuotesTable;


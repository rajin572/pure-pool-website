"use client";

import React from "react";
import { Eye } from "lucide-react";
import ReusableTable, { Column } from "@/components/ui/CustomUi/ReuseableTable";
import { QuoteRecord } from "@/service/QuotesService/QuotesServiceApi";

interface QuotesTableProps {
  data: QuoteRecord[];
  total?: number;
}

const poolName = (q: QuoteRecord) => (typeof q.poolId === "object" ? q.poolId.name : "—");

const STATUS_LABEL: Record<string, string> = {
  SENT: "Pending Review",
  ACCEPTED: "Accepted",
  DECLINED: "Declined",
  EXPIRED: "Expired",
  CANCELLED: "Cancelled",
};

export const QuotesTable: React.FC<QuotesTableProps> = ({ data, total = data.length }) => {
  const columns: Column<QuoteRecord>[] = [
    {
      header: "Reference",
      accessorKey: "number",
      cellClassName: "font-semibold text-gray-900 text-sm py-4",
      render: (number, record) => (
        <a href={`/quotes/${record._id}`} className="text-zinc-900 font-bold hover:text-blue-600 hover:underline transition-colors">
          {String(number || record._id)}
        </a>
      ),
    },
    {
      header: "For",
      accessorKey: "title",
      cellClassName: "text-sm text-gray-800 font-medium py-4 max-w-xs",
      render: (_, record) => <span>{record.title || record.kind}</span>,
    },
    {
      header: "Pool",
      accessorKey: "poolId",
      cellClassName: "text-sm text-gray-600 font-medium py-4",
      render: (_, record) => <span>{poolName(record)}</span>,
    },
    {
      header: "Sent",
      accessorKey: "sentAt",
      cellClassName: "text-sm text-gray-600 py-4",
      render: (val) => <span>{val ? new Date(val as string).toLocaleDateString() : "—"}</span>,
    },
    {
      header: "Valid Until",
      accessorKey: "validUntil",
      cellClassName: "text-sm text-gray-600 py-4",
      render: (val) => <span>{val ? new Date(val as string).toLocaleDateString() : "—"}</span>,
    },
    {
      header: "Amount",
      accessorKey: "total",
      cellClassName: "text-sm font-bold text-gray-900 py-4",
      render: (val) => <span>{val ? `€${Number(val).toLocaleString()}` : "—"}</span>,
    },
    {
      header: "Status",
      accessorKey: "status",
      cellClassName: "py-4",
      render: (status) => {
        let badgeClass = "text-gray-700 bg-gray-100 border border-gray-300";
        if (status === "SENT") badgeClass = "text-amber-700 bg-amber-50 border border-amber-300";
        else if (status === "ACCEPTED") badgeClass = "text-emerald-700 bg-emerald-50 border border-emerald-300";
        else if (status === "EXPIRED" || status === "DECLINED") badgeClass = "text-red-700 bg-red-50 border border-red-200";

        return <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold ${badgeClass}`}>{STATUS_LABEL[String(status)] || String(status)}</span>;
      },
    },
    {
      header: "Action",
      accessorKey: "_id",
      cellClassName: "py-4 text-center",
      render: (_, record) => (
        <a
          href={`/quotes/${record._id}`}
          className="inline-flex p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-sky-50 transition-colors cursor-pointer"
          title="Inspect Proposal"
          aria-label="Inspect proposal"
        >
          <Eye className="w-5 h-5" />
        </a>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
      <ReusableTable<QuoteRecord> columns={columns} data={data} scroll={true} pagination={total > 10} limit={10} total={total} />
    </div>
  );
};

export default QuotesTable;

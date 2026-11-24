"use client";

import React from "react";
import { Eye } from "lucide-react";
import ReusableTable, { Column } from "@/components/ui/CustomUi/ReuseableTable";
import UserAvatar from "@/components/profile/UserAvatar";
import type { IPoolVisit, IVisitReportSafe } from "@/service/MyPoolService/MyPoolServiceApi";

export interface ServiceHistoryRow {
  visit: IPoolVisit;
  report: IVisitReportSafe | null;
}

interface ServiceHistoryTableProps {
  data: ServiceHistoryRow[];
  onViewVisit: (row: ServiceHistoryRow) => void;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  total?: number;
}

const readingValue = (report: IVisitReportSafe | null, key: string) => report?.waterReadings.find((r) => r.name.toLowerCase().startsWith(key))?.value;

export const ServiceHistoryTable: React.FC<ServiceHistoryTableProps> = ({ data, onViewVisit, currentPage = 1, onPageChange, total = data.length }) => {
  const columns: Column<ServiceHistoryRow>[] = [
    {
      header: "Date",
      accessorKey: "visit",
      cellClassName: "font-semibold text-gray-900 text-sm py-4",
      render: (_, row) => <span>{new Date(row.visit.scheduledAt).toLocaleDateString()}</span>,
    },
    {
      header: "Type",
      accessorKey: "visit",
      cellClassName: "text-sm text-gray-700 font-medium py-4",
      render: (_, row) => <span>{row.visit.category?.replace("_", " ") || "—"}</span>,
    },
    {
      header: "Technician",
      accessorKey: "visit",
      cellClassName: "py-4",
      render: (_, row) => (
        <div className="flex items-center gap-2.5">
          <div className="relative w-7 h-7 rounded-full overflow-hidden bg-sky-100 shrink-0 ring-1 ring-sky-200">
            <UserAvatar src={row.visit.technicianId?.avatarUrl} alt={row.visit.technicianId?.name || "Technician"} />
          </div>
          <span className="text-sm font-medium text-gray-900 leading-tight">{row.visit.technicianId?.name || "—"}</span>
        </div>
      ),
    },
    {
      header: "pH",
      accessorKey: "report",
      cellClassName: "text-sm font-semibold text-gray-800 py-4",
      render: (_, row) => <span>{readingValue(row.report, "ph") ?? "—"}</span>,
    },
    {
      header: "Chlorine",
      accessorKey: "report",
      cellClassName: "text-sm text-gray-700 font-medium py-4",
      render: (_, row) => <span>{readingValue(row.report, "chlor") ?? "—"}</span>,
    },
    {
      header: "Status",
      accessorKey: "visit",
      cellClassName: "py-4",
      render: (_, row) => {
        const isCompleted = row.visit.status === "COMPLETED";
        return (
          <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold ${isCompleted ? "text-emerald-700 bg-emerald-50 border border-emerald-300" : "text-amber-700 bg-amber-50 border border-amber-300"}`}>
            {isCompleted ? "Completed" : "Awaiting approval"}
          </span>
        );
      },
    },
    {
      header: "Action",
      accessorKey: "visit",
      cellClassName: "py-4 text-center",
      render: (_, row) =>
        row.report ? (
          <button
            type="button"
            onClick={() => onViewVisit(row)}
            className="p-1.5 rounded-lg text-gray-500 hover:text-sky-600 hover:bg-sky-50 transition-colors cursor-pointer"
            title="View Visit Report"
            aria-label="View visit report"
          >
            <Eye className="w-5 h-5" />
          </button>
        ) : null,
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
      <ReusableTable<ServiceHistoryRow> columns={columns} data={data} scroll={true} pagination={total > 10} currentPage={currentPage} setCurrentPage={onPageChange} limit={10} total={total} />
    </div>
  );
};

export default ServiceHistoryTable;

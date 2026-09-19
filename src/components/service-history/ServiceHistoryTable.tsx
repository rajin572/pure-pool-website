"use client";

import React from "react";
import Image from "next/image";
import { Eye } from "lucide-react";
import ReusableTable, { Column } from "@/components/ui/CustomUi/ReuseableTable";
import { ServiceHistoryRecord } from "@/service/ServiceHistoryService/ServiceHistoryServiceApi";
import { AllImages } from "../../../public/images/AllImages";

interface ServiceHistoryTableProps {
  data: ServiceHistoryRecord[];
  onViewVisit: (record: ServiceHistoryRecord) => void;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  total?: number;
}

export const ServiceHistoryTable: React.FC<ServiceHistoryTableProps> = ({
  data,
  onViewVisit,
  currentPage = 1,
  onPageChange,
  total = data.length,
}) => {
  const columns: Column<ServiceHistoryRecord>[] = [
    {
      header: "Date",
      accessorKey: "date",
      cellClassName: "font-semibold text-gray-900 text-sm py-4",
    },
    {
      header: "Type",
      accessorKey: "type",
      cellClassName: "text-sm text-gray-700 font-medium py-4",
    },
    {
      header: "Technician",
      accessorKey: "technician",
      cellClassName: "py-4",
      render: (technician: ServiceHistoryRecord["technician"]) => (
        <div className="flex items-center gap-2.5">
          <div className="relative w-7 h-7 rounded-full overflow-hidden bg-sky-100 shrink-0 ring-1 ring-sky-200">
            <Image
              src={AllImages.profile}
              alt={technician?.name || "Technician"}
              fill
              sizes="28px"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900 leading-tight">
              {technician?.name || "Carlos Martínez"}
            </span>
            {technician?.role && (
              <span className="text-[11px] text-gray-400 font-normal">
                {technician.role}
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      header: "pH",
      accessorKey: "ph",
      cellClassName: "text-sm font-semibold text-gray-800 py-4",
    },
    {
      header: "Choline",
      accessorKey: "chlorine",
      cellClassName: "text-sm text-gray-700 font-medium py-4",
    },
    {
      header: "Alkalinity",
      accessorKey: "alkalinity",
      cellClassName: "text-sm text-gray-700 font-medium py-4",
    },
    {
      header: "Temperature",
      accessorKey: "temperature",
      cellClassName: "text-sm text-gray-700 font-medium py-4",
    },
    {
      header: "Status",
      accessorKey: "status",
      cellClassName: "py-4",
      render: (status: string) => {
        const isCompleted = status === "Completed";
        return (
          <span
            className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold ${isCompleted
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
      cellClassName: "py-4 text-center",
      render: (_, record) => (
        <button
          type="button"
          onClick={() => onViewVisit(record)}
          className="p-1.5 rounded-lg text-gray-500 hover:text-sky-600 hover:bg-sky-50 transition-colors cursor-pointer"
          title="View Visit Report"
          aria-label="View visit report"
        >
          <Eye className="w-5 h-5" />
        </button>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
      <ReusableTable<ServiceHistoryRecord>
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

export default ServiceHistoryTable;


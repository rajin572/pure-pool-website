"use client";

import React, { useRef } from "react";
import Container from "@/components/ui/CustomUi/Container";
import ReusableTable, { Column } from "@/components/ui/CustomUi/ReuseableTable";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap-util";
import type { IEquipmentItem } from "@/service/MyPoolService/MyPoolServiceApi";

interface MyPoolEquipmentTabProps {
  data: IEquipmentItem[] | null;
  isLoading?: boolean;
}

export const MyPoolEquipmentTab: React.FC<MyPoolEquipmentTabProps> = ({ data, isLoading }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;
      if (prefersReducedMotion()) return;
      gsap.fromTo(containerRef.current, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.75, ease: "power3.out", force3D: true });
    },
    { dependencies: [data?.length] }
  );

  const columns: Column<IEquipmentItem>[] = [
    {
      header: "Equipment",
      accessorKey: "type",
      cellClassName: "py-4",
      render: (_, row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900 text-sm sm:text-base">{row.type}</span>
          {row.serialNumber && <span className="text-xs text-gray-500 font-mono mt-0.5">S/N: {row.serialNumber}</span>}
        </div>
      ),
    },
    {
      header: "Brand & Model",
      accessorKey: "brand",
      cellClassName: "text-sm text-gray-700 font-medium py-4",
      render: (_, row) => <span>{[row.brand, row.model].filter(Boolean).join(" · ") || "—"}</span>,
    },
    {
      header: "Installed",
      accessorKey: "installedAt",
      cellClassName: "text-sm text-gray-600 font-medium py-4",
      render: (val) => <span>{val ? new Date(val as string).toLocaleDateString() : "—"}</span>,
    },
    {
      header: "Condition",
      accessorKey: "condition",
      cellClassName: "py-4",
      render: (val) => (
        <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold text-gray-700 bg-gray-100 border border-gray-200">
          {val}
        </span>
      ),
    },
    {
      header: "Warranty",
      accessorKey: "warrantyStatus",
      cellClassName: "py-4",
      render: (val, row) => (
        <span
          className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold border ${
            val === "VALID"
              ? "text-emerald-600 bg-emerald-50 border-emerald-400/60"
              : val === "EXPIRED"
                ? "text-amber-700 bg-amber-50 border-amber-400/60"
                : "text-gray-500 bg-gray-50 border-gray-200"
          }`}
        >
          {val === "VALID"
            ? `Until ${row.warrantyEndsAt ? new Date(row.warrantyEndsAt).toLocaleDateString() : ""}`
            : val === "EXPIRED"
              ? "Expired"
              : "Unknown"}
        </span>
      ),
    },
  ];

  if (isLoading) {
    return <div className="w-full py-24 text-center text-sm text-gray-500 bg-gray-50/50">Loading equipment...</div>;
  }

  return (
    <div ref={containerRef} className="w-full py-8 md:py-12 bg-gray-50/50">
      <Container>
        {!data || data.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xs py-16 text-center text-sm text-gray-500">
            No equipment recorded for this pool yet.
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
            <ReusableTable<IEquipmentItem> columns={columns} data={data} scroll={true} />
          </div>
        )}
      </Container>
    </div>
  );
};

export default MyPoolEquipmentTab;

"use client";

import React, { useRef } from "react";
import Container from "@/components/ui/CustomUi/Container";
import ReusableTable, { Column } from "@/components/ui/CustomUi/ReuseableTable";
import { FileText } from "lucide-react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap-util";

export interface EquipmentRecord {
  id: string;
  name: string;
  serialNumber: string;
  brandAndModel: string;
  installedDate: string;
  warrantyStatus: string;
  manualUrl?: string;
}

const EQUIPMENT_DATA: EquipmentRecord[] = [
  {
    id: "1",
    name: "Variable Speed Filtration Pump",
    serialNumber: "S/N: AP-2022-88192-M",
    brandAndModel: "AstralPool · Victoria Plus Silent 1.5 CV",
    installedDate: "12/04/2022",
    warrantyStatus: "Confirmed",
  },
  {
    id: "2",
    name: "Variable Speed Filtration Pump",
    serialNumber: "S/N: AP-2022-88192-M",
    brandAndModel: "AstralPool · Victoria Plus Silent 1.5 CV",
    installedDate: "12/04/2022",
    warrantyStatus: "Confirmed",
  },
  {
    id: "3",
    name: "Variable Speed Filtration Pump",
    serialNumber: "S/N: AP-2022-88192-M",
    brandAndModel: "AstralPool · Victoria Plus Silent 1.5 CV",
    installedDate: "12/04/2022",
    warrantyStatus: "Confirmed",
  },
  {
    id: "4",
    name: "Variable Speed Filtration Pump",
    serialNumber: "S/N: AP-2022-88192-M",
    brandAndModel: "AstralPool · Victoria Plus Silent 1.5 CV",
    installedDate: "12/04/2022",
    warrantyStatus: "Confirmed",
  },
  {
    id: "5",
    name: "Variable Speed Filtration Pump",
    serialNumber: "S/N: AP-2022-88192-M",
    brandAndModel: "AstralPool · Victoria Plus Silent 1.5 CV",
    installedDate: "12/04/2022",
    warrantyStatus: "Confirmed",
  },
];

interface MyPoolEquipmentTabProps {
  data?: EquipmentRecord[];
}

export const MyPoolEquipmentTab: React.FC<MyPoolEquipmentTabProps> = ({
  data,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;
      if (prefersReducedMotion()) return;

      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.75, ease: "power3.out", force3D: true }
      );
    },
    { dependencies: [] }
  );

  const columns: Column<EquipmentRecord>[] = [
    {
      header: "Equipment",
      accessorKey: "name",
      cellClassName: "py-4",
      render: (_, row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900 text-sm sm:text-base">
            {row.name}
          </span>
          <span className="text-xs text-gray-500 font-mono mt-0.5">
            {row.serialNumber}
          </span>
        </div>
      ),
    },
    {
      header: "Brand & Model",
      accessorKey: "brandAndModel",
      cellClassName: "text-sm text-gray-700 font-medium py-4",
    },
    {
      header: "Installed",
      accessorKey: "installedDate",
      cellClassName: "text-sm text-gray-600 font-medium py-4",
    },
    {
      header: "Warranty",
      accessorKey: "warrantyStatus",
      cellClassName: "py-4",
      render: (val) => (
        <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-400/60">
          {String(val || "Confirmed")}
        </span>
      ),
    },
    {
      header: "Manuals",
      accessorKey: "id",
      cellClassName: "py-4 text-right sm:text-left",
      render: () => (
        <button
          type="button"
          onClick={() => alert("Downloading equipment user manual & warranty certificate PDF...")}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-sky-600 hover:text-sky-700 transition-colors cursor-pointer"
        >
          <FileText className="w-4 h-4" />
          Manual &amp; Warranty
        </button>
      ),
    },
  ];

  return (
    <div ref={containerRef} className="w-full py-8 md:py-12 bg-gray-50/50">
      <Container>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
          <ReusableTable<EquipmentRecord>
            columns={columns}
            data={data && data.length > 0 ? data : EQUIPMENT_DATA}
            scroll={true}
          />
        </div>
      </Container>
    </div>
  );
};

export default MyPoolEquipmentTab;

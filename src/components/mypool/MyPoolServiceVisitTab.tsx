"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import Container from "@/components/ui/CustomUi/Container";
import ReusableTable, { Column } from "@/components/ui/CustomUi/ReuseableTable";
import { Eye } from "lucide-react";
import { AllImages } from "../../../public/images/AllImages";
import ServiceVisitModal from "./ServiceVisitModal";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap-util";
import type { ServiceVisitRecord } from "@/service/MyPoolService/MyPoolServiceApi";

const SERVICE_VISITS_DATA: ServiceVisitRecord[] = [
  {
    id: "1",
    date: "17 May 2026",
    type: "Weekly maintenance",
    technicianName: "Carlos Martínez",
    ph: "7.3",
    choline: "1.8 mg/L",
    alkalinity: "145 ppm",
    temperature: "24.5 °C",
    status: "Completed",
  },
  {
    id: "2",
    date: "17 May 2026",
    type: "Weekly maintenance",
    technicianName: "Carlos Martínez",
    ph: "7.3",
    choline: "1.8 mg/L",
    alkalinity: "145 ppm",
    temperature: "24.5 °C",
    status: "Completed",
  },
  {
    id: "3",
    date: "17 May 2026",
    type: "Weekly maintenance",
    technicianName: "Carlos Martínez",
    ph: "7.3",
    choline: "1.8 mg/L",
    alkalinity: "145 ppm",
    temperature: "24.5 °C",
    status: "Completed",
  },
  {
    id: "4",
    date: "17 May 2026",
    type: "Weekly maintenance",
    technicianName: "Carlos Martínez",
    ph: "7.3",
    choline: "1.8 mg/L",
    alkalinity: "145 ppm",
    temperature: "24.5 °C",
    status: "Completed",
  },
  {
    id: "5",
    date: "17 May 2026",
    type: "Weekly maintenance",
    technicianName: "Carlos Martínez",
    ph: "7.3",
    choline: "1.8 mg/L",
    alkalinity: "145 ppm",
    temperature: "24.5 °C",
    status: "Completed",
  },
];

interface MyPoolServiceVisitTabProps {
  data?: ServiceVisitRecord[];
  onRequestServiceClick?: () => void;
}

export const MyPoolServiceVisitTab: React.FC<MyPoolServiceVisitTabProps> = ({
  data,
  onRequestServiceClick,
}) => {
  const [selectedVisitModalOpen, setSelectedVisitModalOpen] = useState(false);
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

  const columns: Column<ServiceVisitRecord>[] = [
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
      accessorKey: "technicianName",
      cellClassName: "py-4",
      render: (val) => (
        <div className="flex items-center gap-2">
          <div className="relative w-6 h-6 rounded-full overflow-hidden bg-sky-100 shrink-0">
            <Image
              src={AllImages.profile}
              alt={val}
              fill
              sizes="24px"
              className="object-cover"
            />
          </div>
          <span className="text-sm font-medium text-gray-800">{val}</span>
        </div>
      ),
    },
    {
      header: "pH",
      accessorKey: "ph",
      cellClassName: "text-sm text-gray-700 font-medium py-4",
    },
    {
      header: "Choline",
      accessorKey: "choline",
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
      render: (val) => (
        <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-400/60">
          {val}
        </span>
      ),
    },
    {
      header: "Action",
      accessorKey: "id",
      cellClassName: "py-4 text-center",
      render: () => (
        <button
          type="button"
          onClick={() => setSelectedVisitModalOpen(true)}
          className="p-1.5 rounded-lg text-gray-700 hover:text-sky-600 hover:bg-sky-50 transition-colors cursor-pointer"
          title="View Visit Details"
          aria-label="View visit details"
        >
          <Eye className="w-5 h-5" />
        </button>
      ),
    },
  ];

  return (
    <div ref={containerRef} className="w-full py-8 md:py-12 bg-gray-50/50">
      <Container>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
          <ReusableTable<ServiceVisitRecord>
            columns={columns}
            data={data && data.length > 0 ? data : SERVICE_VISITS_DATA}
            scroll={true}
          />
        </div>
      </Container>

      {/* Service Visit Detail Modal */}
      <ServiceVisitModal
        open={selectedVisitModalOpen}
        onOpenChange={setSelectedVisitModalOpen}
        onRequestServiceClick={() => {
          setSelectedVisitModalOpen(false);
          setTimeout(() => {
            onRequestServiceClick?.();
          }, 150);
        }}
      />
    </div>
  );
};

export default MyPoolServiceVisitTab;

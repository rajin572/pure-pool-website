"use client";

import React, { useRef, useState } from "react";
import Container from "@/components/ui/CustomUi/Container";
import ReusableTable, { Column } from "@/components/ui/CustomUi/ReuseableTable";
import { Eye } from "lucide-react";
import ServiceVisitModal from "./ServiceVisitModal";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap-util";
import type { IPoolDetailsData, IPoolVisit, IVisitReportSafe } from "@/service/MyPoolService/MyPoolServiceApi";

interface MyPoolServiceVisitTabProps {
  details: IPoolDetailsData | null;
  isLoading?: boolean;
  onRequestServiceClick?: () => void;
}

interface VisitRow {
  visit: IPoolVisit;
  report: IVisitReportSafe | null;
}

const readingValue = (report: IVisitReportSafe | null, key: string) =>
  report?.waterReadings.find((r) => r.name.toLowerCase().startsWith(key))?.value;

export const MyPoolServiceVisitTab: React.FC<MyPoolServiceVisitTabProps> = ({
  details,
  isLoading,
  onRequestServiceClick,
}) => {
  const [selectedRow, setSelectedRow] = useState<VisitRow | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;
      if (prefersReducedMotion()) return;
      gsap.fromTo(containerRef.current, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.75, ease: "power3.out", force3D: true });
    },
    { dependencies: [details?.pool._id] }
  );

  if (isLoading || !details) {
    return <div className="w-full py-24 text-center text-sm text-gray-500 bg-gray-50/50">Loading service visits...</div>;
  }

  const rows: VisitRow[] = details.visits
    .filter((v) => ["SUBMITTED", "COMPLETED"].includes(v.status))
    .map((visit) => ({
      visit,
      report: details.readings.find((r) => r.visitId === visit._id) || null,
    }));

  const columns: Column<VisitRow>[] = [
    {
      header: "Date",
      accessorKey: "visit",
      cellClassName: "font-semibold text-gray-900 text-sm py-4",
      render: (_, row) => <span>{new Date(row.visit.scheduledAt).toLocaleDateString()}</span>,
    },
    {
      header: "Technician",
      accessorKey: "visit",
      cellClassName: "py-4",
      render: (_, row) => <span className="text-sm font-medium text-gray-800">{row.visit.technicianId?.name || "—"}</span>,
    },
    {
      header: "pH",
      accessorKey: "report",
      cellClassName: "text-sm text-gray-700 font-medium py-4",
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
      render: (_, row) =>
        row.visit.status === "COMPLETED" ? (
          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-400/60">
            Completed
          </span>
        ) : (
          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-400/60">
            Awaiting approval
          </span>
        ),
    },
    {
      header: "Action",
      accessorKey: "visit",
      cellClassName: "py-4 text-center",
      render: (_, row) =>
        row.report ? (
          <button
            type="button"
            onClick={() => setSelectedRow(row)}
            className="p-1.5 rounded-lg text-gray-700 hover:text-sky-600 hover:bg-sky-50 transition-colors cursor-pointer"
            title="View Visit Details"
            aria-label="View visit details"
          >
            <Eye className="w-5 h-5" />
          </button>
        ) : null,
    },
  ];

  return (
    <div ref={containerRef} className="w-full py-8 md:py-12 bg-gray-50/50">
      <Container>
        {rows.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xs py-16 text-center text-sm text-gray-500">
            No completed visits yet.
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
            <ReusableTable<VisitRow> columns={columns} data={rows} scroll={true} />
          </div>
        )}
      </Container>

      <ServiceVisitModal
        open={!!selectedRow}
        onOpenChange={(open) => !open && setSelectedRow(null)}
        visit={selectedRow?.visit || null}
        report={selectedRow?.report || null}
        onRequestServiceClick={() => {
          setSelectedRow(null);
          setTimeout(() => onRequestServiceClick?.(), 150);
        }}
      />
    </div>
  );
};

export default MyPoolServiceVisitTab;

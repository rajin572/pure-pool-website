"use client";

import React, { useState, useRef } from "react";
import { Search } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Container from "@/components/ui/CustomUi/Container";
import ServiceHistoryTable from "./ServiceHistoryTable";
import ServiceVisitModal from "@/components/mypool/ServiceVisitModal";
import { ServiceHistoryRecord } from "@/service/ServiceHistoryService/ServiceHistoryServiceApi";
import { prefersReducedMotion } from "@/lib/gsap-util";

import ServiceHistoryHero from "./ServiceHistoryHero";

interface ServiceHistoryClientProps {
  initialRecords: ServiceHistoryRecord[];
  total: number;
}

export const ServiceHistoryClient: React.FC<ServiceHistoryClientProps> = ({
  initialRecords,
  total,
}) => {
  const [records, setRecords] = useState<ServiceHistoryRecord[]>(initialRecords);
  const [searchTerm, setSearchTerm] = useState("");
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const [, setSelectedRecord] = useState<ServiceHistoryRecord | null>(null);

  const tableRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (prefersReducedMotion()) return;

    if (tableRef.current) {
      gsap.fromTo(
        tableRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }
      );
    }
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    /**
     * Design phase only:
     * When wired with live API/RTK Query, search is triggered here or debounced.
     */
    if (!val.trim()) {
      setRecords(initialRecords);
      return;
    }
    const filtered = initialRecords.filter(
      (r) =>
        r.technician.name.toLowerCase().includes(val.toLowerCase()) ||
        r.type.toLowerCase().includes(val.toLowerCase()) ||
        r.date.toLowerCase().includes(val.toLowerCase()) ||
        (r.notes && r.notes.toLowerCase().includes(val.toLowerCase()))
    );
    setRecords(filtered);
  };

  const handleViewVisit = (record: ServiceHistoryRecord) => {
    setSelectedRecord(record);
    setIsVisitModalOpen(true);
  };

  return (
    <main className="w-full min-h-screen flex flex-col bg-[#F9FAFB]">
      {/* 1. Hero Section matching About & My Pool */}
      <ServiceHistoryHero />

      {/* 2. Main Content Area */}
      <div className="w-full py-10 md:py-14">
        <Container>
          <div ref={tableRef} className="flex flex-col gap-6">
            {/* Search Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3">
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Search technicians , note , date"
                  className="w-full h-11 pl-10 pr-4 rounded-lg bg-white border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-xs transition-all"
                />
              </div>
            </div>

            {/* Table Section */}
            <div className="w-full">
              <ServiceHistoryTable
                data={records}
                onViewVisit={handleViewVisit}
                total={total}
              />
            </div>
          </div>
        </Container>
      </div>

      {/* Shared Service Visit Modal */}
      <ServiceVisitModal
        open={isVisitModalOpen}
        onOpenChange={setIsVisitModalOpen}
      />
    </main>
  );
};

export default ServiceHistoryClient;

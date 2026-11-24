"use client";

import React, { useEffect, useState, useRef } from "react";
import { Search, ChevronDown } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Container from "@/components/ui/CustomUi/Container";
import ServiceHistoryTable, { ServiceHistoryRow } from "./ServiceHistoryTable";
import ServiceVisitModal from "@/components/mypool/ServiceVisitModal";
import ServiceHistoryHero from "./ServiceHistoryHero";
import { getMyPools, getPoolDetails, type IPoolSummary } from "@/service/MyPoolService/MyPoolServiceApi";
import { prefersReducedMotion } from "@/lib/gsap-util";

export const ServiceHistoryClient: React.FC = () => {
  const [pools, setPools] = useState<IPoolSummary[] | null>(null);
  const [selectedPoolId, setSelectedPoolId] = useState<string>("");
  const [loadError, setLoadError] = useState<string | null>(null);

  const [rows, setRows] = useState<ServiceHistoryRow[] | null>(null);
  const [isLoadingVisits, setIsLoadingVisits] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRow, setSelectedRow] = useState<ServiceHistoryRow | null>(null);
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);

  const tableRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    if (tableRef.current) {
      gsap.fromTo(tableRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" });
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await getMyPools();
      if (cancelled) return;
      if (res.success) {
        setPools(res.data);
        if (res.data[0]) setSelectedPoolId(res.data[0]._id);
      } else {
        setLoadError(res.error.message);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!selectedPoolId) return;
    let cancelled = false;
    (async () => {
      setIsLoadingVisits(true);
      const res = await getPoolDetails(selectedPoolId);
      if (cancelled) return;
      if (res.success) {
        const visitRows = res.data.visits
          .filter((v) => ["SUBMITTED", "COMPLETED"].includes(v.status))
          .map((visit) => ({ visit, report: res.data.readings.find((r) => r.visitId === visit._id) || null }))
          .sort((a, b) => new Date(b.visit.scheduledAt).getTime() - new Date(a.visit.scheduledAt).getTime());
        setRows(visitRows);
      } else {
        setLoadError(res.error.message);
      }
      setIsLoadingVisits(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedPoolId]);

  const filteredRows = (rows || []).filter((row) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      (row.visit.technicianId?.name || "").toLowerCase().includes(q) ||
      (row.visit.category || "").toLowerCase().includes(q) ||
      new Date(row.visit.scheduledAt).toLocaleDateString().toLowerCase().includes(q)
    );
  });

  const handleViewVisit = (row: ServiceHistoryRow) => {
    setSelectedRow(row);
    setIsVisitModalOpen(true);
  };

  if (loadError) {
    return <div className="w-full min-h-screen flex items-center justify-center text-sm text-red-600">{loadError}</div>;
  }

  if (!pools) {
    return <div className="w-full min-h-screen flex items-center justify-center text-sm text-gray-500">Loading your pools...</div>;
  }

  return (
    <main className="w-full min-h-screen flex flex-col bg-[#F9FAFB]">
      <ServiceHistoryHero />

      <div className="w-full py-10 md:py-14">
        <Container>
          <div ref={tableRef} className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              {pools.length > 1 ? (
                <div className="relative w-full sm:w-64">
                  <select
                    value={selectedPoolId}
                    onChange={(e) => {
                      setSelectedPoolId(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full h-11 pl-4 pr-10 rounded-lg bg-white border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-xs appearance-none cursor-pointer"
                  >
                    {pools.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              ) : (
                <div />
              )}

              <div className="relative w-full sm:w-96">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search technician, type or date"
                  className="w-full h-11 pl-10 pr-4 rounded-lg bg-white border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-xs transition-all"
                />
              </div>
            </div>

            <div className="w-full">
              {isLoadingVisits ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-xs py-16 text-center text-sm text-gray-500">Loading service visits...</div>
              ) : filteredRows.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-xs py-16 text-center text-sm text-gray-500">No completed visits yet.</div>
              ) : (
                <ServiceHistoryTable data={filteredRows} onViewVisit={handleViewVisit} currentPage={currentPage} onPageChange={setCurrentPage} total={filteredRows.length} />
              )}
            </div>
          </div>
        </Container>
      </div>

      <ServiceVisitModal open={isVisitModalOpen} onOpenChange={setIsVisitModalOpen} visit={selectedRow?.visit || null} report={selectedRow?.report || null} />
    </main>
  );
};

export default ServiceHistoryClient;

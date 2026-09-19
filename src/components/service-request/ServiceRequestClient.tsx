"use client";

import React, { useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Container from "@/components/ui/CustomUi/Container";
import ReusableGradientButton from "@/components/ui/CustomUi/ReusableGradientButton";
import ServiceRequestCard from "./ServiceRequestCard";
import RequestServiceModal from "@/components/mypool/RequestServiceModal";
import { ServiceRequestRecord } from "@/service/ServiceRequestService/ServiceRequestServiceApi";
import { Plus, PhoneCall, AlertTriangle, Filter } from "lucide-react";
import { prefersReducedMotion } from "@/lib/gsap-util";
import ServiceRequestHero from "./ServiceRequestHero";

interface ServiceRequestClientProps {
  initialRequests: ServiceRequestRecord[];
  total?: number;
}

export const ServiceRequestClient: React.FC<ServiceRequestClientProps> = ({
  initialRequests,
}) => {
  const [requests, setRequests] = useState<ServiceRequestRecord[]>(initialRequests);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [isRequestModalOpen, setIsRequestModalOpen] = useState<boolean>(false);

  const listRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (prefersReducedMotion()) return;

    if (listRef.current) {
      gsap.fromTo(
        listRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }
      );
    }
  }, []);

  const filteredRequests = requests.filter((r) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "in_progress") {
      return r.status === "In progress" || r.status === "Submitted";
    }
    if (activeFilter === "scheduled") {
      return r.status === "Scheduled";
    }
    if (activeFilter === "completed") {
      return r.status === "Completed";
    }
    return true;
  });

  const handleRequestCreated = () => {
    const newReq: ServiceRequestRecord = {
      id: `sr-${Date.now()}`,
      reference: `SR-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      category: "equipment_breakdown",
      categoryTitle: "Equipment breakdown",
      description: "Service ticket logged. Technician dispatch scheduled.",
      poolName: "Main Residence Pool",
      urgency: "Normal",
      status: "Submitted",
      createdAt: "Today",
    };
    setRequests((prev) => [newReq, ...prev]);
  };

  return (
    <main className="w-full min-h-screen flex flex-col bg-[#F9FAFB]">
      {/* 1. Hero Section matching About & My Pool */}
      <ServiceRequestHero />

      {/* 2. Main Content Area */}
      <div className="w-full py-10 md:py-14">
        <Container>
          <div ref={listRef} className="flex flex-col gap-6">
            {/* Action Bar: Request New Service Trigger */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-col">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Active Service Tickets
                </h2>
                <p className="text-sm text-gray-500">
                  Track ongoing technician visits, repair dispatches, and emergency calls.
                </p>
              </div>

              <ReusableGradientButton
                type="button"
                onClick={() => setIsRequestModalOpen(true)}
                leftIcon={<Plus className="w-4 h-4 sm:w-5 sm:h-5 text-white shrink-0" />}
                className="px-5 py-2.5 text-sm sm:text-base font-bold text-white whitespace-nowrap gap-2 shrink-0 shadow-sm cursor-pointer"
              >
                Request new service
              </ReusableGradientButton>
            </div>

            {/* 24/7 Madrid Emergency Callout Banner */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-red-500/10 via-amber-500/10 to-transparent border border-red-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-red-100 text-red-600 shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-900">
                    Experiencing an urgent water leak or electrical failure?
                  </span>
                  <span className="text-xs text-gray-600">
                    Our Madrid rapid response unit is on call 24 hours a day for immediate intervention.
                  </span>
                </div>
              </div>

              <a
                href="tel:+34910882140"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-red-600 hover:text-red-700 hover:bg-red-50 text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer shrink-0"
              >
                <PhoneCall className="w-4 h-4" />
                Call Hotline: +34 910 882 140
              </a>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 pt-1 overflow-x-auto pb-1">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mr-2 hidden sm:inline">
                Filter by:
              </span>
              {[
                { id: "all", label: `All Tickets (${requests.length})` },
                { id: "in_progress", label: "Open & In Progress" },
                { id: "scheduled", label: "Scheduled Visits" },
                { id: "completed", label: "Resolved" },
              ].map((tab) => {
                const isActive = activeFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveFilter(tab.id)}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${isActive
                      ? "bg-sky-600 text-white shadow-xs"
                      : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                      }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Tickets List */}
            <div className="flex flex-col gap-4">
              {filteredRequests.length > 0 ? (
                filteredRequests.map((req) => (
                  <ServiceRequestCard
                    key={req.id}
                    request={req}
                    onClick={() => setIsRequestModalOpen(true)}
                  />
                ))
              ) : (
                <div className="py-16 p-6 rounded-2xl bg-white border border-gray-200 text-center flex flex-col items-center justify-center gap-3">
                  <Filter className="w-8 h-8 text-gray-300" />
                  <p className="text-base font-semibold text-gray-700">
                    No tickets found for this filter
                  </p>
                  <p className="text-xs text-gray-400">
                    Select another filter tab or click &ldquo;Request new service&rdquo; to file a new ticket.
                  </p>
                </div>
              )}
            </div>
          </div>
        </Container>
      </div>

      {/* Request Service Modal */}
      <RequestServiceModal
        open={isRequestModalOpen}
        onOpenChange={setIsRequestModalOpen}
        onRequestCreated={handleRequestCreated}
      />
    </main>
  );
};

export default ServiceRequestClient;

"use client";

import React, { useRef } from "react";
import Container from "@/components/ui/CustomUi/Container";
import UserAvatar from "@/components/profile/UserAvatar";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap-util";
import type { IPoolDetailsData } from "@/service/MyPoolService/MyPoolServiceApi";

interface MyPoolOverviewTabProps {
  details: IPoolDetailsData | null;
  isLoading?: boolean;
  onRequestServiceClick?: () => void;
}

const dims = (pool: IPoolDetailsData["pool"]) =>
  pool.length && pool.width
    ? `${pool.length}m × ${pool.width}m${pool.depth ? ` (Depth ${pool.depth}m${pool.maxDepth ? `-${pool.maxDepth}m` : ""})` : ""}`
    : pool.volumeM3
      ? `${pool.volumeM3} m³`
      : "Not recorded";

export const MyPoolOverviewTab: React.FC<MyPoolOverviewTabProps> = ({
  details,
  isLoading,
  onRequestServiceClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;
      if (prefersReducedMotion()) return;

      const cards = containerRef.current.querySelectorAll(".overview-card");
      if (cards.length > 0) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.75, stagger: 0.12, ease: "power3.out", force3D: true }
        );
      }
    },
    { dependencies: [details?.pool._id] }
  );

  if (isLoading || !details) {
    return (
      <div className="w-full py-24 text-center text-sm text-gray-500 bg-gray-50/50">Loading pool specifications...</div>
    );
  }

  const { pool, property, nextVisit, schedule } = details;

  const specs = [
    { label: "Pool Address", value: property ? [property.address, property.city].filter(Boolean).join(", ") : "—" },
    { label: "Pool Type", value: pool.poolType || "—" },
    { label: "Water Volume", value: pool.volumeM3 ? `${pool.volumeM3} m³` : "—" },
    { label: "Dimensions", value: dims(pool) },
    { label: "Water Type", value: pool.waterType || "—" },
    { label: "Surface Finish", value: pool.surfaceType || "—" },
  ];

  return (
    <div ref={containerRef} className="w-full py-8 md:py-12 bg-gray-50/50">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="overview-card lg:col-span-8 bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-xs">
            <div className="mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">Pool Specifications</h2>
              <p className="text-sm text-gray-500 mt-1">Technical parameters verified on-site by Pure Pool operations.</p>
            </div>

            <div className="divide-y divide-gray-100">
              {specs.map((spec) => (
                <div key={spec.label} className="py-3.5 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                  <span className="text-sm sm:text-base font-normal text-gray-600">{spec.label}</span>
                  <span className="text-sm sm:text-base font-bold text-gray-900 text-left sm:text-right">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="overview-card lg:col-span-4 bg-white rounded-2xl p-6 sm:p-7 border border-gray-100 shadow-xs flex flex-col gap-4">
            <h3 className="text-base sm:text-lg font-bold text-sky-600">Scheduled Maintenance</h3>

            {nextVisit ? (
              <div className="flex items-center gap-4 pt-1">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-sky-600 text-white flex flex-col items-center justify-center shrink-0 shadow-sm">
                  <span className="text-[10px] font-bold tracking-wider uppercase">
                    {new Date(nextVisit.scheduledAt).toLocaleDateString([], { month: "short" }).toUpperCase()}
                  </span>
                  <span className="text-xl sm:text-2xl font-black leading-none mt-0.5">
                    {new Date(nextVisit.scheduledAt).getDate()}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
                    {new Date(nextVisit.scheduledAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                  {nextVisit.technicianId && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="relative w-5 h-5 rounded-full overflow-hidden bg-sky-100 shrink-0">
                        <UserAvatar src={nextVisit.technicianId.avatarUrl} alt={nextVisit.technicianId.name} />
                      </div>
                      <span className="font-medium text-gray-700">{nextVisit.technicianId.name}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                {schedule ? "No visit scheduled yet for the current cycle." : "No regular schedule set up yet."}
              </p>
            )}

            {onRequestServiceClick && (
              <button
                type="button"
                onClick={onRequestServiceClick}
                className="w-full mt-3 py-2 px-3 rounded-xl border border-sky-200 bg-sky-50/50 hover:bg-sky-100 text-sky-700 text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Request Special Service / Check
              </button>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default MyPoolOverviewTab;

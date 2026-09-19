"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Container from "@/components/ui/CustomUi/Container";
import { AllImages } from "../../../public/images/AllImages";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap-util";
import type { PoolOverviewData } from "@/service/MyPoolService/MyPoolServiceApi";

export interface PoolSpecification {
  label: string;
  value: string;
}

const SPECIFICATIONS: PoolSpecification[] = [
  { label: "Pool Address", value: "Calle de Alcalá 125, 28009 Madrid" },
  { label: "Pool Type", value: "Residential" },
  { label: "Water Volume", value: "48 m³ (48,000 L)" },
  { label: "Dimensions", value: "8m × 4m (Depth 1.2m - 2.1m)" },
  { label: "Water Type", value: "Saltwater" },
  { label: "Surface Finish", value: "Tile" },
];

interface MyPoolOverviewTabProps {
  data?: PoolOverviewData;
  onRequestServiceClick?: () => void;
}

export const MyPoolOverviewTab: React.FC<MyPoolOverviewTabProps> = ({
  data,
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
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            stagger: 0.12,
            ease: "power3.out",
            force3D: true,
          }
        );
      }
    },
    { dependencies: [] }
  );

  const specs = data
    ? [
      { label: "Pool Address", value: data.address },
      { label: "Pool Type", value: data.poolType },
      { label: "Water Volume", value: data.waterVolume },
      { label: "Dimensions", value: data.dimensions },
      { label: "Water Type", value: data.waterType },
      { label: "Surface Finish", value: data.surfaceFinish },
    ]
    : SPECIFICATIONS;

  return (
    <div ref={containerRef} className="w-full py-8 md:py-12 bg-gray-50/50">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Pool Specifications */}
          <div className="overview-card lg:col-span-8 bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-xs">
            <div className="mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                Pool Specifications
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Technical parameters verified on-site by Pure Pool operations.
              </p>
            </div>

            <div className="divide-y divide-gray-100">
              {specs.map((spec) => (
                <div
                  key={spec.label}
                  className="py-3.5 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4"
                >
                  <span className="text-sm sm:text-base font-normal text-gray-600">
                    {spec.label}
                  </span>
                  <span className="text-sm sm:text-base font-bold text-gray-900 text-left sm:text-right">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Scheduled Maintenance */}
          <div className="overview-card lg:col-span-4 bg-white rounded-2xl p-6 sm:p-7 border border-gray-100 shadow-xs flex flex-col gap-4">
            <h3 className="text-base sm:text-lg font-bold text-sky-600">
              Scheduled Maintenance
            </h3>

            <div className="flex items-center gap-4 pt-1">
              {/* Blue Date Box */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-sky-600 text-white flex flex-col items-center justify-center shrink-0 shadow-sm">
                <span className="text-[10px] font-bold tracking-wider uppercase">
                  SEP
                </span>
                <span className="text-xl sm:text-2xl font-black leading-none mt-0.5">
                  24
                </span>
              </div>

              {/* Time and Technician */}
              <div className="flex flex-col gap-1">
                <span className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
                  10:00 – 12:00
                </span>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="relative w-5 h-5 rounded-full overflow-hidden bg-sky-100 shrink-0">
                    <Image
                      src={AllImages.profile}
                      alt="Carlos Martínez avatar"
                      fill
                      sizes="24px"
                      className="object-cover"
                    />
                  </div>
                  <span className="font-medium text-gray-700">Carlos Martínez</span>
                </div>
              </div>
            </div>

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

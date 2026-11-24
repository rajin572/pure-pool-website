"use client";

import React, { useState, useRef } from "react";
import Container from "@/components/ui/CustomUi/Container";
import ParameterGauge from "./ParameterGauge";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap-util";
import { cn } from "@/lib/utils";
import type { IPoolWaterData, IWaterReading } from "@/service/MyPoolService/MyPoolServiceApi";

interface MyPoolWaterConditionTabProps {
  data: IPoolWaterData | null;
  isLoading?: boolean;
}

const METRICS = [
  { label: "pH", key: "ph" },
  { label: "Chlorine", key: "chlorine" },
  { label: "Alkalinity", key: "alkalinity" },
] as const;

function gaugeProps(r: IWaterReading) {
  const status: "optimal" | "high" | "low" | "below_ideal" =
    r.status === "GOOD" || r.status === "UNKNOWN" ? "optimal" : r.direction === "LOW" ? "low" : "high";
  const statusText = r.status === "UNKNOWN" ? "No data" : r.status === "GOOD" ? "optimal" : r.status === "BAD" ? (r.direction === "LOW" ? "Low" : "High") : r.direction === "LOW" ? "Below ideal" : "High";
  const range = r.range || { min: r.value, max: r.value, goodFrom: r.value, goodTo: r.value };
  return {
    label: r.name,
    value: r.value,
    unit: r.unit,
    status,
    statusText,
    min: range.min ?? range.goodFrom,
    max: range.max ?? range.goodTo,
    idealMin: range.goodFrom,
    idealMax: range.goodTo,
    currentNumeric: r.value,
  };
}

export const MyPoolWaterConditionTab: React.FC<MyPoolWaterConditionTabProps> = ({ data, isLoading }) => {
  const [activeMetric, setActiveMetric] = useState<(typeof METRICS)[number]["key"]>("ph");
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;
      if (prefersReducedMotion()) return;
      const cards = containerRef.current.querySelectorAll(".water-card");
      if (cards.length > 0) {
        gsap.fromTo(cards, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.14, ease: "power3.out", force3D: true });
      }
    },
    { dependencies: [data?.poolId] }
  );

  if (isLoading || !data) {
    return <div className="w-full py-24 text-center text-sm text-gray-500 bg-gray-50/50">Loading water condition...</div>;
  }

  const range = data.ranges[activeMetric];
  const history = (data.history[activeMetric] || []).slice(-8);
  const scale = range
    ? { min: range.min ?? 0, max: range.max ?? range.goodTo * 1.2, unit: range.unit }
    : { min: 0, max: 1, unit: "" };

  return (
    <div ref={containerRef} className="w-full py-8 md:py-12 bg-gray-50/50">
      <Container className="flex flex-col gap-8">
        <div className="water-card bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-xs">
          <div className="mb-6">
            {data.recordedAt && (
              <span className="text-xs font-mono font-bold text-gray-500 uppercase tracking-wider">
                RECORDED {new Date(data.recordedAt).toLocaleDateString()}
                {data.recordedBy ? ` BY ${data.recordedBy}` : ""}
              </span>
            )}
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight mt-1">Detailed Parameter Analysis</h2>
            <p className="text-sm text-gray-500 mt-1">
              Each value is measured against the maintenance plan&apos;s configured water-quality ranges.
            </p>
          </div>

          {data.readings.length === 0 ? (
            <p className="text-sm text-gray-500 py-6">No water readings recorded yet for this pool.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 pt-2">
              {data.readings.map((r) => (
                <ParameterGauge key={r.key} {...gaugeProps(r)} />
              ))}
            </div>
          )}
        </div>

        <div className="water-card bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <h3 className="text-xl font-bold text-gray-900 tracking-tight">Chemistry History</h3>

            <div className="flex items-center p-1 bg-gray-100 rounded-xl max-w-fit">
              {METRICS.map((metric) => (
                <button
                  key={metric.key}
                  type="button"
                  onClick={() => setActiveMetric(metric.key)}
                  className={cn(
                    "px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-150 cursor-pointer",
                    activeMetric === metric.key ? "bg-white text-gray-900 shadow-xs" : "text-gray-600 hover:text-gray-900"
                  )}
                >
                  {metric.label}
                </button>
              ))}
            </div>
          </div>

          {history.length === 0 ? (
            <p className="text-sm text-gray-500 py-6">No history yet for this parameter.</p>
          ) : (
            <div className="relative w-full h-64 sm:h-72 select-none">
              <div className="absolute inset-0 pl-2 pr-4 flex items-end justify-between gap-2 sm:gap-4 pb-8">
                {history.map((item, i) => {
                  const heightPercent = Math.max(10, Math.min(100, ((item.value - scale.min) / (scale.max - scale.min || 1)) * 100));
                  return (
                    <div key={`${item.date}-${i}`} className="flex-1 h-full flex flex-col items-center justify-end group relative">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-gray-900 text-white text-[11px] font-bold py-1 px-2 rounded pointer-events-none whitespace-nowrap z-10">
                        {item.value}
                        {scale.unit}
                      </div>
                      <div
                        className="w-full max-w-[56px] rounded-t-xl bg-sky-500 transition-all duration-300 group-hover:bg-sky-600"
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                  );
                })}
              </div>

              <div className="absolute inset-x-0 bottom-0 pl-2 pr-4 flex items-center justify-between gap-2 sm:gap-4 pt-2">
                {history.map((item, i) => (
                  <span key={`${item.date}-${i}-label`} className="flex-1 text-center text-xs text-gray-500 font-medium">
                    {new Date(item.date).toLocaleDateString([], { day: "2-digit", month: "short" })}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default MyPoolWaterConditionTab;

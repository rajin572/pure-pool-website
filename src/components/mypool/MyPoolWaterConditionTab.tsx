"use client";

import React, { useState, useRef } from "react";
import Container from "@/components/ui/CustomUi/Container";
import ParameterGauge from "./ParameterGauge";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap-util";
import { cn } from "@/lib/utils";
import type { WaterConditionData } from "@/service/MyPoolService/MyPoolServiceApi";

interface HistoryDataPoint {
  date: string;
  ph: number;
  chlorine: number;
  alkalinity: number;
}

const HISTORY_DATA: HistoryDataPoint[] = [
  { date: "01 Mar", ph: 7.0, chlorine: 1.6, alkalinity: 120 },
  { date: "05 Mar", ph: 7.6, chlorine: 2.1, alkalinity: 135 },
  { date: "10 Mar", ph: 7.0, chlorine: 1.7, alkalinity: 125 },
  { date: "15 Mar", ph: 5.8, chlorine: 0.9, alkalinity: 95 },
  { date: "20 Mar", ph: 6.2, chlorine: 1.2, alkalinity: 105 },
  { date: "25 Mar", ph: 6.2, chlorine: 1.3, alkalinity: 110 },
  { date: "30 Mar", ph: 7.2, chlorine: 1.8, alkalinity: 140 },
  { date: "01 Apr", ph: 7.2, chlorine: 1.8, alkalinity: 145 },
];

interface MyPoolWaterConditionTabProps {
  data?: WaterConditionData;
}

export const MyPoolWaterConditionTab: React.FC<MyPoolWaterConditionTabProps> = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  data,
}) => {
  const [activeMetric, setActiveMetric] = useState<"pH" | "Chlorine" | "Alkalinity">("pH");
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;
      if (prefersReducedMotion()) return;

      const cards = containerRef.current.querySelectorAll(".water-card");
      if (cards.length > 0) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 22 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.14,
            ease: "power3.out",
            force3D: true,
          }
        );
      }
    },
    { dependencies: [] }
  );

  // Determine chart min/max and bar heights based on selected metric
  const getYScale = () => {
    switch (activeMetric) {
      case "pH":
        return {
          min: 5.0,
          max: 8.0,
          ticks: [8.0, 7.0, 6.0, 5.5, 5.0],
          getValue: (d: HistoryDataPoint) => d.ph,
          unit: "",
        };
      case "Chlorine":
        return {
          min: 0.0,
          max: 3.0,
          ticks: [3.0, 2.0, 1.5, 1.0, 0.0],
          getValue: (d: HistoryDataPoint) => d.chlorine,
          unit: " mg/L",
        };
      case "Alkalinity":
        return {
          min: 80,
          max: 160,
          ticks: [160, 140, 120, 100, 80],
          getValue: (d: HistoryDataPoint) => d.alkalinity,
          unit: " ppm",
        };
    }
  };

  const scale = getYScale();

  return (
    <div ref={containerRef} className="w-full py-8 md:py-12 bg-gray-50/50">
      <Container className="flex flex-col gap-8">
        {/* Top Card: Detailed Parameter Analysis */}
        <div className="water-card bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-xs">
          <div className="mb-6">
            <span className="text-xs font-mono font-bold text-gray-500 uppercase tracking-wider">
              RECORDED 17 May BY Carlos Martínez
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight mt-1">
              Detailed Parameter Analysis
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Each value is measured with digital photometers against Spanish Royal
              Decree 742/2013 standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 pt-2">
            <ParameterGauge
              label="pH"
              value="7.3"
              status="optimal"
              statusText="optimal"
              min={6.6}
              max={8.0}
              idealMin={7.2}
              idealMax={7.6}
              currentNumeric={7.3}
            />

            <ParameterGauge
              label="Chlorine"
              value="1.8"
              unit="mg/L"
              status="optimal"
              statusText="optimal"
              min={0}
              max={5.0}
              idealMin={1.0}
              idealMax={3.0}
              currentNumeric={1.8}
            />

            <ParameterGauge
              label="Alkalinity"
              value="145"
              unit="ppm"
              status="high"
              statusText="High"
              min={0}
              max={5.0}
              idealMin={1.0}
              idealMax={3.0}
              currentNumeric={4.2}
            />

            <ParameterGauge
              label="Temperature"
              value="24.5"
              unit="°C"
              status="below_ideal"
              statusText="Below ideal"
              min={15}
              max={35}
              idealMin={26}
              idealMax={28}
              currentNumeric={24.5}
            />
          </div>
        </div>

        {/* Bottom Card: Chemistry History */}
        <div className="water-card bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-xs">
          {/* Header & Filter Pills */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <h3 className="text-xl font-bold text-gray-900 tracking-tight">
              Chemistry History
            </h3>

            {/* Metric Switcher Pills */}
            <div className="flex items-center p-1 bg-gray-100 rounded-xl max-w-fit">
              {(["pH", "Chlorine", "Alkalinity"] as const).map((metric) => (
                <button
                  key={metric}
                  type="button"
                  onClick={() => setActiveMetric(metric)}
                  className={cn(
                    "px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-150 cursor-pointer",
                    activeMetric === metric
                      ? "bg-white text-gray-900 shadow-xs"
                      : "text-gray-600 hover:text-gray-900"
                  )}
                >
                  {metric}
                </button>
              ))}
              <span className="px-3 py-1.5 text-xs text-gray-400 font-medium hidden sm:inline-block">
                Nav item
              </span>
            </div>
          </div>

          {/* Bar Chart Container */}
          <div className="relative w-full h-64 sm:h-72 select-none">
            {/* Horizontal Gridlines & Y-Axis Ticks */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8">
              {scale.ticks.map((tick) => (
                <div key={tick} className="w-full flex items-center gap-3">
                  <span className="w-8 text-right text-xs font-mono text-gray-400">
                    {tick}
                  </span>
                  <div className="flex-1 border-b border-gray-100" />
                </div>
              ))}
            </div>

            {/* Bars Container */}
            <div className="absolute inset-0 pl-12 pr-4 flex items-end justify-between gap-2 sm:gap-4 pb-8">
              {HISTORY_DATA.map((item) => {
                const val = scale.getValue(item);
                const heightPercent = Math.max(
                  10,
                  Math.min(100, ((val - scale.min) / (scale.max - scale.min)) * 100)
                );

                return (
                  <div
                    key={item.date}
                    className="flex-1 h-full flex flex-col items-center justify-end group relative"
                  >
                    {/* Tooltip on hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-gray-900 text-white text-[11px] font-bold py-1 px-2 rounded pointer-events-none whitespace-nowrap z-10">
                      {val}
                      {scale.unit}
                    </div>

                    {/* Bar */}
                    <div
                      className="w-full max-w-[56px] rounded-t-xl bg-sky-500 transition-all duration-300 group-hover:bg-sky-600"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                );
              })}
            </div>

            {/* X-Axis Dates Labels */}
            <div className="absolute inset-x-0 bottom-0 pl-12 pr-4 flex items-center justify-between gap-2 sm:gap-4 pt-2">
              {HISTORY_DATA.map((item) => (
                <span
                  key={item.date}
                  className="flex-1 text-center text-xs text-gray-500 font-medium"
                >
                  {item.date}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default MyPoolWaterConditionTab;

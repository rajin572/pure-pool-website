"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface ParameterGaugeProps {
  label: string;
  value: string | number;
  unit?: string;
  status: "optimal" | "high" | "low" | "below_ideal";
  statusText?: string;
  min: number;
  max: number;
  idealMin: number;
  idealMax: number;
  currentNumeric: number;
  className?: string;
}

export const ParameterGauge: React.FC<ParameterGaugeProps> = ({
  label,
  value,
  unit,
  status,
  statusText,
  min,
  max,
  idealMin,
  idealMax,
  currentNumeric,
  className,
}) => {
  // Calculate relative percentages along the 0–100% track
  const totalRange = max - min || 1;
  const clampedVal = Math.min(Math.max(currentNumeric, min), max);
  const pointerPercent = ((clampedVal - min) / totalRange) * 100;
  const idealStartPercent = Math.max(0, ((idealMin - min) / totalRange) * 100);
  const idealWidthPercent = Math.min(
    100 - idealStartPercent,
    ((idealMax - idealMin) / totalRange) * 100
  );

  const getStatusBadge = () => {
    switch (status) {
      case "optimal":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
            <svg
              className="w-3.5 h-3.5"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="3 8.5 6.5 12 13 4" />
            </svg>
            {statusText ?? "optimal"}
          </span>
        );
      case "high":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-800">
            <svg
              className="w-3.5 h-3.5"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="8" y1="12" x2="8" y2="4" />
              <polyline points="4 8 8 4 12 8" />
            </svg>
            {statusText ?? "High"}
          </span>
        );
      case "below_ideal":
      case "low":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600">
            {statusText ?? "Below ideal"}
          </span>
        );
    }
  };

  return (
    <div className={cn("flex flex-col gap-2 p-1", className)}>
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs sm:text-sm font-semibold text-gray-700">
          {label}
        </span>
        {getStatusBadge()}
      </div>

      {/* Main Value Display */}
      <div className="flex items-baseline gap-1.5">
        <span className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
          {value}
        </span>
        {unit && (
          <span className="text-sm sm:text-base font-semibold text-gray-600">
            {unit}
          </span>
        )}
      </div>

      {/* Visual Range Track */}
      <div className="relative w-full h-2.5 my-2 flex items-center">
        {/* Background track */}
        <div className="w-full h-2 bg-gray-200 rounded-full relative overflow-hidden">
          {/* Ideal range highlight */}
          <div
            className="absolute top-0 bottom-0 bg-emerald-500 rounded-full"
            style={{
              left: `${idealStartPercent}%`,
              width: `${idealWidthPercent}%`,
            }}
          />
        </div>

        {/* Current Value Needle / Indicator */}
        <div
          className="absolute -top-1 w-1 h-4.5 bg-gray-900 rounded-full shadow transition-all duration-500"
          style={{
            left: `calc(${pointerPercent}% - 2px)`,
          }}
          aria-label={`Current ${label}: ${value}`}
        />
      </div>

      {/* Lower Range Labels */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-400 font-medium">{min}</span>
        <span className="text-gray-900 font-bold">
          ideal {idealMin}–{idealMax}
        </span>
        <span className="text-gray-400 font-medium">{max}</span>
      </div>
    </div>
  );
};

export default ParameterGauge;


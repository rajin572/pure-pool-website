"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft, Droplet } from "lucide-react";

export interface PoolSettingsHeaderProps {
  activePoolId: string;
  onPoolChange: (poolId: string) => void;
}

export const PoolSettingsHeader: React.FC<PoolSettingsHeaderProps> = ({
  activePoolId,
  onPoolChange,
}) => {
  return (
    <div className="space-y-6">
      {/* Back Link to My Pool */}
      <Link
        href="/my-pool"
        className="inline-flex items-center gap-1.5 text-zinc-600 hover:text-zinc-900 transition-colors group cursor-pointer"
      >
        <ChevronLeft className="size-4.5 text-zinc-600 group-hover:text-zinc-900 transition-transform group-hover:-translate-x-0.5" />
        <span className="text-sm sm:text-base font-semibold font-['Onest']">
          Back to overview
        </span>
      </Link>

      {/* Title & Description */}
      <div className="space-y-1.5">
        <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-bold text-zinc-900 font-['Onest'] tracking-tight leading-tight">
          Pool settings
        </h1>
        <p className="text-sm sm:text-base font-medium text-zinc-600 font-['Onest'] leading-relaxed max-w-2xl">
          These details go to your technician before every visit. Keep them
          current and nobody gets locked out.
        </p>
      </div>

      {/* Pool Switcher Row */}
      <div className="flex items-center justify-between">
        <div className="p-1 bg-[#F1F3F5] rounded-2xl inline-flex items-center gap-1 overflow-x-auto max-w-full">
          {/* Main Pool */}
          <button
            type="button"
            onClick={() => onPoolChange("main")}
            className={`px-4 py-2 sm:py-2.5 rounded-xl flex items-center gap-2 text-sm sm:text-base transition-all cursor-pointer ${
              activePoolId === "main"
                ? "bg-white text-zinc-900 font-semibold shadow-[0px_1px_3px_0px_rgba(0,0,0,0.08)]"
                : "text-zinc-600 hover:text-zinc-900 font-medium hover:bg-white/40"
            }`}
          >
            <Droplet
              className={`size-4 ${
                activePoolId === "main" ? "text-blue-600 fill-blue-600/10" : "text-zinc-400"
              }`}
            />
            <span className="font-['Onest']">Main Pool</span>
          </button>

          {/* Farm House Pool */}
          <button
            type="button"
            onClick={() => onPoolChange("farmhouse")}
            className={`px-4 py-2 sm:py-2.5 rounded-xl flex items-center gap-2 text-sm sm:text-base transition-all cursor-pointer ${
              activePoolId === "farmhouse"
                ? "bg-white text-zinc-900 font-semibold shadow-[0px_1px_3px_0px_rgba(0,0,0,0.08)]"
                : "text-zinc-600 hover:text-zinc-900 font-medium hover:bg-white/40"
            }`}
          >
            <Droplet
              className={`size-4 ${
                activePoolId === "farmhouse" ? "text-blue-600 fill-blue-600/10" : "text-zinc-400"
              }`}
            />
            <span className="font-['Onest']">Farm House Pool</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PoolSettingsHeader;


"use client";

import React from "react";
import { PhoneCall, AlertTriangle } from "lucide-react";
import { EMERGENCY_INFO } from "@/service/HelpCenterService/HelpCenterServiceApi";

export const EmergencyHotlineBanner: React.FC = () => {
  return (
    <div className="w-full bg-[#FEF2F2] border border-[#FCA5A5] rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6 shadow-2xs">
      {/* Left Details */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-red-100 border border-red-200 flex items-center justify-center shrink-0 text-red-600 mt-0.5">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h2 className="text-zinc-900 font-bold text-base sm:text-lg">
              24/7 Pool Emergency Hotline
            </h2>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-red-600 text-white uppercase tracking-wider">
              Live
            </span>
          </div>
          <p className="text-zinc-600 text-xs sm:text-sm font-medium">
            Active leaks, pump failures, electrical issues or green pool before an event — call immediately.
          </p>
        </div>
      </div>

      {/* Action Button */}
      <a
        href={`tel:${EMERGENCY_INFO.hotline}`}
        className="w-full md:w-auto shrink-0 h-11 px-6 rounded-xl bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white font-bold text-sm sm:text-base inline-flex items-center justify-center gap-2.5 transition-all shadow-xs cursor-pointer"
      >
        <PhoneCall className="w-4 h-4" />
        <span>Call {EMERGENCY_INFO.hotlineDisplay}</span>
      </a>
    </div>
  );
};

export default EmergencyHotlineBanner;


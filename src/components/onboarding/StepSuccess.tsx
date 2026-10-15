"use client";

import React from "react";
import Link from "next/link";
import { Check, Sparkles, Calendar, UserCheck } from "lucide-react";
import ReusableGradientButton from "@/components/ui/CustomUi/ReusableGradientButton";

interface StepSuccessProps {
  poolId?: string;
}

export const StepSuccess: React.FC<StepSuccessProps> = ({
  poolId = "MAD-2026-POOL",
}) => {
  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-gray-100 flex flex-col items-center gap-8 text-center animate-in fade-in zoom-in-95 duration-300">
      {/* Animated Gradient Checkmark Icon */}
      <div className="relative">
        <div className="size-20 sm:size-24 bg-gradient-to-br from-sky-500 to-blue-600 rounded-[36px] flex items-center justify-center text-white shadow-2xl shadow-sky-500/30">
          <Check className="w-10 h-10 sm:w-12 sm:h-12 stroke-[3]" />
        </div>
        <div className="absolute -top-1 -right-1 p-1.5 rounded-full bg-amber-400 text-white shadow-md">
          <Sparkles className="w-4 h-4" />
        </div>
      </div>

      {/* Copy */}
      <div className="flex flex-col gap-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold text-xs mx-auto border border-blue-200">
          <span>Pool ID:</span>
          <span className="font-mono font-bold">{poolId}</span>
        </div>
        <h2 className="text-zinc-900 text-3xl sm:text-4xl font-bold font-['Onest'] leading-tight">
          Your pool is set up!
        </h2>
        <p className="text-zinc-600 text-sm sm:text-base font-medium font-['Onest'] leading-relaxed max-w-md mx-auto">
          Welcome to Pure Pool. Your pool profile has been created, and your dedicated Madrid technician is ready for your initial calibration visit.
        </p>
      </div>

      {/* Onboarding Highlights */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
        <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-100 text-blue-600 shrink-0">
            <UserCheck className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-zinc-500 font-medium">Assigned Tech</span>
            <span className="text-sm text-zinc-900 font-bold">Carlos Martínez</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-100 text-emerald-600 shrink-0">
            <Calendar className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-zinc-500 font-medium">Next Service Visit</span>
            <span className="text-sm text-zinc-900 font-bold">Thursday, 10:00 AM</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="w-full flex flex-col gap-3 pt-2">
        <ReusableGradientButton
          type="redirect"
          href="/my-pool"
          className="w-full h-14 rounded-2xl text-base sm:text-lg font-bold shadow-md cursor-pointer"
        >
          View My Pool
        </ReusableGradientButton>

        <Link
          href="/dashboard"
          className="w-full h-14 py-4 bg-white rounded-2xl outline outline-1 -outline-offset-1 outline-gray-200 hover:bg-gray-50 flex items-center justify-center text-zinc-900 text-base sm:text-lg font-bold transition-colors"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default StepSuccess;


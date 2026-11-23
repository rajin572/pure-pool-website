"use client";

import React from "react";
import Link from "next/link";
import { Check, ClipboardCheck, Mail, FileText } from "lucide-react";
import ReusableGradientButton from "@/components/ui/CustomUi/ReusableGradientButton";

interface StepSuccessProps {
  /** The backend's confirmation text from the submit call (absent when the page is reopened later). */
  message?: string;
}

const NEXT_STEPS = [
  { icon: ClipboardCheck, tone: "bg-blue-100 text-blue-600", title: "We review your details", text: "Our Back Office team checks your pool information." },
  { icon: Mail, tone: "bg-emerald-100 text-emerald-600", title: "You get an email", text: "We write to you as soon as your account is active." },
  { icon: FileText, tone: "bg-amber-100 text-amber-600", title: "We prepare your quote", text: "Your installation quote follows once you're approved." },
];

export const StepSuccess: React.FC<StepSuccessProps> = ({ message }) => {
  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-gray-100 flex flex-col items-center gap-8 text-center animate-in fade-in zoom-in-95 duration-300">
      {/* Gradient Checkmark Icon */}
      <div className="size-20 sm:size-24 bg-gradient-to-br from-sky-500 to-blue-600 rounded-[36px] flex items-center justify-center text-white shadow-2xl shadow-sky-500/30">
        <Check className="w-10 h-10 sm:w-12 sm:h-12 stroke-[3]" />
      </div>

      {/* Copy */}
      <div className="flex flex-col gap-3">
        <h2 className="text-zinc-900 text-3xl sm:text-4xl font-bold font-['Onest'] leading-tight">
          Application submitted
        </h2>
        <p className="text-zinc-600 text-sm sm:text-base font-medium font-['Onest'] leading-relaxed max-w-md mx-auto">
          {message || "Your account is being reviewed by our team. We will email you as soon as it is active."}
        </p>
      </div>

      {/* What happens next */}
      <ol className="w-full flex flex-col gap-3 text-left">
        {NEXT_STEPS.map(({ icon: Icon, tone, title, text }) => (
          <li key={title} className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 flex items-center gap-3">
            <div className={`p-2 rounded-xl shrink-0 ${tone}`}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-zinc-900 font-bold">{title}</span>
              <span className="text-xs text-zinc-500 font-medium">{text}</span>
            </div>
          </li>
        ))}
      </ol>

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
          href="/pool-settings"
          className="w-full h-14 py-4 bg-white rounded-2xl outline outline-1 -outline-offset-1 outline-gray-200 hover:bg-gray-50 flex items-center justify-center text-zinc-900 text-base sm:text-lg font-bold transition-colors"
        >
          Pool Settings
        </Link>
      </div>
    </div>
  );
};

export default StepSuccess;

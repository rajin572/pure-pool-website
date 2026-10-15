"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthLeftPanel from "./AuthLeftPanel";
import { Check } from "lucide-react";
import ReusableGradientButton from "@/components/ui/CustomUi/ReusableGradientButton";

export const ResetSuccessClient: React.FC = () => {
  const router = useRouter();
  const [countdown, setCountdown] = useState<number>(30);

  useEffect(() => {
    if (countdown <= 0) {
      router.push("/login");
      return;
    }
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown, router]);

  return (
    <div className="w-full min-h-screen flex flex-col lg:flex-row bg-white">
      {/* Left Brand Panel */}
      <AuthLeftPanel variant="reset-success" />

      {/* Right Content Column */}
      <main className="flex-1 flex flex-col justify-between p-6 sm:p-10 lg:p-14 xl:p-16 max-w-3xl mx-auto w-full relative">
        <div className="w-full h-8" />

        {/* Center Success Information Section */}
        <div className="w-full max-w-md mx-auto flex flex-col items-center gap-6 my-auto text-center">
          {/* Animated Checkmark Icon */}
          <div className="size-16 sm:size-20 bg-gradient-to-br from-sky-500 to-blue-600 rounded-3xl sm:rounded-[36px] flex items-center justify-center text-white shadow-xl shadow-sky-500/25">
            <Check className="w-8 h-8 sm:w-10 sm:h-10 text-white stroke-[3]" />
          </div>

          {/* Copy */}
          <div className="flex flex-col gap-2">
            <h2 className="text-zinc-900 text-3xl sm:text-4xl font-bold font-['Onest'] leading-tight">
              Password updated
            </h2>
            <p className="text-zinc-600 text-sm sm:text-base font-medium font-['Onest'] leading-relaxed max-w-sm">
              You can now sign in with your new password. We&apos;ve signed you out everywhere else for safety.
            </p>
          </div>

          {/* Action Button */}
          <div className="w-full pt-4">
            <ReusableGradientButton
              type="redirect"
              href="/login"
              className="w-full h-14 rounded-2xl text-base sm:text-lg font-bold shadow-md cursor-pointer"
            >
              Back to sign in
            </ReusableGradientButton>
          </div>

          {/* Countdown redirect indicator */}
          <div className="text-xs sm:text-sm text-zinc-400">
            Taking you there in {countdown}s…
          </div>
        </div>

        {/* Bottom Micro Copy */}
        <div className="w-full text-center text-xs text-zinc-400 mt-8">
          Pure Pool Madrid &bull; Certified Professional Maintenance &bull; Encrypted SSL Protection
        </div>
      </main>
    </div>
  );
};

export default ResetSuccessClient;

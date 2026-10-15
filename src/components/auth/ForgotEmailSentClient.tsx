"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import AuthLeftPanel from "./AuthLeftPanel";
import { Mail, ArrowLeft, RefreshCw } from "lucide-react";
import ReusableGradientButton from "@/components/ui/CustomUi/ReusableGradientButton";

interface ForgotEmailSentClientProps {
  email?: string;
}

export const ForgotEmailSentClient: React.FC<ForgotEmailSentClientProps> = ({
  email = "elena.n•••@costapools.es",
}) => {
  const [resendTimer, setResendTimer] = useState<number>(45);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleResend = () => {
    if (resendTimer > 0) return;
    setResendTimer(45);
  };

  return (
    <div className="w-full min-h-screen flex flex-col lg:flex-row bg-white">
      {/* Left Brand Panel */}
      <AuthLeftPanel variant="forgot" />

      {/* Right Content Column */}
      <main className="flex-1 flex flex-col justify-between p-6 sm:p-10 lg:p-14 xl:p-16 max-w-3xl mx-auto w-full relative">
        {/* Top Back Link */}
        <div className="w-full flex justify-start items-center mb-8 lg:mb-12">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-zinc-600 hover:text-blue-600 text-sm sm:text-base font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to sign in</span>
          </Link>
        </div>

        {/* Center Success Information Section */}
        <div className="w-full max-w-md mx-auto flex flex-col items-center gap-6 my-auto text-center">
          {/* Animated Mail Icon */}
          <div className="size-16 sm:size-20 bg-gradient-to-br from-sky-500 to-blue-600 rounded-3xl sm:rounded-[36px] flex items-center justify-center text-white shadow-xl shadow-sky-500/20">
            <Mail className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>

          {/* Copy */}
          <div className="flex flex-col gap-2">
            <h2 className="text-zinc-900 text-3xl sm:text-4xl font-bold font-['Onest'] leading-tight">
              Check your inbox
            </h2>
            <p className="text-zinc-600 text-sm sm:text-base font-medium font-['Onest'] leading-relaxed max-w-sm">
              We&apos;ve sent a 6-digit code to{" "}
              <span className="font-semibold text-zinc-900">{email}</span>. It expires in 10 minutes.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="w-full flex flex-col gap-3 pt-4">
            <ReusableGradientButton
              type="redirect"
              href={`/forgot-password/verify?email=${encodeURIComponent(email)}`}
              className="w-full h-14 rounded-2xl text-base sm:text-lg font-bold shadow-md"
            >
              Enter code
            </ReusableGradientButton>

            <Link
              href="/forgot-password"
              className="w-full h-14 py-4 bg-white rounded-2xl outline outline-1 -outline-offset-1 outline-gray-200 hover:bg-gray-50 flex items-center justify-center text-zinc-900 text-base sm:text-lg font-bold transition-colors"
            >
              Try a different email
            </Link>
          </div>

          {/* Resend status */}
          <div className="flex items-center justify-center gap-1.5 text-sm text-zinc-500 pt-2">
            {resendTimer > 0 ? (
              <span>Didn&apos;t get it? Resend in {resendTimer}s</span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                className="text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Resend email now</span>
              </button>
            )}
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

export default ForgotEmailSentClient;


"use client";

import React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import AuthLeftPanel from "./AuthLeftPanel";
import OtpVerificationCard from "./OtpVerificationCard";

export const ForgotVerifyClient: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "user•••@gmail.com";

  const handleVerified = () => {
    router.push("/reset-password");
  };

  return (
    <div className="w-full min-h-screen flex flex-col lg:flex-row bg-white">
      {/* Left Brand Panel */}
      <AuthLeftPanel variant="forgot" />

      {/* Right Content Column */}
      <main className="flex-1 flex flex-col justify-between p-6 sm:p-10 lg:p-14 xl:p-16 max-w-3xl mx-auto w-full relative">
        <div className="w-full h-4" />

        {/* Center Card */}
        <div className="w-full max-w-xl mx-auto flex flex-col items-center gap-4 my-auto">
          <OtpVerificationCard
            email={email}
            title="Verify your code"
            subtitle={`Enter the 6-digit code sent to ${email} to continue.`}
            buttonText="Verify code"
            backHref="/forgot-password"
            onVerify={handleVerified}
          />

          <div className="flex items-center justify-center gap-1.5 text-sm text-zinc-500">
            <span>Wrong email?</span>
            <Link
              href="/forgot-password"
              className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
            >
              Change it
            </Link>
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

export default ForgotVerifyClient;


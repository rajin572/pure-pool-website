"use client";

import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthLeftPanel from "@/components/auth/AuthLeftPanel";
import OtpVerificationCard from "@/components/auth/OtpVerificationCard";
import { toast } from "sonner";
import { resendVerification, verifyEmail } from "@/service/AuthService/AuthServiceApi";

function RegisterVerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const handleVerify = async (code: string) => {
    if (!email) {
      toast.error("Missing email address. Sign in again to get a new code.");
      return false;
    }
    const res = await verifyEmail(email, code);
    if (!res.success) {
      toast.error(res.error?.message || "That code didn't work");
      return false;
    }
    toast.success("Email verified");
    router.push("/onboarding?step=1");
    return true;
  };

  const handleResend = async () => {
    if (!email) return;
    const res = await resendVerification(email);
    if (res.success) toast.success("A new code is on its way.");
    else toast.error(res.error?.message || "Couldn't send a new code");
  };

  return (
    <div className="w-full min-h-screen flex flex-col lg:flex-row bg-white">
      {/* Left Brand Panel */}
      <AuthLeftPanel variant="register" />

      {/* Right Content Column */}
      <main className="flex-1 flex flex-col justify-between p-6 sm:p-10 lg:p-14 xl:p-16 max-w-3xl mx-auto w-full relative">
        <div className="w-full h-4" />

        {/* Center Card */}
        <div className="w-full max-w-xl mx-auto flex flex-col items-center gap-4 my-auto">
          <OtpVerificationCard
            cooldownKey="verify"
            email={email}
            title="Submit your code"
            subtitle={`Enter the code we have sent to ${email}`}
            buttonText="Verify Code"
            backHref="/register"
            onVerify={handleVerify}
            onResend={handleResend}
          />
        </div>

        {/* Bottom Micro Copy */}
        <div className="w-full text-center text-xs text-zinc-400 mt-8">
          Pure Pool Madrid &bull; Certified Professional Maintenance &bull; Encrypted SSL Protection
        </div>
      </main>
    </div>
  );
}

export default function RegisterVerifyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <RegisterVerifyContent />
    </Suspense>
  );
}


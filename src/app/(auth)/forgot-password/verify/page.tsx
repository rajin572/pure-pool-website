import React, { Suspense } from "react";
import type { Metadata } from "next";
import ForgotVerifyClient from "@/components/auth/ForgotVerifyClient";

export const metadata: Metadata = {
  title: "Verify Reset Code | Pure Pool Madrid",
  description: "Verify the 6-digit password reset code sent to your email.",
};

export default function ForgotVerifyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ForgotVerifyClient />
    </Suspense>
  );
}


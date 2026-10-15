"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ForgotEmailSentClient from "@/components/auth/ForgotEmailSentClient";

function ForgotEmailSentContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "elena.n•••@costapools.es";

  return <ForgotEmailSentClient email={email} />;
}

export default function ForgotEmailSentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ForgotEmailSentContent />
    </Suspense>
  );
}


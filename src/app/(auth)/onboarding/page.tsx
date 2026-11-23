import React, { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import OnboardingClient from "@/components/onboarding/OnboardingClient";
import { getOnboardingState } from "@/service/OnboardingService/onboardingServer";

export const metadata: Metadata = {
  title: "Pool Onboarding & Setup | Pure Pool Madrid",
  description: "Configure your swimming pool specifications, dimensions, equipment pad, and access instructions.",
};

// The saved registration is per customer and changes with every step.
export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const state = await getOnboardingState();

  switch (state.kind) {
    case "login":
      redirect("/login?next=/onboarding");
    case "not-customer":
      redirect("/");
    case "verify-email":
      redirect(state.email ? `/register/verify?email=${encodeURIComponent(state.email)}` : "/login");
    case "done":
      redirect("/my-pool");
    case "error":
      return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center">
          <p className="text-zinc-700 font-medium max-w-md">{state.message}</p>
          <Link href="/onboarding" className="text-blue-600 font-semibold hover:underline">
            Try again
          </Link>
        </div>
      );
    case "wizard":
      return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading Pool Setup...</div>}>
          <OnboardingClient initialData={state.data} initialStep={state.step} initialPoolId={state.poolId} />
        </Suspense>
      );
  }
}

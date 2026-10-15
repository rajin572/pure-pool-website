import React, { Suspense } from "react";
import type { Metadata } from "next";
import OnboardingClient from "@/components/onboarding/OnboardingClient";
import { getOnboardingState } from "@/service/OnboardingService/OnboardingServiceApi";

export const metadata: Metadata = {
  title: "Pool Onboarding & Setup | Pure Pool Madrid",
  description: "Configure your swimming pool specifications, dimensions, equipment pad, and access instructions.",
};

export default async function OnboardingPage() {
  /**
   * ==============================================================================
   * NEXT.JS SSR API FETCH
   * ==============================================================================
   * When live API is enabled, fetch saved progress from backend:
   * const stateRes = await getOnboardingState();
   * const initialData = stateRes.data;
   * ==============================================================================
   */
  const stateRes = await getOnboardingState();

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading Pool Setup...</div>}>
      <OnboardingClient initialData={stateRes.data} initialStep={stateRes.currentStep} />
    </Suspense>
  );
}


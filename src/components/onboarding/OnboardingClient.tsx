"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { AllImages } from "@/../public/images/AllImages";
import Container from "@/components/ui/CustomUi/Container";
import OnboardingStepper from "./OnboardingStepper";
import Step1Location from "./Step1Location";
import Step2Specifications from "./Step2Specifications";
import Step3Shape from "./Step3Shape";
import Step4Photos from "./Step4Photos";
import Step5Equipment from "./Step5Equipment";
import StepReview from "./StepReview";
import StepSuccess from "./StepSuccess";
import {
  FullOnboardingData,
  initialOnboardingData,
} from "@/service/OnboardingService/OnboardingServiceApi";

interface OnboardingClientProps {
  initialData?: FullOnboardingData;
  initialStep?: number;
}

export const OnboardingClient: React.FC<OnboardingClientProps> = ({
  initialData = initialOnboardingData,
  initialStep = 1,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const stepParam = searchParams.get("step");

  const [currentStep, setCurrentStep] = useState<number>(() => {
    if (stepParam === "review") return 6;
    if (stepParam === "success") return 7;
    const parsed = parseInt(stepParam || "1", 10);
    return isNaN(parsed) ? initialStep : parsed;
  });

  const [onboardingData, setOnboardingData] = useState<FullOnboardingData>(initialData);

  // Sync step changes with URL shallowly
  const updateStep = (stepNumber: number) => {
    setCurrentStep(stepNumber);
    const paramVal = stepNumber === 6 ? "review" : stepNumber === 7 ? "success" : stepNumber.toString();
    router.replace(`/onboarding?step=${paramVal}`, { scroll: false });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /**
   * ==============================================================================
   * REDUX QUERY HOOK / REST API INTEGRATION
   * ==============================================================================
   * When connecting to your live backend:
   *
   * const [saveOnboardingTrigger, { isLoading }] = useSaveOnboardingMutation();
   *
   * const handleCompleteOnboarding = async () => {
   *   const res = await saveOnboardingTrigger(onboardingData).unwrap();
   *   if (res.success) {
   *     updateStep(7); // Show Success
   *   }
   * };
   * ==============================================================================
   */
  const handleConfirmReview = () => {
    updateStep(7);
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 flex flex-col py-8 sm:py-12">
      <Container className="flex flex-col items-center flex-1">
        {/* Top Pure Pool Branding Header */}
        <header className="w-full max-w-4xl flex items-center justify-between mb-6 sm:mb-8 pb-4 border-b border-gray-200/80">
          <Link href="/" className="hover:opacity-90 transition-opacity">
            <Image
              src={AllImages.logo}
              alt="Pure Pool Madrid"
              width={130}
              height={45}
              className="w-28 sm:w-32 h-auto object-contain"
              priority
            />
          </Link>
          <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-zinc-500">
            <span>Pool Setup Wizard</span>
            <span className="inline-block size-1.5 rounded-full bg-emerald-500" />
            <span className="text-emerald-700">In Progress</span>
          </div>
        </header>

        {/* Stepper only visible during steps 1 to 5 */}
        {currentStep <= 5 && (
          <OnboardingStepper
            currentStep={currentStep}
            onStepClick={(step) => updateStep(step)}
          />
        )}

        {/* Wizard Step Content */}
        <div className="w-full max-w-3xl flex-1 flex flex-col justify-center">
          {currentStep === 1 && (
            <Step1Location
              initialData={onboardingData.location}
              onNext={(locData) => {
                setOnboardingData((prev) => ({ ...prev, location: locData }));
                updateStep(2);
              }}
            />
          )}

          {currentStep === 2 && (
            <Step2Specifications
              initialData={onboardingData.specifications}
              onNext={(specData) => {
                setOnboardingData((prev) => ({ ...prev, specifications: specData }));
                updateStep(3);
              }}
              onBack={() => updateStep(1)}
            />
          )}

          {currentStep === 3 && (
            <Step3Shape
              initialData={onboardingData.shape}
              onNext={(shapeData) => {
                setOnboardingData((prev) => ({ ...prev, shape: shapeData }));
                updateStep(4);
              }}
              onBack={() => updateStep(2)}
            />
          )}

          {currentStep === 4 && (
            <Step4Photos
              initialData={onboardingData.photos}
              onNext={(photoData) => {
                setOnboardingData((prev) => ({ ...prev, photos: photoData }));
                updateStep(5);
              }}
              onBack={() => updateStep(3)}
            />
          )}

          {currentStep === 5 && (
            <Step5Equipment
              initialData={onboardingData.equipment}
              onNext={(equipData) => {
                setOnboardingData((prev) => ({ ...prev, equipment: equipData }));
                updateStep(6); // Go to review
              }}
              onBack={() => updateStep(4)}
            />
          )}

          {currentStep === 6 && (
            <StepReview
              data={onboardingData}
              onEditStep={(step) => updateStep(step)}
              onBack={() => updateStep(5)}
              onConfirm={handleConfirmReview}
            />
          )}

          {currentStep === 7 && <StepSuccess />}
        </div>

        {/* Footer info */}
        <footer className="w-full text-center text-xs text-zinc-400 mt-12">
          &copy; {new Date().getFullYear()} Pure Pool Madrid &bull; Dedicated Pool Care Specialist &bull; All Rights Reserved
        </footer>
      </Container>
    </div>
  );
};

export default OnboardingClient;


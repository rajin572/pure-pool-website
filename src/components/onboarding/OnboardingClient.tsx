"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { AllImages } from "@/../public/images/AllImages";
import Container from "@/components/ui/CustomUi/Container";
import { errorMessage } from "@/lib/apiRequest";
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
  savePoolRegistration,
} from "@/service/OnboardingService/OnboardingServiceApi";

interface OnboardingClientProps {
  /** What the server has saved (blank for a new customer). */
  initialData?: FullOnboardingData;
  /** The screen the saved progress points to (1 = start, 6 = review, 7 = already submitted). */
  initialStep?: number;
  /** Set once a first save has created the pool; later saves edit the same pool. */
  initialPoolId?: string;
}

const SUBMITTED_STEP = 7;

export const OnboardingClient: React.FC<OnboardingClientProps> = ({
  initialData = initialOnboardingData,
  initialStep = 1,
  initialPoolId,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const stepParam = searchParams.get("step");

  const [currentStep, setCurrentStep] = useState<number>(() => {
    const wanted = stepParam === "review" ? 6 : stepParam === "success" ? 7 : parseInt(stepParam || "", 10);
    if (isNaN(wanted) || wanted < 1 || wanted > SUBMITTED_STEP) return initialStep;
    // The "submitted" screen only shows for an application that really was submitted.
    if (wanted === SUBMITTED_STEP && initialStep !== SUBMITTED_STEP) return initialStep;
    return wanted;
  });

  const [onboardingData, setOnboardingData] = useState<FullOnboardingData>(initialData);
  const [poolId, setPoolId] = useState<string | undefined>(initialPoolId);
  const [isSaving, setIsSaving] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | undefined>();
  const savingRef = useRef(false);
  const poolIdRef = useRef<string | undefined>(initialPoolId);

  // Sync step changes with URL shallowly
  const updateStep = (stepNumber: number) => {
    setCurrentStep(stepNumber);
    const paramVal = stepNumber === 6 ? "review" : stepNumber === 7 ? "success" : stepNumber.toString();
    router.replace(`/onboarding?step=${paramVal}`, { scroll: false });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /** POST /onboarding/pool. The first call creates the pool; later calls send its id. */
  const save = async (data: FullOnboardingData, submit: boolean) => {
    if (savingRef.current) return null;
    savingRef.current = true;
    setIsSaving(true);
    try {
      const res = await savePoolRegistration(data, { poolId: poolIdRef.current, submit });
      if (!res.success) {
        toast.error(errorMessage(res, "We couldn't save your details."));
        return null;
      }
      poolIdRef.current = res.data.pool._id;
      setPoolId(res.data.pool._id);
      return res.data;
    } finally {
      savingRef.current = false;
      setIsSaving(false);
    }
  };

  /** A step's "Next": keep the answers, save them as a draft, then move on. */
  const saveAndGo = async (patch: Partial<FullOnboardingData>, to: number) => {
    const merged = { ...onboardingData, ...patch };
    setOnboardingData(merged);
    if (await save(merged, false)) updateStep(to);
  };

  const handleConfirmReview = async () => {
    const saved = await save(onboardingData, true);
    if (!saved) return;
    setSubmitMessage(saved.message);
    updateStep(SUBMITTED_STEP);
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
            <span
              className={`inline-block size-1.5 rounded-full ${currentStep === SUBMITTED_STEP ? "bg-blue-500" : "bg-emerald-500"}`}
            />
            <span className={currentStep === SUBMITTED_STEP ? "text-blue-700" : "text-emerald-700"}>
              {currentStep === SUBMITTED_STEP ? "Under review" : "In Progress"}
            </span>
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
              isSaving={isSaving}
              onNext={(location) => saveAndGo({ location }, 2)}
            />
          )}

          {currentStep === 2 && (
            <Step2Specifications
              initialData={onboardingData.specifications}
              isSaving={isSaving}
              onNext={(specifications) => saveAndGo({ specifications }, 3)}
              onBack={() => updateStep(1)}
            />
          )}

          {currentStep === 3 && (
            <Step3Shape
              initialData={onboardingData.shape}
              isSaving={isSaving}
              onNext={(shape) => saveAndGo({ shape }, 4)}
              onBack={() => updateStep(2)}
            />
          )}

          {currentStep === 4 && (
            <Step4Photos
              initialData={onboardingData.photos}
              poolId={poolId}
              isSaving={isSaving}
              onNext={(photos) => saveAndGo({ photos }, 5)}
              onBack={() => updateStep(3)}
            />
          )}

          {currentStep === 5 && (
            <Step5Equipment
              initialData={onboardingData.equipment}
              isSaving={isSaving}
              onNext={(equipment) => saveAndGo({ equipment }, 6)}
              onBack={() => updateStep(4)}
            />
          )}

          {currentStep === 6 && (
            <StepReview
              data={onboardingData}
              onEditStep={(step) => updateStep(step)}
              onBack={() => updateStep(5)}
              onConfirm={handleConfirmReview}
              isSubmitting={isSaving}
            />
          )}

          {currentStep === SUBMITTED_STEP && <StepSuccess message={submitMessage} />}
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

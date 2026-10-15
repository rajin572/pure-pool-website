"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Edit2, CheckCircle2 } from "lucide-react";
import OnboardingActionRow from "./OnboardingActionRow";
import { FullOnboardingData } from "@/service/OnboardingService/OnboardingServiceApi";
import { AllImages } from "@/../public/images/AllImages";

interface StepReviewProps {
  data: FullOnboardingData;
  onEditStep: (stepNumber: number) => void;
  onBack: () => void;
  onConfirm: () => void;
}

export const StepReview: React.FC<StepReviewProps> = ({
  data,
  onEditStep,
  onBack,
  onConfirm,
}) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleConfirm = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onConfirm();
    }, 600);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8">
      {/* Step Header */}
      <div className="flex flex-col gap-1.5 text-center sm:text-left">
        <h2 className="text-zinc-900 text-3xl sm:text-4xl font-bold font-['Onest'] leading-tight">
          Does this look right?
        </h2>
        <p className="text-zinc-600 text-base sm:text-lg font-medium font-['Onest'] leading-relaxed">
          Please review your details before submitting. You can edit any section.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Location */}
        <div className="p-6 bg-white rounded-3xl outline outline-1 -outline-offset-1 outline-gray-200 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <span className="text-blue-600 text-base font-bold font-['Onest']">
              Pool Location
            </span>
            <button
              type="button"
              onClick={() => onEditStep(1)}
              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-semibold transition-colors cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          </div>

          <div className="flex flex-col gap-2.5 text-sm sm:text-base">
            <div className="flex justify-between py-1 border-b border-gray-50">
              <span className="text-zinc-500 font-medium">Address</span>
              <span className="text-zinc-900 font-semibold text-right max-w-xs truncate">
                {data.location.poolAddress || "Calle de las Acacias 14"}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-50">
              <span className="text-zinc-500 font-medium">Postal &amp; City</span>
              <span className="text-zinc-900 font-semibold text-right">
                {data.location.postalCode} {data.location.city}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-zinc-500 font-medium">Gate Code</span>
              <span className="text-zinc-900 font-semibold text-right">
                {data.location.gateCode || "None provided"}
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Pool Specifications */}
        <div className="p-6 bg-white rounded-3xl outline outline-1 -outline-offset-1 outline-gray-200 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <span className="text-blue-600 text-base font-bold font-['Onest']">
              Pool Specifications
            </span>
            <button
              type="button"
              onClick={() => onEditStep(2)}
              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-semibold transition-colors cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          </div>

          <div className="flex flex-col gap-2.5 text-sm sm:text-base">
            <div className="flex justify-between py-1 border-b border-gray-50">
              <span className="text-zinc-500 font-medium">Type</span>
              <span className="text-zinc-900 font-semibold capitalize">
                {data.specifications.poolType}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-50">
              <span className="text-zinc-500 font-medium">Approx. Volume</span>
              <span className="text-zinc-900 font-semibold">
                {data.specifications.approximateVolume || "55,000"} L
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-50">
              <span className="text-zinc-500 font-medium">Dimensions (LxWxD)</span>
              <span className="text-zinc-900 font-semibold">
                {data.specifications.lengthMeters || "10"}m &times;{" "}
                {data.specifications.widthMeters || "5"}m &times;{" "}
                {data.specifications.depthMeters || "1.8"}m
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-zinc-500 font-medium">Water Treatment</span>
              <span className="text-zinc-900 font-semibold capitalize">
                {data.specifications.waterTreatment}
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Shape & Features */}
        <div className="p-6 bg-white rounded-3xl outline outline-1 -outline-offset-1 outline-gray-200 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <span className="text-blue-600 text-base font-bold font-['Onest']">
              Shape &amp; Outline
            </span>
            <button
              type="button"
              onClick={() => onEditStep(3)}
              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-semibold transition-colors cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          </div>

          <div className="flex flex-col gap-2.5 text-sm sm:text-base">
            <div className="flex justify-between py-1 border-b border-gray-50">
              <span className="text-zinc-500 font-medium">Selected Outline</span>
              <span className="text-zinc-900 font-semibold capitalize">
                {data.shape.shape?.replace("_", " ") || "Rectangular"}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-50">
              <span className="text-zinc-500 font-medium">Finish Material</span>
              <span className="text-zinc-900 font-semibold capitalize">
                {data.specifications.surfaceFinish}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-zinc-500 font-medium">Special Features</span>
              <span className="text-zinc-900 font-semibold">
                Automatic Cover, LED Lighting
              </span>
            </div>
          </div>
        </div>

        {/* Card 4: Equipment & Photos */}
        <div className="p-6 bg-white rounded-3xl outline outline-1 -outline-offset-1 outline-gray-200 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <span className="text-blue-600 text-base font-bold font-['Onest']">
              Equipment &amp; Photos
            </span>
            <button
              type="button"
              onClick={() => onEditStep(4)}
              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-semibold transition-colors cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="relative size-14 rounded-xl overflow-hidden border border-gray-200">
                <Image
                  src={AllImages.pool1}
                  alt="Overview thumbnail"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative size-14 rounded-xl overflow-hidden border border-gray-200">
                <Image
                  src={AllImages.pool2}
                  alt="Equipment thumbnail"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-xs text-zinc-500 font-medium">
                2 site photos attached for technician
              </span>
            </div>

            <div className="text-xs sm:text-sm text-zinc-600 pt-1">
              <span className="font-semibold text-zinc-800">Installed equipment:</span> Variable-speed pump, glass media filter, Zodiac heat pump.
            </div>
          </div>
        </div>
      </div>

      {/* Technician Dispatch Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-blue-50 border border-blue-100 flex items-center gap-3.5">
        <CheckCircle2 className="w-6 h-6 text-blue-600 shrink-0" />
        <span className="text-sm sm:text-base text-zinc-700 font-medium">
          Upon submitting, your dedicated Madrid technician will be assigned to verify all equipment on your first visit.
        </span>
      </div>

      {/* Action Row */}
      <OnboardingActionRow
        onBack={onBack}
        nextType="button"
        onNext={handleConfirm}
        disabled={isSubmitting}
        isLoading={isSubmitting}
        loadingText="Setting up pool..."
        nextText="Confirm & Set Up Pool"
        nextButtonClassName="sm:w-64"
      />
    </div>
  );
};

export default StepReview;


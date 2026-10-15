"use client";

import React from "react";
import { Check } from "lucide-react";

export interface OnboardingStepperProps {
  currentStep: number; // 1 to 5, or 6 for review, 7 for success
  onStepClick?: (step: number) => void;
}

const STEPS = [
  { id: 1, name: "Location" },
  { id: 2, name: "Specifications" },
  { id: 3, name: "Shape" },
  { id: 4, name: "Photos" },
  { id: 5, name: "Equipment" },
];

export const OnboardingStepper: React.FC<OnboardingStepperProps> = ({
  currentStep,
  onStepClick,
}) => {
  return (
    <nav aria-label="Onboarding Progress" className="w-full max-w-3xl mx-auto mb-8 sm:mb-12 px-2">
      <div className="flex items-center justify-between gap-1.5 sm:gap-3">
        {STEPS.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          const isUpcoming = currentStep < step.id;

          return (
            <React.Fragment key={step.id}>
              {/* Step indicator button */}
              <button
                type="button"
                disabled={isUpcoming}
                onClick={() => onStepClick && isCompleted && onStepClick(step.id)}
                className={`flex items-center gap-1.5 sm:gap-2.5 transition-all text-left ${isCompleted
                  ? "cursor-pointer group"
                  : isCurrent
                    ? "cursor-default"
                    : "cursor-not-allowed opacity-60"
                  }`}
              >
                {/* Circle Badge */}
                <div
                  className={`size-7 sm:size-8 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${isCompleted
                    ? "bg-blue-600 text-white"
                    : isCurrent
                      ? "bg-blue-600 text-white shadow-sm ring-4 ring-blue-100"
                      : "bg-white text-zinc-400 outline outline-1 -outline-offset-1 outline-gray-200"
                    }`}
                >
                  {isCompleted ? (
                    <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
                  ) : (
                    <span className="text-xs sm:text-sm font-bold font-['Onest']">
                      {step.id}
                    </span>
                  )}
                </div>

                {/* Step Name */}
                <span
                  className={`hidden md:inline-block text-xs sm:text-sm font-['Onest'] transition-colors ${isCurrent
                    ? "text-zinc-900 font-bold"
                    : isCompleted
                      ? "text-blue-600 font-semibold group-hover:text-blue-700"
                      : "text-zinc-400 font-medium"
                    }`}
                >
                  {step.name}
                </span>
              </button>

              {/* Connecting Bar */}
              {index < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-0.5 rounded-[1px] transition-colors ${currentStep > step.id ? "bg-blue-600" : "bg-gray-200"
                    }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </nav>
  );
};

export default OnboardingStepper;


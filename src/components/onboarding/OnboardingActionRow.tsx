"use client";

import React from "react";
import ReusableGradientButton from "@/components/ui/CustomUi/ReusableGradientButton";

export interface OnboardingActionRowProps {
  showBackButton?: boolean;
  onBack?: () => void;
  backText?: string;
  isRegReq?: boolean;
  nextText?: string;
  nextType?: "submit" | "button";
  onNext?: () => void;
  isLoading?: boolean;
  loadingText?: string;
  disabled?: boolean;
  className?: string;
  nextButtonClassName?: string;
}

export const OnboardingActionRow: React.FC<OnboardingActionRowProps> = ({
  showBackButton = true,
  onBack,
  backText = "Back",
  isRegReq = false,
  nextText,
  nextType = "submit",
  onNext,
  isLoading = false,
  loadingText,
  disabled = false,
  className = "",
  nextButtonClassName = "",
}) => {
  const resolvedNextText =
    nextText || (isRegReq ? "Review Registration" : "Continue");

  return (
    <div
      className={`pt-6 border-t border-gray-100 flex items-center gap-4 ${
        showBackButton ? "justify-between" : "justify-end"
      } ${className}`}
    >
      {showBackButton && (
        <button
          type="button"
          onClick={onBack}
          className="px-8 py-3.5 bg-white rounded-2xl outline outline-1 -outline-offset-1 outline-gray-200 hover:bg-gray-50 text-zinc-900 text-base sm:text-lg font-bold transition-colors cursor-pointer"
        >
          {backText}
        </button>
      )}

      <ReusableGradientButton
        type={nextType}
        onClick={onNext}
        disabled={disabled || isLoading}
        className={`w-full sm:w-auto min-w-[192px] px-8 h-14 rounded-2xl text-base sm:text-lg font-bold shadow-md cursor-pointer disabled:opacity-50 ${nextButtonClassName}`}
      >
        {isLoading && loadingText ? loadingText : resolvedNextText}
      </ReusableGradientButton>
    </div>
  );
};

export default OnboardingActionRow;
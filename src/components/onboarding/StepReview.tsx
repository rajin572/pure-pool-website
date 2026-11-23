"use client";

import React from "react";
import { Edit2, CheckCircle2 } from "lucide-react";
import OnboardingActionRow from "./OnboardingActionRow";
import { resolveImageUrl } from "@/helpers/config/envConfig";
import { FullOnboardingData, parseLitres } from "@/service/OnboardingService/OnboardingServiceApi";

const NOT_PROVIDED = "Not provided";

/** "heat_pump" -> "heat pump", "unknown" -> "Not sure". */
const pretty = (value?: string) =>
  !value ? NOT_PROVIDED : value === "unknown" ? "Not sure" : value.replace(/_/g, " ");

/** The equipment the customer ticked, in plain words. */
const equipmentSummary = (e: FullOnboardingData["equipment"]) =>
  [
    e.hasSaltChlorinator ? "Saltwater chlorinator" : "",
    e.hasHeatPump ? "Heat pump / heater" : "",
    e.hasAutoCover ? "Automatic safety cover" : "",
    e.hasCleanerRobot ? "Robotic vacuum" : "",
  ].filter(Boolean);

interface StepReviewProps {
  data: FullOnboardingData;
  onEditStep: (stepNumber: number) => void;
  onBack: () => void;
  /** Saves with `submit: true` (the parent shows errors and moves to the next screen). */
  onConfirm: () => void | Promise<void>;
  isSubmitting?: boolean;
}

export const StepReview: React.FC<StepReviewProps> = ({
  data,
  onEditStep,
  onBack,
  onConfirm,
  isSubmitting = false,
}) => {
  const photos = data.photos.urls;
  const equipment = equipmentSummary(data.equipment);
  const { lengthMeters, widthMeters, depthMeters } = data.specifications;
  const hasDimensions = !!(lengthMeters || widthMeters || depthMeters);
  const litres = parseLitres(data.specifications.approximateVolume);

  const handleConfirm = () => {
    void onConfirm();
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
                {data.location.poolAddress || NOT_PROVIDED}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-50">
              <span className="text-zinc-500 font-medium">Postal &amp; City</span>
              <span className="text-zinc-900 font-semibold text-right">
                {[data.location.postalCode, data.location.city].filter(Boolean).join(" ") || NOT_PROVIDED}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-zinc-500 font-medium">Gate Code</span>
              <span className="text-zinc-900 font-semibold text-right">
                {data.location.gateCode || NOT_PROVIDED}
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
                {pretty(data.specifications.poolType)}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-50">
              <span className="text-zinc-500 font-medium">Approx. Volume</span>
              <span className="text-zinc-900 font-semibold">
                {litres ? `${litres.toLocaleString("en-GB")} L` : NOT_PROVIDED}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-50">
              <span className="text-zinc-500 font-medium">Dimensions (LxWxD)</span>
              <span className="text-zinc-900 font-semibold">
                {hasDimensions
                  ? `${lengthMeters || "?"} × ${widthMeters || "?"} × ${depthMeters || "?"} m`
                  : NOT_PROVIDED}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-zinc-500 font-medium">Water Treatment</span>
              <span className="text-zinc-900 font-semibold capitalize">
                {pretty(data.specifications.waterTreatment)}
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
                {pretty(data.shape.shape)}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-zinc-500 font-medium">Finish Material</span>
              <span className="text-zinc-900 font-semibold capitalize">
                {pretty(data.specifications.surfaceFinish)}
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
              {photos.map((src, i) => (
                <div key={src} className="relative size-14 rounded-xl overflow-hidden border border-gray-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={resolveImageUrl(src)} alt={`Pool photo ${i + 1}`} className="size-full object-cover" />
                </div>
              ))}
              <span className="text-xs text-zinc-500 font-medium">
                {photos.length
                  ? `${photos.length} site photo${photos.length > 1 ? "s" : ""} attached for technician`
                  : "No photos added"}
              </span>
            </div>

            <div className="text-xs sm:text-sm text-zinc-600 pt-1">
              <span className="font-semibold text-zinc-800">Installed equipment:</span>{" "}
              {equipment.length ? `${equipment.join(", ")}.` : NOT_PROVIDED}
            </div>
            {data.equipment.notes && (
              <div className="text-xs sm:text-sm text-zinc-600 whitespace-pre-line">
                <span className="font-semibold text-zinc-800">Notes:</span> {data.equipment.notes}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Technician Dispatch Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-blue-50 border border-blue-100 flex items-center gap-3.5">
        <CheckCircle2 className="w-6 h-6 text-blue-600 shrink-0" />
        <span className="text-sm sm:text-base text-zinc-700 font-medium">
          Once you submit, our team reviews your details and emails you as soon as your account is active.
        </span>
      </div>

      {/* Action Row */}
      <OnboardingActionRow
        onBack={onBack}
        nextType="button"
        onNext={handleConfirm}
        disabled={isSubmitting}
        isLoading={isSubmitting}
        loadingText="Submitting..."
        nextText="Submit for review"
        nextButtonClassName="sm:w-64"
      />
    </div>
  );
};

export default StepReview;


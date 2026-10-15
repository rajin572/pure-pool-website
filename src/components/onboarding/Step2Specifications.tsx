"use client";

import React from "react";
import { useForm, useWatch } from "react-hook-form";
import {
  ReuseableForm,
  FormInput,
} from "@/components/ui/CustomUi/ReuseForm/Form";
import { OnboardingSpecificationsData } from "@/service/OnboardingService/OnboardingServiceApi";
import OnboardingActionRow from "./OnboardingActionRow";

interface Step2SpecificationsProps {
  initialData: OnboardingSpecificationsData;
  onNext: (data: OnboardingSpecificationsData) => void;
  onBack: () => void;
}

const poolTypeOptions: Array<{ id: OnboardingSpecificationsData["poolType"]; label: string }> = [
  { id: "residential", label: "Residential" },
  { id: "commercial", label: "Commercial" },
  { id: "unknown", label: "I don't know" },
];

const waterTreatmentOptions: Array<{ id: OnboardingSpecificationsData["waterTreatment"]; label: string }> = [
  { id: "saltwater", label: "Saltwater" },
  { id: "chlorine", label: "Chlorine" },
  { id: "unknown", label: "I don't know" },
  { id: "other", label: "Other" },
];

const surfaceFinishOptions: Array<{ id: OnboardingSpecificationsData["surfaceFinish"]; label: string }> = [
  { id: "tile", label: "Tile (Gresite)" },
  { id: "liner", label: "Liner / Vinyl" },
  { id: "polyester", label: "Polyester / Fibreglass" },
  { id: "unknown", label: "I don't know" },
  { id: "other", label: "Other" },
];

export const Step2Specifications: React.FC<Step2SpecificationsProps> = ({
  initialData,
  onNext,
  onBack,
}) => {
  const form = useForm<OnboardingSpecificationsData>({
    defaultValues: initialData,
  });

  const poolType = useWatch({ control: form.control, name: "poolType" });
  const waterTreatment = useWatch({ control: form.control, name: "waterTreatment" });
  const surfaceFinish = useWatch({ control: form.control, name: "surfaceFinish" });

  const onSubmit = (data: OnboardingSpecificationsData) => {
    onNext(data);
  };

  return (
    <div className="w-full bg-white rounded-3xl p-6 sm:p-10 shadow-lg border border-gray-100 flex flex-col gap-8">
      {/* Step Header */}
      <div className="flex flex-col gap-1.5">
        <h2 className="text-zinc-900 text-2xl sm:text-3xl font-bold font-['Onest'] leading-tight">
          Pool specifications
        </h2>
        <p className="text-zinc-600 text-base font-medium font-['Onest'] leading-relaxed">
          Tell us about the pool itself — skip anything you&apos;re unsure of.
        </p>
      </div>

      <ReuseableForm form={form} onSubmit={onSubmit} className="flex flex-col gap-8">
        {/* Pool Type */}
        <div className="flex flex-col gap-2.5">
          <label className="text-zinc-900 text-base font-semibold font-['Onest']">
            Pool Type
          </label>
          <div className="flex flex-wrap items-center gap-3">
            {poolTypeOptions.map((option) => {
              const isSelected = poolType === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => form.setValue("poolType", option.id)}
                  className={`px-6 py-3.5 rounded-xl text-base font-semibold transition-all cursor-pointer select-none ${isSelected
                    ? "bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-sm ring-2 ring-sky-300"
                    : "bg-white text-zinc-800 outline outline-1 -outline-offset-1 outline-gray-200 hover:bg-gray-50"
                    }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Volume & Dimensions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            control={form.control}
            name="approximateVolume"
            label="Approximate Volume"
            placeholder="e.g. 55,000 litres"
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-zinc-900 text-base font-semibold font-['Onest']">
              Dimensions (metres)
            </label>
            <div className="grid grid-cols-3 gap-3">
              <FormInput
                control={form.control}
                name="lengthMeters"
                placeholder="L (m)"
              />
              <FormInput
                control={form.control}
                name="widthMeters"
                placeholder="W (m)"
              />
              <FormInput
                control={form.control}
                name="depthMeters"
                placeholder="D (m)"
              />
            </div>
          </div>
        </div>

        {/* Water Treatment */}
        <div className="flex flex-col gap-2.5">
          <label className="text-zinc-900 text-base font-semibold font-['Onest']">
            Water Treatment
          </label>
          <div className="flex flex-wrap items-center gap-3">
            {waterTreatmentOptions.map((option) => {
              const isSelected = waterTreatment === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => form.setValue("waterTreatment", option.id)}
                  className={`px-6 py-3.5 rounded-xl text-base font-semibold transition-all cursor-pointer select-none ${isSelected
                    ? "bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-sm ring-2 ring-sky-300"
                    : "bg-white text-zinc-800 outline outline-1 -outline-offset-1 outline-gray-200 hover:bg-gray-50"
                    }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Surface Finish */}
        <div className="flex flex-col gap-2.5">
          <label className="text-zinc-900 text-base font-semibold font-['Onest']">
            Surface Finish
          </label>
          <div className="flex flex-wrap items-center gap-3">
            {surfaceFinishOptions.map((option) => {
              const isSelected = surfaceFinish === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => form.setValue("surfaceFinish", option.id)}
                  className={`px-6 py-3.5 rounded-xl text-base font-semibold transition-all cursor-pointer select-none ${isSelected
                    ? "bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-sm ring-2 ring-sky-300"
                    : "bg-white text-zinc-800 outline outline-1 -outline-offset-1 outline-gray-200 hover:bg-gray-50"
                    }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Row */}
        <OnboardingActionRow onBack={onBack} />
      </ReuseableForm>
    </div>
  );
};

export default Step2Specifications;


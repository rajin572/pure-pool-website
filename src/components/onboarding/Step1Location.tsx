"use client";

import React from "react";
import { useForm } from "react-hook-form";
import {
  ReuseableForm,
  FormInput,
  FormTextarea,
} from "@/components/ui/CustomUi/ReuseForm/Form";
import OnboardingActionRow from "./OnboardingActionRow";
import { OnboardingLocationData } from "@/service/OnboardingService/OnboardingServiceApi";

interface Step1LocationProps {
  initialData: OnboardingLocationData;
  onNext: (data: OnboardingLocationData) => void;
}

export const Step1Location: React.FC<Step1LocationProps> = ({
  initialData,
  onNext,
}) => {
  const form = useForm<OnboardingLocationData>({
    defaultValues: initialData,
  });

  const onSubmit = (data: OnboardingLocationData) => {
    onNext(data);
  };

  return (
    <div className="w-full bg-white rounded-3xl p-6 sm:p-10 shadow-lg border border-gray-100 flex flex-col gap-8">
      {/* Step Header */}
      <div className="flex flex-col gap-1.5">
        <h2 className="text-zinc-900 text-2xl sm:text-3xl font-bold font-['Onest'] leading-tight">
          Pool location
        </h2>
        <p className="text-zinc-600 text-base font-medium font-['Onest'] leading-relaxed">
          Where is the pool we&apos;ll be looking after?
        </p>
      </div>

      {/* Form */}
      <ReuseableForm form={form} onSubmit={onSubmit} className="flex flex-col gap-6">
        {/* Pool Address */}
        <FormInput
          control={form.control}
          name="poolAddress"
          label="Pool Address"
          placeholder="Calle de las Acacias 14, Chalet B"
        />

        {/* Postal & City */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput
            control={form.control}
            name="postalCode"
            label="Postal Code"
            placeholder="28223"
          />
          <FormInput
            control={form.control}
            name="city"
            label="City / Province"
            placeholder="Pozuelo de Alarcón, Madrid"
          />
        </div>

        {/* Gate Code */}
        <FormInput
          control={form.control}
          name="gateCode"
          label="Gate Code / Entry Instructions"
          placeholder="e.g. Side gate code is 4920, or ring bell at intercom"
        />

        {/* Notes */}
        <FormTextarea
          control={form.control}
          name="accessNotes"
          label="Access Notes for Your Certified Technician"
          placeholder="e.g. The water meter and pump room are around the back garden. Dog will be kept inside on visit days."
          rows={3}
        />

        {/* Action Row */}
        <OnboardingActionRow showBackButton={false} />
      </ReuseableForm>
    </div>
  );
};

export default Step1Location;


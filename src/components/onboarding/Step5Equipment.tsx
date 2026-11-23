"use client";

import React from "react";
import { useForm } from "react-hook-form";
import {
  ReuseableForm,
  FormTextarea,
  FormCheckbox,
} from "@/components/ui/CustomUi/ReuseForm/Form";
import OnboardingActionRow from "./OnboardingActionRow";
import { OnboardingEquipmentData } from "@/service/OnboardingService/OnboardingServiceApi";

interface Step5EquipmentProps {
  initialData: OnboardingEquipmentData;
  onNext: (data: OnboardingEquipmentData) => void;
  onBack: () => void;
  isSaving?: boolean;
}

export const Step5Equipment: React.FC<Step5EquipmentProps> = ({
  initialData,
  onNext,
  onBack,
  isSaving = false,
}) => {
  const form = useForm<OnboardingEquipmentData>({ defaultValues: initialData });

  const onSubmit = (values: OnboardingEquipmentData) => {
    onNext({ ...values, notes: values.notes.trim() });
  };

  return (
    <div className="w-full bg-white rounded-3xl p-6 sm:p-10 shadow-lg border border-gray-100 flex flex-col gap-8">
      {/* Step Header */}
      <div className="flex flex-col gap-1.5">
        <h2 className="text-zinc-900 text-2xl sm:text-3xl font-bold font-['Onest'] leading-tight">
          Equipment notes
        </h2>
        <p className="text-zinc-600 text-base font-medium font-['Onest'] leading-relaxed">
          Any known pump models, filter types, heating systems, or chlorinator details.
        </p>
      </div>

      <ReuseableForm form={form} onSubmit={onSubmit} className="flex flex-col gap-6">
        {/* Equipment Notes Textarea */}
        <FormTextarea
          control={form.control}
          name="notes"
          label="Equipment details (optional)"
          placeholder="e.g. AstralPool 1HP pump, sand filter, electric heat pump, automatic pool cover…"
          rows={5}
        />

        {/* Quick Checkbox Chips */}
        <div className="flex flex-col gap-3 pt-2">
          <span className="text-sm font-semibold text-zinc-700">Quick equipment checklist:</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="p-3.5 rounded-xl border border-gray-200 hover:border-blue-300 transition-colors bg-gray-50/50">
              <FormCheckbox
                control={form.control}
                name="hasSaltChlorinator"
                label="Saltwater chlorinator installed"
              />
            </div>
            <div className="p-3.5 rounded-xl border border-gray-200 hover:border-blue-300 transition-colors bg-gray-50/50">
              <FormCheckbox
                control={form.control}
                name="hasHeatPump"
                label="Heat pump / pool heater installed"
              />
            </div>
            <div className="p-3.5 rounded-xl border border-gray-200 hover:border-blue-300 transition-colors bg-gray-50/50">
              <FormCheckbox
                control={form.control}
                name="hasAutoCover"
                label="Automatic safety roller cover"
              />
            </div>
            <div className="p-3.5 rounded-xl border border-gray-200 hover:border-blue-300 transition-colors bg-gray-50/50">
              <FormCheckbox
                control={form.control}
                name="hasCleanerRobot"
                label="Robotic pool vacuum present"
              />
            </div>
          </div>
        </div>

        {/* Action Row */}
        <OnboardingActionRow
          onBack={onBack}
          isRegReq
          isLoading={isSaving}
          loadingText="Saving..."
          nextButtonClassName="sm:w-60"
        />
      </ReuseableForm>
    </div>
  );
};

export default Step5Equipment;


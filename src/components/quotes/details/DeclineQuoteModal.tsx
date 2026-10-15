"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import ReusableModal from "@/components/ui/CustomUi/ReuseableModal";
import ReuseableForm from "@/components/ui/CustomUi/ReuseForm/ReuseableForm";
import { FormTextarea } from "@/components/ui/CustomUi/ReuseForm/Form";

interface DeclineFormValues {
  reason: string;
  notes?: string;
}

interface DeclineQuoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  validUntil?: string;
  onConfirmDecline: (reason: string, notes?: string) => void;
}

const REASONS = [
  "Too expensive",
  "I'm getting another quote",
  "Not needed right now",
  "I'd like to discuss it first",
  "Other",
];

export const DeclineQuoteModal: React.FC<DeclineQuoteModalProps> = ({
  open,
  onOpenChange,
  validUntil = "26 May",
  onConfirmDecline,
}) => {
  const [selectedReason, setSelectedReason] = useState<string>(
    "I'm getting another quote"
  );

  const methods = useForm<DeclineFormValues>({
    defaultValues: {
      reason: "I'm getting another quote",
      notes: "",
    },
  });

  const handleSubmit = (data: DeclineFormValues) => {
    onConfirmDecline(selectedReason, data.notes);
    onOpenChange(false);
  };

  return (
    <ReusableModal
      open={open}
      onOpenChange={onOpenChange}
      maxWidth="sm:max-w-[540px]"
      contentClassName="p-6 sm:p-8 rounded-3xl"
      showCloseButton={false}
      showXCloseButton={true}
    >
      <div className="w-full flex flex-col gap-6">
        {/* Header matching Figma */}
        <div className="w-full flex flex-col gap-2">
          <h2 className="text-zinc-900 text-2xl font-bold font-['Onest'] leading-8">
            Decline this quote?
          </h2>
          <p className="text-zinc-600 text-sm sm:text-base font-medium leading-relaxed">
            Let us know why — it helps us quote better next time. You can reopen
            this quote until {validUntil}.
          </p>
        </div>

        {/* Reason Radio Options matching Figma */}
        <div className="w-full flex flex-col gap-2.5">
          {REASONS.map((reason) => {
            const isSelected = selectedReason === reason;
            return (
              <button
                key={reason}
                type="button"
                onClick={() => setSelectedReason(reason)}
                className={`w-full px-4 py-3.5 rounded-2xl transition-all flex items-center gap-3 text-left cursor-pointer ${
                  isSelected
                    ? "bg-sky-50 border-[1.5px] border-blue-600 text-blue-600 font-semibold shadow-2xs"
                    : "bg-white border border-gray-200 text-zinc-900 font-medium hover:bg-gray-50/70"
                }`}
              >
                {/* Custom Radio Icon */}
                <div
                  className={`size-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                    isSelected ? "border-blue-600" : "border-gray-300"
                  }`}
                >
                  {isSelected && (
                    <div className="size-2.5 rounded-full bg-blue-600" />
                  )}
                </div>

                <span className="text-sm sm:text-base">{reason}</span>
              </button>
            );
          })}
        </div>

        {/* Form using ReuseableForm and FormTextarea */}
        <ReuseableForm<DeclineFormValues>
          form={methods}
          onSubmit={handleSubmit}
        >
          <div className="w-full flex flex-col gap-6">
            <div className="w-full flex flex-col gap-1.5">
              <label className="text-zinc-900 text-sm sm:text-base font-semibold leading-5">
                Anything else? (optional)
              </label>
              <FormTextarea
                control={methods.control}
                name="notes"
                placeholder="Tell us a bit more…"
                rows={3}
                inputClassName="bg-white! border-gray-200! rounded-2xl! placeholder:text-zinc-400! text-zinc-900! text-sm sm:text-base! focus:border-blue-500!"
              />
            </div>

            {/* Action Buttons matching Figma */}
            <div className="w-full flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="px-5 sm:px-6 py-3.5 bg-white border border-gray-200 hover:bg-gray-50 active:scale-[0.99] text-zinc-900 text-sm sm:text-base font-bold rounded-2xl transition-all cursor-pointer"
              >
                Keep it for now
              </button>
              <button
                type="submit"
                className="px-6 sm:px-7 py-3.5 bg-red-600 hover:bg-red-700 active:scale-[0.99] text-white text-sm sm:text-base font-bold rounded-2xl shadow-sm transition-all cursor-pointer"
              >
                Decline quote
              </button>
            </div>
          </div>
        </ReuseableForm>
      </div>
    </ReusableModal>
  );
};

export default DeclineQuoteModal;

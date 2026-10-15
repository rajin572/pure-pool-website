"use client";

import React from "react";
import { Control } from "react-hook-form";
import { ChevronDown } from "lucide-react";
import { FormInput, FormTextarea } from "@/components/ui/CustomUi/ReuseForm/Form";
import { IPoolSettings } from "@/service/PoolSettingsService/PoolSettingsServiceApi";

export interface LocationAccessCardProps {
  control: Control<IPoolSettings>;
}

export const LocationAccessCard: React.FC<LocationAccessCardProps> = ({
  control,
}) => {
  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200/90 shadow-xs space-y-5">
      <h3 className="text-lg font-bold text-zinc-900 font-['Onest'] leading-6">
        Location &amp; access
      </h3>

      <div className="space-y-4">
        {/* Pool Address */}
        <div>
          <FormInput
            control={control}
            name="address"
            label="Pool Address"
            placeholder="Enter street address"
            inputClassName="bg-white! border-gray-200! focus:border-[#0284C7]! text-zinc-900! text-sm sm:text-base! font-medium! font-['Onest']! py-3.5! rounded-2xl!"
          />
        </div>

        {/* City and Postal Code */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <FormInput
              control={control}
              name="city"
              label="City"
              placeholder="Enter city"
              suffix={<ChevronDown className="size-4.5 text-zinc-400 pointer-events-none" />}
              inputClassName="bg-white! border-gray-200! focus:border-[#0284C7]! text-zinc-900! text-sm sm:text-base! font-medium! font-['Onest']! py-3.5! rounded-2xl!"
            />
          </div>

          <div>
            <FormInput
              control={control}
              name="postalCode"
              label="Postal Code"
              placeholder="e.g. 29602"
              inputClassName="bg-white! border-gray-200! focus:border-[#0284C7]! text-zinc-900! text-sm sm:text-base! font-medium! font-['Onest']! py-3.5! rounded-2xl!"
            />
          </div>
        </div>

        {/* Access instructions */}
        <div>
          <FormTextarea
            control={control}
            name="accessInstructions"
            label="Access instructions"
            placeholder="Gate codes, lockbox locations, pets or special instructions for the technician..."
            rows={3}
            inputClassName="bg-white! border-gray-200! focus:border-[#0284C7]! text-zinc-900! text-sm sm:text-base! font-medium! font-['Onest']! p-3.5! rounded-2xl! min-h-[96px] leading-relaxed!"
          />
        </div>
      </div>
    </div>
  );
};

export default LocationAccessCard;

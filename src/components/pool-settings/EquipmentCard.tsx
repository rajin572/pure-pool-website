"use client";

import React from "react";
import { Control } from "react-hook-form";
import { FormTextarea } from "@/components/ui/CustomUi/ReuseForm/Form";
import { IPoolSettings } from "@/service/PoolSettingsService/PoolSettingsServiceApi";

export interface EquipmentCardProps {
  control: Control<IPoolSettings>;
}

export const EquipmentCard: React.FC<EquipmentCardProps> = ({ control }) => {
  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200/90 shadow-xs space-y-5">
      <h3 className="text-lg font-bold text-zinc-900 font-['Onest'] leading-6">
        Equipment
      </h3>

      <div className="space-y-4">
        <div>
          <FormTextarea
            control={control}
            name="equipmentNotes"
            label="Equipment notes"
            placeholder="Details about pumps, filtration, chlorinators, heaters, cleaners, etc."
            rows={3}
            inputClassName="bg-white! border-gray-200! focus:border-[#0284C7]! text-zinc-900! text-sm sm:text-base! font-medium! font-['Onest']! p-3.5! rounded-2xl! min-h-[96px] leading-relaxed!"
          />
        </div>
      </div>
    </div>
  );
};

export default EquipmentCard;

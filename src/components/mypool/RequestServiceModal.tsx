"use client";

import React from "react";
import { useForm } from "react-hook-form";
import ReusableModal from "@/components/ui/CustomUi/ReuseableModal";
import ReuseableForm from "@/components/ui/CustomUi/ReuseForm/ReuseableForm";
import {
  FormInput,
  FormSelect,
  FormDatePicker,
  FormTimePicker,
  FormTextarea,
} from "@/components/ui/CustomUi/ReuseForm/Form";
import { Button } from "@/components/ui/button";

import { SelectItem } from "@/components/ui/select";

interface RequestServiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultServiceTitle?: string;
}

interface ServiceFormValues {
  serviceTitle: string;
  serviceCategory: string;
  preferredDate: Date;
  preferredTime: Date | undefined;
  notes: string;
}

const SERVICE_CATEGORIES = [
  { label: "Heat Pump & Heating Inspection", value: "heat_pump" },
  { label: "Filter Sand / Glass Replacement", value: "filter_media" },
  { label: "Salt Cell Cleaning / Diagnostic", value: "salt_chlorinator" },
  { label: "Lighting & Electrical Repair", value: "lighting" },
  { label: "Emergency Chemical Shock Treatment", value: "emergency_shock" },
];

export const RequestServiceModal: React.FC<RequestServiceModalProps> = ({
  open,
  onOpenChange,
  defaultServiceTitle = "Heat pump inspection before summer peak season",
}) => {
  const form = useForm<ServiceFormValues>({
    defaultValues: {
      serviceTitle: defaultServiceTitle,
      serviceCategory: "heat_pump",
      preferredDate: new Date(),
      preferredTime: new Date(),
      notes: "",
    },
  });

  const handleSubmit = (data: ServiceFormValues) => {
    // Design phase only — as requested, ready for RTK Query mutation when backend is wired
    console.log("Service Request Submitted:", data);
    alert("Service request logged! When backend is wired, RTK Query mutation triggers here.");
    onOpenChange(false);
  };

  return (
    <ReusableModal
      open={open}
      onOpenChange={onOpenChange}
      title="Request Maintenance Service"
      description="Book a certified technician visit for specialized repairs or routine equipment checks."
      maxWidth="sm:max-w-xl md:max-w-2xl"
    >
      <ReuseableForm
        form={form}
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 mt-2"
      >
        <FormInput
          control={form.control}
          name="serviceTitle"
          label="Service Title / Description"
          placeholder="e.g. Heat pump diagnostic check"
        />

        <FormSelect
          control={form.control}
          name="serviceCategory"
          label="Service Category"
          placeholder="Select a category"
        >
          {SERVICE_CATEGORIES.map((cat) => (
            <SelectItem key={cat.value} value={cat.value}>
              {cat.label}
            </SelectItem>
          ))}
        </FormSelect>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormDatePicker
            control={form.control}
            name="preferredDate"
            label="Preferred Visit Date"
            placeholder="Select date"
          />

          <FormTimePicker
            control={form.control}
            name="preferredTime"
            label="Preferred Time Window"
            placeholder="e.g. 10:00"
          />
        </div>

        <FormTextarea
          control={form.control}
          name="notes"
          label="Special Instructions / Access Notes"
          placeholder="Enter gate codes, equipment location details, or specific symptoms..."
          rows={3}
        />

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 mt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="submit" className="bg-sky-600 hover:bg-sky-700 text-white font-semibold">
            Submit Request
          </Button>
        </div>
      </ReuseableForm>
    </ReusableModal>
  );
};

export default RequestServiceModal;

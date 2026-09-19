"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import ReusableModal from "@/components/ui/CustomUi/ReuseableModal";
import ReuseableForm from "@/components/ui/CustomUi/ReuseForm/ReuseableForm";
import { FormSelect, FormTextarea } from "@/components/ui/CustomUi/ReuseForm/Form";
import { SelectItem } from "@/components/ui/select";
import ReusableGradientButton from "@/components/ui/CustomUi/ReusableGradientButton";
import {
  ServiceCategory,
  UrgencyLevel,
  createServiceRequest,
} from "@/service/ServiceRequestService/ServiceRequestServiceApi";
import {
  Wrench,
  Droplets,
  Sparkles,
  AlertTriangle,
  HelpCircle,
  UploadCloud,
  CheckCircle2,
} from "lucide-react";

interface RequestServiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultServiceTitle?: string;
  defaultCategory?: ServiceCategory;
  onRequestCreated?: () => void;
}

interface ServiceFormValues {
  poolName: string;
  category: ServiceCategory;
  urgency: UrgencyLevel;
  description: string;
}

const ISSUE_OPTIONS: {
  id: ServiceCategory;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
    {
      id: "equipment_breakdown",
      title: "Equipment breakdown",
      description: "Pump not priming, strange noise, chlorinator error code",
      icon: Wrench,
    },
    {
      id: "water_quality",
      title: "Water quality issue",
      description: "Cloudy, green tint, foaming, chlorine smell",
      icon: Droplets,
    },
    {
      id: "special_cleaning",
      title: "Special cleaning / pre-event",
      description: "Extra vacuuming, party prep, post-storm leaf removal",
      icon: Sparkles,
    },
    {
      id: "emergency_leak",
      title: "Emergency leak or flood",
      description: "Pipe burst, rapid water loss, electrical spark",
      icon: AlertTriangle,
    },
    {
      id: "general_inquiry",
      title: "General inquiry / inspection",
      description: "Seasonal winterize, automation setup, heating check",
      icon: HelpCircle,
    },
  ];

export const RequestServiceModal: React.FC<RequestServiceModalProps> = ({
  open,
  onOpenChange,
  defaultCategory = "equipment_breakdown",
  onRequestCreated,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>(defaultCategory);
  const [selectedUrgency, setSelectedUrgency] = useState<UrgencyLevel>("Normal");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<ServiceFormValues>({
    defaultValues: {
      poolName: "Main Residence Pool",
      category: defaultCategory,
      urgency: "Normal",
      description: "",
    },
  });

  const handleSubmit = async (data: ServiceFormValues) => {
    setIsSubmitting(true);
    try {
      const res = await createServiceRequest({
        poolName: data.poolName || "Main Residence Pool",
        category: selectedCategory,
        urgency: selectedUrgency,
        description: data.description,
      });

      if (res.success) {
        setIsSubmitted(true);
        setTimeout(() => {
          setIsSubmitted(false);
          setIsSubmitting(false);
          onOpenChange(false);
          if (onRequestCreated) onRequestCreated();
        }, 1500);
      } else {
        setIsSubmitting(false);
      }
    } catch {
      setIsSubmitting(false);
    }
  };

  return (
    <ReusableModal
      open={open}
      onOpenChange={onOpenChange}
      title="Request Service or Report an Issue"
      description="Our Madrid certified technician team will review and assign a specialist within 2 hours"
      maxWidth="sm:max-w-2xl md:max-w-3xl"
    >
      <ReuseableForm
        form={form}
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 text-gray-900 pb-2"
      >
        {/* Pool Selector */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-gray-900">Select Pool</label>
          <FormSelect
            control={form.control}
            name="poolName"
            placeholder="Select Pool"
          >
            <SelectItem value="Main Residence Pool">Main Residence Pool (Alcalá 125)</SelectItem>
            <SelectItem value="Garden Pool">Garden Pool</SelectItem>
            <SelectItem value="Paseo de la Habana Pool">Paseo de la Habana Pool</SelectItem>
          </FormSelect>
        </div>

        {/* Issue Type Selector Cards */}
        <div className="flex flex-col gap-3">
          <label className="text-sm font-bold text-gray-900">
            What type of issue are you experiencing?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ISSUE_OPTIONS.map((opt) => {
              const isSelected = selectedCategory === opt.id;
              const Icon = opt.icon;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(opt.id);
                    form.setValue("category", opt.id);
                  }}
                  className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all duration-200 cursor-pointer ${isSelected
                      ? "bg-sky-50/80 border-sky-500 ring-2 ring-sky-500/20"
                      : "bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50/50"
                    } ${opt.id === "general_inquiry" ? "sm:col-span-2" : ""}`}
                >
                  <div
                    className={`p-2 rounded-lg shrink-0 mt-0.5 ${isSelected ? "bg-sky-600 text-white" : "bg-gray-100 text-gray-600"
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-900">{opt.title}</span>
                    <span className="text-xs text-gray-500 mt-0.5 leading-snug">
                      {opt.description}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Urgency Level Selector */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-gray-900">Urgency</label>
          <div className="grid grid-cols-3 gap-3 p-1 bg-gray-100 rounded-xl border border-gray-200">
            {(["Normal", "High", "Urgent"] as const).map((urgency) => {
              const isSelected = selectedUrgency === urgency;
              return (
                <button
                  key={urgency}
                  type="button"
                  onClick={() => {
                    setSelectedUrgency(urgency);
                    form.setValue("urgency", urgency);
                  }}
                  className={`py-2 rounded-lg text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${isSelected
                      ? urgency === "Urgent"
                        ? "bg-red-600 text-white shadow-xs"
                        : urgency === "High"
                          ? "bg-amber-600 text-white shadow-xs"
                          : "bg-white text-gray-900 shadow-xs border border-gray-200/60"
                      : "text-gray-600 hover:text-gray-900"
                    }`}
                >
                  {urgency}
                </button>
              );
            })}
          </div>
        </div>

        {/* Description Input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-gray-900">Description</label>
          <FormTextarea
            control={form.control}
            name="description"
            placeholder="e.g. Water is slightly cloudy since yesterday after a heavy rain shower. The pump is running but chlorine reads 0.4 on our dip strip."
            rows={4}
          />
        </div>

        {/* Upload Photos Dropzone */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-gray-900">
            Upload Photos <span className="text-xs font-normal text-gray-400">(Optional)</span>
          </label>
          <div className="border-2 border-dashed border-gray-200 hover:border-sky-400 rounded-xl p-6 flex flex-col items-center justify-center gap-2 text-center bg-gray-50/50 hover:bg-sky-50/20 transition-all cursor-pointer">
            <UploadCloud className="w-8 h-8 text-sky-500" />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-700">
                Upload images here or click to browse
              </span>
              <span className="text-xs text-gray-400 mt-0.5">
                PNG, JPG, WEBP up to 5MB each
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          {isSubmitted ? (
            <div className="w-full py-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-700 flex items-center justify-center gap-2 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              Service request submitted successfully!
            </div>
          ) : (
            <ReusableGradientButton
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 text-base font-bold flex items-center justify-center gap-2 cursor-pointer"
            >
              <Wrench className="w-5 h-5" />
              {isSubmitting ? "Submitting Ticket..." : "Submit"}
            </ReusableGradientButton>
          )}
        </div>
      </ReuseableForm>
    </ReusableModal>
  );
};

export default RequestServiceModal;

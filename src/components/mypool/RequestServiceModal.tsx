"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ReusableModal from "@/components/ui/CustomUi/ReuseableModal";
import ReuseableForm from "@/components/ui/CustomUi/ReuseForm/ReuseableForm";
import { FormSelect, FormTextarea } from "@/components/ui/CustomUi/ReuseForm/Form";
import { SelectItem } from "@/components/ui/select";
import ReusableGradientButton from "@/components/ui/CustomUi/ReusableGradientButton";
import {
  TRequestKind,
  TRequestUrgency,
  createServiceRequest,
} from "@/service/ServiceRequestService/ServiceRequestServiceApi";
import { getMyPools, IPoolSummary } from "@/service/MyPoolService/MyPoolServiceApi";
import { uploadFiles, validateImages, UPLOAD_MAX_FILES } from "@/service/UploadService/UploadServiceApi";
import { errorMessage } from "@/lib/apiRequest";
import {
  Wrench,
  Droplets,
  Sparkles,
  AlertTriangle,
  HelpCircle,
  UploadCloud,
  CheckCircle2,
  X,
  Loader2,
} from "lucide-react";

interface RequestServiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultPoolId?: string;
  defaultKind?: TRequestKind;
  onRequestCreated?: () => void;
}

interface ServiceFormValues {
  poolId: string;
  description: string;
}

const ISSUE_OPTIONS: {
  id: TRequestKind;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
    { id: "EQUIPMENT", title: "Equipment breakdown", description: "Pump not priming, strange noise, chlorinator error code", icon: Wrench },
    { id: "WATER_QUALITY", title: "Water quality issue", description: "Cloudy, green tint, foaming, chlorine smell", icon: Droplets },
    { id: "CLEANING", title: "Special cleaning / pre-event", description: "Extra vacuuming, party prep, post-storm leaf removal", icon: Sparkles },
    { id: "EMERGENCY", title: "Emergency leak or flood", description: "Pipe burst, rapid water loss, electrical spark", icon: AlertTriangle },
    { id: "INSPECTION", title: "General inquiry / inspection", description: "Seasonal winterize, automation setup, heating check", icon: HelpCircle },
  ];

const URGENCY_OPTIONS: { value: TRequestUrgency; label: string }[] = [
  { value: "NORMAL", label: "Normal" },
  { value: "HIGH", label: "High" },
  { value: "URGENT", label: "Urgent" },
];

export const RequestServiceModal: React.FC<RequestServiceModalProps> = ({
  open,
  onOpenChange,
  defaultPoolId,
  defaultKind = "EQUIPMENT",
  onRequestCreated,
}) => {
  const [selectedKind, setSelectedKind] = useState<TRequestKind>(defaultKind);
  const [selectedUrgency, setSelectedUrgency] = useState<TRequestUrgency>("NORMAL");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [pools, setPools] = useState<IPoolSummary[] | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const form = useForm<ServiceFormValues>({
    defaultValues: { poolId: defaultPoolId || "", description: "" },
  });

  useEffect(() => {
    if (!open) return;
    (async () => {
      setSelectedKind(defaultKind);
      setSelectedUrgency("NORMAL");
      setIsSubmitted(false);
      setSubmitError(null);
      setFiles([]);
      form.reset({ poolId: defaultPoolId || "", description: "" });

      const res = await getMyPools();
      if (res.success) {
        setPools(res.data);
        if (!defaultPoolId && res.data[0]) form.setValue("poolId", res.data[0]._id);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, defaultPoolId, defaultKind]);

  const handleFilesSelected = (list: FileList | null) => {
    if (!list) return;
    const incoming = Array.from(list);
    const combined = [...files, ...incoming].slice(0, UPLOAD_MAX_FILES);
    const validationError = validateImages(combined);
    if (validationError) {
      setSubmitError(validationError);
      return;
    }
    setSubmitError(null);
    setFiles(combined);
  };

  const removeFile = (index: number) => setFiles((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async (data: ServiceFormValues) => {
    if (!data.poolId) {
      setSubmitError("Select a pool first.");
      return;
    }
    setIsSubmitting(true);
    setSubmitError(null);

    let attachments: string[] = [];
    if (files.length > 0) {
      setUploading(true);
      const uploadRes = await uploadFiles(files, data.poolId);
      setUploading(false);
      if (!uploadRes.success) {
        setIsSubmitting(false);
        setSubmitError(errorMessage(uploadRes, "Could not upload your photos. Please try again."));
        return;
      }
      attachments = uploadRes.data.map((f) => f.url);
    }

    const res = await createServiceRequest({
      poolId: data.poolId,
      kind: selectedKind,
      urgency: selectedUrgency,
      description: data.description,
      attachments,
    });

    setIsSubmitting(false);

    if (res.success) {
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        onOpenChange(false);
        onRequestCreated?.();
      }, 1500);
    } else {
      setSubmitError(errorMessage(res, "Failed to create service request."));
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
      <ReuseableForm form={form} onSubmit={handleSubmit} className="flex flex-col gap-6 text-gray-900 pb-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-gray-900">Select Pool</label>
          <FormSelect control={form.control} name="poolId" placeholder={pools ? "Select Pool" : "Loading pools..."}>
            {(pools || []).map((p) => (
              <SelectItem key={p._id} value={p._id}>
                {p.name}
              </SelectItem>
            ))}
          </FormSelect>
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-sm font-bold text-gray-900">What type of issue are you experiencing?</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ISSUE_OPTIONS.map((opt) => {
              const isSelected = selectedKind === opt.id;
              const Icon = opt.icon;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSelectedKind(opt.id)}
                  className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all duration-200 cursor-pointer ${isSelected
                    ? "bg-sky-50/80 border-sky-500 ring-2 ring-sky-500/20"
                    : "bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50/50"
                    } ${opt.id === "INSPECTION" ? "sm:col-span-2" : ""}`}
                >
                  <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${isSelected ? "bg-sky-600 text-white" : "bg-gray-100 text-gray-600"}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-900">{opt.title}</span>
                    <span className="text-xs text-gray-500 mt-0.5 leading-snug">{opt.description}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-gray-900">Urgency</label>
          <div className="grid grid-cols-3 gap-3 p-1 bg-gray-100 rounded-xl border border-gray-200">
            {URGENCY_OPTIONS.map(({ value, label }) => {
              const isSelected = selectedUrgency === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setSelectedUrgency(value)}
                  className={`py-2 rounded-lg text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${isSelected
                    ? value === "URGENT"
                      ? "bg-red-600 text-white shadow-xs"
                      : value === "HIGH"
                        ? "bg-amber-600 text-white shadow-xs"
                        : "bg-white text-gray-900 shadow-xs border border-gray-200/60"
                    : "text-gray-600 hover:text-gray-900"
                    }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-gray-900">Description</label>
          <FormTextarea
            control={form.control}
            name="description"
            placeholder="e.g. Water is slightly cloudy since yesterday after a heavy rain shower. The pump is running but chlorine reads 0.4 on our dip strip."
            rows={4}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-gray-900">
            Upload Photos <span className="text-xs font-normal text-gray-400">(Optional, up to {UPLOAD_MAX_FILES})</span>
          </label>

          {files.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {files.map((f, i) => (
                <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={URL.createObjectURL(f)} alt={f.name} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="absolute top-0.5 right-0.5 bg-black/60 text-white rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {files.length < UPLOAD_MAX_FILES && (
            <label className="border-2 border-dashed border-gray-200 hover:border-sky-400 rounded-xl p-6 flex flex-col items-center justify-center gap-2 text-center bg-gray-50/50 hover:bg-sky-50/20 transition-all cursor-pointer">
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => handleFilesSelected(e.target.files)}
              />
              <UploadCloud className="w-8 h-8 text-sky-500" />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-700">Upload images here or click to browse</span>
                <span className="text-xs text-gray-400 mt-0.5">JPG, PNG or WebP, up to 8MB each</span>
              </div>
            </label>
          )}
        </div>

        {submitError && (
          <div className="w-full py-3 px-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">{submitError}</div>
        )}

        <div className="pt-2">
          {isSubmitted ? (
            <div className="w-full py-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-700 flex items-center justify-center gap-2 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              Service request submitted successfully!
            </div>
          ) : (
            <ReusableGradientButton
              type="submit"
              disabled={isSubmitting || !pools}
              className="w-full h-12 text-base font-bold flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wrench className="w-5 h-5" />}
              {uploading ? "Uploading photos..." : isSubmitting ? "Submitting ticket..." : "Submit"}
            </ReusableGradientButton>
          )}
        </div>
      </ReuseableForm>
    </ReusableModal>
  );
};

export default RequestServiceModal;

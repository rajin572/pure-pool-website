"use client";

import React, { useRef, useState } from "react";
import { toast } from "sonner";
import { Upload, X, Plus, Loader2 } from "lucide-react";
import OnboardingActionRow from "./OnboardingActionRow";
import { resolveImageUrl } from "@/helpers/config/envConfig";
import { errorMessage } from "@/lib/apiRequest";
import { MAX_PHOTOS, OnboardingPhotosData } from "@/service/OnboardingService/OnboardingServiceApi";
import { uploadFiles, validateImages } from "@/service/UploadService/UploadServiceApi";

interface Step4PhotosProps {
  initialData: OnboardingPhotosData;
  /** Lets the backend check the customer may attach files to this pool (set after the first save). */
  poolId?: string;
  onNext: (data: OnboardingPhotosData) => void;
  onBack: () => void;
  isSaving?: boolean;
}

export const Step4Photos: React.FC<Step4PhotosProps> = ({
  initialData,
  poolId,
  onNext,
  onBack,
  isSaving = false,
}) => {
  // The URLs already stored for this pool (empty for a new customer).
  const [photos, setPhotos] = useState<string[]>(initialData.urls);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  /** POST /uploads with the chosen files, up to the free slots; the returned URLs are kept. */
  const addFiles = async (picked: File[]) => {
    if (uploading || picked.length === 0) return;
    const room = MAX_PHOTOS - photos.length;
    if (room <= 0) {
      toast.error(`You can add up to ${MAX_PHOTOS} photos.`);
      return;
    }
    const files = picked.slice(0, room);
    if (picked.length > room) toast.info(`Only ${room} more photo${room > 1 ? "s" : ""} fit, the rest were skipped.`);
    const problem = validateImages(files);
    if (problem) {
      toast.error(problem);
      return;
    }
    setUploading(true);
    const res = await uploadFiles(files, poolId);
    setUploading(false);
    if (!res.success) {
      toast.error(errorMessage(res, "The photos could not be uploaded."));
      return;
    }
    setPhotos((cur) => [...cur, ...res.data.map((f) => f.url)].slice(0, MAX_PHOTOS));
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (uploading) return;
    onNext({ urls: photos });
  };

  return (
    <div className="w-full bg-white rounded-3xl p-6 sm:p-10 shadow-lg border border-gray-100 flex flex-col gap-8">
      {/* Step Header */}
      <div className="flex flex-col gap-1.5">
        <h2 className="text-zinc-900 text-2xl sm:text-3xl font-bold font-['Onest'] leading-tight">
          Pool photos
        </h2>
        <p className="text-zinc-600 text-base font-medium font-['Onest'] leading-relaxed">
          Add up to {MAX_PHOTOS} photos of your pool and pump room (optional).
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []);
            e.target.value = "";
            void addFiles(files);
          }}
        />

        {/* Upload Dropzone */}
        <div
          role="button"
          tabIndex={0}
          aria-label="Add photos"
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), inputRef.current?.click())}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            void addFiles(Array.from(e.dataTransfer.files));
          }}
          className={`w-full h-52 sm:h-56 rounded-2xl outline outline-[1.5px] outline-dashed outline-offset-[-1.5px] outline-blue-600 flex flex-col justify-center items-center gap-2.5 p-6 cursor-pointer transition-colors group select-none ${dragging ? "bg-sky-100" : "bg-sky-50 hover:bg-sky-100/60"}`}
        >
          <div className="p-3 bg-white rounded-2xl shadow-sm text-blue-600 group-hover:scale-110 transition-transform">
            {uploading ? <Loader2 className="w-8 h-8 animate-spin" /> : <Upload className="w-8 h-8" />}
          </div>
          <div className="text-zinc-900 text-base sm:text-lg font-semibold font-['Onest'] text-center">
            {uploading ? "Uploading…" : "Drag & drop your photos here"}
          </div>
          <div className="text-zinc-500 text-xs sm:text-sm font-medium font-['Onest'] text-center">
            or click to browse &mdash; JPG, PNG, WEBP up to 8MB each
          </div>
        </div>

        {/* Added Photos Grid */}
        <div className="flex flex-col gap-3">
          <div className="text-zinc-900 text-base font-semibold font-['Onest']">
            Added photos ({photos.length} of {MAX_PHOTOS})
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {photos.map((src, i) => (
              <div
                key={src}
                className="relative h-28 sm:h-32 rounded-xl overflow-hidden border border-gray-200 group shadow-sm"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={resolveImageUrl(src)}
                  alt={`Pool photo ${i + 1}`}
                  className="size-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  type="button"
                  onClick={() => handleRemovePhoto(i)}
                  className="absolute top-2 right-2 p-1 bg-white/90 hover:bg-white text-zinc-700 hover:text-red-600 rounded-lg shadow-md transition-colors cursor-pointer"
                  aria-label="Remove photo"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}

            {Array.from({ length: Math.max(0, MAX_PHOTOS - photos.length) }).map((_, i) => (
              <button
                key={`empty-${i}`}
                type="button"
                onClick={() => inputRef.current?.click()}
                aria-label="Add a photo"
                className="h-28 sm:h-32 rounded-xl border border-dashed border-gray-200 bg-gray-50/50 hover:bg-gray-100 flex items-center justify-center text-zinc-400 hover:text-blue-600 transition-colors cursor-pointer"
              >
                <Plus className="w-6 h-6" />
              </button>
            ))}
          </div>
        </div>

        {/* Action Row */}
        <OnboardingActionRow
          onBack={onBack}
          isLoading={isSaving}
          loadingText="Saving..."
          disabled={uploading}
        />
      </form>
    </div>
  );
};

export default Step4Photos;

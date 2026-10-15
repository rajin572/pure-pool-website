"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  SUPPORTED_LANGUAGES,
  ILanguageOption,
  updateLanguageApi,
} from "@/service/ProfileService/ProfileServiceApi";

export interface LanguageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentLanguage?: string;
  onLanguageChanged?: (newLanguage: string) => void;
}

export const LanguageModal: React.FC<LanguageModalProps> = ({
  open,
  onOpenChange,
  currentLanguage = "English",
  onLanguageChanged,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>(currentLanguage);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      // API call (ready for backend)
      // await updateLanguageApi({ language: selectedLanguage });
      await updateLanguageApi({ language: selectedLanguage });

      if (onLanguageChanged) {
        onLanguageChanged(selectedLanguage);
      }
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update language:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-[92vw] max-w-md p-0 overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-white shadow-2xl"
        showCloseButton={true}
      >
        <DialogHeader className="pt-6 px-6 pb-2 border-b border-slate-100">
          <DialogTitle className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Language
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-slate-500 mt-1">
            Choose the language for your portal and email updates.
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-5 max-h-[70vh] overflow-y-auto space-y-2.5">
          {SUPPORTED_LANGUAGES.map((lang: ILanguageOption) => {
            const isSelected = selectedLanguage === lang.name;
            return (
              <div
                key={lang.code}
                onClick={() => setSelectedLanguage(lang.name)}
                className={`w-full flex items-center justify-between px-4 py-3 sm:py-3.5 rounded-xl cursor-pointer transition-all ${
                  isSelected
                    ? "border-2 border-[#0284C7] bg-sky-50/20 text-slate-900 font-medium shadow-xs"
                    : "border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50/60"
                }`}
              >
                <span className="text-sm sm:text-base font-normal text-slate-900">
                  {lang.name}
                </span>
                {isSelected && (
                  <Check className="size-4 sm:size-5 text-[#0284C7] stroke-[2.5]" />
                )}
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/40">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-10 sm:h-11 px-5 rounded-xl border-slate-200 text-slate-700 font-medium hover:bg-slate-50 text-sm"
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={isSubmitting}
            onClick={handleSave}
            className="h-10 sm:h-11 px-6 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-medium text-sm shadow-xs transition"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LanguageModal;


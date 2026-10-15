"use client";

import React from "react";
import Container from "@/components/ui/CustomUi/Container";

export interface SaveBarProps {
  isDirty?: boolean;
  isSubmitting?: boolean;
  onCancel?: () => void;
}

export const SaveBar: React.FC<SaveBarProps> = ({
  isDirty = true,
  isSubmitting = false,
  onCancel,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 py-3.5 sm:py-4 shadow-[0_-4px_24px_rgba(0,0,0,0.06)]">
      <Container>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="text-zinc-500 text-sm sm:text-base font-medium font-['Onest']">
            {isDirty ? "You have unsaved changes" : "All changes saved"}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="flex-1 sm:flex-none px-6 py-3 sm:py-3.5 bg-white border border-gray-200 hover:bg-gray-50 active:bg-gray-100 text-zinc-900 font-bold font-['Onest'] text-sm sm:text-base rounded-2xl transition-colors cursor-pointer text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 sm:flex-none px-7 py-3 sm:py-3.5 bg-gradient-to-br from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 active:scale-[0.99] text-white font-bold font-['Onest'] text-sm sm:text-base rounded-2xl shadow-sm transition-all cursor-pointer text-center disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save changes"}
            </button>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default SaveBar;


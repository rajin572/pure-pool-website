"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { errorMessage } from "@/lib/apiRequest";
import { requestAccountDeletion } from "@/service/ProfileService/ProfileServiceApi";

export interface DeleteAccountModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Asks the office to delete the account (`POST /auth/me/deletion-request`). Nothing is
 * deleted here: the office confirms by email first, so the user stays signed in.
 */
export const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({ open, onOpenChange }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      const res = await requestAccountDeletion();
      if (!res.success) {
        toast.error(errorMessage(res, "Your request could not be sent."));
        return;
      }
      toast.success(res.data.message || "Deletion request received. The office will confirm by email.");
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-[92vw] max-w-sm p-6 overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-white shadow-2xl text-center"
        showCloseButton={true}
      >
        <DialogHeader className="p-0 border-none space-y-0 text-center">
          <div className="size-13 sm:size-14 rounded-full bg-red-50 text-[#EF4444] flex items-center justify-center mx-auto mb-4 ring-8 ring-red-50/50">
            <Trash2 className="size-6 text-[#EF4444]" />
          </div>
          <DialogTitle className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight text-center">
            Delete your account?
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-slate-500 mt-2 text-center max-w-xs mx-auto leading-relaxed">
            This sends a deletion request to our office. Nothing is removed yet: we&apos;ll confirm
            with you by email first.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-3 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 h-10 sm:h-11 rounded-xl border-slate-200 text-slate-700 font-medium hover:bg-slate-50 text-sm"
          >
            Keep my account
          </Button>
          <Button
            type="button"
            disabled={isSubmitting}
            onClick={handleConfirm}
            className="flex-1 h-10 sm:h-11 rounded-xl bg-[#EF4444] hover:bg-red-600 text-white font-medium text-sm shadow-xs transition"
          >
            {isSubmitting ? "Sending..." : "Request deletion"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteAccountModal;

"use client";

import React, { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Lock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ReuseableForm from "@/components/ui/CustomUi/ReuseForm/ReuseableForm";
import { FormPassword } from "@/components/ui/CustomUi/ReuseForm/Form";
import { Button } from "@/components/ui/button";
import PasswordStrength from "@/components/auth/PasswordStrength";
import { errorMessage } from "@/lib/apiRequest";
import { clearClientAuthTokens } from "@/lib/clientFetch";
import { PASSWORD_MAX, PASSWORD_MIN } from "@/service/AuthService/AuthServiceApi";
import { changePassword } from "@/service/ProfileService/ProfileServiceApi";

const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(PASSWORD_MIN, `Use at least ${PASSWORD_MIN} characters`)
      .max(PASSWORD_MAX, `Use at most ${PASSWORD_MAX} characters`),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: "Choose a password you haven't used here",
    path: ["newPassword"],
  });

type UpdatePasswordFormData = z.infer<typeof updatePasswordSchema>;

export interface UpdatePasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FIELD =
  "bg-white! border-slate-200! focus:border-[#0284C7]! text-slate-900! text-sm! py-3.5! rounded-xl!";

export const UpdatePasswordModal: React.FC<UpdatePasswordModalProps> = ({ open, onOpenChange }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<UpdatePasswordFormData>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  const newPassword = useWatch({ control: form.control, name: "newPassword" }) ?? "";
  const confirmPassword = useWatch({ control: form.control, name: "confirmPassword" }) ?? "";

  const handleOpenChange = (next: boolean) => {
    if (!next) form.reset();
    onOpenChange(next);
  };

  const onSubmit = async (data: UpdatePasswordFormData) => {
    setIsSubmitting(true);
    try {
      const res = await changePassword({ currentPassword: data.currentPassword, newPassword: data.newPassword });
      if (!res.success) {
        // "Wrong current password" is the common one: keep the dialog open so it can be retyped.
        toast.error(errorMessage(res, "Your password could not be changed."));
        return;
      }
      // The backend ended every session (all devices), so this one is over too.
      clearClientAuthTokens();
      toast.success("Password changed. Please sign in again.");
      window.location.assign(new URL("/login", window.location.origin));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="w-[92vw] max-w-lg p-0 overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-white shadow-2xl"
        showCloseButton={true}
      >
        <DialogHeader className="pt-6 px-6 pb-2 border-b border-slate-100">
          <DialogTitle className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Update password
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-5 max-h-[80vh] overflow-y-auto">
          <ReuseableForm form={form} onSubmit={onSubmit} className="space-y-4">
            <FormPassword
              control={form.control}
              name="currentPassword"
              label="Current Password"
              placeholder="Enter current password"
              autoComplete="current-password"
              prefix={<Lock className="size-4 text-slate-400" />}
              inputClassName={FIELD}
            />

            <FormPassword
              control={form.control}
              name="newPassword"
              label="New Password"
              placeholder="Enter new password"
              autoComplete="new-password"
              prefix={<Lock className="size-4 text-slate-400" />}
              inputClassName={FIELD}
            />

            <FormPassword
              control={form.control}
              name="confirmPassword"
              label="Confirm New Password"
              placeholder="Re-enter new password"
              autoComplete="new-password"
              prefix={<Lock className="size-4 text-slate-400" />}
              inputClassName={FIELD}
            />

            <PasswordStrength password={newPassword} confirm={confirmPassword} />

            <p className="text-xs text-slate-500 leading-relaxed">
              For your security, changing your password signs you out on every device. You&apos;ll sign in again with the new one.
            </p>

            <div className="flex items-center justify-end gap-3 pt-5 mt-6 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                className="h-10 sm:h-11 px-5 rounded-xl border-slate-200 text-slate-700 font-medium hover:bg-slate-50 text-sm"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-10 sm:h-11 px-6 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-medium text-sm shadow-xs transition"
              >
                {isSubmitting ? "Updating..." : "Update password"}
              </Button>
            </div>
          </ReuseableForm>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdatePasswordModal;

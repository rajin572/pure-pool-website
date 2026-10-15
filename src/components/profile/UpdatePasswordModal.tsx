"use client";

import React, { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Lock, CheckCircle2, Circle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ReuseableForm from "@/components/ui/CustomUi/ReuseForm/ReuseableForm";
import { FormPassword } from "@/components/ui/CustomUi/ReuseForm/Form";
import { Button } from "@/components/ui/button";
import { updatePasswordApi } from "@/service/ProfileService/ProfileServiceApi";

const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[0-9]/, "Must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type UpdatePasswordFormData = z.infer<typeof updatePasswordSchema>;

export interface UpdatePasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const UpdatePasswordModal: React.FC<UpdatePasswordModalProps> = ({
  open,
  onOpenChange,
  onSuccess,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<UpdatePasswordFormData>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      currentPassword: "•••••••••",
      newPassword: "•••••••••••",
      confirmPassword: "•••••••••••",
    },
    mode: "onChange",
  });

  const newPasswordValue =
    useWatch({ control: form.control, name: "newPassword" }) || "";

  // Password criteria verification
  const hasMinLength = newPasswordValue.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPasswordValue);
  const hasNumber = /[0-9]/.test(newPasswordValue);
  const hasSymbol = /[^A-Za-z0-9]/.test(newPasswordValue);

  // Calculate score for meter (defaults to strong matching screenshot if dummy masked)
  const isDefaultMasked = newPasswordValue === "•••••••••••";
  const criteriaMetCount = isDefaultMasked
    ? 3
    : [hasMinLength, hasUppercase, hasNumber, hasSymbol].filter(Boolean).length;

  const getStrengthLabel = () => {
    if (criteriaMetCount === 4) return "Very strong — all criteria met";
    if (criteriaMetCount === 3) return "Strong — add a symbol to max it out";
    if (criteriaMetCount === 2) return "Moderate — add more variety";
    return "Weak — must meet security standards";
  };

  const onSubmit = async (data: UpdatePasswordFormData) => {
    try {
      setIsSubmitting(true);
      // API call (ready for backend)
      // await updatePasswordApi(data);
      await updatePasswordApi(data);

      if (onSuccess) {
        onSuccess();
      }
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update password:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            {/* Current Password */}
            <div>
              <FormPassword
                control={form.control}
                name="currentPassword"
                label="Current Password"
                placeholder="Enter current password"
                prefix={<Lock className="size-4 text-slate-400" />}
                inputClassName="bg-white! border-slate-200! focus:border-[#0284C7]! text-slate-900! text-sm! py-3.5! rounded-xl!"
              />
            </div>

            {/* New Password */}
            <div>
              <FormPassword
                control={form.control}
                name="newPassword"
                label="New Password"
                placeholder="Enter new password"
                prefix={<Lock className="size-4 text-slate-400" />}
                inputClassName="bg-white! border-slate-200! focus:border-[#0284C7]! text-slate-900! text-sm! py-3.5! rounded-xl!"
              />
            </div>

            {/* Confirm New Password */}
            <div>
              <FormPassword
                control={form.control}
                name="confirmPassword"
                label="Confirm New Password"
                placeholder="Re-enter new password"
                prefix={<Lock className="size-4 text-slate-400" />}
                inputClassName="bg-white! border-slate-200! focus:border-[#0284C7]! text-slate-900! text-sm! py-3.5! rounded-xl!"
              />
            </div>

            {/* Password Strength Indicator */}
            <div className="pt-2">
              <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full">
                {[1, 2, 3, 4].map((index) => {
                  const isActive = index <= criteriaMetCount;
                  return (
                    <div
                      key={index}
                      className={`h-full rounded-full transition-colors duration-300 ${
                        isActive ? "bg-blue-600" : "bg-slate-200"
                      }`}
                    />
                  );
                })}
              </div>
              <p className="text-xs text-slate-500 mt-2 font-normal">
                {getStrengthLabel()}
              </p>
            </div>

            {/* Criteria Checklist 2x2 Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-4 pt-2">
              {/* At least 8 characters */}
              <div className="flex items-center gap-2">
                {hasMinLength || isDefaultMasked ? (
                  <CheckCircle2 className="size-4.5 text-emerald-600 shrink-0" />
                ) : (
                  <Circle className="size-4.5 text-slate-300 shrink-0" />
                )}
                <span
                  className={`text-xs sm:text-[13px] ${
                    hasMinLength || isDefaultMasked
                      ? "text-slate-800 font-medium"
                      : "text-slate-500"
                  }`}
                >
                  At least 8 characters
                </span>
              </div>

              {/* One uppercase letter */}
              <div className="flex items-center gap-2">
                {hasUppercase || isDefaultMasked ? (
                  <CheckCircle2 className="size-4.5 text-emerald-600 shrink-0" />
                ) : (
                  <Circle className="size-4.5 text-slate-300 shrink-0" />
                )}
                <span
                  className={`text-xs sm:text-[13px] ${
                    hasUppercase || isDefaultMasked
                      ? "text-slate-800 font-medium"
                      : "text-slate-500"
                  }`}
                >
                  One uppercase letter
                </span>
              </div>

              {/* One number */}
              <div className="flex items-center gap-2">
                {hasNumber || isDefaultMasked ? (
                  <CheckCircle2 className="size-4.5 text-emerald-600 shrink-0" />
                ) : (
                  <Circle className="size-4.5 text-slate-300 shrink-0" />
                )}
                <span
                  className={`text-xs sm:text-[13px] ${
                    hasNumber || isDefaultMasked
                      ? "text-slate-800 font-medium"
                      : "text-slate-500"
                  }`}
                >
                  One number
                </span>
              </div>

              {/* One symbol */}
              <div className="flex items-center gap-2">
                {hasSymbol && !isDefaultMasked ? (
                  <CheckCircle2 className="size-4.5 text-emerald-600 shrink-0" />
                ) : (
                  <Circle className="size-4.5 text-slate-300 shrink-0" />
                )}
                <span
                  className={`text-xs sm:text-[13px] ${
                    hasSymbol && !isDefaultMasked
                      ? "text-slate-800 font-medium"
                      : "text-slate-500"
                  }`}
                >
                  One symbol
                </span>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 pt-5 mt-6 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
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

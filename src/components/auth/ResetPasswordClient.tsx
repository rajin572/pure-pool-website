"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type * as z from "zod";
import { toast } from "sonner";
import AuthLeftPanel from "./AuthLeftPanel";
import PasswordStrength from "./PasswordStrength";
import { ArrowLeft } from "lucide-react";
import {
  ReuseableForm,
  FormPassword,
} from "@/components/ui/CustomUi/ReuseForm/Form";
import ReusableGradientButton from "@/components/ui/CustomUi/ReusableGradientButton";
import { resetPassword, resetTokenStore } from "@/service/AuthService/AuthServiceApi";
import { resetPasswordSchema } from "@/schemas/auth";

type ResetForm = z.infer<typeof resetPasswordSchema>;

export const ResetPasswordClient: React.FC = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const form = useForm<ResetForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const passwordValue = useWatch({ control: form.control, name: "newPassword" }) ?? "";
  const confirmValue = useWatch({ control: form.control, name: "confirmPassword" }) ?? "";

  // Only reachable after a verified code (the reset token is kept in a 15-minute cookie).
  useEffect(() => {
    if (!resetTokenStore.get()) router.replace("/forgot-password");
  }, [router]);

  const handleResetSubmit = async (data: ResetForm) => {
    const resetToken = resetTokenStore.get();
    if (!resetToken) {
      toast.error("Your reset link expired. Request a new code.");
      router.replace("/forgot-password");
      return;
    }
    setIsSubmitting(true);
    const res = await resetPassword(resetToken, data.newPassword);
    setIsSubmitting(false);
    if (!res.success) {
      toast.error(res.error?.message || "Couldn't reset the password");
      return;
    }
    resetTokenStore.clear();
    router.push("/reset-password/success");
  };

  return (
    <div className="w-full min-h-screen flex flex-col lg:flex-row bg-white">
      {/* Left Brand Panel */}
      <AuthLeftPanel variant="forgot" />

      {/* Right Content Column */}
      <main className="flex-1 flex flex-col justify-between p-6 sm:p-10 lg:p-14 xl:p-16 max-w-3xl mx-auto w-full relative">
        {/* Top Back Link */}
        <div className="w-full flex justify-start items-center mb-8 lg:mb-12">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-zinc-600 hover:text-blue-600 text-sm sm:text-base font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to sign in</span>
          </Link>
        </div>

        {/* Center Form Section */}
        <div className="w-full max-w-xl mx-auto flex flex-col gap-6 my-auto">
          {/* Header */}
          <div className="flex flex-col gap-2">
            <h2 className="text-zinc-900 text-3xl sm:text-4xl font-bold font-['Onest'] leading-tight">
              Create a new password
            </h2>
            <p className="text-zinc-600 text-sm sm:text-base font-medium font-['Onest'] leading-relaxed">
              Your new password must be different from the one you used before.
            </p>
          </div>

          {/* Form */}
          <ReuseableForm form={form} onSubmit={handleResetSubmit} className="flex flex-col gap-5">
            <FormPassword
              control={form.control}
              name="newPassword"
              label="New Password"
              placeholder="Enter new password"
              autoComplete="new-password"
              variant="auth"
            />

            <FormPassword
              control={form.control}
              name="confirmPassword"
              label="Confirm New Password"
              placeholder="Repeat new password"
              autoComplete="new-password"
              variant="auth"
            />

            {/* Strength + requirements */}
            <PasswordStrength password={passwordValue} confirm={confirmValue} />

            {/* Reset Password Button */}
            <div className="pt-3">
              <ReusableGradientButton
                type="submit"
                disabled={isSubmitting}
                className="w-full h-14 rounded-2xl text-base sm:text-lg font-bold shadow-md cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? "Updating password..." : "Reset password"}
              </ReusableGradientButton>
            </div>
          </ReuseableForm>
        </div>

        {/* Bottom Micro Copy */}
        <div className="w-full text-center text-xs text-zinc-400 mt-8">
          Pure Pool Madrid &bull; Certified Professional Maintenance &bull; Encrypted SSL Protection
        </div>
      </main>
    </div>
  );
};

export default ResetPasswordClient;


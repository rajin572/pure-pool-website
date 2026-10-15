"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import AuthLeftPanel from "./AuthLeftPanel";
import { ArrowLeft } from "lucide-react";
import {
  ReuseableForm,
  FormPassword,
} from "@/components/ui/CustomUi/ReuseForm/Form";
import ReusableGradientButton from "@/components/ui/CustomUi/ReusableGradientButton";
import { ResetPasswordPayload } from "@/service/AuthService/AuthServiceApi";

export const ResetPasswordClient: React.FC = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const form = useForm<ResetPasswordPayload>({
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const passwordValue = useWatch({ control: form.control, name: "newPassword" }) ?? "";

  // Dynamic strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: "Enter a new password" };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8 && /[A-Z]/.test(pass)) score += 1;
    if (/\d/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    switch (score) {
      case 1:
        return { score: 1, label: "Weak — try adding numbers and capitals" };
      case 2:
        return { score: 2, label: "Fair — add a special character" };
      case 3:
        return { score: 3, label: "Strong — add a symbol to max it out" };
      case 4:
        return { score: 4, label: "Very strong — optimal security" };
      default:
        return { score: 0, label: "Enter a new password" };
    }
  };

  const strength = getPasswordStrength(passwordValue);

  /**
   * ==============================================================================
   * REDUX QUERY HOOK / REST API INTEGRATION
   * ==============================================================================
   * When connecting to your live backend:
   *
   * const [resetPasswordTrigger, { isLoading }] = useResetPasswordMutation();
   *
   * const onSubmit = async (data: ResetPasswordPayload) => {
   *   const res = await resetPasswordTrigger(data).unwrap();
   *   if (res.success) {
   *     router.push("/reset-password/success");
   *   }
   * };
   * ==============================================================================
   */
  const handleResetSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/reset-password/success");
    }, 600);
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
            />

            <FormPassword
              control={form.control}
              name="confirmPassword"
              label="Confirm New Password"
              placeholder="Repeat new password"
            />

            {/* Strength meter */}
            <div className="flex flex-col gap-1.5 -mt-1">
              <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full">
                <div
                  className={`h-full rounded-full transition-colors ${
                    strength.score >= 1 ? "bg-blue-600" : "bg-gray-200"
                  }`}
                />
                <div
                  className={`h-full rounded-full transition-colors ${
                    strength.score >= 2 ? "bg-blue-600" : "bg-gray-200"
                  }`}
                />
                <div
                  className={`h-full rounded-full transition-colors ${
                    strength.score >= 3 ? "bg-blue-600" : "bg-gray-200"
                  }`}
                />
                <div
                  className={`h-full rounded-full transition-colors ${
                    strength.score >= 4 ? "bg-blue-600" : "bg-gray-200"
                  }`}
                />
              </div>
              <span className="text-zinc-500 text-xs font-medium font-['Onest']">
                {strength.label}
              </span>
            </div>

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


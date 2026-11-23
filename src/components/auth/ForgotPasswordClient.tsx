"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type * as z from "zod";
import { toast } from "sonner";
import AuthLeftPanel from "./AuthLeftPanel";
import { ArrowLeft } from "lucide-react";
import {
  ReuseableForm,
  FormInput,
} from "@/components/ui/CustomUi/ReuseForm/Form";
import ReusableGradientButton from "@/components/ui/CustomUi/ReusableGradientButton";
import { forgotPassword } from "@/service/AuthService/AuthServiceApi";
import { forgotPasswordSchema } from "@/schemas/auth";

type ForgotForm = z.infer<typeof forgotPasswordSchema>;

export const ForgotPasswordClient: React.FC = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const form = useForm<ForgotForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleForgotSubmit = async (data: ForgotForm) => {
    setIsSubmitting(true);
    // The backend answers the same way whether or not the email has an account.
    const res = await forgotPassword(data.email);
    setIsSubmitting(false);
    if (!res.success) {
      toast.error(res.error?.message || "Couldn't send the code");
      return;
    }
    router.push(`/forgot-password/email-sent?email=${encodeURIComponent(data.email.trim())}`);
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
              Forgot your password?
            </h2>
            <p className="text-zinc-600 text-sm sm:text-base font-medium font-['Onest'] leading-relaxed">
              Enter the email linked to your account and we&apos;ll send you a 6-digit code to reset it.
            </p>
          </div>

          {/* Form */}
          <ReuseableForm form={form} onSubmit={handleForgotSubmit} className="flex flex-col gap-5">
            <FormInput
              control={form.control}
              name="email"
              label="Email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              variant="auth"
            />

            {/* Send Reset Code Button */}
            <div className="pt-2">
              <ReusableGradientButton
                type="submit"
                disabled={isSubmitting}
                className="w-full h-14 rounded-2xl text-base sm:text-lg font-bold shadow-md cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? "Sending code..." : "Send reset code"}
              </ReusableGradientButton>
            </div>

            <div className="text-center text-sm text-zinc-400">
              The code expires 15 minutes after it&apos;s sent.
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

export default ForgotPasswordClient;


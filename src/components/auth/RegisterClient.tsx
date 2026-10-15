"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import AuthLeftPanel from "./AuthLeftPanel";
import OtpVerificationModal from "./OtpVerificationModal";
import {
  ReuseableForm,
  FormInput,
  FormPassword,
  FormCheckbox,
} from "@/components/ui/CustomUi/ReuseForm/Form";
import ReusableGradientButton from "@/components/ui/CustomUi/ReusableGradientButton";
import { RegisterPayload } from "@/service/AuthService/AuthServiceApi";

export const RegisterClient: React.FC = () => {
  const router = useRouter();
  const [isOtpModalOpen, setIsOtpModalOpen] = useState<boolean>(false);
  const [registeredEmail, setRegisteredEmail] = useState<string>("you@example.com");

  const form = useForm<RegisterPayload>({
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      acceptTerms: true,
    },
  });

  const passwordValue = useWatch({ control: form.control, name: "password" }) ?? "";

  // Dynamic strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: "Enter a password" };
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
        return { score: 0, label: "Enter a password" };
    }
  };

  const strength = getPasswordStrength(passwordValue);

  /**
   * ==============================================================================
   * REDUX QUERY HOOK / REST API INTEGRATION
   * ==============================================================================
   * When connecting to your live backend:
   *
   * const [registerTrigger, { isLoading }] = useRegisterMutation();
   *
   * const onSubmit = async (data: RegisterPayload) => {
   *   const response = await registerTrigger(data).unwrap();
   *   if (response.success) {
   *     setRegisteredEmail(data.email);
   *     setIsOtpModalOpen(true);
   *   }
   * };
   * ==============================================================================
   */
  const handleRegisterSubmit = (data: RegisterPayload) => {
    setRegisteredEmail(data.email || "you@example.com");
    setIsOtpModalOpen(true);
  };

  const handleOtpVerified = () => {
    setIsOtpModalOpen(false);
    // Proceed to Onboarding Step 1
    router.push("/onboarding?step=1");
  };

  return (
    <div className="w-full min-h-screen flex flex-col lg:flex-row bg-white">
      {/* Left Brand Panel */}
      <AuthLeftPanel variant="register" />

      {/* Right Content Column */}
      <main className="flex-1 flex flex-col justify-between p-6 sm:p-10 lg:p-14 xl:p-16 max-w-3xl mx-auto w-full relative">
        {/* Top Header Switcher */}
        <div className="w-full flex justify-end items-center gap-1.5 text-sm sm:text-base mb-8 lg:mb-12">
          <span className="text-zinc-600 font-medium">Already have an account?</span>
          <Link
            href="/login"
            className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
          >
            Sign in
          </Link>
        </div>

        {/* Center Form Section */}
        <div className="w-full max-w-xl mx-auto flex flex-col gap-6 my-auto">
          {/* Header */}
          <div className="flex flex-col gap-2">
            <span className="text-blue-600 text-xs font-bold font-['Onest'] tracking-wider uppercase">
              STEP 1 OF 6
            </span>
            <h2 className="text-zinc-900 text-3xl sm:text-4xl font-bold font-['Onest'] leading-tight">
              Create your account
            </h2>
            <p className="text-zinc-600 text-sm sm:text-base font-medium font-['Onest'] leading-relaxed">
              We&apos;ll use these details to send visit reports and invoices. No card required.
            </p>
          </div>

          {/* Form */}
          <ReuseableForm form={form} onSubmit={handleRegisterSubmit} className="flex flex-col gap-5">
            {/* Full Name */}
            <FormInput
              control={form.control}
              name="fullName"
              label="Full Name"
              placeholder="Enter your full name"
            />

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                control={form.control}
                name="email"
                label="Email"
                type="email"
                placeholder="you@example.com"
              />
              <FormInput
                control={form.control}
                name="phoneNumber"
                label="Phone Number"
                placeholder="+34 600 000 000"
              />
            </div>

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormPassword
                control={form.control}
                name="password"
                label="Password"
                placeholder="Create a password"
              />
              <FormPassword
                control={form.control}
                name="confirmPassword"
                label="Confirm Password"
                placeholder="Repeat password"
              />
            </div>

            {/* Password Strength Meter */}
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

            {/* Accept Terms */}
            <div className="pt-1">
              <FormCheckbox
                control={form.control}
                name="acceptTerms"
                label="I accept the Terms of Service and Privacy Policy"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <ReusableGradientButton
                type="submit"
                className="w-full h-14 rounded-2xl text-base sm:text-lg font-bold shadow-md cursor-pointer"
              >
                Create account
              </ReusableGradientButton>
            </div>
          </ReuseableForm>
        </div>

        {/* Bottom Micro Copy */}
        <div className="w-full text-center text-xs text-zinc-400 mt-8">
          Pure Pool Madrid &bull; Certified Professional Maintenance &bull; Encrypted SSL Protection
        </div>
      </main>

      {/* OTP Verification Modal */}
      <OtpVerificationModal
        isOpen={isOtpModalOpen}
        onClose={() => setIsOtpModalOpen(false)}
        email={registeredEmail}
        onSuccess={handleOtpVerified}
      />
    </div>
  );
};

export default RegisterClient;


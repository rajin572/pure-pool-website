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
import {
  ReuseableForm,
  FormInput,
  FormPassword,
  FormCheckbox,
} from "@/components/ui/CustomUi/ReuseForm/Form";
import ReusableGradientButton from "@/components/ui/CustomUi/ReusableGradientButton";
import { getSessionUser, nextStepFor, registerUser } from "@/service/AuthService/AuthServiceApi";
import { getClientAccessToken, setClientAuthTokens } from "@/lib/clientFetch";
import { registerSchema } from "@/schemas/auth";

type RegisterForm = z.infer<typeof registerSchema>;

export const RegisterClient: React.FC = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
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
  const confirmValue = useWatch({ control: form.control, name: "confirmPassword" }) ?? "";

  /**
   * The account is created (and signed in) before the email is verified. The code is
   * entered on its own page (/register/verify?email=…), which survives a reload.
   * A visitor who already has a session is sent straight to their next step.
   */
  const routeSession = (me: Awaited<ReturnType<typeof getSessionUser>>, expectedEmail?: string) => {
    if (!me.success || me.data.role !== "CUSTOMER") return false;
    if (expectedEmail && me.data.email.toLowerCase() !== expectedEmail.trim().toLowerCase()) return false;
    router.replace(nextStepFor(me.data)); // unverified -> /register/verify, pending -> /onboarding
    return true;
  };

  useEffect(() => {
    if (!getClientAccessToken()) return;
    let alive = true;
    getSessionUser().then((me) => {
      if (alive) routeSession(me);
    });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount
  }, []);

  const handleRegisterSubmit = async (data: RegisterForm) => {
    setIsSubmitting(true);
    const toastId = toast.loading("Creating your account...");
    const res = await registerUser(data);
    if (!res.success) {
      setIsSubmitting(false);
      if (/already registered/i.test(res.error?.message ?? "")) {
        // Same browser that already registered this email: continue instead of failing.
        if (getClientAccessToken() && routeSession(await getSessionUser(), data.email)) {
          toast.info("You already started signing up. Let's finish verifying your email.", { id: toastId });
          return;
        }
        toast.error("This email already has an account. Sign in to continue; if it isn't verified yet, we'll take you to the code screen.", {
          id: toastId,
          duration: 8000,
          action: {
            label: "Sign in",
            onClick: () => router.push(`/login?email=${encodeURIComponent(data.email.trim())}`),
          },
        });
        return;
      }
      toast.error(res.error?.message || "Couldn't create the account", { id: toastId });
      return;
    }
    // The account exists now (pending review) and is signed in; the email still needs its code.
    const { accessToken, refreshToken, user } = res.data;
    setClientAuthTokens({ accessToken, refreshToken }, true);
    toast.success("Account created. Enter the 6-digit code we emailed you.", { id: toastId });
    router.push(`/register/verify?email=${encodeURIComponent(user.email)}`);
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
              autoComplete="name"
              variant="auth"
            />

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                control={form.control}
                name="email"
                label="Email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                variant="auth"
              />
              <FormInput
                control={form.control}
                name="phoneNumber"
                label="Phone Number"
                placeholder="+34 600 000 000"
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                variant="auth"
              />
            </div>

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormPassword
                control={form.control}
                name="password"
                label="Password"
                placeholder="Create a password"
                autoComplete="new-password"
                variant="auth"
              />
              <FormPassword
                control={form.control}
                name="confirmPassword"
                label="Confirm Password"
                placeholder="Repeat password"
                autoComplete="new-password"
                variant="auth"
              />
            </div>

            {/* Password strength + requirements */}
            <PasswordStrength password={passwordValue} confirm={confirmValue} />
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
                disabled={isSubmitting}
                className="w-full h-14 rounded-2xl text-base sm:text-lg font-bold shadow-md cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? "Creating account..." : "Create account"}
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

export default RegisterClient;


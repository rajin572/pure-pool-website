"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type * as z from "zod";
import { toast } from "sonner";
import AuthLeftPanel from "./AuthLeftPanel";
import {
  ReuseableForm,
  FormInput,
  FormPassword,
  FormCheckbox,
} from "@/components/ui/CustomUi/ReuseForm/Form";
import ReusableGradientButton from "@/components/ui/CustomUi/ReusableGradientButton";
import { loginUser, nextStepFor } from "@/service/AuthService/AuthServiceApi";
import { setClientAuthTokens } from "@/lib/clientFetch";
import { loginSchema } from "@/schemas/auth";

type LoginForm = z.infer<typeof loginSchema>;

export const LoginClient: React.FC = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
  });

  // Prefill from ?email= (e.g. "Sign in" from the register page).
  useEffect(() => {
    const email = new URLSearchParams(window.location.search).get("email");
    if (email) form.setValue("email", email);
  }, [form]);

  const handleLoginSubmit = async (data: LoginForm) => {
    setIsSubmitting(true);
    const toastId = toast.loading("Signing in...");
    const res = await loginUser(data);
    if (!res.success) {
      toast.error(res.error?.message || "Couldn't sign in", { id: toastId });
      setIsSubmitting(false);
      return;
    }
    const { user, accessToken, refreshToken } = res.data;
    if (user.role !== "CUSTOMER") {
      // The client portal is for customers; staff use the Back Office. Tokens are discarded.
      toast.error("This is the customer portal. Staff accounts sign in to the Back Office.", { id: toastId });
      setIsSubmitting(false);
      return;
    }
    setClientAuthTokens({ accessToken, refreshToken }, data.rememberMe ?? true);
    toast.success(`Welcome back, ${user.name}`, { id: toastId });
    // ?next= comes from the proxy redirect; only same-origin paths are accepted.
    const next = new URLSearchParams(window.location.search).get("next");
    router.replace(nextStepFor(user, next));
    router.refresh();
  };

  return (
    <div className="w-full min-h-screen flex flex-col lg:flex-row bg-white">
      {/* Left Brand Panel */}
      <AuthLeftPanel variant="login" />

      {/* Right Content Column */}
      <main className="flex-1 flex flex-col justify-between p-6 sm:p-10 lg:p-14 xl:p-16 max-w-3xl mx-auto w-full relative">
        {/* Top Switcher */}
        <div className="w-full flex justify-end items-center gap-1.5 text-sm sm:text-base mb-8 lg:mb-12">
          <span className="text-zinc-600 font-medium">New to Pure Pool?</span>
          <Link
            href="/register"
            className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
          >
            Create an account
          </Link>
        </div>

        {/* Center Form Section */}
        <div className="w-full max-w-xl mx-auto flex flex-col gap-6 my-auto">
          {/* Header */}
          <div className="flex flex-col gap-2">
            <span className="text-blue-600 text-xs font-bold font-['Onest'] tracking-wider uppercase">
              CLIENT PORTAL
            </span>
            <h2 className="text-zinc-900 text-3xl sm:text-4xl font-bold font-['Onest'] leading-tight">
              Welcome back
            </h2>
            <p className="text-zinc-600 text-sm sm:text-base font-medium font-['Onest'] leading-relaxed">
              Sign in to check your pool&apos;s status, upcoming visits and invoices.
            </p>
          </div>

          {/* Form */}
          <ReuseableForm form={form} onSubmit={handleLoginSubmit} className="flex flex-col gap-5">
            {/* Email */}
            <FormInput
              control={form.control}
              name="email"
              label="Email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              variant="auth"
            />

            {/* Password */}
            <FormPassword
              control={form.control}
              name="password"
              label="Password"
              placeholder="Enter your password"
              autoComplete="current-password"
              variant="auth"
            />

            {/* Remember Me & Forgot Password Row */}
            <div className="flex items-center justify-between text-sm sm:text-base pt-1">
              <FormCheckbox
                control={form.control}
                name="rememberMe"
                label="Remember me"
              />
              <Link
                href="/forgot-password"
                className="text-blue-600 hover:text-blue-700 font-semibold transition-colors shrink-0"
              >
                Forgot password?
              </Link>
            </div>

            {/* Sign In Button */}
            <div className="pt-3">
              <ReusableGradientButton
                type="submit"
                disabled={isSubmitting}
                className="w-full h-14 rounded-2xl text-base sm:text-lg font-bold shadow-md cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? "Signing in..." : "Sign In"}
              </ReusableGradientButton>
            </div>

            {/* Trouble signing in? */}
            <div className="flex items-center justify-center gap-1.5 text-sm text-zinc-500 pt-2">
              <span>Trouble signing in?</span>
              <Link
                href="/about-us"
                className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
              >
                Contact support
              </Link>
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

export default LoginClient;


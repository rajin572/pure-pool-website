import React from "react";
import type { Metadata } from "next";
import ForgotPasswordClient from "@/components/auth/ForgotPasswordClient";

export const metadata: Metadata = {
  title: "Forgot Password | Pure Pool Madrid",
  description: "Reset your customer portal access code.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordClient />;
}


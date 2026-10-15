import React from "react";
import type { Metadata } from "next";
import ResetSuccessClient from "@/components/auth/ResetSuccessClient";

export const metadata: Metadata = {
  title: "Password Updated | Pure Pool Madrid",
  description: "Your account password has been successfully updated.",
};

export default function ResetPasswordSuccessPage() {
  return <ResetSuccessClient />;
}


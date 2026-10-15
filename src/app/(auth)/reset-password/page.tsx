import React from "react";
import type { Metadata } from "next";
import ResetPasswordClient from "@/components/auth/ResetPasswordClient";

export const metadata: Metadata = {
  title: "Create New Password | Pure Pool Madrid",
  description: "Set a new secure password for your Pure Pool customer portal.",
};

export default function ResetPasswordPage() {
  return <ResetPasswordClient />;
}


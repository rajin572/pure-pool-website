import React from "react";
import type { Metadata } from "next";
import RegisterClient from "@/components/auth/RegisterClient";

export const metadata: Metadata = {
  title: "Create Account | Pure Pool Madrid",
  description: "Join Madrid pool owners with certified technician visits, water testing logs, and transparent invoicing.",
};

export default function SignUpPage() {
  return <RegisterClient />;
}


import React from "react";
import type { Metadata } from "next";
import RegisterClient from "@/components/auth/RegisterClient";

export const metadata: Metadata = {
  title: "Create Account | Pure Pool Madrid",
  description: "Join Madrid pool owners with certified technician visits, water testing logs, and transparent invoicing.",
};

export default async function RegisterPage() {
  /**
   * ==============================================================================
   * NEXT.JS SSR SESSION VERIFICATION
   * ==============================================================================
   * When live API is enabled, if user already has an active session cookie:
   * const session = await getSession();
   * if (session?.isAuthenticated) {
   *   redirect("/my-pool");
   * }
   * ==============================================================================
   */

  return <RegisterClient />;
}


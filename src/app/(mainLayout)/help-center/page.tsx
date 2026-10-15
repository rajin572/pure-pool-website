import React from "react";
import { Metadata } from "next";
import { HelpCenterClient } from "@/components/help-center";
import { getHelpFaqs } from "@/service/HelpCenterService/HelpCenterServiceApi";

export const metadata: Metadata = {
  title: "Help Center & Support | Pure Pool",
  description:
    "Reach the Pure Pool Madrid team by phone, WhatsApp or email, access our 24/7 emergency hotline, and find answers to common questions.",
};

export default async function HelpCenterPage() {
  /**
   * ==============================================================================
   * NEXT.JS SERVER-SIDE RENDERING (SSR) API CALL
   * ==============================================================================
   * Pre-fetches FAQ records on the server before client hydration.
   * When live:
   * const faqs = await getHelpFaqs();
   * ==============================================================================
   */
  const faqs = await getHelpFaqs();

  return <HelpCenterClient initialFaqs={faqs} />;
}


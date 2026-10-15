import React from "react";
import { Metadata } from "next";
import { InvoicesClient } from "@/components/invoices";
import {
  getInvoices,
  MOCK_INVOICE_RECORDS,
} from "@/service/BillingService/BillingServiceApi";

export const metadata: Metadata = {
  title: "Invoices | Pure Pool",
  description:
    "Every invoice for your pool service, with what's settled and what's still outstanding.",
};

export default async function InvoicesPage() {
  /**
   * ==============================================================================
   * NEXT.JS SERVER-SIDE RENDERING (SSR) API CALL
   * ==============================================================================
   * Pre-fetches invoices on the server before client hydration.
   * When backend is live:
   * const invoicesResponse = await getInvoices({ status: "all", page: 1, limit: 10 });
   * ==============================================================================
   */
  const invoicesResponse = await getInvoices();
  const initialInvoices = invoicesResponse.data.length
    ? invoicesResponse.data
    : MOCK_INVOICE_RECORDS;

  return (
    <InvoicesClient
      initialInvoices={initialInvoices}
      total={initialInvoices.length}
    />
  );
}


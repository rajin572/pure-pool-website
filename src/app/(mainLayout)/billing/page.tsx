import React from "react";
import { Metadata } from "next";
import { BillingClient } from "@/components/billing";
import {
  getInvoices,
  MOCK_INVOICE_RECORDS,
} from "@/service/BillingService/BillingServiceApi";

export const metadata: Metadata = {
  title: "Billing & Invoices | Pure Pool",
  description:
    "Manage your maintenance subscriptions, view official VAT tax receipts, and pay outstanding invoices.",
};

export default async function BillingPage() {
  /**
   * ==============================================================================
   * NEXT.JS SERVER-SIDE RENDERING (SSR) API CALL
   * ==============================================================================
   * Pre-fetches billing records on the server before client hydration.
   * When the backend REST API is live, uncomment this direct SSR service call:
   *
   * const invoicesResponse = await getInvoices({ status: "all", page: 1, limit: 10 });
   * const initialInvoices = invoicesResponse.data;
   * const total = invoicesResponse.total;
   * ==============================================================================
   */

  const invoicesResponse = await getInvoices();
  const initialInvoices = invoicesResponse.data.length
    ? invoicesResponse.data
    : MOCK_INVOICE_RECORDS;

  return (
    <BillingClient
      initialInvoices={initialInvoices}
      total={initialInvoices.length}
    />
  );
}


import React from "react";
import { Metadata } from "next";
import { InvoicesClient } from "@/components/invoices";
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


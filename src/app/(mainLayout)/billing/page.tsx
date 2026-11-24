import React from "react";
import { Metadata } from "next";
import { InvoicesClient } from "@/components/invoices";

export const metadata: Metadata = {
  title: "Billing & Invoices | Pure Pool",
  description:
    "Manage your maintenance subscriptions, view official VAT tax receipts, and pay outstanding invoices.",
};

export default function BillingPage() {
  return <InvoicesClient />;
}

import React from "react";
import { Metadata } from "next";
import { InvoicesClient } from "@/components/invoices";

export const metadata: Metadata = {
  title: "Invoices | Pure Pool",
  description:
    "Every invoice for your pool service, with what's settled and what's still outstanding.",
};

export default function InvoicesPage() {
  return <InvoicesClient />;
}

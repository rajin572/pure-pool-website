import React from "react";
import { Metadata } from "next";
import { QuotesClient } from "@/components/quotes";

export const metadata: Metadata = {
  title: "Quotes & Proposals | Pure Pool",
  description: "Review certified repair estimates, approve part replacements, and track technician scheduling.",
};

export default function QuotesPage() {
  return <QuotesClient />;
}

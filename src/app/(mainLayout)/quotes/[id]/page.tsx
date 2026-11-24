import React from "react";
import { Metadata } from "next";
import { QuoteDetailsView } from "@/components/quotes/details";

interface QuoteDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export const metadata: Metadata = {
  title: "Quote details | Pure Pool",
};

export default async function QuoteDetailPage({ params }: QuoteDetailPageProps) {
  const { id } = await params;
  return <QuoteDetailsView quoteId={id} />;
}

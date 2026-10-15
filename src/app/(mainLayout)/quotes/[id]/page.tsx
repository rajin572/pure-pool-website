import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getQuoteDetail } from "@/service/QuotesService/QuotesServiceApi";
import { QuoteDetailsView } from "@/components/quotes/details";

interface QuoteDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: QuoteDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const quoteResponse = await getQuoteDetail(id);
  const quote = quoteResponse.data;

  if (!quote) {
    return {
      title: "Quote Not Found | Pure Pool",
    };
  }

  return {
    title: `${quote.forService} (${quote.reference}) | Pure Pool`,
    description: `Review quote estimate for ${quote.forService} on ${quote.poolName}. Total: ${quote.amount}.`,
  };
}

export default async function QuoteDetailPage({
  params,
}: QuoteDetailPageProps) {
  const { id } = await params;

  /**
   * ==============================================================================
   * NEXT.JS SERVER-SIDE RENDERING (SSR) API CALL
   * ==============================================================================
   * Pre-fetches the detailed quote proposal and breakdown on the server.
   * When the backend REST API is live, uncomment this direct SSR service call:
   *
   * const quoteResponse = await getQuoteDetail(id);
   * ==============================================================================
   */
  const quoteResponse = await getQuoteDetail(id);
  const quote = quoteResponse.data;

  if (!quote) {
    notFound();
  }

  return <QuoteDetailsView initialQuote={quote} />;
}


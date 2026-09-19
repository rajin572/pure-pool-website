import React from "react";
import { Metadata } from "next";
import { QuotesClient } from "@/components/quotes";
import {
  getQuotes,
  MOCK_QUOTE_RECORDS,
} from "@/service/QuotesService/QuotesServiceApi";

export const metadata: Metadata = {
  title: "Quotes & Proposals | Pure Pool",
  description:
    "Review certified repair estimates, approve part replacements, and track technician scheduling.",
};

export default async function QuotesPage() {
  /**
   * ==============================================================================
   * NEXT.JS SERVER-SIDE RENDERING (SSR) API CALL
   * ==============================================================================
   * Pre-fetches quotes on the server before client hydration.
   * When the backend REST API is live, uncomment this direct SSR service call:
   *
   * const quotesResponse = await getQuotes({ status: "all", page: 1, limit: 10 });
   * const initialQuotes = quotesResponse.data;
   * const total = quotesResponse.total;
   * ==============================================================================
   */

  const quotesResponse = await getQuotes();
  const initialQuotes = quotesResponse.data.length
    ? quotesResponse.data
    : MOCK_QUOTE_RECORDS;

  return (
    <QuotesClient
      initialQuotes={initialQuotes}
      total={initialQuotes.length}
    />
  );
}


/* eslint-disable @typescript-eslint/no-explicit-any */

import { fetchWithAuth } from "@/lib/fetchWraper";
// import { revalidatePath } from "next/cache";

/**
 * ==============================================================================
 * QUOTES & PROPOSALS API SERVICES & TYPE DEFINITIONS
 * ==============================================================================
 * Next.js Server Side Rendering (SSR) & Server Actions architecture.
 * Ready for live REST API wiring:
 * - GET: Fetch quotes list with tab filtering & search
 * - GET: Fetch single quote details & itemized estimates
 * - PATCH: Accept quote proposal
 * - PATCH: Decline quote proposal
 * - GET: Download quote PDF estimate
 * ==============================================================================
 */

export interface QuoteItem {
  name: string;
  description?: string;
  amount: string;
}

export interface QuoteRecord {
  id: string;
  reference: string;
  forService: string;
  poolName: string;
  sentDate: string;
  validUntil: string;
  amount: string;
  status: "Pending Review" | "Accepted" | "Expired" | "Declined";
  items?: QuoteItem[];
  subtotal?: string;
  vatAmount?: string;
  vatRate?: string;
  notes?: string;
}

export interface QuotesFilterParams {
  status?: "pending" | "accepted" | "past" | "all";
  search?: string;
  page?: number;
  limit?: number;
}

/**
 * MOCK QUOTES RECORDS
 * Matches Figma Node 40014298:7560
 */
export const MOCK_QUOTE_RECORDS: QuoteRecord[] = [
  {
    id: "quote-001",
    reference: "EST-2026-0042",
    forService: "Heat pump fan motor replacement",
    poolName: "Main Residence Pool",
    sentDate: "12 May 2026",
    validUntil: "12 Jun 2026",
    amount: "€420.00",
    status: "Pending Review",
    subtotal: "€347.11",
    vatAmount: "€72.89",
    vatRate: "21%",
    notes:
      "Technician noted abnormal motor vibration during visit on 10 May. Replacement recommended before summer heat load.",
    items: [
      {
        name: "OEM Inverter Fan Motor Unit",
        description: "Direct manufacturer replacement part with 2-year warranty",
        amount: "€260.00",
      },
      {
        name: "Technician Certified Labor",
        description: "2 hours on-site HVAC & electrical installation",
        amount: "€87.11",
      },
    ],
  },
  {
    id: "quote-002",
    reference: "EST-2026-0038",
    forService: "Glass filter media upgrade (Activated AFM)",
    poolName: "Main Residence Pool",
    sentDate: "28 Apr 2026",
    validUntil: "28 May 2026",
    amount: "€285.00",
    status: "Accepted",
    subtotal: "€235.54",
    vatAmount: "€49.46",
    vatRate: "21%",
    notes:
      "Upgrades existing silica sand to bio-resistant activated AFM glass for 30% enhanced clarity and lower chemical consumption.",
    items: [
      {
        name: "AFM Grade 1 & 2 Filter Glass Media (125kg)",
        description: "Self-sterilizing bio-resistant filter media",
        amount: "€160.00",
      },
      {
        name: "Sand extraction, lateral inspection & recharge labor",
        description: "Complete filter extraction and disposal",
        amount: "€75.54",
      },
    ],
  },
  {
    id: "quote-003",
    reference: "EST-2026-0029",
    forService: "Underwater RGB LED Luminaire replacement",
    poolName: "Garden Pool",
    sentDate: "15 Apr 2026",
    validUntil: "15 May 2026",
    amount: "€195.00",
    status: "Expired",
    subtotal: "€161.16",
    vatAmount: "€33.84",
    vatRate: "21%",
    notes: "Quote expired on 15 May. You can request a renewed estimate at any time.",
    items: [
      {
        name: "Spectra-LED Ultra IP68 Sealed 12V Fixture",
        description: "Nicheless color-changing LED lamp",
        amount: "€135.00",
      },
      {
        name: "Potting & watertight connection labor",
        description: "Includes IP68 resin junction sealing",
        amount: "€26.16",
      },
    ],
  },
  {
    id: "quote-004",
    reference: "EST-2026-0019",
    forService: "Automated dosing tube peristaltic pump repair",
    poolName: "Main Residence Pool",
    sentDate: "10 Mar 2026",
    validUntil: "10 Apr 2026",
    amount: "€115.00",
    status: "Accepted",
    subtotal: "€95.04",
    vatAmount: "€19.96",
    vatRate: "21%",
    notes: "Santoprene squeeze tube and roller assembly renewed.",
    items: [
      {
        name: "Santoprene Peristaltic Squeeze Tube Kit",
        description: "Chemical resistant tubing kit",
        amount: "€45.00",
      },
      {
        name: "Pump overhaul & calibration labor",
        description: "Flow rate calibration and test run",
        amount: "€50.04",
      },
    ],
  },
];

/**
 * GET: Fetch Quotes with status filter & search
 */
export async function getQuotes(
  params?: QuotesFilterParams
): Promise<{ success: boolean; data: QuoteRecord[]; total: number }> {
  try {
    /**
     * ==============================================================================
     * LIVE API REST ENDPOINT INTEGRATION:
     * When backend is live, uncomment this block:
     *
     * const query = new URLSearchParams({
     *   status: params?.status || "all",
     *   search: params?.search || "",
     *   page: String(params?.page || 1),
     *   limit: String(params?.limit || 10),
     * });
     * const res = await fetchWithAuth(`/api/quotes?${query.toString()}`, {
     *   method: "GET",
     *   next: { tags: ["quotes"] },
     * });
     * return await res.json();
     * ==============================================================================
     */

    let quotes = [...MOCK_QUOTE_RECORDS];

    if (params?.status && params.status !== "all") {
      if (params.status === "pending") {
        quotes = quotes.filter((q) => q.status === "Pending Review");
      } else if (params.status === "accepted") {
        quotes = quotes.filter((q) => q.status === "Accepted");
      } else if (params.status === "past") {
        quotes = quotes.filter(
          (q) => q.status === "Expired" || q.status === "Declined"
        );
      }
    }

    if (params?.search) {
      const q = params.search.toLowerCase();
      quotes = quotes.filter(
        (quote) =>
          quote.reference.toLowerCase().includes(q) ||
          quote.forService.toLowerCase().includes(q) ||
          quote.poolName.toLowerCase().includes(q)
      );
    }

    return {
      success: true,
      data: quotes,
      total: quotes.length,
    };
  } catch (error: any) {
    console.error("Error fetching quotes:", error);
    return {
      success: false,
      data: MOCK_QUOTE_RECORDS,
      total: MOCK_QUOTE_RECORDS.length,
    };
  }
}

/**
 * GET: Fetch single quote detail
 */
export async function getQuoteDetail(
  quoteId: string
): Promise<{ success: boolean; data: QuoteRecord | null }> {
  try {
    const record =
      MOCK_QUOTE_RECORDS.find((q) => q.id === quoteId) || MOCK_QUOTE_RECORDS[0];
    return { success: true, data: record };
  } catch (error) {
    console.error("Error fetching quote detail:", error);
    return { success: false, data: null };
  }
}

/**
 * PATCH: Accept Quote
 */
export async function acceptQuote(
  quoteId: string
): Promise<{ success: boolean; message: string }> {
  try {
    /**
     * const res = await fetchWithAuth(`/api/quotes/${quoteId}/accept`, {
     *   method: "PATCH",
     * });
     * revalidatePath("/quotes");
     * return await res.json();
     */
    // revalidatePath("/quotes");
    return {
      success: true,
      message: "Quote approved! Our scheduling team will contact you shortly.",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to accept quote.",
    };
  }
}

/**
 * PATCH: Decline Quote
 */
export async function declineQuote(
  quoteId: string,
  reason?: string
): Promise<{ success: boolean; message: string }> {
  try {
    /**
     * const res = await fetchWithAuth(`/api/quotes/${quoteId}/decline`, {
     *   method: "PATCH",
     *   body: JSON.stringify({ reason }),
     * });
     * revalidatePath("/quotes");
     * return await res.json();
     */
    // revalidatePath("/quotes");
    return {
      success: true,
      message: "Quote declined.",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to decline quote.",
    };
  }
}

/**
 * GET: Download Quote PDF
 */
export async function downloadQuotePdf(
  quoteId: string
): Promise<{ success: boolean; downloadUrl?: string; message: string }> {
  try {
    return {
      success: true,
      downloadUrl: `/sample-estimate-${quoteId}.pdf`,
      message: "Estimate PDF ready for download.",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to download PDF.",
    };
  }
}

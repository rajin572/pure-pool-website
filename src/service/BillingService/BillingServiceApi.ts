/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { fetchWithAuth } from "@/lib/fetchWraper";
// import { revalidatePath } from "next/cache";

/**
 * ==============================================================================
 * BILLING & INVOICE API SERVICES & TYPE DEFINITIONS
 * ==============================================================================
 * Next.js Server Side Rendering (SSR) & Server Actions architecture.
 * Ready for live REST API wiring:
 * - GET: Fetch invoices with status filter & search
 * - GET: Fetch single invoice details & line items
 * - POST: Submit invoice payment
 * - GET: Download invoice PDF receipt
 * ==============================================================================
 */

export interface InvoiceLineItem {
  description: string;
  amount: string | number;
}

export interface InvoiceRecord {
  id: string;
  invoiceNumber: string;
  service: string;
  period?: string;
  date: string;
  dueDate: string;
  amount: string;
  status: "Paid" | "Outstanding" | "Overdue";
  lineItems?: InvoiceLineItem[];
  subtotal?: string;
  vatAmount?: string;
  vatRate?: string;
}

export interface BillingFilterParams {
  status?: "all" | "paid" | "outstanding";
  search?: string;
  page?: number;
  limit?: number;
}

/**
 * MOCK INVOICE RECORDS
 * Matches Figma Node 40014997:10295
 */
export const MOCK_INVOICE_RECORDS: InvoiceRecord[] = [
  {
    id: "inv-131",
    invoiceNumber: "INV-2026-0131",
    service: "Monthly Pool Maintenance",
    period: "Sep 2026 · Monthly service",
    date: "15 Sep 2026",
    dueDate: "25 Sep 2026",
    amount: "€285.00",
    status: "Paid",
    subtotal: "€235.54",
    vatAmount: "€49.46",
    vatRate: "21%",
    lineItems: [
      { description: "Monthly Pool Maintenance (4 visits)", amount: "€235.54" },
    ],
  },
  {
    id: "inv-119",
    invoiceNumber: "INV-2026-0119",
    service: "Monthly Pool Maintenance",
    period: "Aug 2026 · Monthly service",
    date: "15 Aug 2026",
    dueDate: "25 Aug 2026",
    amount: "€285.00",
    status: "Paid",
    subtotal: "€235.54",
    vatAmount: "€49.46",
    vatRate: "21%",
    lineItems: [
      { description: "Monthly Pool Maintenance (4 visits)", amount: "€235.54" },
    ],
  },
  {
    id: "inv-104",
    invoiceNumber: "INV-2026-0104",
    service: "Service + filter swap",
    period: "Jul 2026 · Service + filter swap",
    date: "15 Jul 2026",
    dueDate: "25 Jul 2026",
    amount: "€412.50",
    status: "Paid",
    subtotal: "€340.91",
    vatAmount: "€71.59",
    vatRate: "21%",
    lineItems: [
      { description: "Monthly Pool Maintenance (4 visits)", amount: "€235.54" },
      { description: "Activated Glass Filter AFM Media Swap", amount: "€105.37" },
    ],
  },
  {
    id: "inv-093",
    invoiceNumber: "INV-2026-0093",
    service: "Monthly Pool Maintenance",
    period: "Jun 2026 · Monthly service",
    date: "15 Jun 2026",
    dueDate: "25 Jun 2026",
    amount: "€285.00",
    status: "Paid",
    subtotal: "€235.54",
    vatAmount: "€49.46",
    vatRate: "21%",
    lineItems: [
      { description: "Monthly Pool Maintenance (4 visits)", amount: "€235.54" },
    ],
  },
  {
    id: "inv-070",
    invoiceNumber: "INV-2026-0070",
    service: "Opening season service",
    period: "Apr 2026 · Opening season service",
    date: "15 Apr 2026",
    dueDate: "25 Apr 2026",
    amount: "€320.00",
    status: "Paid",
    subtotal: "€264.46",
    vatAmount: "€55.54",
    vatRate: "21%",
    lineItems: [
      { description: "Seasonal Pool Opening & Intensive Shock", amount: "€264.46" },
    ],
  },
  {
    id: "inv-052",
    invoiceNumber: "INV-2026-0052",
    service: "Pump replacement",
    period: "May 2026 · Pump replacement",
    date: "10 May 2026",
    dueDate: "24 May 2026",
    amount: "€411.40",
    status: "Outstanding",
    subtotal: "€340.00",
    vatAmount: "€71.40",
    vatRate: "21%",
    lineItems: [
      { description: "AstralPool Victoria Plus pump", amount: "€240.00" },
      { description: "Certified Plumbing & Connection Labor", amount: "€80.00" },
      { description: "Disposal of old unit", amount: "€20.00" },
    ],
  },
  {
    id: "inv-002",
    invoiceNumber: "INV-2026-0029",
    service: "Monthly Pool Maintenance (4 visits)",
    date: "17 Apr 2026",
    dueDate: "25 Apr 2026",
    amount: "€85.00",
    status: "Paid",
    subtotal: "€70.25",
    vatAmount: "€14.75",
    vatRate: "21%",
    lineItems: [
      { description: "Monthly Pool Maintenance (4 visits)", amount: "€70.25" },
      { description: "Chemical supplies & Salt balance", amount: "€0.00" },
    ],
  },
  {
    id: "inv-003",
    invoiceNumber: "INV-2026-0021",
    service: "Salt Cell Replacement & System Diagnostic",
    date: "04 Apr 2026",
    dueDate: "18 Apr 2026",
    amount: "€340.00",
    status: "Paid",
    subtotal: "€280.99",
    vatAmount: "€59.01",
    vatRate: "21%",
    lineItems: [
      { description: "Hayward Salt Chlorinator T-Cell 15 OEM", amount: "€260.00" },
      { description: "Installation & System Calibration Labor", amount: "€20.99" },
    ],
  },
  {
    id: "inv-004",
    invoiceNumber: "INV-2026-0018",
    service: "Monthly Pool Maintenance (4 visits)",
    date: "17 Mar 2026",
    dueDate: "25 Mar 2026",
    amount: "€85.00",
    status: "Paid",
    subtotal: "€70.25",
    vatAmount: "€14.75",
    vatRate: "21%",
    lineItems: [
      { description: "Monthly Pool Maintenance (4 visits)", amount: "€70.25" },
    ],
  },
  {
    id: "inv-005",
    invoiceNumber: "INV-2026-0012",
    service: "Seasonal Pool Opening & Chemical Shock",
    date: "02 Mar 2026",
    dueDate: "16 Mar 2026",
    amount: "€165.00",
    status: "Paid",
    subtotal: "€136.36",
    vatAmount: "€28.64",
    vatRate: "21%",
    lineItems: [
      { description: "Comprehensive Spring Pool De-winterization", amount: "€110.00" },
      { description: "Chlorine Shock Treatment & Algaecide Dosage", amount: "€26.36" },
    ],
  },
  {
    id: "inv-006",
    invoiceNumber: "INV-2026-0008",
    service: "Monthly Pool Maintenance (Winter Plan)",
    date: "17 Feb 2026",
    dueDate: "25 Feb 2026",
    amount: "€65.00",
    status: "Paid",
    subtotal: "€53.72",
    vatAmount: "€11.28",
    vatRate: "21%",
    lineItems: [
      { description: "Bi-weekly Winter Pool Inspection & Chemistry", amount: "€53.72" },
    ],
  },
];

/**
 * GET: Fetch Invoices
 */
export async function getInvoices(
  params?: BillingFilterParams
): Promise<{ success: boolean; data: InvoiceRecord[]; total: number }> {
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
     * const res = await fetchWithAuth(`/api/invoices?${query.toString()}`, {
     *   method: "GET",
     *   next: { tags: ["invoices"] },
     * });
     * return await res.json();
     * ==============================================================================
     */

    let invoices = [...MOCK_INVOICE_RECORDS];

    if (params?.status && params.status !== "all") {
      const filterStatus = params.status.toLowerCase();
      invoices = invoices.filter(
        (inv) => inv.status.toLowerCase() === filterStatus
      );
    }

    if (params?.search) {
      const q = params.search.toLowerCase();
      invoices = invoices.filter(
        (inv) =>
          inv.invoiceNumber.toLowerCase().includes(q) ||
          inv.service.toLowerCase().includes(q) ||
          inv.date.toLowerCase().includes(q)
      );
    }

    return {
      success: true,
      data: invoices,
      total: invoices.length,
    };
  } catch (error: any) {
    console.error("Error fetching invoices:", error);
    return {
      success: false,
      data: MOCK_INVOICE_RECORDS,
      total: MOCK_INVOICE_RECORDS.length,
    };
  }
}

/**
 * GET: Fetch single invoice details
 */
export async function getInvoiceDetail(
  invoiceId: string
): Promise<{ success: boolean; data: InvoiceRecord | null }> {
  try {
    const record =
      MOCK_INVOICE_RECORDS.find((inv) => inv.id === invoiceId) ||
      MOCK_INVOICE_RECORDS[0];
    return { success: true, data: record };
  } catch (error) {
    console.error("Error fetching invoice detail:", error);
    return { success: false, data: null };
  }
}

/**
 * POST: Pay Invoice
 */
export async function payInvoice(
  invoiceId: string,
  paymentMethodId?: string
): Promise<{ success: boolean; message: string; transactionId?: string }> {
  try {
    /**
     * const res = await fetchWithAuth(`/api/invoices/${invoiceId}/pay`, {
     *   method: "POST",
     *   body: JSON.stringify({ paymentMethodId }),
     * });
     * revalidatePath("/billing");
     * return await res.json();
     */
    console.log("Processing payment for invoice:", invoiceId, paymentMethodId);
    // revalidatePath("/billing");
    return {
      success: true,
      transactionId: `TXN-${Date.now()}`,
      message: "Payment processed successfully.",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Payment processing failed.",
    };
  }
}

/**
 * GET: Download Invoice PDF
 */
export async function downloadInvoicePdf(
  invoiceId: string
): Promise<{ success: boolean; downloadUrl?: string; message: string }> {
  try {
    return {
      success: true,
      downloadUrl: `/sample-invoice-${invoiceId}.pdf`,
      message: "Invoice download link generated.",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to download invoice.",
    };
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */

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
 * Matches Figma Node 40014296:6051
 */
export const MOCK_INVOICE_RECORDS: InvoiceRecord[] = [
  {
    id: "inv-001",
    invoiceNumber: "INV-2026-0034",
    service: "Monthly Pool Maintenance (4 visits)",
    date: "17 May 2026",
    dueDate: "25 May 2026",
    amount: "€85.00",
    status: "Outstanding",
    subtotal: "€70.25",
    vatAmount: "€14.75",
    vatRate: "21%",
    lineItems: [
      { description: "Monthly Pool Maintenance (4 visits)", amount: "€70.25" },
      { description: "Chemical supplies & Salt balance", amount: "€0.00" },
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

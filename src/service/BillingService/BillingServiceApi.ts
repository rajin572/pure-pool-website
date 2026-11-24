import { get } from "@/lib/apiRequest";

export type TInvoiceKind = "INSTALLATION" | "REPAIR" | "REPAIR_DEPOSIT" | "REPAIR_BALANCE" | "EXTRA" | "RENEWAL" | "MANUAL";
export type TInvoiceStatus = "ISSUED" | "PAID" | "VOID";
export type TInvoiceDisplayStatus = "WAITING" | "OVERDUE" | "PAID" | "VOID";
export type TInvoiceWhatFor = "YEARLY_PLAN" | "REPAIR" | "EXTRA_WORK";

export interface IInvoiceLineItem {
  description: string;
  details?: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface IInvoiceEvent {
  type: "ISSUED" | "VIEWED" | "REMINDER_SENT" | "PAID" | "VOIDED";
  at: string;
  note?: string;
}

/** `Invoice`, customer-visible fields (DRAFT invoices never reach the customer). */
export interface InvoiceRecord {
  _id: string;
  number: string;
  poolId: { _id: string; name: string } | string | null;
  kind: TInvoiceKind;
  whatFor: TInvoiceWhatFor;
  status: TInvoiceStatus;
  displayStatus: TInvoiceDisplayStatus;
  daysLate: number;
  balanceDue: number;
  lineItems: IInvoiceLineItem[];
  subtotal: number;
  taxAmount: number;
  total: number;
  currency: string;
  issuedAt?: string | null;
  dueAt?: string | null;
  paidAt?: string | null;
  notes?: string;
  events: IInvoiceEvent[];
}

export interface IInvoiceListCounts {
  all: number;
  paid: number;
  waiting: number;
  overdue: number;
  outstanding: number;
}

export interface BillingFilterParams {
  [key: string]: string | number | boolean | undefined;
  tab?: "paid" | "outstanding";
  sort?: "newest" | "oldest" | "amount-desc" | "amount-asc";
  page?: number;
  limit?: number;
}

export const getInvoices = (params?: BillingFilterParams) => get<InvoiceRecord[]>("/invoices", params);
export const getInvoiceDetail = (invoiceId: string) => get<InvoiceRecord>(`/invoices/${invoiceId}`);

import { get, post } from "@/lib/apiRequest";

export type TQuoteKind = "INSTALLATION" | "REPAIR" | "EXTRA" | "OTHER";
export type TQuoteCustomerStatus = "PREPARING" | "PENDING" | "ACCEPTED" | "PAST";
export type TQuoteStatus = "SENT" | "ACCEPTED" | "DECLINED" | "EXPIRED" | "CANCELLED";

export interface IQuoteLineItem {
  description: string;
  details?: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface IQuoteTechnician {
  id: string;
  name: string;
  avatarUrl?: string;
  jobTitle?: string;
  area?: string;
}

/** `Quote`, customer projection (no `officeNote`). */
export interface QuoteRecord {
  _id: string;
  number?: string;
  kind: TQuoteKind;
  status: TQuoteStatus;
  customerStatus: TQuoteCustomerStatus;
  title?: string;
  poolId: { _id: string; name: string } | string;
  items: IQuoteLineItem[];
  subtotal?: number;
  taxRate?: number;
  taxAmount?: number;
  total?: number;
  currency: string;
  validUntil?: string;
  sentAt?: string;
  customerNote?: string;
  message?: string;
  photos: string[];
  acceptedAt?: string;
  declinedAt?: string;
  declineReason?: string;
  declineNote?: string;
  signatureRequired: boolean;
  repairBillingStatus: string;
  contractId?: string;
  invoiceId?: string;
  technician?: IQuoteTechnician | null;
  daysLeft: number | null;
  waitingDays: number;
}

export interface QuotesFilterParams {
  [key: string]: string | number | boolean | undefined;
  tab?: "pending" | "accepted" | "past";
  search?: string;
  page?: number;
  limit?: number;
}

export const getQuotes = (params?: QuotesFilterParams) => get<QuoteRecord[]>("/quotes", params);
export const getQuoteDetail = (quoteId: string) => get<QuoteRecord>(`/quotes/${quoteId}`);

export const DECLINE_REASONS: { label: string; value: string }[] = [
  { label: "Too expensive", value: "TOO_EXPENSIVE" },
  { label: "I'm getting another quote", value: "ANOTHER_QUOTE" },
  { label: "Not needed right now", value: "NOT_NEEDED_NOW" },
  { label: "I'd like to discuss it first", value: "DISCUSS_FIRST" },
  { label: "Other", value: "OTHER" },
];

export interface IRespondResult {
  quote: QuoteRecord;
  contractId?: string;
  nextStep: "SIGN_CONTRACT" | "SIGN_REPAIR" | "PAY_INVOICE" | null;
}

export const respondToQuote = (quoteId: string, accept: boolean, reason?: string, note?: string) =>
  post<IRespondResult>(`/quotes/${quoteId}/respond`, { accept, reason, note });

export const reopenQuote = (quoteId: string) => post<QuoteRecord>(`/quotes/${quoteId}/reopen`);

export const signRepairQuote = (quoteId: string, signerName: string) =>
  post<{ quote: QuoteRecord; invoice: { _id: string; number?: string; total: number } }>(`/quotes/${quoteId}/repair-sign`, {
    agree: true,
    signerName,
  });

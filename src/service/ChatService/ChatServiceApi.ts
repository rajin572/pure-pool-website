/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { fetchWithAuth } from "@/lib/fetchWraper";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  suggestedActions?: { label: string; query: string }[];
}

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: "msg-welcome",
    role: "assistant",
    content:
      "Hello! I'm your Pure Pool AI Assistant. How can I help you today? You can ask me about pool water issues, scheduled maintenance, equipment warranties, or how to settle an invoice.",
    timestamp: "Just now",
    suggestedActions: [
      { label: "Emergency Hotline", query: "What is the emergency hotline?" },
      { label: "Water is Cloudy", query: "My pool water is cloudy and murky" },
      { label: "Pay an Invoice", query: "How do I pay an invoice?" },
      { label: "Warranty Lookup", query: "Where can I find equipment warranties?" },
    ],
  },
];

const PREDEFINED_REPLIES: Record<string, string> = {
  emergency:
    "🚨 For immediate emergencies (active pump leak, flooding, electrical hazard), please call our 24/7 Madrid Emergency Hotline right away: +34 910 000 000. Technicians respond within 60–90 minutes.",
  cloudy:
    "Cloudy water is usually caused by low sanitizer (free chlorine), high pH (> 7.6), or a dirty sand/AFM glass filter. We recommend backwashing the filter for 3 minutes, testing pH & chlorine, and adding 1 liter of rapid clarifier. If it persists, our technician can inspect on the next visit.",
  invoice:
    "You can view and settle all invoices under your Invoices page (/invoices). Click 'View' next to any invoice to review the line items and click 'Pay Now' to complete payment via debit/credit card.",
  warranty:
    "All your manufacturer warranty certificates and equipment operating manuals are archived in the Documents page (/documents). You can view and download them at any time.",
  schedule:
    "Routine maintenance visits are conducted Monday through Friday between 08:00 and 17:00. You can review your technician's next scheduled arrival in your dashboard or message our team via WhatsApp at +34 600 123 456.",
};

/**
 * Send a message to the AI Chatbot
 */
export async function sendChatMessage(
  message: string,
  history: ChatMessage[] = []
): Promise<{ success: boolean; reply: string }> {
  try {
    /**
     * ==============================================================================
     * LIVE BACKEND REST / RTK QUERY INTEGRATION (Commented out ready for activation)
     * ==============================================================================
     * const response = await fetchWithAuth("/api/chat/message", {
     *   method: "POST",
     *   body: JSON.stringify({ message, history }),
     * });
     * return { success: true, reply: response.reply };
     * ==============================================================================
     */

    // Simulated intelligent assistant response
    const lower = message.toLowerCase();
    let reply =
      "Thank you for your question. I've logged your request. For personalized assistance, you can also reach our Madrid support team via WhatsApp at +34 600 123 456 or call our customer service.";

    if (lower.includes("emergency") || lower.includes("leak") || lower.includes("broken") || lower.includes("flood")) {
      reply = PREDEFINED_REPLIES.emergency;
    } else if (lower.includes("cloudy") || lower.includes("green") || lower.includes("algae") || lower.includes("chemical") || lower.includes("ph")) {
      reply = PREDEFINED_REPLIES.cloudy;
    } else if (lower.includes("invoice") || lower.includes("pay") || lower.includes("bill") || lower.includes("cost")) {
      reply = PREDEFINED_REPLIES.invoice;
    } else if (lower.includes("warranty") || lower.includes("manual") || lower.includes("document") || lower.includes("certificate")) {
      reply = PREDEFINED_REPLIES.warranty;
    } else if (lower.includes("visit") || lower.includes("technician") || lower.includes("time") || lower.includes("schedule")) {
      reply = PREDEFINED_REPLIES.schedule;
    }

    return { success: true, reply };
  } catch (error: any) {
    return {
      success: false,
      reply: "Sorry, I'm having trouble connecting right now. Please try again or contact support at support@purepool.es.",
    };
  }
}


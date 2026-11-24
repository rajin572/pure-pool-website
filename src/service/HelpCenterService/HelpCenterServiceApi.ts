/**
 * Help Center FAQs: static content, no backend endpoint (project-docs qa.md Q-11).
 * The contact form itself is wired in `SendMessageForm.tsx` directly against
 * `/conversations` (logged in) or `POST /public/leads` (logged out).
 */

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface EmergencyInfo {
  hotline: string;
  hotlineDisplay: string;
  customerService: string;
  customerServiceDisplay: string;
  customerServiceHours: string;
  whatsapp: string;
  whatsappDisplay: string;
  email: string;
  address: string;
  hours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
}

export const EMERGENCY_INFO: EmergencyInfo = {
  hotline: "+34910000000",
  hotlineDisplay: "+34 910 000 000",
  customerService: "+34910123456",
  customerServiceDisplay: "+34 910 123 456",
  customerServiceHours: "Mon-Fri: 8:00 - 19:00 · Sat: 9:00 - 14:00",
  whatsapp: "+34600123456",
  whatsappDisplay: "+34 600 123 456",
  email: "support@purepool.es",
  address: "Calle de Velázquez 45, 28001 Madrid, Spain",
  hours: {
    weekdays: "08:00 - 19:00",
    saturday: "09:00 - 14:00",
    sunday: "Emergency service only (24/7 hotline)",
  },
};

export const MOCK_HELP_FAQS: FAQItem[] = [
  {
    id: "faq-1",
    question: "How quickly can you attend to a pool emergency in Madrid?",
    answer:
      "For emergency calls placed to our 24/7 hotline (+34 910 000 000), our Madrid-based duty technicians arrive within 60 to 90 minutes anywhere across the Community of Madrid, equipped with emergency pumps, leak detection gear, and water remediation kits.",
    category: "Emergency",
  },
  {
    id: "faq-2",
    question: "What is included in the standard weekly maintenance visit?",
    answer:
      "Every weekly visit includes precision water testing, professional chemical dosing, vacuuming the pool bottom, surface skimming, wall brushing, emptying skimmer and pre-filter baskets, backwashing and rinsing filters, checking pump and chlorinator operation, and logging a digital inspection report in your client portal.",
    category: "Maintenance",
  },
  {
    id: "faq-3",
    question: "How do I reschedule a scheduled technician visit?",
    answer:
      "You can easily reschedule a scheduled visit directly through your portal dashboard under 'Service Schedule' or by sending our support team a quick WhatsApp message at least 24 hours prior to the appointment window.",
    category: "Scheduling",
  },
  {
    id: "faq-4",
    question: "What payment methods do you accept for invoices?",
    answer:
      "We accept SEPA direct debit subscriptions, all major credit/debit cards (Visa, Mastercard, American Express), and instant bank transfers. All invoices include detailed line items and official Spanish VAT (IVA 21%) compliance.",
    category: "Billing",
  },
  {
    id: "faq-5",
    question: "Can I pause or cancel my service during the winter months?",
    answer:
      "Yes! You can switch to our reduced Winter Protection Plan or pause routine cleaning with 14 days notice. We will properly winterize your filtration system, add winterization algaecide, and fit safety covers.",
    category: "Subscriptions",
  },
  {
    id: "faq-6",
    question: "How do I request warranty repairs on installed pool equipment?",
    answer:
      "All equipment supplied and installed by Pure Pool carries our 2-to-5 year warranty. You can view all warranty certificates directly under your Documents page and submit a service warranty ticket in one click.",
    category: "Warranty",
  },
];

export async function getHelpFaqs() {
  return MOCK_HELP_FAQS;
}


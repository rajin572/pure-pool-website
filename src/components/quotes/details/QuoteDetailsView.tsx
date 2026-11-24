"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import Container from "@/components/ui/CustomUi/Container";
import { QuoteRecord, getQuoteDetail, respondToQuote } from "@/service/QuotesService/QuotesServiceApi";
import QuoteHeader from "./QuoteHeader";
import QuoteStatusBanner from "./QuoteStatusBanner";
import QuoteBreakdownCard from "./QuoteBreakdownCard";
import QuotePhotosCard from "./QuotePhotosCard";
import QuoteTechnicianNotesCard from "./QuoteTechnicianNotesCard";
import QuoteNextStepsCard from "./QuoteNextStepsCard";
import QuoteSummarySidebar from "./QuoteSummarySidebar";
import DeclineQuoteModal from "./DeclineQuoteModal";

interface QuoteDetailsViewProps {
  quoteId: string;
}

export const QuoteDetailsView: React.FC<QuoteDetailsViewProps> = ({ quoteId }) => {
  const [quote, setQuote] = useState<QuoteRecord | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false);
  const [isDeclining, setIsDeclining] = useState(false);

  const refresh = async () => {
    const res = await getQuoteDetail(quoteId);
    if (res.success) setQuote(res.data);
    else setLoadError(res.error.message);
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await getQuoteDetail(quoteId);
      if (cancelled) return;
      if (res.success) setQuote(res.data);
      else setLoadError(res.error.message);
    })();
    return () => {
      cancelled = true;
    };
  }, [quoteId]);

  if (loadError) {
    return <div className="w-full min-h-screen flex items-center justify-center text-sm text-red-600">{loadError}</div>;
  }

  if (!quote) {
    return <div className="w-full min-h-screen flex items-center justify-center text-sm text-gray-500">Loading quote...</div>;
  }

  const handleConfirmDecline = async (reason: string, notes?: string) => {
    setIsDeclining(true);
    const res = await respondToQuote(quote._id, false, reason, notes);
    setIsDeclining(false);
    if (!res.success) {
      toast.error(res.error.message);
      return;
    }
    toast.success("Quote declined. You can reopen it any time.");
    setIsDeclineModalOpen(false);
    setQuote(res.data.quote);
  };

  return (
    <main className="w-full min-h-screen bg-[#F9FAFB] flex flex-col">
      <div className="w-full bg-[#041D37] h-20 sm:h-24 shadow-xs" />

      <div className="w-full py-8 sm:py-12">
        <Container>
          <div className="w-full flex flex-col gap-6 sm:gap-8">
            <QuoteHeader quote={quote} />

            <QuoteStatusBanner quote={quote} />

            <div className="w-full flex flex-col lg:flex-row items-start gap-6 lg:gap-8">
              <div className="w-full flex-1 flex flex-col gap-6 max-w-full lg:max-w-[840px]">
                <QuoteBreakdownCard quote={quote} />
                <QuotePhotosCard photos={quote.photos} />
                <QuoteTechnicianNotesCard quote={quote} />
                <QuoteNextStepsCard quote={quote} />
              </div>

              <QuoteSummarySidebar quote={quote} onOpenDeclineModal={() => setIsDeclineModalOpen(true)} onRefresh={refresh} />
            </div>
          </div>
        </Container>
      </div>

      <DeclineQuoteModal
        open={isDeclineModalOpen}
        onOpenChange={setIsDeclineModalOpen}
        validUntil={quote.validUntil ? new Date(quote.validUntil).toLocaleDateString() : undefined}
        isSubmitting={isDeclining}
        onConfirmDecline={handleConfirmDecline}
      />
    </main>
  );
};

export default QuoteDetailsView;

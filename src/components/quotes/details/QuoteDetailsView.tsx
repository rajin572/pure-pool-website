"use client";

import React, { useState } from "react";
import Container from "@/components/ui/CustomUi/Container";
import { QuoteRecord } from "@/service/QuotesService/QuotesServiceApi";
import QuoteHeader from "./QuoteHeader";
import QuoteStatusBanner from "./QuoteStatusBanner";
import QuoteBreakdownCard from "./QuoteBreakdownCard";
import QuotePhotosCard from "./QuotePhotosCard";
import QuoteTechnicianNotesCard from "./QuoteTechnicianNotesCard";
import QuoteNextStepsCard from "./QuoteNextStepsCard";
import QuoteSummarySidebar from "./QuoteSummarySidebar";
import DeclineQuoteModal from "./DeclineQuoteModal";

interface QuoteDetailsViewProps {
  initialQuote: QuoteRecord;
}

export const QuoteDetailsView: React.FC<QuoteDetailsViewProps> = ({
  initialQuote,
}) => {
  const [quote, setQuote] = useState<QuoteRecord>(initialQuote);
  const [status, setStatus] = useState<QuoteRecord["status"]>(initialQuote.status);
  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "info";
    message: string;
  } | null>(null);

  /**
   * ==============================================================================
   * REDUX RTK QUERY / REST API MUTATION HOOKS (Ready for backend connection):
   *
   * const [acceptQuoteMutation, { isLoading: isAccepting }] = useAcceptQuoteMutation();
   * const [declineQuoteMutation, { isLoading: isDeclining }] = useDeclineQuoteMutation();
   * const [reopenQuoteMutation, { isLoading: isReopening }] = useReopenQuoteMutation();
   * const [downloadPdfTrigger] = useLazyDownloadQuotePdfQuery();
   *
   * const handleAccept = async () => {
   *   try {
   *     const res = await acceptQuoteMutation({ id: quote.id }).unwrap();
   *     setStatus("Accepted");
   *   } catch (error) {
   *     console.error("Accept failed", error);
   *   }
   * };
   * ==============================================================================
   */

  const showToast = (message: string, type: "success" | "info" = "success") => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  const handleStatusChange = (newStatus: QuoteRecord["status"]) => {
    setStatus(newStatus);
    setQuote((prev) => ({ ...prev, status: newStatus }));
  };

  const handleAccept = () => {
    setStatus("Accepted");
    setQuote((prev) => ({
      ...prev,
      status: "Accepted",
      acceptedDate: "15 May 2026",
      scheduledDate: "Thursday 22 May, 09:00 – 11:00",
      scheduledTechnician: prev.technician?.name || "Álvaro Ruiz",
    }));
    showToast("Quote accepted! Work has been scheduled for Thursday 22 May, 09:00 – 11:00.");
  };

  const handleConfirmDecline = (reason: string, notes?: string) => {
    setStatus("Declined");
    setQuote((prev) => ({
      ...prev,
      status: "Declined",
      declinedDate: "15 May 2026",
      declinedReason: reason,
      notes: notes || prev.notes,
    }));
    showToast(`Quote declined (${reason}). You can reopen it at any time.`, "info");
  };

  const handleReopen = () => {
    setStatus("Pending Review");
    setQuote((prev) => ({
      ...prev,
      status: "Pending Review",
    }));
    showToast("Quote reopened. You can now accept or review changes.", "success");
  };

  const handleDownloadPdf = () => {
    showToast(`Downloading estimate PDF for ${quote.reference}…`, "info");
    // Simulated download action
    const link = document.createElement("a");
    link.href = "#";
    link.setAttribute("download", `${quote.reference}-Estimate.pdf`);
  };

  const handleDownloadReceipt = () => {
    showToast(`Generating receipt for ${quote.reference}…`, "info");
  };

  const handleMessageTechnician = () => {
    const techName = quote.technician?.name || "Álvaro Ruiz";
    showToast(`Opening secure channel to message ${techName}…`, "info");
  };

  const handleAskQuestion = () => {
    showToast("Support ticket draft created for quote inquiry.", "info");
  };

  return (
    <main className="w-full min-h-screen bg-[#F9FAFB] flex flex-col">
      {/* 1. Dark Top Bar: Provides clear contrast for the transparent fixed Navbar */}
      <div className="w-full bg-[#041D37] h-20 sm:h-24 shadow-xs" />

      {/* 2. Notification Toast banner */}
      {notification && (
        <div className="w-full bg-blue-600 text-white py-3 px-4 text-center text-sm font-semibold shadow-md animate-fadeIn transition-all">
          <Container>
            <div className="flex items-center justify-between gap-4">
              <span className="flex-1 text-center">{notification.message}</span>
              <button
                type="button"
                onClick={() => setNotification(null)}
                className="text-white/80 hover:text-white text-xs uppercase tracking-wider font-bold cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </Container>
        </div>
      )}

      {/* 3. Main Content Area */}
      <div className="w-full py-8 sm:py-12">
        <Container>
          <div className="w-full flex flex-col gap-6 sm:gap-8">
            {/* Header: Breadcrumb, Title, Status badge, Subtitle, Preview pills */}
            <QuoteHeader
              quote={quote}
              currentStatus={status}
              onStatusChange={handleStatusChange}
            />

            {/* Status Alert Banner (Accepted or Declined) */}
            <QuoteStatusBanner status={status} quote={quote} />

            {/* Two-Column Responsive Layout matching Figma */}
            <div className="w-full flex flex-col lg:flex-row items-start gap-6 lg:gap-8">
              {/* Left Column (840px / max-w-[840px]) */}
              <div className="w-full flex-1 flex flex-col gap-6 max-w-full lg:max-w-[840px]">
                {/* 1. Quote Breakdown Card */}
                <QuoteBreakdownCard quote={quote} />

                {/* 2. Photos Card with '+2 more' and Lightbox */}
                <QuotePhotosCard photos={quote.photos} />

                {/* 3. Notes From Technician */}
                <QuoteTechnicianNotesCard quote={quote} />

                {/* 4. What Happens Next Progression Card */}
                <QuoteNextStepsCard status={status} />
              </div>

              {/* Right Column (Sidebar - 400px) */}
              <QuoteSummarySidebar
                quote={quote}
                status={status}
                onAccept={handleAccept}
                onOpenDeclineModal={() => setIsDeclineModalOpen(true)}
                onReopen={handleReopen}
                onDownloadPdf={handleDownloadPdf}
                onDownloadReceipt={handleDownloadReceipt}
                onMessageTechnician={handleMessageTechnician}
                onAskQuestion={handleAskQuestion}
              />
            </div>
          </div>
        </Container>
      </div>

      {/* 4. Decline Quote Modal */}
      <DeclineQuoteModal
        open={isDeclineModalOpen}
        onOpenChange={setIsDeclineModalOpen}
        validUntil={quote.validUntil}
        onConfirmDecline={handleConfirmDecline}
      />
    </main>
  );
};

export default QuoteDetailsView;


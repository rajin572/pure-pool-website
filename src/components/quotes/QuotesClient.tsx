"use client";

import React, { useState, useRef, useMemo } from "react";
import { Search } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Container from "@/components/ui/CustomUi/Container";
import QuotesTable from "./QuotesTable";
import QuoteDetailsModal from "./QuoteDetailsModal";
import { QuoteRecord } from "@/service/QuotesService/QuotesServiceApi";
import { prefersReducedMotion } from "@/lib/gsap-util";
import QuotesHero from "./QuotesHero";

interface QuotesClientProps {
  initialQuotes: QuoteRecord[];
  total: number;
}

export const QuotesClient: React.FC<QuotesClientProps> = ({
  initialQuotes,
  total,
}) => {
  const [quotes, setQuotes] = useState<QuoteRecord[]>(initialQuotes);
  const [activeTab, setActiveTab] = useState<"pending" | "accepted" | "past">("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedQuote, setSelectedQuote] = useState<QuoteRecord | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (prefersReducedMotion()) return;

    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }
      );
    }
  }, []);

  const filteredQuotes = useMemo(() => {
    return quotes.filter((q) => {
      const matchesTab =
        (activeTab === "pending" && q.status === "Pending Review") ||
        (activeTab === "accepted" && q.status === "Accepted") ||
        (activeTab === "past" && (q.status === "Declined" || q.status === "Expired"));

      const matchesSearch =
        !searchTerm.trim() ||
        q.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.forService.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.poolName.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesTab && matchesSearch;
    });
  }, [quotes, activeTab, searchTerm]);

  const handleViewQuote = (quote: QuoteRecord) => {
    setSelectedQuote(quote);
    setIsDetailsModalOpen(true);
  };

  const handleStatusChange = (newStatus: QuoteRecord["status"]) => {
    if (selectedQuote) {
      setQuotes((prev) =>
        prev.map((item) =>
          item.id === selectedQuote.id ? { ...item, status: newStatus } : item
        )
      );
    }
  };

  return (
    <main className="w-full min-h-screen flex flex-col bg-[#F9FAFB]">
      {/* 1. Hero Section matching About & My Pool */}
      <QuotesHero />

      {/* 2. Main Content Area */}
      <div className="w-full py-10 md:py-14">
        <Container>
          <div ref={contentRef} className="flex flex-col gap-6">
            {/* Controls: Segmented Filter Switcher & Search Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Switcher matching Figma Node 40014298:7760 */}
              <div className="inline-flex p-1 bg-[#F1F1F3] rounded-2xl border border-gray-200/80 w-fit">
                {(["pending", "accepted", "past"] as const).map((tab) => {
                  const isActive = activeTab === tab;
                  const label =
                    tab === "pending"
                      ? "Pending"
                      : tab === "accepted"
                        ? "Accepted"
                        : "Past";
                  return (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      className={`px-5 py-2 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer ${isActive
                          ? "bg-white text-gray-900 shadow-xs border border-gray-200/60"
                          : "text-gray-500 hover:text-gray-900"
                        }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              {/* Search Input */}
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search technicians , note , date"
                  className="w-full h-11 pl-10 pr-4 rounded-lg bg-white border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-xs transition-all"
                />
              </div>
            </div>

            {/* Quotes Table */}
            <div className="w-full">
              <QuotesTable
                data={filteredQuotes}
                onViewQuote={handleViewQuote}
                total={total}
              />
            </div>
          </div>
        </Container>
      </div>

      {/* Quote Details Modal */}
      <QuoteDetailsModal
        open={isDetailsModalOpen}
        onOpenChange={setIsDetailsModalOpen}
        quote={selectedQuote}
        onStatusChange={handleStatusChange}
      />
    </main>
  );
};

export default QuotesClient;

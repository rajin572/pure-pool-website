"use client";

import React, { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Container from "@/components/ui/CustomUi/Container";
import QuotesTable from "./QuotesTable";
import { getQuotes, type QuoteRecord } from "@/service/QuotesService/QuotesServiceApi";
import { prefersReducedMotion } from "@/lib/gsap-util";
import QuotesHero from "./QuotesHero";

export const QuotesClient: React.FC = () => {
  const [quotes, setQuotes] = useState<QuoteRecord[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"pending" | "accepted" | "past">("pending");
  const [searchTerm, setSearchTerm] = useState("");

  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    if (contentRef.current) {
      gsap.fromTo(contentRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" });
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await getQuotes({ tab: activeTab, limit: 100 });
      if (cancelled) return;
      if (res.success) setQuotes(res.data);
      else setLoadError(res.error.message);
    })();
    return () => {
      cancelled = true;
    };
  }, [activeTab]);

  const filteredQuotes = (quotes || []).filter((q) => {
    if (!searchTerm.trim()) return true;
    const pool = typeof q.poolId === "object" ? q.poolId.name : "";
    const term = searchTerm.toLowerCase();
    return (q.number || "").toLowerCase().includes(term) || (q.title || "").toLowerCase().includes(term) || pool.toLowerCase().includes(term);
  });

  return (
    <main className="w-full min-h-screen flex flex-col bg-[#F9FAFB]">
      <QuotesHero />

      <div className="w-full py-10 md:py-14">
        <Container>
          <div ref={contentRef} className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="inline-flex p-1 bg-[#F1F1F3] rounded-2xl border border-gray-200/80 w-fit">
                {(["pending", "accepted", "past"] as const).map((tab) => {
                  const isActive = activeTab === tab;
                  const label = tab === "pending" ? "Pending" : tab === "accepted" ? "Accepted" : "Past";
                  return (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      className={`px-5 py-2 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer ${
                        isActive ? "bg-white text-gray-900 shadow-xs border border-gray-200/60" : "text-gray-500 hover:text-gray-900"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              <div className="relative w-full md:w-96">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by reference, service or pool"
                  className="w-full h-11 pl-10 pr-4 rounded-lg bg-white border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-xs transition-all"
                />
              </div>
            </div>

            <div className="w-full">
              {!quotes ? (
                <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs py-16 text-center text-sm text-gray-500">Loading your quotes...</div>
              ) : loadError ? (
                <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs py-16 text-center text-sm text-red-600">{loadError}</div>
              ) : filteredQuotes.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs py-16 text-center text-sm text-gray-500">No quotes in this state.</div>
              ) : (
                <QuotesTable data={filteredQuotes} total={filteredQuotes.length} />
              )}
            </div>
          </div>
        </Container>
      </div>
    </main>
  );
};

export default QuotesClient;

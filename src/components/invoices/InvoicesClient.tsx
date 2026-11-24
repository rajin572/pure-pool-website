"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Container from "@/components/ui/CustomUi/Container";
import InvoicesHeader from "./InvoicesHeader";
import InvoicesToolbar, { InvoiceStatusFilter } from "./InvoicesToolbar";
import InvoicesTable from "./InvoicesTable";
import InvoiceViewModal from "./InvoiceViewModal";
import { getInvoices, InvoiceRecord } from "@/service/BillingService/BillingServiceApi";
import { prefersReducedMotion } from "@/lib/gsap-util";

const TAB_PARAM: Record<InvoiceStatusFilter, "paid" | "outstanding" | undefined> = {
  all: undefined,
  paid: "paid",
  outstanding: "outstanding",
};
const SORT_PARAM: Record<string, "newest" | "oldest" | "amount-desc" | "amount-asc"> = {
  newest: "newest",
  oldest: "oldest",
  "amount-high": "amount-desc",
  "amount-low": "amount-asc",
};

export const InvoicesClient: React.FC = () => {
  const [invoices, setInvoices] = useState<InvoiceRecord[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [activeTab, setActiveTab] = useState<InvoiceStatusFilter>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceRecord | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    if (containerRef.current) {
      gsap.fromTo(containerRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" });
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await getInvoices({ tab: TAB_PARAM[activeTab], sort: SORT_PARAM[sortBy], limit: 100 });
      if (cancelled) return;
      if (res.success) {
        setInvoices(res.data);
        if (res.meta?.counts) setCounts(res.meta.counts);
      } else {
        setLoadError(res.error.message);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [activeTab, sortBy]);

  const filteredInvoices = (invoices || []).filter((inv) => {
    if (!searchTerm.trim()) return true;
    const query = searchTerm.toLowerCase();
    return inv.number.toLowerCase().includes(query) || inv.whatFor.toLowerCase().includes(query);
  });

  const handleViewClick = (invoice: InvoiceRecord) => {
    setSelectedInvoice(invoice);
    setIsViewModalOpen(true);
  };

  return (
    <main className="w-full min-h-screen bg-[#F8F9FA] pb-24">
      <div className="w-full bg-[#041D37] h-20 sm:h-24 shadow-xs" />

      <div className="w-full pt-10 sm:pt-14">
        <Container>
          <div ref={containerRef} className="flex flex-col gap-6 sm:gap-8">
            <InvoicesHeader />

            <InvoicesToolbar
              activeTab={activeTab}
              onSelectTab={(tab) => {
                setActiveTab(tab);
                setCurrentPage(1);
              }}
              searchTerm={searchTerm}
              onSearchChange={(val) => {
                setSearchTerm(val);
                setCurrentPage(1);
              }}
              sortBy={sortBy}
              onSortChange={setSortBy}
              counts={{ all: counts.all ?? 0, paid: counts.paid ?? 0, outstanding: counts.outstanding ?? 0 }}
            />

            <div className="w-full">
              {!invoices ? (
                <div className="bg-white rounded-2xl border border-zinc-200/90 shadow-2xs py-16 text-center text-sm text-zinc-500">Loading your invoices...</div>
              ) : loadError ? (
                <div className="bg-white rounded-2xl border border-zinc-200/90 shadow-2xs py-16 text-center text-sm text-red-600">{loadError}</div>
              ) : filteredInvoices.length === 0 ? (
                <div className="bg-white rounded-2xl border border-zinc-200/90 shadow-2xs py-16 text-center text-sm text-zinc-500">No invoices in this state.</div>
              ) : (
                <InvoicesTable
                  data={filteredInvoices}
                  onViewClick={handleViewClick}
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
                  total={filteredInvoices.length}
                />
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between text-xs sm:text-sm text-zinc-500 gap-2 px-1">
              <span>
                Showing 1–{filteredInvoices.length} of {counts.all ?? filteredInvoices.length} invoices
              </span>
              <span>All amounts displayed include Spanish VAT (IVA 21%)</span>
            </div>
          </div>
        </Container>
      </div>

      <InvoiceViewModal open={isViewModalOpen} onOpenChange={setIsViewModalOpen} invoice={selectedInvoice} />
    </main>
  );
};

export default InvoicesClient;

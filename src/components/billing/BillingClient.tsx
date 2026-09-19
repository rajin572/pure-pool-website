"use client";

import React, { useState, useRef, useMemo } from "react";
import { Search } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Container from "@/components/ui/CustomUi/Container";
import BillingTable from "./BillingTable";
import PayInvoiceModal from "./PayInvoiceModal";
import { InvoiceRecord, downloadInvoicePdf } from "@/service/BillingService/BillingServiceApi";
import { prefersReducedMotion } from "@/lib/gsap-util";
import BillingHero from "./BillingHero";

interface BillingClientProps {
  initialInvoices: InvoiceRecord[];
  total: number;
}

export const BillingClient: React.FC<BillingClientProps> = ({
  initialInvoices,
  total,
}) => {
  const [invoices, setInvoices] = useState<InvoiceRecord[]>(initialInvoices);
  const [activeTab, setActiveTab] = useState<"all" | "paid" | "outstanding">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceRecord | null>(null);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);

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

  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const matchesTab =
        activeTab === "all" ||
        (activeTab === "paid" && inv.status === "Paid") ||
        (activeTab === "outstanding" && inv.status === "Outstanding");

      const matchesSearch =
        !searchTerm.trim() ||
        inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.date.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesTab && matchesSearch;
    });
  }, [invoices, activeTab, searchTerm]);

  const handlePayClick = (inv: InvoiceRecord) => {
    setSelectedInvoice(inv);
    setIsPayModalOpen(true);
  };

  const handleDownloadClick = async (inv: InvoiceRecord) => {
    const res = await downloadInvoicePdf(inv.id);
    if (res.success && res.downloadUrl) {
      alert(`Downloading official tax receipt for ${inv.invoiceNumber}...`);
    }
  };

  const handlePaymentSuccess = () => {
    if (selectedInvoice) {
      setInvoices((prev) =>
        prev.map((i) =>
          i.id === selectedInvoice.id ? { ...i, status: "Paid" } : i
        )
      );
    }
  };

  return (
    <main className="w-full min-h-screen flex flex-col bg-[#F9FAFB]">
      {/* 1. Hero Section matching About & My Pool */}
      <BillingHero />

      {/* 2. Main Content Area */}
      <div className="w-full py-10 md:py-14">
        <Container>
          <div ref={contentRef} className="flex flex-col gap-6">
            {/* Controls: Segmented Filter Switcher & Search Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Switcher matching Figma Node 40014296:7069 */}
              <div className="inline-flex p-1 bg-[#F1F1F3] rounded-2xl border border-gray-200/80 w-fit">
                {(["all", "paid", "outstanding"] as const).map((tab) => {
                  const isActive = activeTab === tab;
                  const label =
                    tab === "all" ? "All" : tab === "paid" ? "Paid" : "Outstanding";
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

            {/* Invoices Table */}
            <div className="w-full">
              <BillingTable
                data={filteredInvoices}
                onPayClick={handlePayClick}
                onDownloadClick={handleDownloadClick}
                total={total}
              />
            </div>
          </div>
        </Container>
      </div>

      {/* Pay Invoice Modal */}
      <PayInvoiceModal
        open={isPayModalOpen}
        onOpenChange={setIsPayModalOpen}
        invoice={selectedInvoice}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </main>
  );
};

export default BillingClient;

"use client";

import React, { useState, useRef, useMemo } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Container from "@/components/ui/CustomUi/Container";
import InvoicesHeader from "./InvoicesHeader";
import InvoicesToolbar, { InvoiceStatusFilter } from "./InvoicesToolbar";
import InvoicesTable from "./InvoicesTable";
import InvoiceViewModal from "./InvoiceViewModal";
import {
  InvoiceRecord,
  downloadInvoicePdf,
} from "@/service/BillingService/BillingServiceApi";
import { prefersReducedMotion } from "@/lib/gsap-util";

/**
 * ==============================================================================
 * REDUX / API HOOKS (Ready for live backend integration)
 * ==============================================================================
 * When wiring up backend:
 * import { useGetInvoicesQuery, usePayInvoiceMutation } from "@/redux/api/billingApi";
 * const { data: liveInvoices, isLoading } = useGetInvoicesQuery({ status: activeTab, search: searchTerm });
 * const [payInvoice] = usePayInvoiceMutation();
 * ==============================================================================
 */

interface InvoicesClientProps {
  initialInvoices: InvoiceRecord[];
  total: number;
}

export const InvoicesClient: React.FC<InvoicesClientProps> = ({
  initialInvoices,
  total,
}) => {
  const [invoices, setInvoices] = useState<InvoiceRecord[]>(initialInvoices);
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
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
      );
    }
  }, []);

  // Calculate live counts
  const counts = useMemo(() => {
    const all = invoices.length;
    const paid = invoices.filter((i) => i.status === "Paid").length;
    const outstanding = invoices.filter((i) => i.status === "Outstanding").length;
    return { all, paid, outstanding };
  }, [invoices]);

  // Filter and sort invoices
  const filteredInvoices = useMemo(() => {
    let result = invoices.filter((inv) => {
      const matchesTab =
        activeTab === "all" ||
        (activeTab === "paid" && inv.status === "Paid") ||
        (activeTab === "outstanding" && inv.status === "Outstanding");

      const query = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !query ||
        inv.invoiceNumber.toLowerCase().includes(query) ||
        inv.service.toLowerCase().includes(query) ||
        (inv.period && inv.period.toLowerCase().includes(query)) ||
        inv.date.toLowerCase().includes(query);

      return matchesTab && matchesSearch;
    });

    // Sorting
    result = [...result].sort((a, b) => {
      if (sortBy === "oldest") {
        return a.date.localeCompare(b.date);
      }
      if (sortBy === "amount-high") {
        const numA = parseFloat(a.amount.replace(/[^0-9.]/g, "")) || 0;
        const numB = parseFloat(b.amount.replace(/[^0-9.]/g, "")) || 0;
        return numB - numA;
      }
      if (sortBy === "amount-low") {
        const numA = parseFloat(a.amount.replace(/[^0-9.]/g, "")) || 0;
        const numB = parseFloat(b.amount.replace(/[^0-9.]/g, "")) || 0;
        return numA - numB;
      }
      // default: newest
      return b.invoiceNumber.localeCompare(a.invoiceNumber);
    });

    return result;
  }, [invoices, activeTab, searchTerm, sortBy]);

  const handleViewClick = (invoice: InvoiceRecord) => {
    setSelectedInvoice(invoice);
    setIsViewModalOpen(true);
  };

  const handleDownloadClick = async (invoice: InvoiceRecord) => {
    const res = await downloadInvoicePdf(invoice.id);
    if (res.success && res.downloadUrl) {
      alert(`Downloading official tax receipt for ${invoice.invoiceNumber}...`);
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
    <main className="w-full min-h-screen bg-[#F8F9FA] pb-24">
      {/* Top Contrast Bar for transparent fixed Navbar */}
      <div className="w-full bg-[#041D37] h-20 sm:h-24 shadow-xs" />

      <div className="w-full pt-10 sm:pt-14">
        <Container>
          <div ref={containerRef} className="flex flex-col gap-6 sm:gap-8">
            {/* Header */}
            <InvoicesHeader />

            {/* Toolbar */}
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
              counts={counts}
            />

            {/* Invoices Table */}
            <div className="w-full">
              <InvoicesTable
                data={filteredInvoices}
                onViewClick={handleViewClick}
                onDownloadClick={handleDownloadClick}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                total={filteredInvoices.length}
              />
            </div>

            {/* Footer Summary */}
            <div className="flex flex-col sm:flex-row items-center justify-between text-xs sm:text-sm text-zinc-500 gap-2 px-1">
              <span>
                Showing 1–{filteredInvoices.length} of {total} invoices
              </span>
              <span>All amounts displayed include Spanish VAT (IVA 21%)</span>
            </div>
          </div>
        </Container>
      </div>

      {/* Invoice Details & Payment Modal */}
      <InvoiceViewModal
        open={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
        invoice={selectedInvoice}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </main>
  );
};

export default InvoicesClient;


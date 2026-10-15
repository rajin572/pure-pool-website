"use client";

import React from "react";
import { Search, ChevronDown } from "lucide-react";

export type InvoiceStatusFilter = "all" | "paid" | "outstanding";

interface InvoicesToolbarProps {
  activeTab: InvoiceStatusFilter;
  onSelectTab: (tab: InvoiceStatusFilter) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  counts?: {
    all: number;
    paid: number;
    outstanding: number;
  };
}

export const InvoicesToolbar: React.FC<InvoicesToolbarProps> = ({
  activeTab,
  onSelectTab,
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  counts = { all: 6, paid: 5, outstanding: 1 },
}) => {
  const tabs: { label: string; value: InvoiceStatusFilter; count: number }[] = [
    { label: "All", value: "all", count: counts.all },
    { label: "Paid", value: "paid", count: counts.paid },
    { label: "Outstanding", value: "outstanding", count: counts.outstanding },
  ];

  return (
    <div className="w-full flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
      {/* Left: Search input & Status Tabs */}
      <div className="flex flex-wrap items-center gap-3 flex-1">
        {/* Search Input */}
        <div className="relative w-full sm:w-[300px] shrink-0">
          <Search className="w-5 h-5 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search invoices..."
            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-zinc-900 placeholder:text-zinc-400 text-sm sm:text-base font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-2xs"
          />
        </div>

        {/* Status Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {tabs.map((tab) => {
            const isSelected = activeTab === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => onSelectTab(tab.value)}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-xs"
                    : "bg-white border border-gray-200 text-zinc-800 hover:bg-gray-50/80"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                    isSelected ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right: Sort Dropdown */}
      <div className="relative shrink-0">
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="appearance-none px-4 py-3 pr-10 bg-white border border-gray-200 rounded-xl text-zinc-800 text-sm sm:text-base font-semibold cursor-pointer focus:outline-none focus:border-blue-500 shadow-2xs"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="amount-high">Amount: High to low</option>
          <option value="amount-low">Amount: Low to high</option>
        </select>
        <ChevronDown className="w-4 h-4 text-zinc-600 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  );
};

export default InvoicesToolbar;


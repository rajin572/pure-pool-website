"use client";

import React from "react";
import { Search, ChevronDown } from "lucide-react";

export type DocumentCategory = "All" | "Warranty" | "Manual" | "Certificate";

interface DocumentsToolbarProps {
  activeCategory: DocumentCategory;
  onSelectCategory: (category: DocumentCategory) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
}

const CATEGORIES: { label: string; value: DocumentCategory }[] = [
  { label: "All", value: "All" },
  { label: "Warranties", value: "Warranty" },
  { label: "Manuals", value: "Manual" },
  { label: "Certificates", value: "Certificate" },
];

export const DocumentsToolbar: React.FC<DocumentsToolbarProps> = ({
  activeCategory,
  onSelectCategory,
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
}) => {
  return (
    <div className="w-full flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
      {/* Left: Search input & Category Chips */}
      <div className="flex flex-wrap items-center gap-3 flex-1">
        {/* Search Input */}
        <div className="relative w-full sm:w-[300px] shrink-0">
          <Search className="w-5 h-5 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search documents"
            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-zinc-900 placeholder:text-zinc-400 text-sm sm:text-base font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-2xs"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {CATEGORIES.map((cat) => {
            const isSelected = activeCategory === cat.value;
            return (
              <button
                key={cat.value}
                type="button"
                onClick={() => onSelectCategory(cat.value)}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-xs"
                    : "bg-white border border-gray-200 text-zinc-800 hover:bg-gray-50/80"
                }`}
              >
                {cat.label}
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
          <option value="name">Name (A–Z)</option>
        </select>
        <ChevronDown className="w-4 h-4 text-zinc-600 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  );
};

export default DocumentsToolbar;


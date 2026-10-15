"use client";

import React, { useState, useMemo } from "react";
import Accordion from "@/components/ui/CustomUi/Accordion";
import { FAQItem, MOCK_HELP_FAQS } from "@/service/HelpCenterService/HelpCenterServiceApi";

interface HelpCenterFaqSectionProps {
  initialFaqs?: FAQItem[];
}

export const HelpCenterFaqSection: React.FC<HelpCenterFaqSectionProps> = ({
  initialFaqs = MOCK_HELP_FAQS,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = useMemo(() => {
    const set = new Set<string>();
    initialFaqs.forEach((f) => {
      if (f.category) set.add(f.category);
    });
    return ["All", ...Array.from(set)];
  }, [initialFaqs]);

  const filteredFaqs = useMemo(() => {
    if (activeCategory === "All") return initialFaqs;
    return initialFaqs.filter((f) => f.category === activeCategory);
  }, [initialFaqs, activeCategory]);

  return (
    <div className="w-full bg-white rounded-2xl border border-zinc-200/90 p-6 sm:p-8 shadow-2xs flex flex-col gap-6">
      {/* FAQ Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-zinc-100">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">
            Clear Answers
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-zinc-500 font-medium">
            Everything you need to know about our maintenance plans, emergency visits, water quality, and billing.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 shrink-0">
          {categories.map((cat) => {
            const isSelected = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-sky-600 text-white shadow-2xs"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Accordion List */}
      <div className="w-full divide-y divide-zinc-200">
        {filteredFaqs.map((faq, idx) => (
          <Accordion
            key={faq.id}
            item={{
              question: faq.question,
              answer: faq.answer,
            }}
            defaultOpen={idx === 0}
            variant="bordered"
            className="py-1 first:border-t-0"
            questionClassName="text-base sm:text-lg font-bold text-zinc-900"
            answerClassName="text-zinc-600 text-sm sm:text-base leading-relaxed"
          />
        ))}
      </div>
    </div>
  );
};

export default HelpCenterFaqSection;


"use client";

import React from "react";
import Container from "@/components/ui/CustomUi/Container";
import { cn } from "@/lib/utils";

export type MyPoolTabKey =
  | "overview"
  | "water_condition"
  | "equipment"
  | "service_visit";

interface TabItem {
  key: MyPoolTabKey;
  label: string;
}

const TABS: TabItem[] = [
  { key: "overview", label: "Overview" },
  { key: "water_condition", label: "Water Condition" },
  { key: "equipment", label: "Equipment" },
  { key: "service_visit", label: "Service Visit" },
];

interface MyPoolTabsNavProps {
  activeTab: MyPoolTabKey;
  onTabChange: (tab: MyPoolTabKey) => void;
}

export const MyPoolTabsNav: React.FC<MyPoolTabsNavProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="w-full bg-white border-b border-gray-200 sticky top-0 z-20 shadow-xs">
      <Container>
        <nav
          className="flex items-center gap-6 sm:gap-8 overflow-x-auto no-scrollbar pt-4"
          aria-label="Pool Details Tabs"
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => onTabChange(tab.key)}
                className={cn(
                  "pb-3 text-base sm:text-lg font-semibold whitespace-nowrap transition-colors duration-150 relative cursor-pointer",
                  isActive
                    ? "text-sky-600"
                    : "text-gray-600 hover:text-gray-900"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {tab.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-600 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>
      </Container>
    </div>
  );
};

export default MyPoolTabsNav;


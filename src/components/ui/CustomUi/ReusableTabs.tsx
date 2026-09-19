"use client";

import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState, useTransition } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Container from "./Container";

gsap.registerPlugin(useGSAP);

type Tab<T extends string> = {
  label: string;
  value: T;
  disabled?: boolean;
  content: React.ReactNode;
};

type ReusableTabsProps<T extends string> = {
  tabs: Tab<T>[];
  activeTab: T;
  onTabChange?: (tab: T) => void;
  align?: "left" | "center" | "right";
  resetPage?: boolean;
  /** Query params to drop when switching tabs — e.g. a `search` or filter that only makes sense on the tab it was set from. */
  resetParams?: string[];
  tabContentStyle?: string;
  tabName?: string;
  variant?: "default" | "bordered";
  className?: string;
  headerWrapperClassName?: string;
  tabRowClassName?: string;
  containerClassName?: string;
  useContainer?: boolean;
};

const ReusableTabs = <T extends string>({
  tabs,
  activeTab,
  onTabChange,
  align = "center",
  resetPage = false,
  resetParams,
  tabContentStyle = "",
  tabName = "tab",
  variant = "default",
  className,
  headerWrapperClassName,
  tabRowClassName,
  containerClassName,
  useContainer = false,
}: ReusableTabsProps<T>) => {
  const tabRowRef = useRef<HTMLDivElement | null>(null);
  const indicatorRef = useRef<HTMLDivElement | null>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ offset: 0, width: 0 });
  // Per-tab clip-path inset (in px, from that tab's own left/right edges) describing
  // exactly how much of its white text overlay is hidden. Only the slice the pill is
  // currently over is left visible — so the wipe follows the pill pixel-for-pixel
  // instead of the whole label flipping white the moment any overlap starts.
  const [textClips, setTextClips] = useState<Record<string, { left: number; right: number }>>({});
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isPending, startTransition] = useTransition();

  // The pill spans the active tab's whole button — offsetLeft/offsetWidth are already
  // measured against the row's padding box, which is exactly the indicator's containing
  // block (the row is `relative`, the indicator is `absolute left-0`). So they need no
  // compensation for the row's border, padding, or scrollLeft the way rect math would.
  const updateIndicator = (target: HTMLElement) => {
    setIndicatorStyle({ offset: target.offsetLeft, width: target.offsetWidth });
  };

  // Runs on every animation frame while the pill slides — computes, per tab, exactly
  // how much of its label the pill's current bounds overlap, live.
  const handleIndicatorUpdate = (pillLeft: number, pillWidth: number) => {
    const row = tabRowRef.current;
    if (!row) return;

    const pillRight = pillLeft + pillWidth;

    const next: Record<string, { left: number; right: number }> = {};
    row.querySelectorAll<HTMLElement>("[tab-value]").forEach((el) => {
      const tabLeft = el.offsetLeft;
      const tabRight = tabLeft + el.offsetWidth;
      const value = el.getAttribute("tab-value") ?? "";

      const overlapLeft = Math.max(tabLeft, pillLeft);
      const overlapRight = Math.min(tabRight, pillRight);

      next[value] = overlapRight > overlapLeft
        ? { left: overlapLeft - tabLeft, right: tabRight - overlapRight }
        : { left: el.offsetWidth, right: 0 };
    });

    setTextClips(next);
  };

  useEffect(() => {
    const measureActiveTab = () => {
      const activeTabElement = tabRowRef.current?.querySelector<HTMLElement>(
        `[data-tab-button="${activeTab}"]`
      );
      if (activeTabElement) {
        updateIndicator(activeTabElement);
      }
    };

    measureActiveTab();

    // Re-measure after layout has rendered
    const rafId = requestAnimationFrame(measureActiveTab);
    document.fonts?.ready?.then(measureActiveTab);
    window.addEventListener("resize", measureActiveTab);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", measureActiveTab);
    };
  }, [activeTab]);

  const didPlaceIndicatorRef = useRef(false);

  useGSAP(() => {
    const indicator = indicatorRef.current;
    if (!indicator) return;

    const targetX = indicatorStyle.offset;
    const targetWidth = indicatorStyle.width;

    if (targetWidth === 0) return;

    if (!didPlaceIndicatorRef.current) {
      didPlaceIndicatorRef.current = true;
      gsap.set(indicator, { x: targetX, width: targetWidth });
      handleIndicatorUpdate(targetX, targetWidth);
      return;
    }

    gsap.to(indicator, {
      x: targetX,
      width: targetWidth,
      duration: 0.35,
      ease: "power2.out",
      onUpdate: () => {
        handleIndicatorUpdate(
          gsap.getProperty(indicator, "x") as number,
          gsap.getProperty(indicator, "width") as number
        );
      },
    });
  }, { dependencies: [indicatorStyle], scope: tabRowRef });

  const searchParams = useSearchParams();
  const pathName = usePathname();
  const router = useRouter();
  const { replace } = router;

  const justifyClass =
    align === "left"
      ? "justify-start"
      : align === "right"
        ? "justify-end"
        : "justify-center";

  const handleTabChange = (value: string) => {
    onTabChange?.(value as T);
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(tabName, value);
      if (resetPage) {
        params.set("page", "1");
        params.delete("search");
      }
      resetParams?.forEach((key) => params.delete(key));
    } else {
      params.delete(tabName);
    }

    startTransition(() => {
      replace(`${pathName}?${params.toString()}`, { scroll: false });
    });
  };

  const TabRow = (
    <div
      ref={tabRowRef}
      className={cn(
        "scrollbar-thin scrollbar-thumb-[#10b981] scrollbar-track-gray-200 hover:scrollbar-thumb-[#10b98155]",
        variant === "bordered"
          ? "p-0 flex gap-2 sm:gap-4 relative overflow-x-auto"
          : "bg-[#ffffff] p-1 rounded-xl flex gap-2 relative overflow-x-auto border border-base-color/10",
        tabRowClassName
      )}
    >
      {tabs.map((tab) => {
        const clip = textClips[tab.value];

        return (
          <button
            key={tab.value}
            data-tab-button={tab.value}
            disabled={tab.disabled || false}
            onClick={() => handleTabChange(tab.value)}
            className={cn(
              "px-4 sm:px-6 z-10 py-2.5 bg-transparent font-medium text-sm sm:text-base transition-all disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer whitespace-nowrap",
              variant === "bordered" ? "w-auto" : "w-full"
            )}
          >
            {variant === "bordered" ? (
              <span
                tab-value={tab.value}
                className={
                  activeTab === tab.value
                    ? "text-secondary-color font-bold tracking-tight"
                    : "text-gray-500 hover:text-gray-900 font-medium"
                }
              >
                {tab.label}
              </span>
            ) : (
              <span tab-value={tab.value} className="relative inline-block">
                <span className="text-secondary-color">{tab.label}</span>
                <span
                  className="absolute inset-0 text-white pointer-events-none"
                  style={{
                    clipPath: clip
                      ? `inset(0 ${clip.right}px 0 ${clip.left}px)`
                      : "inset(0 100% 0 0)",
                  }}
                >
                  {tab.label}
                </span>
              </span>
            )}
          </button>
        );
      })}
      <div
        ref={indicatorRef}
        className={cn(
          "indicator absolute left-0 z-0 pointer-events-none",
          variant === "bordered"
            ? "bottom-0 h-0.5 bg-secondary-color rounded-full"
            : "bottom-1 top-1 rounded-md bg-secondary-color"
        )}
      />
    </div>
  );

  return (
    <div className={cn("w-full h-fit overflow-hidden", className)}>
      <div className={cn(`w-full flex ${justifyClass}`, headerWrapperClassName)}>
        {useContainer ? (
          <Container className={containerClassName}>{TabRow}</Container>
        ) : (
          TabRow
        )}
      </div>

      <div className={cn("mt-10", tabContentStyle)}>
        {tabs.find((tab) => tab.value === activeTab)?.content}
      </div>
    </div>
  );
};

export { ReusableTabs, ReusableTabs as ReuseableTabs };
export default ReusableTabs;

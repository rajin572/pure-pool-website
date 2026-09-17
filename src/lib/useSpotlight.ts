"use client";

import { useEffect } from "react";
import { hasFinePointer } from "./gsap-util";

/**
 * Tracks the pointer over any descendant matching `cardSelector` and writes
 * --spot-x/--spot-y CSS vars for the .spotlight-card glow (see globals.css).
 */
export function useSpotlight(
  containerRef: React.RefObject<HTMLElement | null>,
  cardSelector: string
) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !hasFinePointer()) return;

    let frame = 0;

    const handleMove = (e: PointerEvent) => {
      const card = (e.target as HTMLElement)?.closest<HTMLElement>(cardSelector);
      if (!card || !container.contains(card)) return;

      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
        card.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
      });
    };

    container.addEventListener("pointermove", handleMove);
    return () => {
      container.removeEventListener("pointermove", handleMove);
      cancelAnimationFrame(frame);
    };
  }, [containerRef, cardSelector]);
}

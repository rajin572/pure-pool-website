"use client";

import { gsap, useGSAP, prefersReducedMotion, hasFinePointer } from "./gsap-util";

export interface UseMagneticOptions {
  /** How strongly the element follows the pointer (0-1). Default 0.3. */
  strength?: number;
}

/**
 * Pointer-follow "magnetic" pull for buttons/links, used site-wide for a premium hover feel.
 * No-ops on touch devices and when the visitor prefers reduced motion.
 *
 * Takes a plain ref (created with `useRef` by the caller, as usual) and attaches the pointer
 * listeners imperatively inside useGSAP — never as JSX event props — so the ref is only ever
 * read outside of render.
 */
export function useMagnetic<T extends HTMLElement>(
  nodeRef: React.RefObject<T | null>,
  { strength = 0.3 }: UseMagneticOptions = {}
) {
  useGSAP(
    () => {
      const node = nodeRef.current;
      if (!node || prefersReducedMotion() || !hasFinePointer()) return;

      const setX = gsap.quickTo(node, "x", { duration: 0.55, ease: "power3.out" });
      const setY = gsap.quickTo(node, "y", { duration: 0.55, ease: "power3.out" });

      const onPointerMove = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        const rect = node.getBoundingClientRect();
        setX((e.clientX - rect.left - rect.width / 2) * strength);
        setY((e.clientY - rect.top - rect.height / 2) * strength);
      };
      const onPointerLeave = () => {
        setX(0);
        setY(0);
      };

      node.addEventListener("pointermove", onPointerMove);
      node.addEventListener("pointerleave", onPointerLeave);
      return () => {
        node.removeEventListener("pointermove", onPointerMove);
        node.removeEventListener("pointerleave", onPointerLeave);
      };
    },
    { scope: nodeRef }
  );
}

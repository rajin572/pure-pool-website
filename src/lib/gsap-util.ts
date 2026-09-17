"use client";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase, useGSAP);

    // Signature deceleration curves used across the homepage for a consistent, premium feel
    CustomEase.create("premiumOut", "0.16, 1, 0.3, 1");
    CustomEase.create("premiumInOut", "0.65, 0, 0.35, 1");
    CustomEase.create("premiumSoft", "0.22, 1, 0.36, 1");

    // Refresh ScrollTrigger calculations after assets and web fonts are fully loaded
    window.addEventListener("load", () => {
        setTimeout(() => {
            ScrollTrigger.refresh();
        }, 100);
    });

    if (typeof document !== "undefined" && document.fonts) {
        document.fonts.ready.then(() => {
            setTimeout(() => {
                ScrollTrigger.refresh();
            }, 100);
        });
    }
}

/** True when the visitor's OS/browser requests reduced motion. Guard scroll/idle animations with this. */
export const prefersReducedMotion = () =>
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** True on devices with an accurate pointer (mouse/trackpad) — gate hover-only interactions like magnetic buttons and tilt. */
export const hasFinePointer = () =>
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(pointer: fine)").matches;

export { gsap, SplitText, ScrollTrigger, CustomEase, useGSAP };
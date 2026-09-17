"use client";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

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

export { gsap, SplitText, ScrollTrigger, useGSAP };
"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap-util";
import { cn } from "@/lib/utils";

interface SplitLinesRevealProps {
    text: string;
    className?: string;
    /**
     * Window event that (re)plays the reveal from the start. Omit to reveal
     * immediately on mount and skip the restart/reverse cycle entirely.
     */
    restartOnEvent?: string;
    /** Window event that reverses the reveal, hiding it again. */
    reverseOnEvent?: string;
}

/**
 * Splits `text` into lines, each clipped inside its own mask, and rises them
 * into view staggered top to bottom — a distinct treatment from
 * WaveColorShift's per-character wave used elsewhere in the hero. Mirrors
 * Contact's "restart none none reverse" pattern: `restartOnEvent` replays it
 * every time it comes back into view, `reverseOnEvent` hides it again when
 * scrolling back out.
 */
export function SplitLinesReveal({ text, className, restartOnEvent, reverseOnEvent }: SplitLinesRevealProps) {
    const containerRef = useRef<HTMLSpanElement>(null);
    const tweenRef = useRef<gsap.core.Tween | null>(null);

    useGSAP(
        () => {
            if (!containerRef.current) return;

            const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

            // Tracks logical state across `autoSplit` re-splits (resize,
            // font-load): a re-split mid-cycle must render its fresh lines in
            // whichever state — shown or hidden — the text was last in,
            // rather than always starting hidden again.
            let isVisible = !restartOnEvent;

            const split = SplitText.create(containerRef.current, {
                type: "lines",
                mask: "lines",
                autoSplit: true,
                onSplit: (self) => {
                    const tween = reduceMotion
                        ? gsap.from(self.lines, { opacity: 0, duration: 0.5, stagger: 0.08, paused: true, })
                        : gsap.from(self.lines, {
                            yPercent: 110,
                            duration: 0.9,
                            ease: "power4.out",
                            stagger: 0.1,
                            paused: true,
                        });
                    if (isVisible) tween.progress(1);
                    tweenRef.current = tween;
                    return tween;
                },
            });

            if (!restartOnEvent) return () => split.revert();

            if (typeof window !== "undefined" && (window as unknown as { __HERO_ABOUT_ACTIVE__?: boolean }).__HERO_ABOUT_ACTIVE__) {
                isVisible = true;
                tweenRef.current?.progress(1);
            }

            const onRestart = () => {
                isVisible = true;
                tweenRef.current?.restart();
            };
            const onReverse = () => {
                isVisible = false;
                tweenRef.current?.reverse();
            };

            window.addEventListener(restartOnEvent, onRestart);
            if (reverseOnEvent) window.addEventListener(reverseOnEvent, onReverse);

            return () => {
                window.removeEventListener(restartOnEvent, onRestart);
                if (reverseOnEvent) window.removeEventListener(reverseOnEvent, onReverse);
                split.revert();
            };
        },
        { scope: containerRef, dependencies: [text, restartOnEvent, reverseOnEvent] }
    );

    return (
        <span ref={containerRef} className={cn("inline-block", className)}>
            {text}
        </span>
    );
}

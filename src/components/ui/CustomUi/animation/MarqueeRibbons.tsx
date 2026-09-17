"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap-util";
import { cn } from "@/lib/utils";

export type RibbonTag = { text: string; outlined?: boolean };

/** Ribbon travel in px per px of page scroll. */
const SPEED = 0.4;

const Spark = () => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className="text-brand-bg mx-8 h-5 w-5 shrink-0 md:mx-12"
    >
        <path
            d="M12 0C12 6.62742 17.3726 12 24 12C17.3726 12 12 17.3726 12 24C12 17.3726 6.62742 12 0 12C6.62742 12 12 6.62742 12 0Z"
            fill="currentColor"
        />
    </svg>
);

/**
 * Two marquee bands crossing behind the hero.
 *
 * Instead of going perfectly corner-to-corner, they are offset slightly
 * so the angle is shallower (e.g. crossing from 10% above the bottom to 10% below the top).
 */
export function MarqueeRibbons({ tags }: { tags: RibbonTag[] }) {
    const wrapRef = useRef<HTMLDivElement>(null);
    const armRefs = useRef<(HTMLDivElement | null)[]>([]);
    const trackRefs = useRef<(HTMLDivElement | null)[]>([]);

    // Two identical halves: the scroll offset wraps at one half's width, so the
    // seam is always covered by the copy behind it.
    const unit = [...tags, ...tags];
    const items = [...unit, ...unit];

    useGSAP(
        () => {
            const wrap = wrapRef.current;
            if (!wrap) return;

            const halfWidths: number[] = [];
            const measure = () => {
                const { width, height } = wrap.getBoundingClientRect();
                if (!width || !height) return;

                // Adjust these multipliers to change how "steep" the cross is.
                // 0.6 means the ribbon covers 60% of the screen's height (a shallower angle).
                // 1.0 would be exactly corner-to-corner.
                const targetHeight = height * 0.6;
                const targetWidth = width;

                // Add extra length (200px) so the ribbons bleed cleanly off the edges
                const diagonal = Math.hypot(targetWidth, targetHeight) + 200;
                const angle = (Math.atan2(targetHeight, targetWidth) * 180) / Math.PI;

                armRefs.current.forEach((arm, i) => {
                    if (!arm) return;
                    gsap.set(arm, {
                        width: diagonal,
                        xPercent: -50,
                        yPercent: -50,
                        rotation: i === 0 ? angle : -angle,
                    });
                });

                trackRefs.current.forEach((track, i) => {
                    if (!track) return;
                    halfWidths[i] = track.scrollWidth / 2;
                });
            };

            measure();
            ScrollTrigger.addEventListener("refreshInit", measure);

            // Driven by scroll position rather than a CSS animation, so the bands
            // only move when the page does.
            const trigger = ScrollTrigger.create({
                start: 0,
                end: "max",
                onUpdate: (self) => {
                    const travelled = self.scroll() * SPEED;

                    trackRefs.current.forEach((track, i) => {
                        if (!track) return;
                        const half = halfWidths[i];
                        if (!half) return;

                        const direction = i === 0 ? 1 : -1;
                        gsap.set(track, {
                            x: gsap.utils.wrap(-half, 0, -travelled * direction),
                        });
                    });
                },
            });

            return () => {
                ScrollTrigger.removeEventListener("refreshInit", measure);
                trigger.kill();
            };
        },
        { scope: wrapRef }
    );

    return (
        <div
            ref={wrapRef}
            aria-hidden="true"
            className="ribbon-exit-layer pointer-events-none absolute inset-0 z-0 overflow-hidden"
            style={{ willChange: "opacity, transform" }}
        >
            <div
                className="ribbon-entrance-layer h-full w-full opacity-0"
                style={{ willChange: "opacity" }}
            >
                <div className="h-full w-full opacity-20">
                    {[1].map((i) => (
                        <div
                            key={i}
                            ref={(el) => {
                                armRefs.current[i] = el;
                            }}
                            className="bg-brand-text absolute top-1/2 left-1/2 flex overflow-hidden py-8 whitespace-nowrap md:py-10"
                        >
                            <div
                                ref={(el) => {
                                    trackRefs.current[i] = el;
                                }}
                                className="flex w-max items-center"
                            >
                                {items.map((tag, index) => (
                                    <div key={`${tag.text}-${index}`} className="flex items-center">
                                        <span
                                            className={cn(
                                                "font-sans text-2xl font-bold tracking-[0.4em] uppercase md:text-5xl",
                                                tag.outlined ? "text-transparent" : "text-brand-bg"
                                            )}
                                            style={{
                                                WebkitTextStroke: tag.outlined
                                                    ? "1px var(--color-brand-bg)"
                                                    : undefined,
                                            }}
                                        >
                                            {tag.text}
                                        </span>
                                        <Spark />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

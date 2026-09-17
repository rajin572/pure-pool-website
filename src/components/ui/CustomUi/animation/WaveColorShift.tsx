"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap-util";
import { cn } from "@/lib/utils";

interface WaveColorShiftProps {
    text: string;
    className?: string;
    waveColor?: string;
    /**
     * Window event to wait for before playing. Omit to play immediately on
     * mount — only safe if nothing hides this behind an invisible parent
     * first. HeroTypography gates the header on "preloader:complete" because
     * without that, the wave finishes invisibly behind the preloader overlay
     * and all anyone ever sees is a static result.
     */
    playOnEvent?: string;
}

export function WaveColorShift({ text, className, waveColor = "var(--color-secondary, #797979)", playOnEvent }: WaveColorShiftProps) {
    const containerRef = useRef<HTMLSpanElement>(null);

    useGSAP(() => {
        if (!containerRef.current) return;

        // Target all the individual character spans
        const chars = containerRef.current.querySelectorAll(".wave-char");

        // The user's effect adapted for React
        const tween = gsap.from(chars, {
            y: 10,
            color: "#797979",
            opacity: 0,
            stagger: { each: 0.1, from: "start" },
            duration: 1,
            ease: "sine.out",
            paused: !!playOnEvent,
        });

        if (!playOnEvent) return;

        const play = () => tween.play();

        if (typeof window !== "undefined" && playOnEvent === "preloader:complete" && (window as unknown as { __PRELOADER_COMPLETE__?: boolean }).__PRELOADER_COMPLETE__) {
            play();
        } else {
            window.addEventListener(playOnEvent, play, { once: true });
        }

        return () => window.removeEventListener(playOnEvent, play);
    }, { scope: containerRef, dependencies: [text, waveColor, playOnEvent] });

    return (
        <span ref={containerRef} className={cn("inline-block", className)}>
            {text.split(" ").map((word, wordIndex, wordsArray) => (
                <span key={wordIndex} className="inline-block whitespace-nowrap">
                    {word.split("").map((char, charIndex) => (
                        <span
                            key={charIndex}
                            className="wave-char inline-block"
                        >
                            {char}
                        </span>
                    ))}
                    {/* Add a space after the word, except for the last word */}
                    {wordIndex !== wordsArray.length - 1 && (
                        <span className="wave-char inline-block whitespace-pre"> </span>
                    )}
                </span>
            ))}
        </span>
    );
}

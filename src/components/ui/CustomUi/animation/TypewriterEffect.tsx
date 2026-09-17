"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap-util";
import { cn } from "@/lib/utils";

interface TypewriterEffectProps {
    texts: string[];
    className?: string;
    cursorClassName?: string;
    typeSpeed?: number;
    delayBetween?: number;
}

export function TypewriterEffect({
    texts,
    className,
    cursorClassName,
    typeSpeed = 0.1,
    delayBetween = 2,
}: TypewriterEffectProps) {
    const textRef = useRef<HTMLSpanElement>(null);
    const cursorRef = useRef<HTMLSpanElement>(null);
    const containerRef = useRef<HTMLSpanElement>(null);

    useGSAP(() => {
        if (!textRef.current || !cursorRef.current) return;

        // Blinking cursor
        gsap.to(cursorRef.current, {
            opacity: 0,
            repeat: -1,
            yoyo: true,
            duration: 0.4,
            ease: "power1.inOut",
        });

        const masterTl = gsap.timeline({ repeat: -1 });

        texts.forEach((text) => {
            const tl = gsap.timeline({
                repeat: 1,
                yoyo: true,
                repeatDelay: delayBetween,
            });

            tl.to(textRef.current, {
                text: { value: text },
                duration: text.length * typeSpeed,
                ease: "none",
            });
            
            masterTl.add(tl);
        });

    }, { scope: containerRef, dependencies: [texts, typeSpeed, delayBetween] });

    return (
        <span ref={containerRef} className={cn("inline-flex items-center", className)}>
            <span ref={textRef} className="text"></span>
            <span ref={cursorRef} className={cn("typewriter-cursor font-medium -ml-1", cursorClassName)}>
                |
            </span>
        </span>
    );
}

"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

const wrap = (val: number, total: number) =>
    (((val % total) + total) % total) - total;

export const MarqueeTrack = ({
    children,
    direction = 1,
    speed = 1.8,
}: {
    children: React.ReactNode;
    direction?: 1 | -1;
    speed?: number;
}) => {
    const trackRef = useRef<HTMLDivElement>(null);
    const xRef = useRef(0);
    const lastTimeRef = useRef<number | null>(null);
    const rafRef = useRef<number | null>(null);
    const paused = useRef(false);

    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;

        const totalWidth = track.scrollWidth / 3;

        const tick = (time: number) => {
            const delta = lastTimeRef.current ? time - lastTimeRef.current : 0;
            lastTimeRef.current = time;

            if (!paused.current) {
                const vel = direction * speed * (delta / 1000) * 60;
                xRef.current = wrap(xRef.current + vel, totalWidth);
                gsap.set(track, { x: xRef.current });
            }

            rafRef.current = requestAnimationFrame(tick);
        };

        rafRef.current = requestAnimationFrame(tick);
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [direction, speed]);

    return (
        <div
            className="overflow-hidden"
            onMouseEnter={() => {
                paused.current = true;
            }}
            onMouseLeave={() => {
                paused.current = false;
            }}
        >
            <div ref={trackRef} className="flex items-stretch">
                {children}
            </div>
        </div>
    );
};

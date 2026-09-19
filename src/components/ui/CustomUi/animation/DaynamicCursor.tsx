"use client";
import { gsap } from "@/lib/gsap-util";
import { useEffect, useRef } from "react";

const DaynamicCursor = () => {
    const cursorRef = useRef<HTMLDivElement>(null);
    const dotRef = useRef<HTMLDivElement>(null);
    const labelRef = useRef<HTMLParagraphElement>(null);
    const badgeRef = useRef<HTMLDivElement>(null);

    const activeTarget = useRef<HTMLElement | null>(null);
    /** Resolved mode for the active target — implicit text matches carry no dataset. */
    const activeType = useRef("");
    const lastMouse = useRef({ x: 0, y: 0 });

    const setLabel = (text: string) => {
        if (labelRef.current) {
            labelRef.current.innerText = text;
        }
    };

    const handleHover = (target: HTMLElement, typeOverride?: string) => {
        if (!cursorRef.current) return;

        const type = typeOverride || target?.dataset?.cursor || "";
        const label = target?.dataset?.cursorLabel || "";

        activeTarget.current = target;
        activeType.current = type;

        switch (type) {
            case "textview":
                gsap.to(cursorRef.current, { scale: 2, duration: 0.5, ease: "power3", overwrite: "auto" });
                break;

            case "view-card":
                setLabel(label);

                gsap.to(cursorRef.current, { scale: 7, duration: 0.5, ease: "power3", overwrite: "auto" });
                gsap.to(labelRef.current, { opacity: 1, scale: 0.15, duration: 0 });
                break;

            case "hide":
                gsap.to(cursorRef.current, { opacity: 0, duration: 0.2, overwrite: "auto" });
                break;

            case "animated_circle":
                gsap.to(dotRef.current, { opacity: 0, scale: 0, duration: 0, overwrite: "auto" });
                gsap.to(badgeRef.current, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)", overwrite: "auto" });

                break;

            default:
                break;
        }
    };

    const resetCursor = () => {
        if (!cursorRef.current) return;

        const type = activeType.current;

        switch (type) {
            case "textview":
                break;

            case "view-card":
                setLabel("");
                gsap.to(labelRef.current, { opacity: 0, scale: 0, duration: 0 });
                break;

            case "hide":
                gsap.to(cursorRef.current, { opacity: 1, duration: 0.2 });
                break;

            case "animated_circle":
                gsap.to(badgeRef.current, { opacity: 0, scale: 0, duration: 0.5, overwrite: "auto" });
                gsap.to(dotRef.current, { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(1.7)", overwrite: "auto" });
                return;
        }

        gsap.to(cursorRef.current, { scale: 1, duration: 0.4, ease: "power3", overwrite: "auto" });
        activeTarget.current = null;
        activeType.current = "";
    };

    useEffect(() => {
        if (!cursorRef.current) return;

        gsap.set(cursorRef.current, { xPercent: -50, yPercent: -50 });
        gsap.set(badgeRef.current, { xPercent: -50, yPercent: -50, opacity: 0, scale: 0 });

        // Short and non-overshooting: back.out threw the dot past the pointer and
        // let it drift back, which was most of what read as lag.
        const follow = { duration: 0.18, ease: "power3.out" };

        const xTo = gsap.quickTo(cursorRef.current, "x", follow);
        const yTo = gsap.quickTo(cursorRef.current, "y", follow);

        const badgeXTo = gsap.quickTo(badgeRef.current, "x", follow);
        const badgeYTo = gsap.quickTo(badgeRef.current, "y", follow);

        const onMove = (e: PointerEvent) => {
            lastMouse.current = { x: e.clientX, y: e.clientY };
            xTo(e.clientX);
            yTo(e.clientY);
            badgeXTo(e.clientX);
            badgeYTo(e.clientY);
        };

        // Any text — headings, paragraphs, spans — enlarges the dot without needing
        // an attribute. An explicit data-cursor still wins, so elements can opt out
        // or pick a different mode.
        const TEXT = "h1, h2, h3, h4, h5, h6, p, span";

        const resolve = (e: PointerEvent) => {
            const el = e.target as HTMLElement | null;
            const explicit = el?.closest("[data-cursor]") as HTMLElement | null;
            if (explicit) return { target: explicit, type: undefined as string | undefined };

            const text = el?.closest(TEXT) as HTMLElement | null;
            return text ? { target: text, type: "textview" } : null;
        };

        const onPointerOver = (e: PointerEvent) => {
            const hit = resolve(e);
            if (!hit) return;
            handleHover(hit.target, hit.type);
        };

        const onPointerOut = (e: PointerEvent) => {
            if (!resolve(e)) return;
            resetCursor();
        };

        let ticking = false;
        const onScroll = () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                const el = document.elementFromPoint(lastMouse.current.x, lastMouse.current.y) as HTMLElement | null;
                const newTarget = el?.closest("[data-cursor]") as HTMLElement | null;
                if (!newTarget && activeTarget.current) resetCursor();
                ticking = false;
            });
        };

        window.addEventListener("pointermove", onMove);
        document.addEventListener("pointerover", onPointerOver);
        document.addEventListener("pointerout", onPointerOut);
        window.addEventListener("scroll", onScroll, true);

        return () => {
            window.removeEventListener("pointermove", onMove);
            document.removeEventListener("pointerover", onPointerOver);
            document.removeEventListener("pointerout", onPointerOut);
            window.removeEventListener("scroll", onScroll, true);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <div
                ref={cursorRef}
                // mix-blend-difference is permanent, not toggled. A white dot
                // through difference inverts whatever it sits on: it reads black
                // over the light page and turns black letters white as it crosses
                // them. Painting the dot black instead would look right on the page
                // but go invisible over dark text.
                className="fixed top-0 left-0 size-7 rounded-full bg-transparent pointer-events-none z-9999 flex items-center justify-center mix-blend-difference"
            >
                <div ref={dotRef} className="size-4 rounded-full bg-white flex items-center justify-center">
                    <p
                        ref={labelRef}
                        className="opacity-0 text-xs px-3 leading-snug whitespace-nowrap text-black"
                    /></div>
            </div>

            {/* <div
                ref={badgeRef}
                className="fixed top-0 left-0 pointer-events-none z-9999"
            >
                <CircularBadge />
            </div> */}
        </>
    );
};

export default DaynamicCursor;

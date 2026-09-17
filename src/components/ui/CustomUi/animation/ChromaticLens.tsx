"use client";

import { Fragment, useId, useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap-util";
import { cn } from "@/lib/utils";

/** Where the lens sits while idle — far outside any element's filter region. */
const LENS_PARKED = -9999;

/**
 * One displaced copy of the source per colour channel: isolate each with a
 * colour matrix, screen-blend the three back together, and the picture
 * reassembles with coloured fringes wherever the copies disagree. Doing the
 * split inside the filter means this works on anything the browser can paint —
 * text, an <img>, a whole subtree.
 *
 * `offset` is a *signed multiplier on the aberration*, not on the strength. The
 * three channels travel almost exactly the same distance and separate by only a
 * few pixels. Scaling them by fractions of the strength instead (1 / 0.82 / 0.64)
 * makes red travel a third further than blue, so the copies stop overlapping and
 * the fringe stops being a fringe — it becomes flat fields of pure cyan and blue
 * where only one or two channels landed.
 */
const CHANNELS = [
    { key: "r", offset: 1, matrix: "1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" },
    { key: "g", offset: 0, matrix: "0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" },
    { key: "b", offset: -1, matrix: "0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" },
] as const;

/**
 * The displacement map's moving part.
 *
 * Only the alpha varies between the two stops — the colour is identical at both
 * ends. That matters: a gradient running white → black fades its *colour* toward
 * 0 as well as its alpha, so the outer ring of the lens lands below the 128
 * neutral point and displaces backwards, which reads as a pinch fighting the
 * smear. Holding the colour flat means the falloff is pure strength.
 *
 * R=255 with G=180 biases the drag roughly 2.4 : 1 horizontal, which is the
 * direction the smear runs in the reference. B sits at the neutral 128 and is
 * unused.
 */
const LENS_IMAGE =
    "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cdefs%3E%3CradialGradient id='g' cx='50%25' cy='50%25' r='50%25'%3E%3Cstop offset='0%25' stop-color='%23FFB480' stop-opacity='1'/%3E%3Cstop offset='100%25' stop-color='%23FFB480' stop-opacity='0'/%3E%3C/radialGradient%3E%3C/defs%3E%3Ccircle cx='100' cy='100' r='100' fill='url(%23g)'/%3E%3C/svg%3E";

type ChromaticLensProps = {
    children: React.ReactNode;
    className?: string;
    /** Element to render. Use "div" when wrapping block content such as an image. */
    as?: "span" | "div";
    /** Radius of the distortion, in px. */
    radius?: number;
    /** Peak displacement at the centre of the lens, in px — how far it smears. */
    strength?: number;
    /**
     * How many px red and blue land either side of green. This is the whole of
     * the rainbow: a dozen px reads as a fringe on the smear's edges, while
     * anything approaching `strength` tears the channels apart into flat colour.
     */
    aberration?: number;
} & Omit<React.HTMLAttributes<HTMLElement>, "children" | "className">;

/**
 * Smears whatever it wraps around the pointer, splitting it into RGB as it goes.
 *
 * SSR-safe: the server-rendered markup carries no filter and no pointer state, so
 * first client paint is identical and nothing mismatches on hydration. Hover is
 * driven entirely by GSAP writing to refs, so this renders exactly once — no
 * state, no re-render per mouse move. The filter is attached on enter and
 * detached on leave, keeping a fairly expensive pipeline off the element at rest.
 *
 * Draws no cursor of its own — <DaynamicCursor /> owns that. Pass `data-cursor`
 * through to control how it reacts.
 */
export function ChromaticLens({
    children,
    className = "",
    as = "span",
    radius = 180,
    strength = 200,
    aberration = 12,
    ...rest
}: ChromaticLensProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const lensRef = useRef<SVGFEImageElement>(null);
    const mapRefs = useRef<(SVGFEDisplacementMapElement | null)[]>([]);

    // React 19's useId returns "«r0»" — strip anything that isn't safe inside a
    // CSS `url(#…)` reference.
    const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
    const filterId = `lens-${uid}`;

    useGSAP(
        (_context, contextSafe) => {
            const container = containerRef.current;
            if (!container || !contextSafe) return;

            /** Pointer position in the filtered element's own coordinate space. */
            const localPoint = (e: PointerEvent) => {
                const rect = container.getBoundingClientRect();
                return { x: e.clientX - rect.left, y: e.clientY - rect.top };
            };

            // Set only once the effect has actually engaged, so a pointer that was
            // turned away at the door (touch, or reduced motion) doesn't leave
            // `move` and `leave` tweening things that are switched off anyway.
            let active = false;

            const onEnter = contextSafe((e: PointerEvent) => {
                // Hover-only effect: skip touch/pen, and skip when motion is unwelcome.
                if (e.pointerType !== "mouse") return;
                if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

                active = true;
                const { x, y } = localPoint(e);

                // Park the lens under the cursor *before* the displacement ramps
                // up, or the content snaps in from wherever the lens was left.
                gsap.set(lensRef.current, { attr: { x: x - radius, y: y - radius } });
                container.style.filter = `url(#${filterId})`;

                mapRefs.current.forEach((map, i) => {
                    gsap.to(map, {
                        attr: { scale: strength + CHANNELS[i].offset * aberration },
                        duration: 0.35,
                        ease: "power2.out",
                        overwrite: "auto",
                    });
                });
            }) as (e: PointerEvent) => void;

            const onMove = contextSafe((e: PointerEvent) => {
                if (!active) return;

                const { x, y } = localPoint(e);

                gsap.to(lensRef.current, {
                    attr: { x: x - radius, y: y - radius },
                    duration: 0.1,
                    ease: "power2.out",
                    overwrite: "auto",
                });
            }) as (e: PointerEvent) => void;

            const onLeave = contextSafe(() => {
                if (!active) return;
                active = false;

                // Ease the displacement back to zero, then drop the filter so the
                // idle element paints without a filter pass.
                gsap.to(mapRefs.current, {
                    attr: { scale: 0 },
                    duration: 0.4,
                    ease: "power2.out",
                    overwrite: "auto",
                    onComplete: () => {
                        container.style.filter = "";
                        gsap.set(lensRef.current, { attr: { x: LENS_PARKED, y: LENS_PARKED } });
                    },
                });
            }) as () => void;

            container.addEventListener("pointerenter", onEnter);
            container.addEventListener("pointermove", onMove);
            container.addEventListener("pointerleave", onLeave);

            return () => {
                container.removeEventListener("pointerenter", onEnter);
                container.removeEventListener("pointermove", onMove);
                container.removeEventListener("pointerleave", onLeave);
            };
        },
        { scope: containerRef, dependencies: [filterId, radius, strength, aberration] }
    );

    const Wrapper = as as "div";

    return (
        // `relative` is only a default — a caller passing `absolute` must win.
        // cn() resolves that; plain interpolation would leave both position
        // utilities and let CSS source order decide.
        <Wrapper ref={containerRef} className={cn("relative", className)} {...rest}>
            {children}

            <svg aria-hidden="true" focusable="false" className="pointer-events-none absolute h-0 w-0">
                <defs>
                    {/* Generous region: the smear reaches roughly strength/2 px past
                        the element, and anything beyond the region is clipped off. */}
                    <filter
                        id={filterId}
                        x="-50%"
                        y="-50%"
                        width="200%"
                        height="200%"
                        colorInterpolationFilters="sRGB"
                    >
                        {/* A mid-grey field is what "no displacement" looks like:
                            feDisplacementMap offsets by scale × (channel/255 − 0.5),
                            so 128 maps to zero. Flooding the region first is
                            essential — the lens image only covers a small circle, and
                            everywhere outside it the map would otherwise sit at 0 and
                            shove every pixel by a constant −scale/2. */}
                        <feFlood floodColor="#808080" floodOpacity="1" result="neutral" />
                        <feImage
                            ref={lensRef}
                            href={LENS_IMAGE}
                            x={LENS_PARKED}
                            y={LENS_PARKED}
                            width={radius * 2}
                            height={radius * 2}
                            result="lensRaw"
                        />
                        {/* Liquid Distortion Noise */}
                        <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" seed="2" result="noise" />
                        
                        {/* Combine the chaotic noise with the smooth lens fading alpha */}
                        <feComposite in="noise" in2="lensRaw" operator="in" result="liquidLens" />
                        
                        {/* Composite over neutral to ensure 0 displacement outside the cursor */}
                        <feComposite in="liquidLens" in2="neutral" operator="over" result="map" />

                        {CHANNELS.map((channel, i) => (
                            <Fragment key={channel.key}>
                                <feDisplacementMap
                                    ref={(el) => {
                                        mapRefs.current[i] = el;
                                    }}
                                    in="SourceGraphic"
                                    in2="map"
                                    scale={0}
                                    xChannelSelector="R"
                                    yChannelSelector="G"
                                    result={`displaced-${channel.key}`}
                                />
                                <feColorMatrix
                                    in={`displaced-${channel.key}`}
                                    type="matrix"
                                    values={channel.matrix}
                                    result={`channel-${channel.key}`}
                                />
                            </Fragment>
                        ))}

                        <feBlend in="channel-r" in2="channel-g" mode="screen" result="rg" />
                        <feBlend in="rg" in2="channel-b" mode="screen" />
                    </filter>
                </defs>
            </svg>
        </Wrapper>
    );
}

export default ChromaticLens;

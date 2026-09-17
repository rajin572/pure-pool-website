"use client";

import {
    useRef,
    useLayoutEffect,
    createContext,
    useContext,
    useState,
    ReactNode,
} from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

const SmootherContext = createContext<ScrollSmoother | null>(null);
export const useSmoother = () => useContext(SmootherContext);

interface SmoothScrollerProps {
    children: ReactNode;
    smooth?: number;
    smoothTouch?: number;
    effects?: boolean;
}

const SmoothScroller = ({
    children,
    smooth = 1.5,
    smoothTouch = 0.1,
    effects = true,
}: SmoothScrollerProps) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [smoother, setSmoother] = useState<ScrollSmoother | null>(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const instance = ScrollSmoother.create({
                wrapper: wrapperRef.current!,
                content: contentRef.current!,
                smooth,
                smoothTouch,
                effects,
                normalizeScroll: true,
            });
            setSmoother(instance);
        });

        return () => ctx.revert();
    }, [smooth, smoothTouch, effects]);

    return (
        <SmootherContext.Provider value={smoother}>
            <div id="smooth-wrapper" ref={wrapperRef}>
                <div id="smooth-content" ref={contentRef}>
                    {children}
                </div>
            </div>
        </SmootherContext.Provider>
    );
};

export default SmoothScroller;
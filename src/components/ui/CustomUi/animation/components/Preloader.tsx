"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap-util";
import { useLenis } from "lenis/react";

export default function Preloader() {
  const preloaderRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGPathElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  // `useLenis()` resolves to the root Lenis instance created by
  // LenisSmoothScroll even though that component is a sibling, not an
  // ancestor — root-mode Lenis publishes itself to a global store for
  // exactly this case. Lenis drives scroll itself (it isn't a consumer of
  // `overflow`), so it has to be stopped explicitly or it keeps processing
  // wheel/touch input while the preloader plays and "catches up" the moment
  // scroll is unlocked, which is what caused sections to snap into their
  // scrolled-in state right as the preloader finished.
  const lenis = useLenis();
  const lenisRef = useRef(lenis);

  // The GSAP layout effect below can run before Lenis finishes mounting
  // (its own effect fires later), so stop it here too as soon as it exists.
  useEffect(() => {
    lenisRef.current = lenis;
    lenis?.stop();
  }, [lenis]);

  useGSAP(() => {
    if (!preloaderRef.current || !svgRef.current || !counterRef.current) return;

    // Disable scrolling while preloader is active. `documentElement` (not
    // just `body`) is the element that actually scrolls in a standards-mode
    // document, so both need to be locked.
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    lenisRef.current?.stop();

    // HeroSection builds an entrance timeline (played below, on
    // "preloader:complete") and a separate scroll-scrubbed timeline in the
    // same effect. The scrubbed one re-syncs to whatever the real scroll
    // position is via the ScrollTrigger.refresh() call further down — so if
    // the browser restored a mid-page scroll position on reload, that
    // timeline jumps to its correct mid-scroll pose right as the entrance
    // timeline *also* plays its from-the-top reveal over the same elements
    // (.photo-card, .hero-subtitle, .crosshair-ui...), and the two fight.
    // Resetting to the top here is invisible — this curtain already covers
    // the whole viewport — and disabling scrollRestoration stops the browser
    // from re-restoring it on the next reload in this tab.
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    lenisRef.current?.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);

    const tl = gsap.timeline();
    const curve = "M0 502S175 272 500 272s500 230 500 230V0H0Z";
    const flat = "M0 2S175 1 500 1s500 1 500 1V0H0Z";

    const counterObj = { val: 0 };

    tl.to(counterObj, {
      val: 100,
      duration: 1.5,
      ease: "power4.inOut",
      onUpdate: () => {
        if (counterRef.current) {
          counterRef.current.textContent = Math.round(counterObj.val).toString();
        }
      },
    })
      .to(".preloader-heading .load-text", {
        y: -80,
        opacity: 0,
        duration: 0.6,
      }, "+=0.2")
      .to(svgRef.current, {
        duration: 0.6,
        attr: { d: curve },
        ease: "power2.inOut",
      }, "<0.2")
      .to(svgRef.current, {
        duration: 0.6,
        attr: { d: flat },
        ease: "power2.inOut",
      })
      .call(() => {
        // The wipe has shrunk to a hairline by now, so the page is already
        // visually revealed underneath — only the (already pointer-events-none)
        // container is left to slide away as a cosmetic flourish. Unlocking
        // here, rather than waiting for that trailing 0.8s slide + its own
        // onComplete, is what closes the gap between "preloader looks done"
        // and scroll/the hero reveal actually becoming available.
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
        lenisRef.current?.start();
        if (typeof window !== "undefined") {
          (window as unknown as { __PRELOADER_COMPLETE__?: boolean }).__PRELOADER_COMPLETE__ = true;
        }
        window.dispatchEvent(new Event("preloader:complete"));

        // Every ScrollTrigger on the page was measured while the lines above
        // were "hidden", i.e. against a viewport with no scrollbar. Pin
        // distances and start/end positions are stale until retaken with
        // real values.
        ScrollTrigger.refresh();
      })
      .to(preloaderRef.current, {
        y: "-130%",
        duration: 0.8,
        ease: "power4.inOut",
      })
      .set(preloaderRef.current, {
        display: "none",
        zIndex: -1,
      });
  });

  return (
    <div
      className="fixed inset-0 z-9999999! flex items-center justify-center bg-transparent pointer-events-none"
      ref={preloaderRef}
    >
      {/* SVG covering the screen. It is absolute to the fixed container. */}
      <svg
        className="absolute inset-0 h-[110vh] w-full"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="none"
      >
        <path
          id="preloaderSvg"
          ref={svgRef}
          d="M0,1005S175,995,500,995s500,5,500,5V0H0Z"
          className="fill-black"
        ></path>
      </svg>

      {/* Heading is absolute so it sits exactly in the center */}
      <div className="preloader-heading absolute z-10 flex overflow-hidden">
        <div className="load-text flex items-baseline text-6xl md:text-8xl font-bold tracking-tighter text-white">
          <span ref={counterRef}>0</span>
          <span className="text-2xl md:text-4xl ml-1"></span>
        </div>
      </div>
    </div>
  );
}

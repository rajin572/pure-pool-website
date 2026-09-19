"use client";

import React, { useRef } from "react";
import Container from "@/components/ui/CustomUi/Container";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap-util";

export const AboutOurStorySection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const storyRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;
      if (prefersReducedMotion()) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          toggleActions: "restart none none reverse",
        },
      });

      if (badgeRef.current) {
        tl.fromTo(
          badgeRef.current,
          { opacity: 0, y: 14 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            force3D: true,
          },
          0
        );
      }

      if (titleRef.current) {
        tl.fromTo(
          titleRef.current,
          { opacity: 0, y: 22 },
          {
            opacity: 1,
            y: 0,
            duration: 0.95,
            ease: "power3.out",
            force3D: true,
          },
          0.08
        );
      }

      if (storyRef.current) {
        tl.fromTo(
          storyRef.current,
          { opacity: 0, y: 18 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: "power3.out",
            force3D: true,
          },
          0.18
        );
      }
    },
    { dependencies: [] }
  );

  return (
    <section ref={sectionRef} className="w-full py-20 md:py-28 bg-white overflow-hidden">
      <Container className="flex flex-col items-center text-center">
        <span
          ref={badgeRef}
          className="text-sky-600 text-xs sm:text-sm font-mono font-bold tracking-widest uppercase mb-3"
        >
          OUR STORY
        </span>

        <h2
          ref={titleRef}
          className="text-[clamp(1.85rem,3.5vw,2.75rem)] font-bold text-gray-900 tracking-tight leading-snug max-w-2xl"
        >
          From one pool to four hundred
        </h2>

        <p
          ref={storyRef}
          className="text-[clamp(1.05rem,1.8vw,1.25rem)] text-gray-600 font-medium leading-relaxed max-w-4xl mt-6 sm:mt-8"
        >
          Pure Pool started in 2014 when our founder got tired of hearing the same
          complaint from friends: &ldquo;I never know if anyone actually came.&rdquo; So the
          first thing we built wasn&apos;t a bigger team — it was a habit of leaving proof.
          A photo, a reading, a note. Everything else grew from there. Today, our certified
          field technicians manage over 400 residential, community, and commercial pools
          across the Madrid region with fixed weekly routes, direct in-house employment,
          and 0% guesswork.
        </p>
      </Container>
    </section>
  );
};

export default AboutOurStorySection;


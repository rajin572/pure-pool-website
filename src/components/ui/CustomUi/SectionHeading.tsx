"use client";

import React, { useRef } from "react";
import { cn } from "@/lib/utils";
import { gsap, ScrollTrigger, SplitText, useGSAP, prefersReducedMotion } from "@/lib/gsap-util";

export interface SectionHeadingProps {
  /**
   * Top badge/category/overline text (e.g. "WHAT WE DO", "OUR WORK")
   */
  badge?: React.ReactNode;

  /**
   * Main prominent title (e.g. "Full-service pool care, covered.")
   */
  title: React.ReactNode;

  /**
   * Explanatory supporting description / subtitle text
   */
  description?: React.ReactNode;

  /**
   * Alignment mode: "center" (default), "left", or "right"
   */
  align?: "center" | "left" | "right";

  /**
   * Color theme variant:
   * - "default": dark text for light/clean backgrounds
   * - "light": white/light text for dark, navy, or photographic backdrops
   */
  variant?: "default" | "light";

  /**
   * Heading semantic HTML element (default: "h2")
   */
  titleAs?: "h1" | "h2" | "h3" | "h4" | "span";

  /**
   * Custom max width utility class (default: "max-w-2xl")
   */
  maxWidth?: string;

  /**
   * Container className
   */
  className?: string;

  /**
   * Custom badge className
   */
  badgeClassName?: string;

  /**
   * Custom title className
   */
  titleClassName?: string;

  /**
   * Custom description className
   */
  descriptionClassName?: string;

  /**
   * Optional content rendered below the description (e.g., CTA buttons)
   */
  children?: React.ReactNode;

  /**
   * Enable/disable scrollTrigger split-text animation (default: true)
   */
  animate?: boolean;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  badge,
  title,
  description,
  align = "center",
  variant = "default",
  titleAs: TitleTag = "h2",
  maxWidth = "max-w-2xl",
  className,
  badgeClassName,
  titleClassName,
  descriptionClassName,
  children,
  animate = true,
}) => {
  const isLight = variant === "light";
  const containerRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const childrenRef = useRef<HTMLDivElement>(null);

  const alignmentClasses = {
    center: "items-center text-center mx-auto",
    left: "items-start text-left mr-auto",
    right: "items-end text-right ml-auto",
  }[align];

  useGSAP(
    () => {
      if (!animate || !containerRef.current) return;

      // Reduced motion: leave everything in its natural, fully-visible state.
      if (prefersReducedMotion()) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 88%",
          toggleActions: "restart none none reverse",
        },
      });

      if (badgeRef.current) {
        tl.fromTo(
          badgeRef.current,
          { autoAlpha: 0, y: 14 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            ease: "premiumOut",
            force3D: true,
          },
          0
        );
      }

      if (titleRef.current) {
        // Word-by-word "wipe up" reveal — each word slides out from under a mask,
        // sequenced into the same scroll-triggered timeline as the rest of the heading.
        const split = SplitText.create(titleRef.current, {
          type: "words",
          mask: "words",
          wordsClass: "sh-word",
        });

        tl.from(
          split.words,
          {
            yPercent: 115,
            rotate: 3,
            autoAlpha: 0,
            duration: 0.85,
            stagger: 0.045,
            ease: "premiumOut",
            force3D: true,
          },
          0.08
        );
      }

      if (descRef.current) {
        tl.fromTo(
          descRef.current,
          { autoAlpha: 0, y: 18 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.75,
            ease: "premiumOut",
            force3D: true,
          },
          0.2
        );
      }

      if (childrenRef.current) {
        tl.fromTo(
          childrenRef.current,
          { autoAlpha: 0, y: 16 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            ease: "premiumOut",
            force3D: true,
          },
          0.3
        );
      }
    },
    { dependencies: [animate] }
  );

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex flex-col gap-2 w-full",
        maxWidth,
        alignmentClasses,
        className
      )}
    >
      {badge && (
        <span
          ref={badgeRef}
          className={cn(
            "text-xs sm:text-sm font-extrabold font-mono uppercase tracking-wider inline-block",
            isLight ? "text-white/90" : "text-sky-600",
            badgeClassName
          )}
        >
          {badge}
        </span>
      )}

      <TitleTag
        ref={titleRef}
        className={cn(
          "text-[clamp(1.75rem,4vw,2.75rem)] font-bold leading-tight tracking-tight",
          isLight ? "text-white" : "text-gray-900",
          titleClassName
        )}
      >
        {title}
      </TitleTag>

      {description && (
        <p
          ref={descRef}
          className={cn(
            "text-base sm:text-lg font-normal leading-relaxed mt-1",
            isLight ? "text-white/90" : "text-gray-600",
            descriptionClassName
          )}
        >
          {description}
        </p>
      )}

      {children && (
        <div ref={childrenRef} className="w-full flex flex-col items-inherit">
          {children}
        </div>
      )}
    </div>
  );
};

export default SectionHeading;

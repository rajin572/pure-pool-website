"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Container from "@/components/ui/CustomUi/Container";
import SectionHeading from "@/components/ui/CustomUi/SectionHeading";
import { AllImages } from "../../../public/images/AllImages";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap-util";

const wrap = (val: number, total: number) => (((val % total) + total) % total) - total;

/* ── Generic GSAP RAF marquee for any card children ─────────── */
const MarqueeTrack = ({
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

    // scrollWidth covers all 3 copies — one copy = 1/3 of that
    const totalWidth = track.scrollWidth / 3;

    if (prefersReducedMotion()) return;

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

/* ── Data ────────────────────────────────────────────────────── */
interface Testimonial {
  id: number;
  name: string;
  role: string;
  text: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Juan Pérez",
    role: "Homeowner",
    text: "I never knew if anyone actually came. Now I get photos every visit and finally trust what I'm paying for.",
  },
  {
    id: 2,
    name: "María Fernández",
    role: "Community Manager",
    text: "Managing a shared pool used to mean chasing everyone for updates. Now it's just there in the app.",
  },
  {
    id: 3,
    name: "Roberto Vidal",
    role: "Hotel Manager",
    text: "Our pump failed on a Friday with a full hotel booked. They had someone here within the hour.",
  },
];

/* ── Card ────────────────────────────────────────────────────── */
const TestimonialCard = ({ name, role, text }: Testimonial) => (
  <div className="shrink-0 w-80 sm:w-96 bg-white rounded-2xl p-7 sm:p-8 shadow-sm border border-gray-200/80 mx-3 flex flex-col items-center text-center gap-5">
    <p className="text-lg font-bold text-gray-900 leading-relaxed">&ldquo;{text}&rdquo;</p>

    <div className="flex flex-col items-center gap-3">
      <div className="relative size-14 rounded-full overflow-hidden bg-sky-50 shrink-0">
        <Image src={AllImages.profile} alt={name} fill className="object-cover" sizes="56px" />
      </div>
      <div className="flex flex-col">
        <span className="text-base font-bold text-gray-900">{name}</span>
        <span className="text-sm text-gray-500 font-normal">{role}</span>
      </div>
    </div>
  </div>
);

/* ── Section ─────────────────────────────────────────────────── */
export const CustomerTestimonialsSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const marqueeWrapRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!marqueeWrapRef.current || prefersReducedMotion()) return;

      gsap.fromTo(
        marqueeWrapRef.current,
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.95,
          ease: "premiumOut",
          force3D: true,
          scrollTrigger: {
            trigger: marqueeWrapRef.current,
            start: "top 85%",
            toggleActions: "restart none none reverse",
          },
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="w-full py-20 md:py-28 bg-[#f0f7ff] overflow-hidden">
      <Container>
        <SectionHeading
          badge="Customer Testimonials"
          title="What our customers say"
          description="Twelve years of pools that just get looked after."
        />
      </Container>

      <div ref={marqueeWrapRef} className="mt-14 md:mt-16 relative">
        <MarqueeTrack direction={-1} speed={0.45}>
          {[...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS].map((item, i) => (
            <TestimonialCard key={`${item.id}-${i}`} {...item} />
          ))}
        </MarqueeTrack>

        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-[#f0f7ff] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-[#f0f7ff] to-transparent" />
      </div>
    </section>
  );
};

export default CustomerTestimonialsSection;

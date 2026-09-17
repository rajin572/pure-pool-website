"use client";

import React, { useRef } from "react";
import Image from "next/image";
import type { StaticImageData } from "next/image";
import Container from "@/components/ui/CustomUi/Container";
import SectionHeading from "@/components/ui/CustomUi/SectionHeading";
import { AllImages } from "../../../public/images/AllImages";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap-util";

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  avatar: StaticImageData | string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: "juan",
    quote:
      "I never knew if anyone actually came. Now I get photos every visit and finally trust what I'm paying for.",
    author: "Juan Pérez",
    role: "Homeowner",
    avatar: AllImages.profile,
  },
  {
    id: "maria",
    quote:
      "Managing a shared pool used to mean chasing everyone for updates. Now it's just there in the app.",
    author: "María Fernández",
    role: "Community Manager",
    avatar: AllImages.profile,
  },
  {
    id: "roberto",
    quote:
      "Our pump failed on a Friday with a full hotel booked. They had someone here within the hour.",
    author: "Roberto Vidal",
    role: "Hotel Manager",
    avatar: AllImages.profile,
  },
];

export const CustomerTestimonialsSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!cardsRef.current) return;
      const cards = cardsRef.current.querySelectorAll(".testimonial-card");
      const avatars = cardsRef.current.querySelectorAll(".testimonial-avatar");
      if (!cards || cards.length === 0) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: cardsRef.current,
          start: "top 85%",
          toggleActions: "restart none none reverse",
        },
      });

      tl.fromTo(
        cards,
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: "power2.out",
        }
      );

      if (avatars.length > 0) {
        tl.fromTo(
          avatars,
          { opacity: 0, scale: 0.8 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: "back.out(1.7)",
          },
          0.25
        );
      }
    },
    { dependencies: [] }
  );

  return (
    <section ref={sectionRef} className="w-full py-20 md:py-28 bg-[#f0f7ff] overflow-hidden">
      <Container>
        <SectionHeading
          badge="Customer Testimonials"
          title="What our customers say"
          description="Twelve years of pools that just get looked after."
        />

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mt-14 md:mt-16 items-stretch">
          {TESTIMONIALS.map((testimonial) => (
            <div
              key={testimonial.id}
              className="testimonial-card p-7 sm:p-8 bg-white rounded-2xl shadow-sm border border-gray-200/80 hover:shadow-md transition-all duration-300 flex flex-col justify-between items-center text-center gap-6"
            >
              <p className="text-lg sm:text-xl font-bold text-gray-900 leading-relaxed">
                &ldquo;{testimonial.quote}&rdquo;
              </p>

              <div className="flex flex-col items-center gap-3">
                <div className="testimonial-avatar relative size-14 rounded-full overflow-hidden border-2 border-sky-500/20 shadow-inner">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-bold text-gray-900">
                    {testimonial.author}
                  </span>
                  <span className="text-sm text-gray-500 font-normal">
                    {testimonial.role}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default CustomerTestimonialsSection;


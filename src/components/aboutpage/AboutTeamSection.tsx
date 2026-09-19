"use client";

import React, { useRef } from "react";
import Container from "@/components/ui/CustomUi/Container";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap-util";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "roberto",
    name: "Roberto Vidal",
    role: "Founder & Director",
    bio: "Started with one van in 2014. Still checks the schedule most mornings before anyone else is in the office.",
  },
  {
    id: "ana",
    name: "Ana López",
    role: "Operations Manager",
    bio: "Runs the day-to-day — scheduling, customer requests, and making sure nothing falls through the cracks.",
  },
  {
    id: "carlos",
    name: "Carlos Martínez",
    role: "Senior Technician",
    bio: "With Pure Pool since the early days. Trains every new technician who joins the team.",
  },
  {
    id: "laura",
    name: "Laura García",
    role: "Customer Care",
    bio: "The voice on the phone when something needs sorting quickly.",
  },
];

export const AboutTeamSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

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

      if (headerRef.current) {
        const badge = headerRef.current.querySelector(".team-badge");
        const title = headerRef.current.querySelector(".team-title");
        const subtitle = headerRef.current.querySelector(".team-subtitle");

        if (badge) {
          tl.fromTo(
            badge,
            { opacity: 0, y: 14 },
            {
              opacity: 1,
              y: 0,
              duration: 0.65,
              ease: "power3.out",
              force3D: true,
            },
            0
          );
        }

        if (title) {
          tl.fromTo(
            title,
            { opacity: 0, y: 22 },
            {
              opacity: 1,
              y: 0,
              duration: 0.85,
              ease: "power3.out",
              force3D: true,
            },
            0.08
          );
        }

        if (subtitle) {
          tl.fromTo(
            subtitle,
            { opacity: 0, y: 16 },
            {
              opacity: 1,
              y: 0,
              duration: 0.75,
              ease: "power3.out",
              force3D: true,
            },
            0.18
          );
        }
      }

      if (gridRef.current) {
        const cards = gridRef.current.querySelectorAll(".team-card");
        if (cards.length > 0) {
          tl.fromTo(
            cards,
            { opacity: 0, y: 32 },
            {
              opacity: 1,
              y: 0,
              duration: 0.85,
              stagger: 0.12,
              ease: "power3.out",
              force3D: true,
            },
            0.25
          );
        }
      }
    },
    { dependencies: [] }
  );

  return (
    <section
      ref={sectionRef}
      className="w-full py-20 md:py-28 bg-[#f0f7ff] overflow-hidden"
    >
      <Container>
        {/* Header */}
        <div
          ref={headerRef}
          className="flex flex-col items-center text-center max-w-2xl mx-auto mb-14 md:mb-16"
        >
          <span className="team-badge text-sky-600 text-xs sm:text-sm font-mono font-bold tracking-widest uppercase mb-3">
            THE PEOPLE BEHIND IT
          </span>
          <h2 className="team-title text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold text-gray-900 tracking-tight leading-tight">
            The Team Keeping Your Pool Right
          </h2>
          <p className="team-subtitle text-[clamp(0.95rem,1.5vw,1.1rem)] text-gray-600 font-medium leading-relaxed mt-3">
            Small enough to know every pool by name, big enough to be there when
            you need us.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          {TEAM_MEMBERS.map((member) => (
            <div
              key={member.id}
              className="team-card flex flex-col items-center group"
            >
              {/* Image Box Placeholder */}
              <div className="w-full aspect-square bg-[#D9D9D9] rounded-2xl flex items-center justify-center relative overflow-hidden transition-all duration-300 group-hover:scale-[1.02] shadow-sm">
                <svg
                  className="w-16 h-16 text-gray-400 opacity-80"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54-1.96-2.36L6.5 17h11l-3.54-4.71z" />
                </svg>
              </div>

              {/* Text Info */}
              <div className="w-full flex flex-col items-center mt-5 text-center">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-snug">
                  {member.name}
                </h3>
                <p className="text-sm sm:text-base font-normal text-gray-600 mt-1">
                  {member.role}
                </p>
                <p className="text-xs sm:text-sm text-gray-500 font-normal leading-relaxed mt-3 max-w-[280px]">
                  {member.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default AboutTeamSection;


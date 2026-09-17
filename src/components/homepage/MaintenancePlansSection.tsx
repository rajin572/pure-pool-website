"use client";

import React, { useRef } from "react";
import Container from "@/components/ui/CustomUi/Container";
import SectionHeading from "@/components/ui/CustomUi/SectionHeading";
import ReusableGradientButton from "@/components/ui/CustomUi/ReusableGradientButton";
import { Check } from "lucide-react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap-util";

interface PlanItem {
  id: string;
  name: string;
  subtitle: string;
  price: string;
  period: string;
  isPopular?: boolean;
  features: string[];
}

const PLANS: PlanItem[] = [
  {
    id: "essential",
    name: "Essential",
    subtitle: "Fortnightly visits for smaller residential pools.",
    price: "€60",
    period: "/ month",
    features: [
      "Fortnightly maintenance visit",
      "Water testing and chemical balancing",
      "Cleaning and filter basket checks",
      "Pure Pool app access with photos & logs",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    subtitle: "Weekly visits and priority response. What most of our customers choose.",
    price: "€85",
    period: "/ month",
    isPopular: true,
    features: [
      "Weekly maintenance visit",
      "Everything in Essential",
      "Equipment inspection and warranty tracking",
      "Priority emergency response",
      "Same qualified technician every week",
    ],
  },
  {
    id: "commercial",
    name: "Commercial",
    subtitle: "Hotels, communities and public pools with regulatory requirements.",
    price: "€340",
    period: "/ month",
    features: [
      "Visit frequency tailored to pool volume & usage",
      "Everything in Premium",
      "Official sanitary compliance records & reporting",
      "Multiple pools managed on one central account",
      "Named Madrid account manager & direct line",
    ],
  },
];

export interface MaintenancePlansSectionProps {
  onSelectPlan?: (planName: string) => void;
}

export const MaintenancePlansSection: React.FC<MaintenancePlansSectionProps> = ({
  onSelectPlan,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!cardsRef.current) return;
      const cards = cardsRef.current.querySelectorAll(".pricing-card");
      const badge = cardsRef.current.querySelector(".popular-badge");
      if (!cards || cards.length === 0) return;

      const reduceMotion = prefersReducedMotion();
      if (reduceMotion) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: cardsRef.current,
          start: "top 85%",
          toggleActions: "restart none none reverse",
        },
      });

      tl.fromTo(
        cards,
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.95,
          stagger: 0.12,
          ease: "premiumOut",
          force3D: true,
        }
      );

      if (badge) {
        tl.fromTo(
          badge,
          { opacity: 0, scale: 0 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.65,
            ease: "back.out(1.5)",
            force3D: true,
          },
          0.3
        );
      }

      const note = sectionRef.current?.querySelector(".pricing-note");
      if (note) {
        tl.fromTo(
          note,
          { opacity: 0, y: 15 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "premiumOut",
            force3D: true,
          },
          0.4
        );
      }
    },
    { dependencies: [] }
  );

  return (
    <section ref={sectionRef} className="w-full py-20 md:py-28 bg-[#f0f7ff] overflow-hidden">
      <Container>
        <SectionHeading
          badge="Maintenance Plans"
          title="Straightforward pricing"
          description="One fixed monthly fee covers every scheduled visit. Repairs and extra work are always quoted separately, before we start."
          maxWidth="max-w-3xl"
        />

        <div ref={cardsRef} className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mt-14 md:mt-16 items-stretch">
          {PLANS.map((plan) => {
            const isDark = plan.isPopular;

            return (
              <div
                key={plan.id}
                className={`pricing-card relative flex flex-col justify-between rounded-3xl p-6 sm:p-8 transition-all duration-300 ${isDark
                  ? "bg-[#0c2340] text-white shadow-2xl border-2 border-sky-400/50 scale-100 lg:-translate-y-2"
                  : "bg-white text-gray-900 shadow-md border border-gray-200/80 hover:shadow-xl hover:-translate-y-1"
                  }`}
              >
                {plan.isPopular && (
                  <div className="popular-badge absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 rounded-full bg-amber-500 text-white text-xs font-bold uppercase tracking-wider shadow-md">
                      MOST POPULAR
                    </span>
                  </div>
                )}

                <div>
                  {/* Header */}
                  <div className="pb-6 border-b border-gray-200/40 dark:border-white/10">
                    <h3 className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                      {plan.name}
                    </h3>
                    <p className={`text-sm mt-1 min-h-[40px] leading-relaxed ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                      {plan.subtitle}
                    </p>
                    <div className="flex items-baseline gap-1.5 mt-5">
                      <span className={`text-4xl sm:text-5xl font-extrabold tracking-tight ${isDark ? "text-white" : "text-gray-900"}`}>
                        {plan.price}
                      </span>
                      <span className={`text-base sm:text-lg font-medium ${isDark ? "text-gray-300" : "text-gray-500"}`}>
                        {plan.period}
                      </span>
                    </div>
                  </div>

                  {/* Feature Checklist */}
                  <div className="py-6 flex flex-col gap-3.5">
                    <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-gray-300" : "text-gray-500"}`}>
                      Includes:
                    </span>
                    <ul className="flex flex-col gap-3">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm sm:text-base leading-relaxed">
                          <div
                            className={`size-5 rounded-full shrink-0 flex items-center justify-center mt-0.5 ${isDark
                              ? "bg-sky-500/20 text-sky-400"
                              : "bg-emerald-50 text-emerald-600"
                              }`}
                          >
                            <Check className="size-3.5 stroke-[2.5]" />
                          </div>
                          <span className={isDark ? "text-gray-200" : "text-gray-700"}>
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card Action */}
                <div className="pt-6 mt-auto">
                  {onSelectPlan ? (
                    <ReusableGradientButton
                      type="button"
                      onClick={() => onSelectPlan(plan.name)}
                      fullWidth
                      size="lg"
                      className="py-3.5 text-base font-bold shadow-md rounded-xl"
                    >
                      Get a quote
                    </ReusableGradientButton>
                  ) : (
                    <ReusableGradientButton
                      type="redirect"
                      href={`/contact?plan=${encodeURIComponent(plan.name)}`}
                      fullWidth
                      size="lg"
                      className="py-3.5 text-base font-bold shadow-md rounded-xl"
                    >
                      Get a quote
                    </ReusableGradientButton>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Note */}
        <p className="pricing-note text-center text-xs sm:text-sm text-gray-500 mt-10 max-w-xl mx-auto leading-relaxed">
          All prices exclude VAT (IVA). No setup fees or lock-in contracts. Cancel or modify anytime with 14 days notice.
        </p>
      </Container>
    </section>
  );
};

export default MaintenancePlansSection;


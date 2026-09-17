"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGSAP, gsap, ScrollTrigger } from "@/lib/gsap-util";

const NAV_LINKS = [
    { label: "Services", href: "/services" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "Features", href: "/features" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
] as const;

const SOCIAL_LINKS = [
    { label: "LinkedIn", href: "#" },
    { label: "Facebook", href: "#" },
    { label: "Twitter", href: "#" },
] as const;

const CONTACT_EMAIL = "admin@bonaventpr.com";
const CONTACT_NAME = "Bonavent";
const BRAND_NAME = "Bonavent";

const buildFooterScrollTrigger = (
    footerEl: HTMLElement,
    containerEl: HTMLElement
): ScrollTrigger => {
    gsap.set(containerEl, { yPercent: -50 });

    const uncover = gsap.timeline({ paused: true });
    uncover.to(containerEl, { yPercent: 0, ease: "none" });

    const trigger = ScrollTrigger.create({
        trigger: footerEl,
        start: "top bottom",
        end: "+=75%",
        animation: uncover,
        scrub: true,
    });

    return trigger;
};

const Footer = () => {
    const footerRef = useRef<HTMLElement>(null);
    const containerRef = useRef<HTMLElement>(null);
    const triggerRef = useRef<ScrollTrigger | null>(null);
    const pathname = usePathname();

    // Rebuild ScrollTrigger from scratch — kills any previous one first
    const rebuildTrigger = () => {
        if (!footerRef.current || !containerRef.current) return;

        // Kill existing trigger if any
        if (triggerRef.current) {
            triggerRef.current.kill();
            triggerRef.current = null;
        }

        // Reset container and create fresh trigger
        triggerRef.current = buildFooterScrollTrigger(
            footerRef.current,
            containerRef.current
        );
    };

    // Initial setup on mount
    useGSAP(
        () => {
            if (!footerRef.current || !containerRef.current) return;
            triggerRef.current = buildFooterScrollTrigger(
                footerRef.current,
                containerRef.current
            );

            return () => {
                if (triggerRef.current) {
                    triggerRef.current.kill();
                    triggerRef.current = null;
                }
            };
        },
        { scope: footerRef }
    );

    // Listen for page transition end to rebuild the trigger
    // at the correct time — after the new page has fully rendered
    useEffect(() => {
        const handleTransitionEnd = () => {
            rebuildTrigger();
        };

        window.addEventListener("pageTransitionEnd", handleTransitionEnd);
        return () => {
            window.removeEventListener("pageTransitionEnd", handleTransitionEnd);
        };
    }, []);

    // React to route change: reset visually, then let the event handle the rest
    useEffect(() => {
        if (!containerRef.current) return;

        // Immediately reset the container so it's hidden on the new page
        gsap.set(containerRef.current, { yPercent: -50 });
    }, [pathname]);

    return (
        <footer
            ref={footerRef}
            className="h-[75vh] w-screen bg-base-color overflow-hidden relative"
        >
            <section
                ref={containerRef}
                className="footer-container h-[75vh] w-screen text-primary-color bg-[radial-gradient(ellipse_at_70%_50%,#313a7e_0%,#4d5bde_0%,var(--color-secondary-color)_100%)] flex flex-col justify-between px-6 md:px-12 py-8 md:py-10"
            >
                {/* Top row: contact + nav */}
                <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                    <div className="flex flex-col gap-1">
                        <p className="text-xs sm:text-sm text-primary-color/60">Contact {CONTACT_NAME} at:</p>
                        <a
                            href={`mailto:${CONTACT_EMAIL}`}
                            className="text-sm sm:text-base inline-flex items-center gap-1 text-primary-color hover:text-highlight-color transition-colors w-fit"
                        >
                            {CONTACT_EMAIL}
                            <span aria-hidden="true">↗</span>
                        </a>
                    </div>

                    <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm sm:text-base">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className="text-primary-color hover:text-highlight-color transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Middle: large brand wordmark */}
                <div className="flex items-center justify-center flex-1 select-none">
                    <h2 className="text-[18vw] md:text-[16vw] leading-none font-bold tracking-tight uppercase text-primary-color">
                        {BRAND_NAME}
                    </h2>
                </div>

                {/* Bottom row: copyright | legal | socials */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm">
                    {/* Copyright */}
                    <p className="text-primary-color/50">© {new Date().getFullYear()} {CONTACT_NAME}. All rights reserved.</p>

                    {/* Legal links — clearly separated */}
                    <div className="flex items-center gap-1 border border-primary-color/15 rounded-full px-4 py-1.5">
                        <Link
                            href="/privacy-policy"
                            className="hover:text-primary-color transition-colors cursor-pointer bg-transparent border-0 p-0 text-xs text-primary-color/60"
                        >Privacy Policy</Link>
                        <span className="text-primary-color/20 mx-1">·</span>
                        <Link
                            href="/terms-and-conditions"
                            className="hover:text-primary-color transition-colors cursor-pointer bg-transparent border-0 p-0 text-xs text-primary-color/60"
                        >
                            Terms & Conditions
                        </Link>
                    </div>

                    {/* Social links */}
                    <div className="flex flex-wrap gap-x-5 gap-y-2 text-primary-color/50">
                        {SOCIAL_LINKS.map((social) => (
                            <a
                                key={social.label}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-primary-color transition-colors"
                            >
                                {social.label}
                            </a>
                        ))}
                    </div>
                </div>
            </section>
        </footer>
    );
};

export default Footer;
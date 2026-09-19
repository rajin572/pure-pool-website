"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState, useTransition } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
    Bell,
    ChevronDown,
    ChevronRight,
    ClipboardList,
    CreditCard,
    FileText,
    HelpCircle,
    Loader2,
    LogOut,
    Settings,
    Sparkles,
    User,
    Waves,
    Wrench,
} from "lucide-react";
// import useUserData from "@/context/useGetUserData";
import Container from "../ui/CustomUi/Container";
import ReusableGradientButton from "../ui/CustomUi/ReusableGradientButton";
import { AllImages } from "../../../public/images/AllImages";
import { getAvatar } from "@/utils/getAvatar";

gsap.registerPlugin(useGSAP);

export interface NavItem {
    id: string;
    name: string;
    route: string;
}

export const LOGGED_OUT_NAV_ITEMS: NavItem[] = [
    { id: "1", name: "Home", route: "/" },
    { id: "2", name: "About Us", route: "/about-us" },
    { id: "5", name: "Contact Us", route: "/contact" },
];

export const LOGGED_IN_NAV_ITEMS: NavItem[] = [
    { id: "1", name: "Home", route: "/" },
    { id: "2", name: "About Us", route: "/about-us" },
    { id: "3", name: "My Pool", route: "/my-pool" },
    { id: "4", name: "Service History", route: "/service-history" },
    { id: "5", name: "Billing", route: "/billing" },
    { id: "6", name: "Quotes", route: "/quotes" },
    { id: "7", name: "Service Request", route: "/service-request" },
];

export interface DropdownMenuItemConfig {
    id: string;
    label: string;
    description: string;
    route: string;
    icon: React.ComponentType<{ className?: string }>;
    iconBg: string;
    badge?: string;
    badgeClass?: string;
}

export interface DropdownMenuSection {
    id: string;
    title?: string;
    items: DropdownMenuItemConfig[];
}

export const DROPDOWN_MENU_SECTIONS: DropdownMenuSection[] = [
    {
        id: "pool-management",
        title: "Pool Management",
        items: [
            {
                id: "my-pool",
                label: "My Pool Specifications",
                description: "Equipment, filter & volume data",
                route: "/my-pool",
                icon: Waves,
                iconBg: "bg-sky-50 text-sky-600 group-hover:bg-sky-500 group-hover:text-white",
                badge: "Active",
                badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
            },
            {
                id: "service-history",
                label: "Service History & Visits",
                description: "Completed maintenance & reports",
                route: "/service-history",
                icon: ClipboardList,
                iconBg: "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white",
            },
            {
                id: "quotes",
                label: "Quotes & Approvals",
                description: "Pending proposals & estimates",
                route: "/quotes",
                icon: FileText,
                iconBg: "bg-amber-50 text-amber-600 group-hover:bg-amber-500 group-hover:text-white",
                badge: "2 Pending",
                badgeClass: "bg-amber-50 text-amber-700 border-amber-200/80",
            },
            {
                id: "service-request",
                label: "Service Request",
                description: "Schedule cleaning or maintenance",
                route: "/service-request",
                icon: Wrench,
                iconBg: "bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white",
            },
        ],
    },
    {
        id: "account-settings",
        title: "Account & Settings",
        items: [
            {
                id: "profile",
                label: "Personal Profile",
                description: "Account details & address",
                route: "/profile",
                icon: User,
                iconBg: "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white",
            },
            {
                id: "billing",
                label: "Billing & Invoices",
                description: "Payment methods & statements",
                route: "/billing",
                icon: CreditCard,
                iconBg: "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white",
            },
            {
                id: "settings",
                label: "Preferences & Alerts",
                description: "Water alerts & notifications",
                route: "/settings",
                icon: Settings,
                iconBg: "bg-slate-100 text-slate-600 group-hover:bg-slate-700 group-hover:text-white",
            },
            {
                id: "help-center",
                label: "Help Center & Standards",
                description: "Water safety RD 742/2013 & FAQs",
                route: "/help-center",
                icon: HelpCircle,
                iconBg: "bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white",
            },
        ],
    },
];

const Navbar = () => {
    const path = usePathname();
    // const router = useRouter();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [hidden, setHidden] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [height, setHeight] = useState(0);
    const navbarRef = useRef<HTMLDivElement>(null);
    const navWrapperRef = useRef<HTMLDivElement>(null);
    const [isLoggingOut, startLogout] = useTransition();

    // const user = useUserData();
    // TODO: wire up real auth. Hardcoded to null (logged-out) so anonymous visitors and
    // search crawlers see the public marketing nav instead of a fake account menu.
    const user = null as { fullName: string; email: string; isSuscribed: boolean } | null;
    const navItems = user ? LOGGED_IN_NAV_ITEMS : LOGGED_OUT_NAV_ITEMS;

    const handleLogout = () => {
        startLogout(async () => {
            console.log("Logged out");
            // await logout();
            // window.dispatchEvent(new Event(TOKEN_UPDATED_EVENT));
            // router.push("/");
            // router.refresh();
        });
    };

    useEffect(() => {
        let lastScrollY = window.scrollY;

        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            setScrolled(currentScrollY > 10);

            if (currentScrollY > lastScrollY && currentScrollY > 150 && !mobileMenuOpen) {
                setHidden(true);
            } else {
                setHidden(false);
            }

            lastScrollY = currentScrollY;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [mobileMenuOpen]);

    useGSAP(
        () => {
            gsap.to(navWrapperRef.current, {
                y: hidden ? "-120%" : "0%",
                duration: 0.3,
                ease: "power2.inOut",
            });
        },
        { scope: navWrapperRef, dependencies: [hidden] }
    );

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;

        if (mobileMenuOpen) {
            timer = setTimeout(() => {
                setHeight(navbarRef.current?.scrollHeight ?? 0);
            }, 0);
        } else {
            timer = setTimeout(() => {
                setHeight(0);
            }, 0);
        }

        return () => clearTimeout(timer);
    }, [mobileMenuOpen]);

    return (
        <div
            ref={navWrapperRef}
            className={`z-99999 text-foreground transition-colors duration-300 ${scrolled ? "bg-primary-color shadow-sm" : "bg-transparent"
                }`}
        >
            <Container className="">
                <header className="flex justify-between items-center py-1.5 gap-2 xl:gap-4">
                    {/* Logo */}
                    <Link href="/" className="flex items-center shrink-0">
                        <Image
                            src={scrolled ? AllImages.logo : AllImages.logoSecondary}
                            alt="Pure Pool"
                            width={240}
                            height={60}
                            className="w-auto h-9 sm:h-10 xl:h-12 transition-all duration-300 object-contain"
                            preload
                        />
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden lg:flex items-center shrink-0">
                        <ul className="flex items-center gap-0.5 xl:gap-1.5">
                            {navItems.map((navItem) => (
                                <li key={navItem.id} className="flex items-center">
                                    <Link
                                        href={navItem.route}
                                        className={`px-2 xl:px-3 py-1.5 rounded-lg text-xs xl:text-base  font-medium tracking-normal xl:tracking-wide whitespace-nowrap shrink-0 transition-all duration-200 ${path === navItem.route
                                            ? "text-secondary-color bg-secondary-color/10 font-semibold"
                                            : scrolled
                                                ? "text-slate-700 hover:text-secondary-color hover:bg-slate-100/80"
                                                : "text-white/90 hover:text-white hover:bg-white/10"
                                            }`}
                                    >
                                        {navItem.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Right Actions */}
                    <div className="flex items-center gap-2 sm:gap-2.5 xl:gap-3 shrink-0">
                        {user ? (
                            <div className="flex items-center gap-2 sm:gap-2.5 xl:gap-3">
                                {/* Notifications Button */}
                                <button
                                    type="button"
                                    aria-label="Notifications"
                                    className={`relative flex items-center justify-center size-8 xl:size-9 rounded-full border transition-all duration-200 shrink-0 cursor-pointer ${scrolled
                                        ? "border-slate-200/90 text-slate-700 bg-slate-100/80 hover:bg-slate-200/80 hover:text-slate-900"
                                        : "border-white/20 text-white/90 bg-white/10 hover:bg-white/20 hover:text-white backdrop-blur-md"
                                        }`}
                                >
                                    <Bell className="size-4 xl:size-4.5" />
                                    <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-sky-500 ring-2 ring-white" />
                                </button>

                                {/* User Dropdown */}
                                <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                                    <DropdownMenuTrigger
                                        className={`group outline-none cursor-pointer flex items-center gap-1.5 xl:gap-2 pl-1.5 pr-2 xl:pr-3 py-1 rounded-full border transition-all duration-200 select-none shrink-0 ${scrolled
                                            ? "bg-slate-100/90 hover:bg-slate-200/80 border-slate-200/90 text-slate-900 shadow-xs"
                                            : "bg-white/10 hover:bg-white/20 border-white/20 text-white backdrop-blur-md shadow-xs"
                                            } ${dropdownOpen ? "ring-2 ring-sky-500/30 border-sky-400/50" : ""}`}
                                    >
                                        {/* Avatar with status */}
                                        <div className="relative shrink-0">
                                            <div className="size-7.5 xl:size-8 rounded-full bg-gradient-to-tr from-sky-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-xs ring-1 ring-white/30">
                                                {getAvatar(user?.fullName)}
                                            </div>
                                            <span className="absolute -bottom-0.5 -right-0.5 size-2 rounded-full bg-emerald-500 ring-2 ring-white" />
                                        </div>

                                        {/* Name & Plan (hidden on tiny screens, compact on lg) */}
                                        <div className="hidden sm:flex flex-col items-start text-left leading-tight min-w-0">
                                            <span
                                                className={`text-xs font-semibold tracking-tight truncate max-w-[70px] sm:max-w-[85px] xl:max-w-[110px] ${scrolled ? "text-slate-900" : "text-white"
                                                    }`}
                                            >
                                                {user?.fullName}
                                            </span>
                                            <span
                                                className={`hidden xl:block text-[10px] font-medium tracking-wide leading-none mt-0.5 ${scrolled ? "text-slate-500" : "text-white/70"
                                                    }`}
                                            >
                                                {user?.isSuscribed ? "Pro Member" : "Free Plan"}
                                            </span>
                                        </div>

                                        {/* Animated Chevron */}
                                        <ChevronDown
                                            className={`size-3.5 hidden sm:block opacity-60 transition-transform duration-200 ${scrolled ? "text-slate-700" : "text-white"
                                                } ${dropdownOpen ? "rotate-180 opacity-100" : "rotate-0"}`}
                                        />
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent
                                        align="end"
                                        side="bottom"
                                        sideOffset={8}
                                        className="w-[calc(100vw-2rem)] sm:w-80 max-w-sm p-0 overflow-hidden rounded-2xl border border-slate-200/90 bg-white/98 backdrop-blur-xl shadow-[0_20px_50px_rgba(8,112,184,0.12),0_10px_25px_rgba(0,0,0,0.08)] duration-150"
                                    >
                                        {/* Top Accent Gradient Bar */}
                                        <div className="h-1 w-full bg-gradient-to-r from-sky-400 via-blue-600 to-cyan-400" />

                                        {/* User Header Profile Card */}
                                        <div className="p-3.5 bg-gradient-to-b from-slate-50/90 via-slate-50/40 to-white border-b border-slate-100">
                                            <div className="flex items-center gap-3">
                                                <div className="relative shrink-0">
                                                    <div className="size-10 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-xs ring-1 ring-black/5">
                                                        {getAvatar(user?.fullName)}
                                                    </div>
                                                    <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center justify-between gap-1">
                                                        <p className="font-bold text-sm text-slate-900 truncate">
                                                            {user?.fullName}
                                                        </p>
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-50 text-sky-700 border border-sky-200/70 shrink-0">
                                                            <Sparkles className="size-2.5 text-sky-600" />
                                                            {user?.isSuscribed ? "Pro Member" : "Free Plan"}
                                                        </span>
                                                    </div>
                                                    {user?.email && (
                                                        <p className="text-xs text-slate-500 truncate mt-0.5">
                                                            {user.email}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Menu Items List */}
                                        <div className="p-1.5 flex flex-col gap-0.5 max-h-[340px] overflow-y-auto scrollbar-none">
                                            {DROPDOWN_MENU_SECTIONS.map((section, sIndex) => (
                                                <div key={section.id} className="flex flex-col gap-0.5">
                                                    {section.title && (
                                                        <div className="px-2.5 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                                            {section.title}
                                                        </div>
                                                    )}
                                                    {section.items.map((item) => (
                                                        <DropdownMenuItem
                                                            key={item.id}
                                                            render={<Link href={item.route} />}
                                                            className="group flex items-center gap-2.5 px-2.5 py-2 rounded-xl cursor-pointer hover:bg-slate-100/80 focus:bg-slate-100/80 transition-colors duration-150 outline-none text-slate-800"
                                                        >
                                                            <span
                                                                className={`flex items-center justify-center size-8 rounded-lg shrink-0 transition-colors duration-150 ${item.iconBg}`}
                                                            >
                                                                <item.icon className="size-4" />
                                                            </span>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center justify-between gap-1.5">
                                                                    <span className="text-xs font-semibold text-slate-800 group-hover:text-slate-950 transition-colors">
                                                                        {item.label}
                                                                    </span>
                                                                    {item.badge && (
                                                                        <span
                                                                            className={`text-[10px] font-medium px-1.5 py-0.2 rounded-full border ${item.badgeClass}`}
                                                                        >
                                                                            {item.badge}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <p className="text-[11px] text-slate-500 truncate group-hover:text-slate-600">
                                                                    {item.description}
                                                                </p>
                                                            </div>
                                                            <ChevronRight className="size-3.5 text-slate-300 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-150 shrink-0" />
                                                        </DropdownMenuItem>
                                                    ))}
                                                    {sIndex < DROPDOWN_MENU_SECTIONS.length - 1 && (
                                                        <div className="my-1 border-t border-slate-100" />
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        {/* Logout Section */}
                                        <div className="p-1.5 border-t border-slate-100 bg-slate-50/60">
                                            <DropdownMenuItem
                                                variant="destructive"
                                                onClick={handleLogout}
                                                disabled={isLoggingOut}
                                                className="group w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl cursor-pointer hover:bg-red-50 focus:bg-red-50 transition-colors duration-150 outline-none"
                                            >
                                                <span className="flex items-center justify-center size-8 rounded-lg bg-red-100/80 text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors duration-150 shrink-0">
                                                    {isLoggingOut ? (
                                                        <Loader2 className="size-4 animate-spin" />
                                                    ) : (
                                                        <LogOut className="size-4" />
                                                    )}
                                                </span>
                                                <div className="flex flex-col text-left flex-1 min-w-0">
                                                    <span className="text-xs font-semibold text-red-600 group-hover:text-red-700">
                                                        {isLoggingOut ? "Signing out…" : "Log out"}
                                                    </span>
                                                    <span className="text-[10px] text-red-400 group-hover:text-red-500">
                                                        End your active session
                                                    </span>
                                                </div>
                                            </DropdownMenuItem>
                                        </div>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        ) : (
                            <div className="hidden lg:flex items-center gap-2.5 xl:gap-5 shrink-0">
                                <Link
                                    href="/login"
                                    className={`text-xs xl:text-base font-medium hover:text-secondary-color transition-colors duration-200 whitespace-nowrap ${scrolled ? "text-lighter-color" : "text-primary-color/80"
                                        }`}
                                >
                                    Log In
                                </Link>
                                <ReusableGradientButton type="redirect" href="/register" size="lg" >
                                    Register
                                </ReusableGradientButton>
                            </div>
                        )}

                        {/* Mobile Hamburger Toggle */}
                        <div className="lg:hidden flex items-center gap-3">
                            <button
                                onClick={() => setMobileMenuOpen((prev) => !prev)}
                                className={`cursor-pointer transition-colors duration-200 ${scrolled ? "text-base-color" : "text-primary-color"
                                    }`}
                                aria-label="Toggle menu"
                            >
                                {mobileMenuOpen ? (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="size-7"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="size-7"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                                        />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </header>
            </Container>

            {/* Mobile Menu */}
            <div
                style={{ height: `${height}px`, overflow: "hidden", transition: "height 0.3s ease" }}
                ref={navbarRef}
                className="lg:hidden bg-primary-color shadow-md"
            >
                <ul className="flex flex-col items-center gap-4 py-6">
                    {navItems.map((navItem) => (
                        <li
                            key={navItem.id}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`cursor-pointer text-sm font-semibold tracking-wide hover:text-secondary-color transition-colors duration-300 ${path === navItem.route
                                ? "text-secondary-color underline underline-offset-4"
                                : "text-base-color"
                                }`}
                        >
                            <Link href={navItem.route}>{navItem.name}</Link>
                        </li>
                    ))}
                    {!user && (
                        <li
                            className="flex items-center gap-4 pt-2"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <Link
                                href="/login"
                                className="text-sm font-medium text-lighter-color hover:text-secondary-color"
                            >
                                Log In
                            </Link>
                            <ReusableGradientButton type="redirect" href="/register" size="sm">
                                Register
                            </ReusableGradientButton>
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default Navbar;

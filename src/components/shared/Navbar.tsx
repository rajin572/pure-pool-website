"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { HiOutlineAcademicCap, HiOutlineUserCircle } from "react-icons/hi";
import { FaUserLarge } from "react-icons/fa6";
import useUserData from "@/context/useGetUserData";
import Container from "../ui/CustomUi/Container";
import { AllImages } from "../../../public/images/AllImages";
import { getAvatar } from "@/utils/getAvatar";

gsap.registerPlugin(useGSAP);

const Navbar = () => {
    const path = usePathname();
    const router = useRouter();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [hidden, setHidden] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [height, setHeight] = useState(0);
    const navbarRef = useRef<HTMLDivElement>(null);
    const navWrapperRef = useRef<HTMLDivElement>(null);
    const [isLoggingOut, startLogout] = useTransition();

    const user = useUserData();

    const handleLogout = () => {
        startLogout(async () => {
            console.log("first")
            // await logout();
            // window.dispatchEvent(new Event(TOKEN_UPDATED_EVENT));
            // router.push("/");
            // router.refresh();
        });
    };

    const NavItems = [
        { id: "1", name: "HOME", route: "/" },
        { id: "2", name: "THE ACADEMY", route: "/the-academy" },
        { id: "3", name: "THE STUDIO", route: "/the-studio" },
        { id: "4", name: "THE METHOD", route: "/the-method" },
        { id: "5", name: "TESTIMONIALS", route: "/testimonials" },
        { id: "6", name: "ABOUT", route: "/about-us" },
    ];

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
            className={`z-99999 bg-[#FFFFFF] text-foreground ${scrolled ? "shadow-sm duration-300" : "duration-300"}`}
        >
            <Container>
                <header className="flex justify-between items-center py-3">
                    {/* Logo */}
                    <Link href="/" className="flex items-center shrink-0">
                        <Image src={AllImages.logo} alt="Logo" width={1000} height={1000} className="w-auto h-auto max-w-30 xl:max-w-35"
                            fetchPriority="high"
                            preload={true} />
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden lg:flex items-center">
                        <ul className="flex flex-wrap items-center">
                            {NavItems.map((navItem) => (
                                <li key={navItem.id} className="flex items-center">
                                    <Link
                                        href={navItem.route}
                                        className={`px-2 xl:px-4 text-sm xl:text-base font-medium tracking-wide hover:text-secondary-color transition-colors duration-300 ${path === navItem.route ? "text-secondary-color" : "text-[#9DB6DC]"}`}
                                    >
                                        {navItem.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Desktop Right Actions */}
                    <div className="flex items-center gap-3">
                        {/* Login/Register or User Dropdown */}
                        <div className="flex items-center">
                            {user ? (
                                <DropdownMenu>
                                    {/* Trigger: avatar + name + chevron */}
                                    <DropdownMenuTrigger className="outline-none cursor-pointer flex items-center gap-2 group">
                                        <FaUserLarge className="w-5 h-5 text-secondary-color" />
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent align="end" className="w-60 p-0! overflow-hidden rounded shadow">
                                        {/* User info header */}
                                        <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 bg-base-color">
                                            <div className="relative shrink-0">
                                                <div className="size-9 rounded-full bg-linear-to-br from-secondary-color to-secondary-color/80 flex items-center justify-center text-white font-semibold text-sm select-none">
                                                    {getAvatar(user?.fullName)}
                                                </div>
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-semibold text-sm text-primary-color truncate">{user?.fullName}</p>
                                                {user?.email && (
                                                    <p className="text-xs text-primary-color/50 truncate">{user.email}</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Menu items */}
                                        <div className="p-2 flex flex-col gap-0.5">
                                            <DropdownMenuItem
                                                render={<Link href="/profile" />}
                                                className="px-2.5! py-2! gap-2.5! rounded-xl! cursor-pointer bg-primary-color!"
                                            >
                                                <span className="flex items-center justify-center p-1.5 rounded bg-secondary-color/30 shrink-0">
                                                    <HiOutlineUserCircle className="w-4 h-4 text-gray-500" />
                                                </span>
                                                <span className="flex-1 text-sm font-medium text-gray-800">Profile</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                render={<Link href="/courses" />}
                                                className="px-2.5! py-2! gap-2.5! rounded-xl! cursor-pointer bg-primary-color!"
                                            >
                                                <span className="flex items-center justify-center p-1.5 rounded bg-secondary-color/30 shrink-0">
                                                    <HiOutlineAcademicCap className="w-4 h-4 text-gray-500" />
                                                </span>
                                                <span className="flex-1 text-sm font-medium text-gray-800">Courses</span>
                                            </DropdownMenuItem>
                                        </div>

                                        {/* Log out — separated */}
                                        <div className="p-2 border-t border-gray-100">
                                            <DropdownMenuItem
                                                variant="destructive"
                                                onClick={handleLogout}
                                                disabled={isLoggingOut}
                                                className="px-2.5! py-0! gap-2.5! rounded-xl! cursor-pointer bg-primary-color!"
                                            >
                                                <span className="flex items-center justify-center p-1.5 rounded bg-red-50 shrink-0">
                                                    <RiLogoutBoxRLine className="w-4 h-4 text-red-600" />
                                                </span>
                                                <span className="text-sm font-medium text-red-600">
                                                    {isLoggingOut ? "Logging out…" : "Log out"}
                                                </span>
                                            </DropdownMenuItem>
                                        </div>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <Link
                                    href="/register"
                                    className="flex items-center gap-2 text-sm font-medium text-[#9DB6DC] transition-colors duration-200"
                                >
                                    <FaUserLarge className="w-4 h-4 text-secondary-color" />
                                    LOG IN / REGISTER
                                </Link>
                            )}
                        </div>

                        {/* Contact Button */}
                        <Link
                            href="/contact"
                            className="ml-5 hidden lg:block px-3 py-1.5 bg-base-color text-white text-sm font-semibold rounded hover:bg-[#2a3444] transition-colors duration-200"
                        >
                            CONTACT
                        </Link>
                        {/* Mobile Right Actions */}
                        <div className="lg:hidden flex items-center gap-3">
                            <button
                                onClick={() => setMobileMenuOpen((prev) => !prev)}
                                className="cursor-pointer"
                                aria-label="Toggle menu"
                            >
                                {mobileMenuOpen ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#e6c258" className="w-8 h-8">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#e6c258" className="w-8 h-8">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
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
                className="lg:hidden bg-white border-t border-gray-100 shadow-md"
            >
                <ul className="flex flex-col items-center gap-5 py-6">
                    {NavItems.map((navItem) => (
                        <li
                            key={navItem.id}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`cursor-pointer text-sm font-semibold tracking-wide hover:text-secondary-color transition-colors duration-300 ${path === navItem.route ? "text-secondary-color underline underline-offset-4" : "text-[#9DB6DC]"}`}
                        >
                            <Link href={navItem.route}>{navItem.name}</Link>
                        </li>
                    ))}
                    <Link
                        href="/contact"
                        className="ml-5 lg:hidden block px-5 py-2 bg-[#1a2332] text-white text-sm font-semibold rounded hover:bg-[#2a3444] transition-colors duration-200"
                    >
                        CONTACT
                    </Link>
                </ul>
            </div>
        </div>
    );
};

export default Navbar;

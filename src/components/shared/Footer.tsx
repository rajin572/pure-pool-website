import Image from "next/image";
import Link from "next/link";
import {
    HiOutlineLocationMarker,
    HiOutlineMail,
    HiOutlinePhone,
} from "react-icons/hi";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa6";
import { AllImages } from "../../../public/images/AllImages";
import Container from "../ui/CustomUi/Container";

const ACCOUNT_LINKS = [
    { label: "My pool specifications", href: "/my-pool-specifications" },
    { label: "Service history & visits", href: "/service-history" },
    { label: "Invoices & payment", href: "/billing" },
    { label: "Contracts & renewals", href: "/contracts-renewals" },
    { label: "Equipment manuals & warranties", href: "/equipment-manuals-warranties" },
    { label: "Documents", href: "/documents" },
] as const;

const SUPPORT_LINKS = [
    { label: "Help center & FAQ", href: "/help-center" },
    { label: "Water safety standards (RD 742/2013)", href: "/water-safety-standards" },
] as const;

const SOCIAL_LINKS = [
    { label: "Facebook", href: "#", Icon: FaFacebook },
    { label: "Instagram", href: "#", Icon: FaInstagram },
    { label: "YouTube", href: "#", Icon: FaYoutube },
] as const;

const FooterLinkColumn = ({
    title,
    links,
}: {
    title: string;
    links: ReadonlyArray<{ label: string; href: string }>;
}) => (
    <div className="flex flex-col gap-3.5 min-w-0">
        <h3 className="text-sm font-bold uppercase tracking-wider text-primary-color">
            {title}
        </h3>
        <ul className="flex flex-col gap-2.5">
            {links.map((link) => (
                <li key={link.label} className="min-w-0">
                    <Link
                        href={link.href}
                        className="text-sm font-medium text-primary-color/80 hover:text-primary-color transition-colors leading-snug block"
                    >
                        {link.label}
                    </Link>
                </li>
            ))}
        </ul>
    </div>
);

const Footer = () => {
    return (
        <footer className="w-full overflow-x-clip bg-sky-950 text-primary-color">
            <Container className="flex flex-col gap-12 pt-16 pb-12">
                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8 xl:gap-12">
                    {/* Brand Column */}
                    <div className="flex flex-col items-start gap-3 sm:col-span-2 lg:col-span-4 min-w-0">
                        <Link href="/" className="inline-block">
                            <Image
                                src={AllImages.logoSecondary}
                                alt="Pure Pool"
                                width={240}
                                height={80}
                                className="h-16 sm:h-18 w-auto object-contain"
                                priority
                            />
                        </Link>
                        <p className="text-sm leading-relaxed text-primary-color/85 max-w-sm">
                            Pure Pool provides premium, stress-free pool maintenance, diagnostic
                            chemistry, and warranty protection across Greater Madrid.
                        </p>
                    </div>

                    {/* Account Links */}
                    <div className="sm:col-span-1 lg:col-span-3 min-w-0">
                        <FooterLinkColumn title="Your Account" links={ACCOUNT_LINKS} />
                    </div>

                    {/* Support Links */}
                    <div className="sm:col-span-1 lg:col-span-2 min-w-0">
                        <FooterLinkColumn title="Support" links={SUPPORT_LINKS} />
                    </div>

                    {/* Get In Touch */}
                    <div className="flex flex-col gap-3.5 sm:col-span-2 lg:col-span-3 min-w-0">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-primary-color">
                            Get In Touch
                        </h3>
                        <ul className="flex flex-col gap-3 text-sm font-medium text-primary-color/85">
                            <li className="flex items-start gap-2.5 min-w-0">
                                <HiOutlineLocationMarker className="mt-0.5 size-5 shrink-0 text-sky-400" />
                                <span className="leading-snug break-words">
                                    Calle de Velázquez 94, 1º Izq, 28006 Madrid, Spain
                                </span>
                            </li>
                            <li className="flex items-center gap-2.5 min-w-0">
                                <HiOutlinePhone className="size-5 shrink-0 text-sky-400" />
                                <a
                                    href="tel:+34910882140"
                                    className="hover:text-primary-color transition-colors"
                                >
                                    +34 910 882 140
                                </a>
                            </li>
                            <li className="flex items-center gap-2.5 min-w-0">
                                <HiOutlineMail className="size-5 shrink-0 text-sky-400" />
                                <a
                                    href="mailto:support@purepool.es"
                                    className="hover:text-primary-color transition-colors truncate"
                                >
                                    support@purepool.es
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="flex flex-col items-center gap-5 pt-8 border-t border-white/10 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs sm:text-sm text-primary-color/75 text-center sm:text-left">
                        © {new Date().getFullYear()} Pure Pool. All rights reserved.
                    </p>
                    <div className="flex items-center gap-5">
                        {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                            <a
                                key={label}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={label}
                                className="text-primary-color/80 hover:text-sky-400 hover:scale-110 transition-all duration-200"
                            >
                                <Icon className="size-5" />
                            </a>
                        ))}
                    </div>
                </div>
            </Container>
        </footer>
    );
};

export default Footer;

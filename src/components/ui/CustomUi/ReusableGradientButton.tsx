"use client";

import Link from "next/link";
import { useRef } from "react";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useMagnetic } from "@/lib/useMagnetic";

type GradientButtonSize = "sm" | "md" | "lg";

const SIZE_CLASSES: Record<GradientButtonSize, string> = {
    sm: " px-3 py-1 text-sm gap-1",
    md: " px-4 py-1.5 text-sm gap-1",
    lg: " px-3 py-1.5 text-base gap-0.5",
};

const BASE_CLASSES =
    "group relative isolate overflow-hidden inline-flex shrink-0 items-center justify-center rounded-xl font-bold font-['Onest'] text-primary-color " +
    "bg-gradient-to-br shadow-[0px_1px_1px_-0.5px_rgba(0,0,0,0.03),inset_0px_3px_3px_0px_rgba(255,255,255,0.12)] " +
    "outline outline-1 -outline-offset-1 outline-white/25 backdrop-blur-md select-none will-change-transform " +
    "transition-[opacity,box-shadow] duration-200 hover:opacity-90 hover:shadow-lg active:opacity-80 " +
    "disabled:pointer-events-none disabled:opacity-50";

/** Diagonal light sweep + clipping wrapper, shared by both the link and button render paths. */
const ButtonShine = () => (
    <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[inherit]"
    >
        <span className="absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/35 to-transparent -translate-x-[200%] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:group-hover:translate-x-[420%]" />
    </span>
);

interface GradientButtonBaseProps {
    children: ReactNode;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    size?: GradientButtonSize;
    fullWidth?: boolean;
    /** Tailwind gradient "from-*" class, e.g. "from-sky-500" */
    gradientFrom?: string;
    /** Tailwind gradient "to-*" class, e.g. "to-blue-600" */
    gradientTo?: string;
    className?: string;
}

type GradientButtonAsButton = GradientButtonBaseProps &
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "size" | "className"> & {
        type?: "button" | "submit" | "reset";
        href?: never;
    };

type GradientButtonAsLink = GradientButtonBaseProps &
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "type" | "href" | "className"> & {
        type: "redirect";
        href: string;
    };

export type ReusableGradientButtonProps = GradientButtonAsButton | GradientButtonAsLink;

const ReusableGradientButton = (props: ReusableGradientButtonProps) => {
    // Hooks must run unconditionally (before the branch below) to respect the rules of hooks.
    const nodeRef = useRef<HTMLAnchorElement & HTMLButtonElement>(null);
    useMagnetic(nodeRef, { strength: 0.22 });

    if (props.type === "redirect") {
        const {
            children,
            leftIcon,
            rightIcon,
            size = "lg",
            fullWidth,
            gradientFrom = "from-sky-500",
            gradientTo = "to-blue-600",
            className,
            type: _type,
            href,
            target,
            rel,
            ...anchorRest
        } = props;

        return (
            <Link
                ref={nodeRef}
                href={href}
                target={target}
                rel={rel ?? (target === "_blank" ? "noopener noreferrer" : undefined)}
                className={cn(BASE_CLASSES, gradientFrom, gradientTo, SIZE_CLASSES[size], fullWidth && "w-full", className)}
                {...anchorRest}
            >
                <ButtonShine />
                {leftIcon && <span className="relative z-10 flex items-center shrink-0">{leftIcon}</span>}
                <span className="relative z-10">{children}</span>
                {rightIcon && <span className="relative z-10 flex items-center shrink-0">{rightIcon}</span>}
            </Link>
        );
    }

    const {
        children,
        leftIcon,
        rightIcon,
        size = "lg",
        fullWidth,
        gradientFrom = "from-sky-500",
        gradientTo = "to-blue-600",
        className,
        type = "button",
        ...buttonRest
    } = props;

    return (
        <button
            ref={nodeRef}
            type={type}
            className={cn(BASE_CLASSES, gradientFrom, gradientTo, SIZE_CLASSES[size], fullWidth && "w-full", className)}
            {...buttonRest}
        >
            <ButtonShine />
            {leftIcon && <span className="relative z-10 flex items-center shrink-0">{leftIcon}</span>}
            <span className="relative z-10">{children}</span>
            {rightIcon && <span className="relative z-10 flex items-center shrink-0">{rightIcon}</span>}
        </button>
    );
};

export default ReusableGradientButton;

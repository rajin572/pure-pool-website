"use client";

import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type GradientButtonSize = "sm" | "md" | "lg";

const SIZE_CLASSES: Record<GradientButtonSize, string> = {
    sm: " px-3 py-1 text-sm gap-1",
    md: " px-4 py-1.5 text-sm gap-1",
    lg: " px-3 py-1.5 text-base gap-0.5",
};

const BASE_CLASSES =
    "inline-flex shrink-0 items-center justify-center rounded-xl font-bold font-['Onest'] text-primary-color " +
    "bg-gradient-to-br shadow-[0px_1px_1px_-0.5px_rgba(0,0,0,0.03),inset_0px_3px_3px_0px_rgba(255,255,255,0.12)] " +
    "outline outline-1 -outline-offset-1 outline-white/25 backdrop-blur-md select-none " +
    "transition-opacity duration-200 hover:opacity-90 active:opacity-80 " +
    "disabled:pointer-events-none disabled:opacity-50";

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
                href={href}
                target={target}
                rel={rel ?? (target === "_blank" ? "noopener noreferrer" : undefined)}
                className={cn(BASE_CLASSES, gradientFrom, gradientTo, SIZE_CLASSES[size], fullWidth && "w-full", className)}
                {...anchorRest}
            >
                {leftIcon && <span className="flex items-center shrink-0">{leftIcon}</span>}
                <span>{children}</span>
                {rightIcon && <span className="flex items-center shrink-0">{rightIcon}</span>}
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
            type={type}
            className={cn(BASE_CLASSES, gradientFrom, gradientTo, SIZE_CLASSES[size], fullWidth && "w-full", className)}
            {...buttonRest}
        >
            {leftIcon && <span className="flex items-center shrink-0">{leftIcon}</span>}
            <span>{children}</span>
            {rightIcon && <span className="flex items-center shrink-0">{rightIcon}</span>}
        </button>
    );
};

export default ReusableGradientButton;

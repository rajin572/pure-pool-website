import React, { useRef, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { Button } from "../button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../dialog";

interface ReusableModalProps {
    trigger?: React.ReactElement;
    title?: string;
    description?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    maxWidth?: string;
    showCloseButton?: boolean;
    closeButtonText?: string;
    showXCloseButton?: boolean;
    contentClassName?: string;
}

function ReusableModal({
    trigger,
    title,
    description,
    children,
    footer,
    open,
    onOpenChange,
    maxWidth = "sm:max-w-[765px]",
    showCloseButton = false,
    closeButtonText = "Cancel",
    showXCloseButton = true,
    contentClassName,
}: ReusableModalProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (open) {
            const resetScroll = () => {
                if (scrollContainerRef.current) {
                    scrollContainerRef.current.scrollTop = 0;
                }
            };
            resetScroll();
            const timer = setTimeout(resetScroll, 50);
            return () => clearTimeout(timer);
        }
    }, [open]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {trigger && <DialogTrigger render={trigger} />}

            <DialogContent
                className={cn(
                    "flex flex-col max-h-[calc(100dvh-2.5rem)] sm:max-h-[calc(100dvh-4rem)] overflow-hidden p-0 gap-0",
                    maxWidth
                )}
                showCloseButton={showXCloseButton}
            >
                {title ? (
                    <DialogHeader className="shrink-0 pt-5 sm:pt-6 px-5 sm:px-6 pb-4 pr-12 border-b border-gray-100">
                        <DialogTitle className='text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 leading-snug'>{title}</DialogTitle>
                        {description && <DialogDescription className="text-xs sm:text-sm text-gray-500 mt-1">{description}</DialogDescription>}
                    </DialogHeader>
                ) : (
                    <DialogHeader className="sr-only">
                        <DialogTitle>Dialog</DialogTitle>
                    </DialogHeader>
                )}

                <div
                    ref={scrollContainerRef}
                    className={cn("flex-1 min-h-0 overflow-y-auto px-5 sm:px-6 py-4 sm:py-5", contentClassName)}
                >
                    {children}
                </div>

                {(footer || showCloseButton) && (
                    <DialogFooter className="shrink-0 border-t border-gray-100 bg-gray-50/50 p-4 sm:px-6 sm:py-4 flex-col-reverse sm:flex-row sm:justify-end gap-2 m-0 rounded-b-xl">
                        {showCloseButton && (
                            <DialogClose render={<Button variant="outline">{closeButtonText}</Button>} />
                        )}
                        {footer}
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    );
}

export default ReusableModal;
"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type DownloadModalProps = {
    children: React.ReactNode;
    className?: string;
};

const DownloadModal = ({ children, className }: DownloadModalProps) => {
    return (
        <Dialog>
            <DialogTrigger className={cn("cursor-pointer", className)}>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md rounded-2xl p-6">
                <DialogHeader className=" my-10!">
                    <DialogTitle className="text-2xl sm:text-3xl lg:text-4xl font-bold text-base-color text-center mb-3!">
                        Coming Soon...
                    </DialogTitle>
                    <DialogDescription className="text-base sm:text-lg lg:text-xl text-lighter-color text-center">
                        Our Apps Will Be Available Soon.
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export default DownloadModal;
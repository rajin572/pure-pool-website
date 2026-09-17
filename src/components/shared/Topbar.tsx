"use client";
import { SidebarTrigger } from "@/components/ui/sidebar";

const Topbar = () => {
    return (
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-4 border-b border-slate-100 bg-white px-4">
            <SidebarTrigger />

            <div className="ml-auto flex items-center gap-1 rounded-full bg-background-color py-1.5 pr-1.5 pl-4">
                <button
                    type="button"
                    className="rounded-full bg-secondary-color px-5 py-1.5 text-sm font-semibold text-white transition-colors"
                >
                    Log in
                </button>
            </div>
        </header>
    );
};

export default Topbar;

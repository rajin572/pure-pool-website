import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import { ChatBot } from "@/components/chatbot";
// import DaynamicCursor from "@/component/ui/animation/DaynamicCursor";
// import SmoothScroller from "@/component/ui/animation/SmoothScroller";
import React from "react";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="relative min-h-screen flex flex-col justify-between overflow-x-clip">
            <div className="fixed top-0 h-fit! w-full z-100!">
                <Navbar />
            </div>
            <main className="flex-1">
                {children}
            </main>
            <ChatBot />
            <Footer />
        </div>
    );
};

export default MainLayout;

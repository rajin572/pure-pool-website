import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
// import DaynamicCursor from "@/component/ui/animation/DaynamicCursor";
// import SmoothScroller from "@/component/ui/animation/SmoothScroller";
import React from "react";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div>

            <div className="fixed top-0 h-fit! w-full z-100!">
                <Navbar />
            </div>
            <div className="mt-14">
                {children}
            </div>
            <Footer />
        </div>
    );
};

export default MainLayout;

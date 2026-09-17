import { SidebarProvider } from "@/components/ui/sidebar";
import { Sidebar } from "@/components/shared/Sidebar";
import Topbar from "@/components/shared/Topbar";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <SidebarProvider>
            <Sidebar />
            <div className="flex min-w-0 flex-1 flex-col">
                <Topbar />
                <div className="flex min-w-0 flex-1 bg-background-color">
                    <main className="min-w-0 flex-1 h-[calc(100vh-56px)] overflow-y-auto scrollbar-none ">{children}</main>
                </div>
            </div>
        </SidebarProvider>
    );
};

export default MainLayout;

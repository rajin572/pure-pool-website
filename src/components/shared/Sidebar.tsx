"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Compass,
  Home,
  MessageCircle,
  Plus,
  Store,
  User,
} from "lucide-react";
import { AllImages } from "../../../public/images/AllImages";
import {
  Sidebar as SidebarPrimitive,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const NAV_ITEMS = [
  { label: "Home", href: "/", icon: Home },
  { label: "Explore", href: "/explore", icon: Compass },
  { label: "Marketplace", href: "/marketplace", icon: Store },
  { label: "Chat", href: "/chat", icon: MessageCircle },
  { label: "Notifications", href: "/notifications", icon: Bell },
  { label: "Profile", href: "/profile", icon: User },
] as const;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <SidebarPrimitive collapsible="icon">
      <SidebarHeader className="items-center py-4">
        <Link href="/" className="flex items-center justify-center">
          <Image
            src={AllImages.logo}
            alt="eKayzone"
            className="h-auto w-[90%] group-data-[collapsible=icon]:hidden"
            priority
          />
          <Image
            src={AllImages.logoIcon}
            alt="eKayzone"
            className="hidden h-auto w-7 shrink-0 group-data-[collapsible=icon]:block"
            priority
          />
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarMenu className="gap-1.5">
          {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <SidebarMenuItem key={label}>
                <SidebarMenuButton
                  render={<Link href={href} />}
                  isActive={isActive}
                  tooltip={label}
                  size="lg"
                  className="gap-3 rounded-xl px-4 text-[15px] group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:rounded-full [&_svg]:size-5"
                >
                  <Icon strokeWidth={isActive ? 2.5 : 2} />
                  <span
                    className={`group-data-[collapsible=icon]:hidden ${isActive ? "font-semibold" : "font-medium"}`}
                  >
                    {label}
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="pb-4">
        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-xl bg-secondary-color px-4 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-secondary-color/90 group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:rounded-md group-data-[collapsible=icon]:p-0"
        >
          <Plus className="hidden size-4 group-data-[collapsible=icon]:block" />
          <span className="group-data-[collapsible=icon]:hidden">Create</span>
        </button>
      </SidebarFooter>
    </SidebarPrimitive>
  );
}

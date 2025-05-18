"use client";

import { Calendar, PawPrint, BookOpenText, House, ArrowUpNarrowWide,  } from "lucide-react";
import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/Logo";
import { usePathname } from "next/navigation";
import classnames from "classnames";
import { useSession } from "@/auth-client";

export default function AppSidebar() {
  const currentPath = usePathname();
  const session = useSession();
  const id = session?.data?.user?.id;

  // Menu items.
  const items = [
    {
      title: "Home",
      url: "/shelter-homepage",
      icon: PawPrint,
    },
    {
      title: "Public Page",
      url: `/public-page/${id}`,
      icon: BookOpenText,
    },
    {
      title: "Adoption Requests",
      url: `/adoption-requests/${id}`,
      icon: Calendar,
    },
    {
      title: "Rehome Requests",
      url: "/rehoming-requests",
      icon: House,
    },
    {
      title: "Analytics",
      url: "/analytics",
      icon: ArrowUpNarrowWide,
    },
  ];

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <Logo color="white" />
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="text-white flex flex-col gap-8">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a
                      href={item.url}
                      target={item.title === "Public Page" ? "_blank" : "_self"}
                      rel="noopener noreferrer"
                      className={classnames({
                        "flex items-center gap-3": true,
                        "bg-primary-foreground opacity-50 text-sidebar-accent-foreground focus-visible:ring-2":
                          item.url === currentPath,
                        "text-white": item.url !== currentPath,
                      })}
                    >
                      <item.icon size={32} className="w-15 h-15 text-current" />
                      <span className="text-lg font-medium">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

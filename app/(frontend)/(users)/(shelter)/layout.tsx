'use client'

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import AppSidebar from "../_components/shelters/app-sidebar";
import ShelterNavbar from "../_components/shelters/shelter-navbar";

export default function ShelterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <ShelterNavbar />
      <SidebarProvider>
        <AppSidebar/>
        <SidebarTrigger />
        {children}
      </SidebarProvider>
    </main>
  );
}

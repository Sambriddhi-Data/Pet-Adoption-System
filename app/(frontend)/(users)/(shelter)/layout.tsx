'use client'

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import AppSidebar from "../_components/app-sidebar";
import ShelterNavbar from "../_components/shelter-navbar";

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

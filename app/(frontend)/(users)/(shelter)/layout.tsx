import { SidebarProvider } from "@/components/ui/sidebar"
import AppSidebar from "../_components/shelters/app-sidebar";
import ShelterNavbar from "../_components/shelters/shelter-navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Fur-Ever Friends",
    template:"%s | Fur-Ever Friends"
  },
  description: "Pet Adoption Website",
};

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
        {children}
      </SidebarProvider>
    </main>
  );
}

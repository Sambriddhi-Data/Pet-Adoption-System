import { SidebarProvider } from "@/components/ui/sidebar"
import AppSidebar from "../_components/shelters/app-sidebar";
import ShelterNavbar from "../_components/shelters/shelter-navbar";
import ResponsiveNavbar from "../_components/shelters/responsive-navbar";
import type { Metadata } from "next";
import ShelterFooter from "@/components/Shelter-Footer";

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
    <>
    <main>
      {/* Mobile and Tablet Navigation (Hidden on large screens) */}
      <div className="lg:hidden">
        <ResponsiveNavbar />
      </div>
      
      {/* Desktop Navigation (Hidden on small/medium screens) */}
      <div className="hidden lg:block">
        <ShelterNavbar />
        <SidebarProvider>
          <AppSidebar/>
          {children}
        </SidebarProvider>
      </div>
      
      {/* Content for mobile/tablet without the SidebarProvider */}
      <div className="lg:hidden">
        {children}
      </div>
    </main>
    {/* <ShelterFooter className/> */}
    </>

  );
}

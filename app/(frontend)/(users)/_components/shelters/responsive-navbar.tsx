"use client";

import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger
} from "@/components/ui/sheet";
import { Calendar, PawPrint, BookOpenText, House, ArrowUpNarrowWide, Menu, UserPen, LogOut } from "lucide-react";
import { usePathname, redirect } from "next/navigation";
import Link from "next/link";
import { useSession, signOut } from "@/auth-client";
import classnames from "classnames";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function ResponsiveNavbar() {
  const currentPath = usePathname();
  const session = useSession();
  const id = session?.data?.user?.id;
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState<boolean>(false);
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);

  // Menu items (same as sidebar)
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
    {
      title: "Profile",
      url: "/shelter-profile",
      icon: UserPen,
    },
  ];

  return (
    <div className="flex items-center justify-between w-full px-4 py-2 bg-primary text-white">
      <div className="flex items-center">
        <Logo color="white" />
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" className="p-2">
            <Menu className="h-6 w-6 text-white" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="bg-primary text-white border-none">
          <div className="flex flex-col gap-6 mt-10">
            {items.map((item) => (
              <Link
                key={item.title}
                href={item.url}
                target={item.title === "Public Page" ? "_blank" : "_self"}
                rel="noopener noreferrer"
                className={classnames({
                  "flex items-center gap-3 px-4 py-3 rounded-md transition-colors": true,
                  "bg-primary-foreground opacity-80 text-sidebar-accent-foreground": 
                    item.url === currentPath,
                  "hover:bg-primary-foreground/30": item.url !== currentPath,
                })}
              >
                <item.icon size={24} className="text-current" />
                <span className="text-base font-medium">{item.title}</span>
              </Link>
            ))}

            {/* Sign out button */}
            <button 
              onClick={() => {
                setIsSheetOpen(false);
                setIsAlertDialogOpen(true);
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-md transition-colors hover:bg-primary-foreground/30"
            >
              <LogOut size={24} className="text-current" />
              <span className="text-base font-medium">Sign Out</span>
            </button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Sign Out Alert Dialog */}
      <AlertDialog open={isAlertDialogOpen} onOpenChange={(open) => { setIsAlertDialogOpen(open) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to sign out?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            You need to sign in again after signing out!
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={async () => {
              const response = await signOut();
              if (response.data?.success === true) {
                redirect("/");
              }
            }}>Sign Out</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
'use client'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { redirect, usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";
import { buttonVariants } from './ui/button';
import { signOut, useSession } from '@/auth-client';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import classNames from 'classnames';

export default function Navbar() {
  const session = useSession();
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const currentPath = usePathname();
  const user = session?.data?.user;
  const [menuItems, setMenuItems] = useState<{ label: string, path: string }[]>([]);

  useEffect(() => {
    if (!user) return;

    let items = [{ label: "Profile", path: "/customer-profile" }];

    if (user.user_role === "shelter_manager") {
      items.unshift({ label: "Shelter Controls", path: "/shelter-homepage" });
    } else if (user.user_role === "admin") {
      items.unshift({ label: "Admin Controls", path: "/admin-homepage" });
    }

    setMenuItems(items);
  }, [user]);

  const links = [
    { title: "Adopt a pet", href: "/adopt-pet" },
    { title: "Rehome a pet", href: "/rehome-pet" },
    { title: "About Us", href: "/about-us" },
    { title: "Blog", href: "/blog" },
  ];

  return (
    <div className="border-b px-16 bg-primary">
      <div className="flex items-center justify-between mx-auto h-16">
        {/* Logo */}
        <Link href="/">
          <Logo color="white" />
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center text-white gap-5">
          <ul className="flex space-x-6">
            {links.map(link => (
              <Link key={link.href} href={link.href} className={classNames('text-white hover:underline', { 'underline': link.href === currentPath })}>
                {link.title}
              </Link>
            ))}
          </ul>

          {/* User Account Menu */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div>
                  <h1>My Account</h1>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {menuItems.map(item => (
                  <DropdownMenuItem key={item.path} onClick={() => redirect(item.path)}>
                    {item.label}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem onClick={() => setIsAlertDialogOpen(true)}>Sign Out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href='/sign-in' className={buttonVariants({ variant: "secondary" })}>
              Sign In
            </Link>
          )}
        </div>
      </div>

      {/* Sign Out Dialog */}
      <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to sign out?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>You will need to sign in again.</AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={async () => {
              const response = await signOut();
              if (response.data?.success) {
                redirect("/sign-in");
              }
            }}>
              Sign Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

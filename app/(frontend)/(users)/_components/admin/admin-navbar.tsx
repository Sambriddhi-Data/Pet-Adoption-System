'use client'

import React, { useState } from 'react'
import { redirect, usePathname } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { signOut, useSession } from '@/auth-client';
import { Logo } from '@/components/Logo';
import Link from 'next/link';
import classNames from 'classnames';


export default function AdminNavbar() {
  const session = useSession();
  const user = session?.data?.user;
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState<boolean>();
  const currentPath = usePathname();

  const links = [
    { title: 'Customer Home', href: '/' },
    { title: 'Admin Home', href: '/admin-homepage' },
    { title: 'Add Blog', href: '/add-blog' },
    { title: 'Pet Alerts', href: '/pet-alerts' },
  ];

  return (
    <div className="border-b px-16">
      <div className="flex items-center justify-between mx-auto p-4 h-16">
        <div>
          <Link href={"/"}>
            <Logo color='black' />
          </Link>
        </div>
        <div className="hidden md:flex items-center text-primary gap-2 md:gap-3 lg:gap-6">
          <ul className="flex space-x-6">
            {links.map(link => (
              <Link key={link.href} href={link.href} className={classNames('text-primary hover:underline', { 'underline': link.href === currentPath })}>
                {link.title}
              </Link>
            ))}
          </ul>
          <DropdownMenu>
            <DropdownMenuTrigger>
              {/* Admin Name + Logo */}
              <div className='flex items-center text-black gap-2 text-lg'>
                <h1 className='font-fruktur'>{user?.name}</h1>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => {
                redirect("/");
              }}>Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                setIsAlertDialogOpen(true)
              }}>Sign Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

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
    </div>
  )
}

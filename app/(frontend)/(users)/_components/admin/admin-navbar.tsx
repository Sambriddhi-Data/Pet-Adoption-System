'use client'
import React, { useState } from 'react'
import { redirect } from "next/navigation";
import { CldImage } from 'next-cloudinary';
import Image from 'next/image'
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { signOut, useSession } from '@/auth-client';
import { Logo } from '@/components/Logo';
import Link from 'next/link';


export default function AdminNavbar() {
  const session = useSession();
  const user = session?.data?.user;
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState<boolean>();
  return (
    <div className="border-b px-4">
      <div className="flex items-center justify-between mx-auto p-4 h-16">
        <div>
          <Link href={"/"}>
            <Logo color='black' />
          </Link>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            {/* Admin Name + Logo */}
            <div className='flex items-center gap-2 text-lg'>
              <h1 className='font-fruktur'>{user?.name}</h1>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => {
              redirect("/shelter-profile");
            }}>Profile</DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              setIsAlertDialogOpen(true)
            }}>Sign Out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

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

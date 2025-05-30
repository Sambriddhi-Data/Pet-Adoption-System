'use client'
import React, { useState } from 'react'
import { redirect, useRouter } from "next/navigation";
import { CldImage } from 'next-cloudinary';
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
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';


export default function ShelterNavbar() {
  const session = useSession();
  const user = session?.data?.user;
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState<boolean>();

  const handleOnClick = () => {
    redirect("/");
  }
  return (
    <div className="border-b bg-white px-4">
      <div className="flex items-center justify-between mx-auto p-4 h-16">
        <div className='ml-64'>
          <Button onClick={handleOnClick}>Switch to Customer</Button>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            {/* Shelter Name + Logo */}
            <div className='flex items-center gap-2 text-lg'>
              <h1 className='font-fruktur'>{user?.name}</h1>
              <CldImage
                src= {user?.image || "https://res.cloudinary.com/dasa1mcpz/image/upload/v1739022787/FurEverFriendsPetImages/kracd2oevfyabh2scuqk.png"}
                width="28" // Transform the image: auto-crop to square aspect_ratio
                height="28"
                alt="Sample"
                crop={{
                  type: 'auto',
                  source: true
                }}
              />
              <ChevronDown size={18}/>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => {
              redirect(`/shelter-profile/${user?.id}`);
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

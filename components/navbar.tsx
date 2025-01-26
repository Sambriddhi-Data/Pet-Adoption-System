'use client'
import Link from 'next/link'
import React, { useState } from 'react'
import { redirect, usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";
import { buttonVariants } from './ui/button';
import { signOut, useSession } from '@/auth-client';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from "@/components/ui/alert-dialog"
import classNames from 'classnames';

export default function Navbar() {
  const session = useSession();
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState<boolean>();
  const currentPath = usePathname();

  const links = [
    {
      title: "Adopt a pet",
      href: "/adopt-pet",
    },
    {
      title: "Rehome a pet",
      href: "/rehome-pet",
    },
    {
      title: "About Us",
      href: "/about-us",
    },
    {
      title: "Blog",
      href: "/blog",
    },
  ]
  return (
    <div className="border-b px-4 bg-primary">
      <div className="flex items-center justify-between mx-auto max-w-4xl h-16">
        <div>
          <Link href="/">
            <Logo color='white' />
          </Link>
        </div>
        <div className='flex items-center justify-between text-white gap-5 '>
          <ul className='flex space-x-6'>
            {links.map(link => 
            <Link key= {link.href} href={link.href}
            className = {classNames({
              'text-white': true,
              'hover:underline':true,
              'underline': link.href === currentPath,
            })}
            >{link.title}</Link>
            )}
          </ul>
          {
            (session?.data) ?
              (
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <div>
                      <h1>
                        My Account
                      </h1>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => {
                      redirect("/customer-profile");
                    }}>Profile</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {
                      setIsAlertDialogOpen(true)
                    }}>Sign Out</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) :
              <Link href='/sign-in' className={buttonVariants({ variant: "secondary" })}>
                Sign In
              </Link>
          }

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
                    redirect("/sign-in");
                  }
                }}>Sign Out</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>

  )
}

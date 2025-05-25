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
import { Menu, X } from 'lucide-react';


export default function AdminNavbar() {
  const session = useSession();
  const user = session?.data?.user;
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState<boolean>();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const currentPath = usePathname();

  const links = [
    { title: 'Customer Home', href: '/' },
    { title: 'Admin Home', href: '/admin-homepage' },
    { title: 'Add Blog', href: '/add-blog' },
    { title: 'Pet Alerts', href: '/pet-alerts' },
  ];

  const handleMobileLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="border-b px-4 sm:px-8 md:px-12 lg:px-16">
      <div className="flex items-center justify-between mx-auto p-4 h-16">
        {/* Logo */}
        <div>
          <Link href={"/"}>
            <Logo color='black' />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center text-primary gap-2 md:gap-3">
          <ul className="flex space-x-6">
            {links.map(link => (
              <Link key={link.href} href={link.href} className={classNames('text-primary hover:underline', { 'underline': link.href === currentPath })}>
                {link.title}
              </Link>
            ))}
          </ul>
          <DropdownMenu>
            <DropdownMenuTrigger>
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

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-black hover:bg-gray-100 rounded-md"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="px-4 py-2 space-y-1">
            {links.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={handleMobileLinkClick}
                className={classNames(
                  'block px-3 py-2 text-base font-medium rounded-md hover:bg-gray-100',
                  { 'bg-gray-100 text-primary': link.href === currentPath },
                  { 'text-gray-700': link.href !== currentPath }
                )}
              >
                {link.title}
              </Link>
            ))}
            
            {/* Mobile User Section */}
            <div className="pt-4 pb-2 border-t border-gray-200">
              <div className="px-3 py-2">
                <p className="text-base font-medium text-gray-800 font-fruktur">{user?.name}</p>
              </div>
              <button
                onClick={() => {
                  handleMobileLinkClick();
                  redirect("/");
                }}
                className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Profile
              </button>
              <button
                onClick={() => {
                  handleMobileLinkClick();
                  setIsAlertDialogOpen(true);
                }}
                className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

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
  )
}

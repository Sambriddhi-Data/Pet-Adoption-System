import Link from 'next/link'
import React from 'react'
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Logo } from "@/components/Logoblack";
import { Button, buttonVariants } from './ui/button';


export default async function Navbar() {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    return (
        <div className="border-b px-4">
            <div className="flex items-center justify-between mx-auto max-w-4xl h-16">
                <div>
                    <Link href="/">
                        <Logo />
                    </Link>
                </div>
                <div>
                    {
            session ? (
              <form action={async () => {
                'use server'
                await auth.api.signOut({
                  headers: await headers()
                });
                redirect('/')
              }}>
                <Button type='submit'>Sign Out</Button>
              </form>
            ) :
              <Link href='/signIn' className={buttonVariants()}>
                Sign In
              </Link>
          }
                </div>
            </div>

        </div>
    )
}

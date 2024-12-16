import { AirVent } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { Logo } from "@/components/Logo";


export default function Navbar() {
    return (
        <div className="border-b px-4">
            <div className="flex items-center justify-between mx-auto max-w-4xl h-16">
                <Link href='/' className='flex items-center gap-2'>
                <Logo />
                </Link>
                <Link href='/signIn' className='text-primary hover:underline'>
                    Sign In
                </Link>
            </div>

        </div>
    )
}

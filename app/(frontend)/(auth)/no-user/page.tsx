'use client'
import { buttonVariants } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"

export default function UnableToCreateUser() {
    return (
        <Card className='m-10 p-20 space-y-4 text-center opacity-85'>
            <h1 className='text-2xl font-bold underline'> Unable to create user! </h1>
            <h2>Please Sign Up First</h2>
            <Link className={buttonVariants({
                variant: "default",
            })}
                href="/">Click here to go to homepage</Link>
        </Card>
    )
} 
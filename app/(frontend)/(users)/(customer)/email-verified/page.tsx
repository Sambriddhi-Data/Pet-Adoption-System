'use client'

import {buttonVariants } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"

export default function ShelterLandingPage() {
  return (
      <Card className='m-10 p-20 space-y-4 text-center opacity-85'>
        <h1 className='text-2xl font-bold underline'> You have successfully verified your email! </h1>
        <h2>You can now use Fur-Ever Friends to adopt or rehome pets</h2>
        <Link className={buttonVariants({
          variant: "default",
        })}
          href="/sign-in">Click here to go to sign in page</Link>
      </Card>
  )
}
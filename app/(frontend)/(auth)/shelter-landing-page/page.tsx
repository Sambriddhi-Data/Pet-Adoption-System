'use client'

import {buttonVariants } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"

export default function ShelterLandingPage() {
  return (
      <Card className='m-10 p-20 space-y-4 text-center opacity-85'>
        <h1 className='text-2xl font-bold underline'> You have successfully registered as a shelter! </h1>
        <h2>However, you can not sign in right now.<br />To maintain the security of the website, your shelter needs to be verified first. This can take from 24 to 72 hours.<br />
          Please be patient. You will get an email after your shelter has been verified.</h2>
        <Link className={buttonVariants({
          variant: "default",
        })}
          href="/">Click here to go to homepage</Link>
      </Card>
  )
}
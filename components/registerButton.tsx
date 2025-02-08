"use client"
import React from 'react'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'

const RegisterButton = () => {
    const router = useRouter();
  return (
    <Button onClick={()=>{router.push("/sign-up")}}>Register</Button>
  )
}

export default RegisterButton;
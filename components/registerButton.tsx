"use client"
import React from 'react'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'

interface RegisterButtonProps {
    route: string;
}

const RegisterButton: React.FC<RegisterButtonProps> = ({ route }) => {
    const router = useRouter();
    
    return (
        <Button onClick={() => router.push(route)}>Register</Button>
    )
}

export default RegisterButton;

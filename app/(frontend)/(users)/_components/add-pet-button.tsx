'use client'
import React from 'react'
import { Button } from '@/components/ui/button';
import { redirect } from "next/navigation";

const AddPetButton = () => {
  return (
    <Button onClick={()=> redirect('/add-pet')}>Add new pet</Button>
  )
}
export default AddPetButton
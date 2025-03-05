'use client'
import React from 'react'
import { Button } from '@/components/ui/button';
import { redirect } from "next/navigation";
import usePetRegistrationStore from './store';


const AddPetButton = () => {
  const { resetForm } = usePetRegistrationStore();
  const handleAddPet = () => {
    resetForm();
    redirect('/add-pet-details/details');
  }
  return (
    <Button onClick={handleAddPet}>Add new pet</Button>
  )
}
export default AddPetButton
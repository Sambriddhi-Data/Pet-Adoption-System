'use client'
import { Button } from '@/components/ui/button'
import React from 'react'
import { CancelProps } from './type'
import { redirect } from 'next/navigation'


const CancelFormButton:React.FC<CancelProps> = ({route = ''}) => {
  return (
    <Button onClick={()=> redirect (`${route}`)}>Cancel</Button>
  )
}

export default CancelFormButton
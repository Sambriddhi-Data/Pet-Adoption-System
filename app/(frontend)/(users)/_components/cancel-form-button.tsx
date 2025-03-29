'use client'
import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import { CancelProps } from './type'
import { redirect } from 'next/navigation'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const CancelFormButton: React.FC<CancelProps> = ({ route = '' }) => {
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsAlertDialogOpen(true)}>Cancel</Button>
      <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure you want to leave?</AlertDialogTitle>
                  <AlertDialogDescription>You will loose any updates made.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>No, stay</AlertDialogCancel>
                  <AlertDialogAction onClick={() => redirect(`${route}`)}>
                    Yes, leave
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
    </>
  )
}

export default CancelFormButton
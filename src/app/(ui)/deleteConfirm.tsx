'use client'
import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import { useToast } from '@/components/ui/use-toast'
import { Loader2 } from 'lucide-react'

interface DeleteConfirmProps {
  id: string // Assuming id is a string
}

export default function DeleteConfirm({ id }: DeleteConfirmProps) {
  const [isLoading, setisLoading] = useState(false)
  const { toast } = useToast()
  console.log(id)

  const handleDelete = async (id: string) => {
    setisLoading(true)
    try {
      console.log(`Deleting todo with ID: ${id}`) // Informative logging

      const response = await axios.delete(
        `/api/deletetodo/${id}`
      )

      if (response.status === 200) {
        toast({
          title: 'Todo deleted successfully'
        })
        setisLoading(false)
        // Additional logic to handle successful deletion, e.g., update UI
      } else {
        console.error(`Error deleting todo (status: ${response.status})`)
        // Handle specific errors based on response status (optional)
      }
    } catch (error) {
      console.error('Error deleting todo:', error)
      // Handle general network or unexpected errors
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className='w-full pl-3 mt-2 text-left font-normal'>
          {isLoading ? (
            <Loader2 className='h-4 w-4 animate-spin' />
          ) : (
            <p>Delete</p>
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your todo
            data from the server.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => handleDelete(id)}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

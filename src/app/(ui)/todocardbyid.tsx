import React from 'react'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import calculateProgress from '@/utils/dateCalculator'
import DeleteConfirm from './deleteConfirm'
import { Button } from '@/components/ui/button'
import EditForm from './editTodoForm'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer'

const formatDate = (dateStr: any) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-GB') // en-GB format is DD-MM-YYYY
}

const TodoCardbyid = ({ title, description }: any) => {
  return (
    
      <Drawer  >
        <DrawerTrigger>
            <Button variant="link" className='max-w-min h-auto mt-2'>Read More</Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Todo Details</DrawerTitle>
            
            <Card className='max-w-sm overflow-hidden  rounded-lg bg-white shadow-lg md:w-auto'>
              <CardHeader className='px-6 py-4'>
                <h2 className='mb-2 text-xl font-bold'>{title}</h2>
              </CardHeader>
              {/* <CardHeader className="px-6 py-4">
        <h2 className="font-bold text-xl mb-2">{id}</h2>
      </CardHeader> */}
              <CardContent className='text-wrap px-6 py-4 text-justify'>
                <p className='text-base text-gray-700'>{description}</p>
              </CardContent>
            </Card>
          </DrawerHeader>
          <DrawerFooter>
            <DrawerClose>
              <Button variant='outline'>Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    
  )
}

export default TodoCardbyid

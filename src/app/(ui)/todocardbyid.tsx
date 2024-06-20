import React from 'react'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import calculateProgress from '@/utils/dateCalculator'
import DeleteConfirm from './deleteConfirm'
import { Button } from '@/components/ui/button'
import EditForm from './editTodoForm'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { cn } from "@/lib/utils";

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
type BgColor = "Red" | "Orange" | "Green" | "Default";
const TodoCardbyid = ({ bgColor,id,title, description }: any) => {
  
  const getBackgroundColorClass = (bgColor:BgColor) => {
    switch (bgColor) {
      case "Red":
        return "bg-red-200";
      case "Orange":
        return "bg-orange-200";
      case "Green":
        return "bg-green-200";
      default:
        return "bg-white";
    }
  };
  console.log(bgColor)
  return (
    
      <Drawer >
        <DrawerTrigger>
            <Button variant="link" className='max-w-min h-auto mt-2'>Read More...</Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Todo Details</DrawerTitle>
            
            <Card className={cn("max-w-xl overflow-hidden rounded-lg shadow-lg md:w-auto",getBackgroundColorClass (bgColor))}>
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

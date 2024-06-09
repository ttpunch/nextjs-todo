import React from 'react'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import calculateProgress from '@/utils/dateCalculator'
import DeleteConfirm from './deleteConfirm'
import { Button } from '@/components/ui/button'
import EditForm from './editTodoForm'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import TodoCardbyid from './todocardbyid'

const formatDate = (dateStr: any) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-GB') // en-GB format is DD-MM-YYYY
}

const TodoCard = ({
  userid,
  id,
  title,
  description,
  startdate,
  enddate
}: any) => {
  console.log(userid)
  const formattedStartDate = formatDate(startdate)
  const formattedEndDate = formatDate(enddate)
  const progress = calculateProgress(startdate, enddate)

  console.log(progress)
  return (
    <Card className='max-w-sm overflow-hidden  rounded-lg bg-white shadow-lg md:w-auto '>
      <CardHeader className='px-6 py-4'>
        <h2 className='mb-2 text-xl font-bold'>{title}</h2>
      </CardHeader>
      {/* <CardHeader className="px-6 py-4">
        <h2 className="font-bold text-xl mb-2">{id}</h2>
      </CardHeader> */}
      <CardContent className='text-wrap px-6 text-justify '>
        <p className='line-clamp-2 h-12  text-base text-gray-700'>
          {description}
        </p>

        <TodoCardbyid id={id} title={title} description={description} />
      </CardContent>
      <CardFooter className='px-6'>
        <div className=' flex gap-2'>
          <div className='text-sm text-gray-600'>
            <span className='font-semibold'>Start Date: </span>
            {formattedStartDate}
          </div>
          <Separator className='h-5 border-inherit' orientation='vertical' />
          <div className='text-sm text-gray-600'>
            <span className='font-semibold'>End Date: </span>
            {formattedEndDate}
          </div>
        </div>
      </CardFooter>
      <div className='mx-4 mb-2'>
        <Progress value={progress} />
        <Dialog>
          <DialogTrigger asChild>
            <Button className='mt-4 w-full' variant='default'>
              Edit Todo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <EditForm id={id} user={userid} />
          </DialogContent>
          <DeleteConfirm id={id} />
        </Dialog>
      </div>
    </Card>
  )
}

export default TodoCard

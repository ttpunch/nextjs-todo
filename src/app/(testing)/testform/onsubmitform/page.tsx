'use client'

import React, { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useForm} from 'react-hook-form'
import { z } from 'zod'
import { todoSchema } from '@/schemas/todoSchema'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'
import { CalendarIcon } from '@radix-ui/react-icons'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
  SelectGroup
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

const TodoForm = () => {
  const { data: session, status } = useSession() // Assuming useSession is from a library
  const [isLoading, setIsLoading] = useState(false)

  // Log session and status for debugging purposes only (remove in production)
  console.log(session, status)

  const form = useForm<z.infer<typeof todoSchema>>({resolver: zodResolver(todoSchema) })
  
  const parseddata=todoSchema.parse({
    title: "Complete project report",
    todos: "Write the final section of the project report and submit it.",
    user: "664e267ff3c429cc9fca8f81", 
    startDate: new Date(),
    plannedDateOfCompletion: new Date(),
    backgroundColor: "Red",
    status: "Pending",
    importance: "Critical"
  })
 console.log(parseddata)


  const { toast } = useToast()

  type formdata = z.infer<typeof todoSchema>


  const onSubmit = async (data:formdata) => {
    todoSchema.parse(data)
    setIsLoading(true)
    console.log(session?.user?._id)

    if (!session) {
      toast({
        title: 'Error',
        description: 'You must be logged in to submit a todo.'
      })
      return
    }

    if (session !== undefined) {
      try {
        // Attempt form submission
        console.log(data)
        const todoData = {
          ...data,
          user: session?.user?._id
        }
        console.log(todoData)

        const response = await axios.post('/api/getalltodos', todoData, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        if (response.status == 201) {
          toast({
            title: response.data.message
          })
        }

        if (response.status !== 200 && response.status !== 201) {
          // Handle server-side errors
          const errorData = response.data
          throw new Error(errorData.message || 'An error occurred')
        }
        /* toast({
          title: 'You submitted the following values:',
          description: (
            <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
              <code className='text-white'>
                {JSON.stringify(todoData, null, 2)}
              </code>
            </pre>
          )
        }) */
      } catch (error) {
        console.error('Error submitting todo:', error)
        // Display error message to user
        toast({
          title: 'Error',
          description: 'An error occurred while submitting your todo.',
          className: 'bg-red-200'
        })
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex flex-col items-center justify-center space-y-6'
      >
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  className='w-[240px] pl-3 text-left font-normal'
                  placeholder='Enter Title'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='todos'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Todos</FormLabel>
              <FormControl>
                <Textarea
                  className='w-[240px] pl-3 text-left font-normal'
                  placeholder='Enter todos'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='startDate'
          render={({ field }) => (
            <FormItem className='flex flex-col'>
              <FormLabel>Start Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-[240px] pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value ? (
                        format(field.value, 'PPP')
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0' align='start'>
                  <Calendar
                    mode='single'
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={date =>
                      date > new Date() || date < new Date('1900-01-01')
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='plannedDateOfCompletion'
          render={({ field }) => (
            <FormItem className='flex flex-col'>
              <FormLabel>Planned Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-[240px] pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value ? (
                        format(field.value, 'PPP')
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0' align='start'>
                  <Calendar
                    mode='single'
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={date => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='backgroundColor'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Background Color</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className='w-[240px] pl-3 text-left font-normal'>
                    <SelectValue placeholder='Background Color' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value='Red'>Red</SelectItem>
                      <SelectItem value='Orange'>Orange</SelectItem>
                      <SelectItem value='Green'>Green</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='status'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className='w-[240px] pl-3 text-left font-normal'>
                    <SelectValue placeholder='Status' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value='Pending'>Pending</SelectItem>
                      <SelectItem value='inProgress'>In Progress</SelectItem>
                      <SelectItem value='Completed'>Completed</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='importance'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Importance</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className='w-[240px] pl-3 text-left font-normal'>
                    <SelectValue placeholder='Importance' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value='Critical'>Critical</SelectItem>
                      <SelectItem value='non-critical'>Non-critical</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className='w-[240px] pl-3 text-left font-normal' type='submit'>
          {isLoading ? (
            <Loader2 className='h-4 w-4 animate-spin' />
          ) : (
            <span>Add Todo</span>
          )}
        </Button>
      </form>
    </Form>
  )
}

export default TodoForm

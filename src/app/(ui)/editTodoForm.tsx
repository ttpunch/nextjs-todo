"use client"
import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { todoSchema } from '@/schemas/todoSchema';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from '@radix-ui/react-icons';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const EditForm = ({ id, user }:any) => {
    const { data: session } = useSession();
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
  
    const form = useForm({
        resolver: zodResolver(todoSchema),
        defaultValues: {
            status: '',
            title: '',
            todos: '',
            startDate: null,
            plannedDateOfCompletion: null,
            backgroundColor: '',
            importance: '',
        },
    });
  
    const { reset } = form;
  
    useEffect(() => {
        const fetchTodoData = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(`/api/gettodobyid/${id}`);
                if (response.status === 200) {
                  const todoData = response.data.todo;
                  // Ensure dates are converted to Date objects
                  todoData.startDate = todoData.startDate ? new Date(todoData.startDate) : null;
                  todoData.plannedDateOfCompletion = todoData.plannedDateOfCompletion ? new Date(todoData.plannedDateOfCompletion) : null;
                  reset(todoData);
                } else {
                    toast({
                        title: 'Error',
                        description: 'An error occurred while fetching the todo.',
                        className: 'bg-red-200',
                    });
                }
            } finally {
                setIsLoading(false);
            }
        };
  
        if (id) {
            fetchTodoData();
        }
    }, [id, reset, toast]);
  
    const onSubmit = async (data:any) => {
        try {
            setIsLoading(true);
            if (!session) {
                toast({
                    title: 'Error',
                    description: 'You must be logged in to submit a todo.',
                });
                return;
            }
  
            const todoData = {
                ...data,
                user: session?.user?._id,
            };
            const response = await axios.patch(`/api/edittodo/${id}`, todoData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
  
            if (response.status === 200) {
                toast({
                    title: 'Success',
                    description: 'Todo updated successfully.',
                });
            }
        } catch (error) {
            console.error('Error updating todo:', error);
            toast({
                title: 'Error',
                description: 'An error occurred while updating your todo.',
                className: 'bg-red-200',
            });
        } finally {
            setIsLoading(false);
        }
    };
  
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col items-center justify-center space-y-6">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input className="md:w-[450px] pl-3 text-left font-normal w-[250px]" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
  
                <FormField
                    control={form.control}
                    name="todos"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Todos</FormLabel>
                            <FormControl>
                                <Textarea className="md:w-[450px] pl-3 text-left font-normal w-[250px]" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                
                <div className="flex justify-between gap-2">
                    <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Start Date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={'outline'}
                                                className={cn(
                                                    'md:w-[220px] pl-3 text-left font-normal w-[120px] ',
                                                    !field.value && 'text-muted-foreground'
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, 'PPP')
                                                ) : (
                                                    <span>Start Date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value || undefined}
                                            onSelect={field.onChange}
                                            disabled={date => date < new Date('1900-01-01')}
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
                        name="plannedDateOfCompletion"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Planned Date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={'outline'}
                                                className={cn(
                                                    'md:w-[220px] pl-3 text-left font-normal w-[170px]',
                                                    !field.value && 'text-muted-foreground'
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, 'PPP')
                                                ) : (
                                                    <span>Completion Date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value || undefined}
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
                </div>
  
                <FormField
                    control={form.control}
                    name="backgroundColor"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Background Color</FormLabel>
                            <FormControl>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger className="md:w-[450px] pl-3 text-left font-normal w-[250px]">
                                        <SelectValue placeholder="Background Color" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="Red">Red</SelectItem>
                                            <SelectItem value="Orange">Orange</SelectItem>
                                            <SelectItem value="Green">Green</SelectItem>
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
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Status</FormLabel>
                            <FormControl>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger className="md:w-[450px] pl-3 text-left font-normal w-[250px]">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="Pending">Pending</SelectItem>
                                            <SelectItem value="inProgress">In Progress</SelectItem>
                                            <SelectItem value="Completed">Completed</SelectItem>
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
                    name="importance"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Importance</FormLabel>
                            <FormControl>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger className="md:w-[450px] pl-3 text-left font-normal w-[250px]">
                                        <SelectValue placeholder="Importance" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="Critical">Critical</SelectItem>
                                            <SelectItem value="non-critical">Non-critical</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
  
                <Button className="w-full pl-3 text-left font-normal" type="submit">
                    {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <span>Update Todo</span>
                    )}
                </Button>
            </form>
        </Form>
    );
};

export default EditForm;

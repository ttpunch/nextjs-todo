"use server"

import dbConnect from '@/lib/dbConnect';
import Todo from '@/model/todo';
import CompletedTask from "../model/completedTask";

import ReminderEmail from "../app/(ui)/reminderEmail";
import { Resend } from 'resend';
import { ReactElement } from 'react';

const resend = new Resend(process.env.RESEND_API_KEY);


interface EmailParams {
  email: string;
  title: string;
  plannedDateOfCompletion: Date;
}

 const sendReminderEmails = async ({ email, title, plannedDateOfCompletion }: EmailParams): Promise<any> => {
  console.log(email, title, plannedDateOfCompletion);
  
  try {
    // Send reminder email
    const { data, error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: email,
      subject: "Reminder: Todo Deadline Expired",
      react: ReminderEmail({ email, title, plannedDateOfCompletion }) as ReactElement,
    });

    if (error) {
      console.error('Error sending reminder email:', error);
      throw new Error(error.message);
    }

    return data;
  } catch (err) {
    console.error('Exception caught while sending reminder email:', err);
    throw err;
  }
}

// /lib/serverActions/getCompletedTodos.ts

const getCompletedTodos = async (userId: string) => {
  await dbConnect();
  console.log(userId)
  const completedTodos = await Todo.find({ user: userId, status: "Completed" }).lean();
  console.log(completedTodos)
  const data = JSON.parse(JSON.stringify(completedTodos))
  console.log(data)
  return data;
};


// Function to save completed tasks to CompletedTask model
const saveCompletedTasks = async (userId: string) => {
  await dbConnect();
  console.log(userId);
  const completedTodos = await Todo.find({ user: userId, status: "Completed" }).lean();
  console.log(completedTodos);

  const data = JSON.parse(JSON.stringify(completedTodos));
  
  // Prepare data to be saved in CompletedTask model
  const completedTaskData = data.map((todo: any) => ({
    title: todo.title,
    todos: todo.todos,
    user: todo.user,
    startDate: todo.startDate,
    plannedDateOfCompletion: todo.plannedDateOfCompletion,
    backgroundColor: todo.backgroundColor,
    status: "Completed" as const,
    importance: todo.importance,
  }));

  // Save each completed task to CompletedTask model
  for (const task of completedTaskData) {
    const existingTask = await CompletedTask.findOne({ 
      title: task.title,
      user: task.user,
      startDate: task.startDate,
      plannedDateOfCompletion: task.plannedDateOfCompletion
    });

    if (!existingTask) {
      const completedTask = new CompletedTask(task);
      await completedTask.save();
    }
  }

  console.log("New completed tasks saved successfully.");
  return completedTaskData;
};

const getAllSavedTasks = async (userId: string) => {
  await dbConnect();
  const response = await CompletedTask.find({ user: userId }).lean();
  const data = JSON.parse(JSON.stringify(response))
  console.log(data)
  return data;
}
export { sendReminderEmails, getCompletedTodos, saveCompletedTasks,getAllSavedTasks};
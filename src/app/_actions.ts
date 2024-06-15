"use server"

import { NextResponse,NextRequest } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Todo from '@/model/todo';

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

export default getCompletedTodos;

export {sendReminderEmails,getCompletedTodos}
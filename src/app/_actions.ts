"use server"

import ReminderEmail from "../app/(ui)/reminderEmail";
import { Resend } from 'resend';
import { ReactElement } from 'react';

const resend = new Resend(process.env.RESEND_API_KEY);


interface EmailParams {
  email: string;
  title: string;
  plannedDateOfCompletion: Date;
}

export const sendReminderEmails = async ({ email, title, plannedDateOfCompletion }: EmailParams): Promise<any> => {
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

import ReminderEmail from '../../(ui)/reminderEmail';
import { Resend } from 'resend';
import dbConnect from '@/lib/dbConnect';
import Todo from '@/model/todo'; // Adjust the path according to your project structure

const resend = new Resend(process.env.RESEND_API_KEY);

/* async function sendReminderEmails(userId: any) {
  console.log(userId);
  // Connect to the database
  await dbConnect();

  try {
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    // Query to find todos with a planned end date expired one day before for the given userId
    const todos = await Todo.find({
      user: userId, // Filter todos by the provided userId
      plannedDateOfCompletion: {
        $lte: oneDayAgo,
      },
    });

    console.log(todos); // Log the todos for debugging

    // Iterate over each todo and send an email
    for (const todo of todos) {
      console.log(todo); // Log each todo item for debugging
      const { email, plannedEndDate, title } = todo;

      // Send reminder email
      const { data, error } = await resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: "vinod418@gmail.com",
        subject: "Reminder: Todo Deadline Expired",
        react: ReminderEmail({ email, title, plannedEndDate }) as React.ReactElement,
      });

      if (error) {
        console.error('Error sending reminder email:', error);
      }
    }

    return { success: true, message: "Reminder emails sent successfully" };
  } catch (error) {
    console.error('Error sending reminder emails:', error);
    return { success: false, error };
  }
}
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId } = body;
    
    console.log(userId)
   
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    
    const todos = await Todo.find({
      user: userId, // Filter todos by the provided userId
      plannedDateOfCompletion: {
        $lte: oneDayAgo,
      },
    });
    if (userId) {
      return Response.json({ success: true, todos }, { status: 200 });
    }
  }
  catch (error) {
    console.error('Error registering todo:', error);
    // Return an error response
    return Response.json(
      {
        success: false,
        message: 'Error registering todo',
      },
      { status: 500 }
    );
  }
}

//const result = await sendReminderEmails(userId);

/*    if (result.success) {
     return new Response(
       JSON.stringify({
         success: true,
         message: 'Reminder emails sent successfully.',
       }),
       { status: 201, headers: { 'Content-Type': 'application/json' } }
     );
   } else {
     return new Response(
       JSON.stringify({
         success: false,
         message: 'Failed to send reminder emails.',
       }),
       { status: 500, headers: { 'Content-Type': 'application/json' } }
     );
   }
 } catch (error) {
   console.error('Error parsing request body:', error);
   return new Response(
     JSON.stringify({
       success: false,
       message: 'Invalid request body',
     }),
     { status: 400, headers: { 'Content-Type': 'application/json' } }
   );
 } */


import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Todo from '@/model/todo';


export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const body=await request.json()
  console.log(body)
  try {
    await dbConnect();

    const { id } = params;
    console.log(id)

    if (!id) {
      return NextResponse.json({ message: 'Missing todo ID in request parameters' }, { status: 400 });
    }

   
    // Validate data (optional, based on your needs)
    const { title,user, todos, startDate, plannedDateOfCompletion, backgroundColor, status, importance } = body;
    if (!title || !todos || !startDate || !plannedDateOfCompletion || !backgroundColor || !status || !importance) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      {
        title,
        todos,
        user,
        startDate,
        plannedDateOfCompletion,
        backgroundColor,
        status,
        importance,
      },
      { new: true }
    );

    if (updatedTodo) {
      return NextResponse.json({ success: true, message: 'Todo updated successfully.', todo: updatedTodo }, { status: 200 });
    } else {
      return NextResponse.json({ success: false, message: 'Todo not found.' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error updating todo:', error);
    return NextResponse.json({ success: false, message: 'Error updating todo' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Todo from '@/model/todo';

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();

    const { id } = params;

    console.log(id);

    // Validate user ID (optional, adjust based on your needs)
    if (!id) {
      return NextResponse.json({ message: 'Missing todo ID in request parameters' }, { status: 400 });
    }

    // Find and delete the todo by ID
    const deletedTodo = await Todo.findByIdAndDelete(id);

    if (deletedTodo) {
      return NextResponse.json({ success: true, message: 'Todo deleted successfully.' }, { status: 200 });
    } else {
      return NextResponse.json({ success: false, message: 'Todo not found.' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error deleting todo:', error);
    // Return an error response
    return NextResponse.json({ success: false, message: 'Error deleting todo' }, { status: 500 });
  }
}

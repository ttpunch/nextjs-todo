import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Todo from '@/model/todo';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();

    const { id } = params;
    console.log(id);

    if (!id) {
      return NextResponse.json({ message: 'Missing todo ID in request parameters' }, { status: 400 });
    }

    const todo = await Todo.findById(id); // Corrected line

    if (todo) {
      return NextResponse.json({ success: true, message: 'Todo found.', todo }, { status: 200 });
    } else {
      return NextResponse.json({ success: false, message: 'Todo not found.' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching todo:', error);
    return NextResponse.json({ success: false, message: 'Error fetching todo' }, { status: 500 });
  }
}

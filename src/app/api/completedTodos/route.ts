import { NextResponse,NextRequest } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Todo from '@/model/todo';

export async function POST(request: NextRequest) {

     try {
      await dbConnect();

      const { userId } = await request.json(); // Assuming request body contains userId

      if (!userId) {
        return NextResponse.json({ message: 'Missing user ID in request body' }, { status: 400 });
      }

      // Find completed todos for the user
      const completedTodos = await Todo.find({ user:userId, status: "Completed" }); // Filter by userId and completed status

      return NextResponse.json(completedTodos, { status: 200 });
    } catch (error) {
      console.error('Error fetching completed todos:', error);
      return NextResponse.json({ message: 'Error fetching todos' }, { status: 500 });
    }
} 
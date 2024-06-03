import dbConnect from '@/lib/dbConnect';
import Todo from '@/model/todo';

export async function POST(request: Request) {
  try {
    await dbConnect();

    // Parse the request body as JSON (assuming user ID is in the body)
    const { userId } = await request.json();

    // Validate user ID (optional, adjust based on your needs)
    if (!userId) {
      return Response.json({ message: 'Missing user ID in request body' }, { status: 400 });
    }

    // Fetch todos for the specified user
    const todos = await Todo.find({ user: userId });

    // Return the fetched todos
    return Response.json({ success: true, todos }, { status: 200 });
  } catch (error) {
    console.error('Error fetching todos:', error);
    // Return an error response
    return Response.json({ success: false, message: 'Error fetching todos' }, { status: 500 });
  }
}

import dbConnect from '@/lib/dbConnect';
import Todo from '@/model/todo';

export async function POST(request: Request) {
    await dbConnect();

    try {
        // Parse the request body as JSON
        const requestBody = await request.json();
        console.log(requestBody)

        // Check if all required fields are present
        const { title, todos, user, startDate, plannedDateOfCompletion, backgroundColor, status, importance } = requestBody;
        if (!title || !todos || !user || !startDate || !plannedDateOfCompletion || !backgroundColor || !status || !importance) {
            return Response.json(
                {
                    success: false,
                    message: 'Missing required fields',
                },
                { status: 400 }
            );
        }

        // Create a new Todo document
        const newTodo = new Todo({
            title,
            todos,
            user,
            startDate,
            plannedDateOfCompletion,
            backgroundColor,
            status,
            importance,
        });

        // Save the new Todo document to the database
        await newTodo.save();

        // Return a successful response
        return Response.json(
            {
                success: true,
                message: 'Todo added successfully.',
            },
            { status: 201 }
        );
    } catch (error) {
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

import { z } from 'zod';
import { isValidObjectId } from 'mongoose'

export const todoSchema = z.object({
  title:z.string().min(2),
  todos: z.string().min(10),
  user: z.string().optional(),
    // Other validations for username, email, etc. (if needed)
  // Assuming UserModal is a class or constructor function
  startDate: z.date(),
  plannedDateOfCompletion: z.date(),
  backgroundColor: z.enum(['Red', 'Orange', 'Green']),
  status: z.enum(['Pending', 'inProgress', 'Completed']),
  importance: z.enum(['Critical', 'non-critical']),
});


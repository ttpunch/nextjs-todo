import mongoose, { Document, Schema, model, models } from "mongoose";
import UserModal from './user';  // Ensure the path to the user model is correct

// Defining todo interface
export interface ITodo extends Document {
  title: string;
  todos: string;
  user: mongoose.Types.ObjectId; // assuming user is referenced by their ID
  startDate: Date;
  plannedDateOfCompletion: Date;
  backgroundColor: 'Red' | 'Orange' | 'Green';
  status: 'Pending' | 'inProgress' | 'Completed';
  importance: 'Critical' | 'non-critical';
}

// todoSchema
const todoSchema = new Schema<ITodo>({
  title: {
    type: String,
    required: true,
  },
  todos: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: UserModal, // Reference the 'User' model
    required: true,
   
  },
  startDate: {
    type: Date,
    default: Date.now,
    required: true,
  },
  plannedDateOfCompletion: {
    type: Date,
    required: true,
  },
  backgroundColor: {
    type: String,
    enum: ['Red', 'Orange', 'Green'],
    default: 'Red',
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'inProgress', 'Completed'],
    default: 'Pending',
    required: true,
  },
  importance: {
    type: String,
    enum: ['Critical', 'non-critical'],
    default: 'non-critical',
    required: true,
  },
});

export default models.Todo || model<ITodo>('Todo', todoSchema);

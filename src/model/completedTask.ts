import mongoose, { Document, Schema, model, models } from "mongoose";
import UserModel from './user';  // Ensure the path to the user model is correct

// Defining the interface for CompletedTask
export interface ICompletedTask extends Document {
  title: string;
  todos: string;
  user: mongoose.Types.ObjectId;
  startDate: Date;
  plannedDateOfCompletion: Date;
  backgroundColor: 'Red' | 'Orange' | 'Green';
  status: 'Completed';
  importance: 'Critical' | 'non-critical';
}

// completedTaskSchema
const completedTaskSchema = new Schema<ICompletedTask>({
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
    ref: UserModel, // Reference the 'User' model
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
    enum: ['Completed'],
    required: true,
  },
  importance: {
    type: String,
    enum: ['Critical', 'non-critical'],
    default: 'non-critical',
    required: true,
  },
});

// Export the CompletedTask model
export default models.CompletedTask || model<ICompletedTask>('CompletedTask', completedTaskSchema);

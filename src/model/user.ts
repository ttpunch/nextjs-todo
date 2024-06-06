import { Document, Schema, model, models } from "mongoose";

// Defining user interface
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  otp:string,
  otpExpiry:Date
}

// User schema
const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: [true, 'Username is required'],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    match: [/.+\@.+\..+/, 'Please use a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  otp: {
    type: String,
    required: false,
  },
  otpExpiry: {
    type: Date,
    required: false,
  },
});

const  UserModal = models.User || model<IUser>('User', userSchema);

export default UserModal

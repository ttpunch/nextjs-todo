import { z } from 'zod';

export const passwordresetSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  otp: z
    .string()
    .min(6, { message: 'otp must be 6 characters long' }),
});
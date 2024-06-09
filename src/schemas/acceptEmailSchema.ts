import { z } from 'zod'

export const AcceptEmailReminderSchema = z.object({
  acceptEmail: z.boolean(),
});
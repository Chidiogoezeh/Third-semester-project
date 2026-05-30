import { z } from "zod";

export const createReminderSchema = z.object({
  reminderOffset: z.coerce
    .number()
    .int()
    .min(1)
    .max(8760)
});
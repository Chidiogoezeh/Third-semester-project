import { z } from "zod";

export const createEventSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  location: z.string(),
  price: z.coerce.number(),
  capacity: z.coerce.number().optional(),
  eventDate: z.string(),
  reminderWindow: z.coerce.number().optional()
});
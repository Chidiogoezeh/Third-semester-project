import { z } from "zod";

export const createEventSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  location: z.string(),
  price: z.coerce.number(),
  capacity: z.coerce.number().int().positive().optional(),
  eventDate: z.string().datetime(),
  reminderWindow: z.coerce.number().optional()
});

export const updateEventSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().min(10).optional(),
  location: z.string().optional(),
  price: z.coerce.number().min(0).optional(),
  capacity: z.coerce.number().int().positive().optional(),
  eventDate: z.string().datetime().optional(),
  reminderWindow: z.coerce.number().optional()
});

export type CreateEventDto =
  z.infer<typeof createEventSchema>;

export type UpdateEventDto =
  z.infer<typeof updateEventSchema>;
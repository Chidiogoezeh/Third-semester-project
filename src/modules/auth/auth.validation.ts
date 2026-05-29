import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["CREATOR", "EVENTEE"])
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});
import { z } from "zod";

export const updateUserSchema =
  z.object({
    email: z
      .string()
      .email()
      .transform((value) =>
        value.toLowerCase()
      )
      .optional()
  });
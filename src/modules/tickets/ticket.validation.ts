import { z } from "zod";

export const verifyTicketSchema = z.object({
  ticketToken: z.string().uuid()
});
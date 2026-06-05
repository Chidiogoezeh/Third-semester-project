import { Role } from "@prisma/client";

export type AuthUser = {
  userId: string;
  role: Role;
};
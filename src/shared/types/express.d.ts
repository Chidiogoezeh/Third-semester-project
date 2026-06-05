import "express-serve-static-core";
import { Role } from "@prisma/client";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      userId: string;
      role: Role;
    };
  }
}

export {};
import "express-serve-static-core";
import { Role } from "@prisma/client";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      userId: AuthUser;
      role: Role;
    };
  }
}

export {};
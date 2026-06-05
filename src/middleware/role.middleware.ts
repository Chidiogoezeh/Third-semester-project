import { NextFunction, Request, Response } from "express";
import { Role } from "@prisma/client";
import { AppError } from "../shared/errors/appError";

export function roleMiddleware(...roles: Role[]) {
  return (
    req: Request,
    _res: Response,
    next: NextFunction
  ) => {
    if (!req.user) {
      throw AppError.forbidden("Access denied");
    }

    if (!roles.includes(req.user.role)) {
      throw AppError.forbidden("Access denied");
    }

    next();
  };
}
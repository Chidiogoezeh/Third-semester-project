import { NextFunction, Request, Response } from "express";
import { ForbiddenError } from "../shared/errors/forbidden";

export function roleMiddleware(...roles: string[]) {
  return (
    req: Request,
    _res: Response,
    next: NextFunction
  ) => {
    if (!req.user) {
      throw new ForbiddenError();
    }

    if (!roles.includes(req.user.role)) {
      throw new ForbiddenError();
    }

    next();
  };
}
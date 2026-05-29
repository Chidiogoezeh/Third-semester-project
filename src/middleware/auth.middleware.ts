import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../shared/utils/jwt";
import { UnauthorizedError } from "../shared/errors/unauthorized";

export function authMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    throw new UnauthorizedError("Missing token");
  }

  const token = authHeader.split(" ")[1];

  const decoded = verifyToken(token);

  req.user = decoded;

  next();
}
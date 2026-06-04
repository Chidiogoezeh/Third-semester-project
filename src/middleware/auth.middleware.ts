import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../shared/utils/jwt";
import { AppError } from "../shared/errors/appError";
import { prisma } from "../config/database";

export async function authMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      throw AppError.unauthorized("Missing token");
    }

    const token = authHeader.split(" ")[1];

    const decoded = verifyToken(token);

    // Verify user still exists
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId,
      },
    });

    if (!user) {
      throw AppError.unauthorized("Invalid user");
    }

    req.user = decoded;

    next();
  } catch (error) {
    next(error);
  }
}
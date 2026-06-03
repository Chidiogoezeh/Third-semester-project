import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../shared/utils/jwt";
import { UnauthorizedError } from "../shared/errors/unauthorized";
import { prisma } from "../config/database";

export async function authMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      throw new UnauthorizedError("Missing token");
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
      throw new UnauthorizedError("User not found");
    }

    req.user = decoded;

    next();
  } catch (error) {
    next(error);
  }
}
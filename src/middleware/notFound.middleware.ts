import { Request, Response } from "express";

export function notFoundMiddleware(
  _req: Request,
  res: Response
) {
  return res.status(404).json({
    success: false,
    message: "Route not found"
  });
}
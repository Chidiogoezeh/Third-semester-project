import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";

type ValidationTarget =
  | "body"
  | "params"
  | "query";

export function validate(
  schema: ZodSchema,
  target: ValidationTarget = "body"
) {
  return (
    req: Request,
    _res: Response,
    next: NextFunction
  ) => {
    schema.parse(req[target]);

    next();
  };
}
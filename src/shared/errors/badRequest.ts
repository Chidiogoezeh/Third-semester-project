import { AppError } from "./appError";

export class BadRequestError extends AppError {
  constructor(message = "Bad request") {
    super(message, 400);
  }
}
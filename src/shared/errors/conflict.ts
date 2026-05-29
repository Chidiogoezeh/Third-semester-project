import { AppError } from "./appError";

export class ConflictError extends AppError {
  constructor(message = "Conflict") {
    super(message, 409);
  }
}
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode = 500
  ) {
    super(message);

    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string) {
    return new AppError(message, 400);
  }

  static unauthorized(message: string) {
    return new AppError(message, 401);
  }

  static forbidden(message: string) {
    return new AppError(message, 403);
  }

  static notFound(message: string) {
    return new AppError(message, 404);
  }

  static conflict(message: string) {
    return new AppError(message, 409);
  }
}
import { Request, Response } from "express";

import { AuthService } from "./auth.service";

import { successResponse } from "../../shared/utils/response";

const service = new AuthService();

export class AuthController {
  register = async (
    req: Request,
    res: Response
  ) => {
    const result = await service.register(req.body);

    return successResponse(
      res,
      "Registration successful",
      result,
      201
    );
  };

  login = async (
    req: Request,
    res: Response
  ) => {
    const result = await service.login(req.body);

    return successResponse(
      res,
      "Login successful",
      result
    );
  };
}
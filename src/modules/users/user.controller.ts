import { Request, Response } from "express";

import { UserService } from "./user.service";

import { successResponse } from "../../shared/utils/response";

const service = new UserService();

export class UserController {
  profile = async (
    req: Request,
    res: Response
  ) => {
    const result =
      await service.getProfile(
        req.user!.userId
      );

    return successResponse(
      res,
      "Profile fetched",
      result
    );
  };

  update = async (
    req: Request,
    res: Response
  ) => {
    const result =
      await service.updateProfile(
        req.user!.userId,
        req.body
      );

    return successResponse(
      res,
      "Profile updated",
      result
    );
  };
}
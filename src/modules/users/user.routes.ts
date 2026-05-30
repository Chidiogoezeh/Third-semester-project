import { Router } from "express";

import { UserController } from "./user.controller";

import { authMiddleware } from "../../middleware/auth.middleware";

import { validate } from "../../middleware/validate.middleware";

import { updateUserSchema } from "./user.validation";

import { asyncHandler } from "../../shared/utils/asyncHandler";

const router = Router();

const controller =
  new UserController();

router.get(
  "/me",
  authMiddleware,
  asyncHandler(controller.profile)
);

router.patch(
  "/me",
  authMiddleware,
  validate(updateUserSchema),
  asyncHandler(controller.update)
);

export default router;
import { Router } from "express";

import { UserController } from "./user.controller";

import { authMiddleware } from "../../middleware/auth.middleware";

import { validate } from "../../middleware/validate.middleware";

import { updateUserSchema } from "./user.validation";

const router = Router();

const controller =
  new UserController();

router.get(
  "/me",
  authMiddleware,
  controller.profile
);

router.patch(
  "/me",
  authMiddleware,
  validate(updateUserSchema),
  controller.update
);

export default router;
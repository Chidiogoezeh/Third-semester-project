import { Router } from "express";

import { AuthController } from "./auth.controller";

import { validate } from "../../middleware/validate.middleware";

import {
  loginSchema,
  registerSchema
} from "./auth.validation";

import { asyncHandler } from "../../shared/utils/asyncHandler";

const router = Router();

const controller = new AuthController();

router.post(
  "/register",
  validate(registerSchema),
  asyncHandler(controller.register)
);

router.post(
  "/login",
  validate(loginSchema),
  asyncHandler(controller.login)
);

export default router;
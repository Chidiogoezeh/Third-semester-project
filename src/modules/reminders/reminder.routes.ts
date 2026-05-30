import { Router } from "express";

import { ReminderController } from "./reminder.controller";

import { authMiddleware } from "../../middleware/auth.middleware";

import { validate } from "../../middleware/validate.middleware";

import { createReminderSchema } from "./reminder.validation";

import { asyncHandler } from "../../shared/utils/asyncHandler";

const router = Router();

const controller =
  new ReminderController();

router.post(
  "/:id",
  authMiddleware,
  validate(createReminderSchema),
  asyncHandler(controller.create)
);

export default router;
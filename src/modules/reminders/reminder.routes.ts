import { Router } from "express";

import { ReminderController } from "./reminder.controller";

import { authMiddleware } from "../../middleware/auth.middleware";

import { asyncHandler } from "../../shared/utils/asyncHandler";

const router = Router();

const controller =
  new ReminderController();

router.post(
  "/:id",
  authMiddleware,
  asyncHandler(controller.create)
);

export default router;
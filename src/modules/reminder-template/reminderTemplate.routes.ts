import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { roleMiddleware } from "../../middleware/role.middleware";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { ReminderTemplateController } from "./reminderTemplate.controller";

const router = Router();

const controller =
  new ReminderTemplateController();

router.post(
  "/events/:id/reminder-templates",
  authMiddleware,
  roleMiddleware("CREATOR"),
  asyncHandler(controller.create)
);

router.get(
  "/events/:id/reminder-templates",
  authMiddleware,
  roleMiddleware("CREATOR"),
  asyncHandler(controller.list)
);

router.delete(
  "/events/:id/reminder-templates/:templateId",
  authMiddleware,
  roleMiddleware("CREATOR"),
  asyncHandler(controller.delete)
);

export default router;
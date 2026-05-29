import { Router } from "express";

import { AnalyticsController } from "./analytics.controller";

import { authMiddleware } from "../../middleware/auth.middleware";

import { roleMiddleware } from "../../middleware/role.middleware";

import { asyncHandler } from "../../shared/utils/asyncHandler";

const router = Router();

const controller =
  new AnalyticsController();

router.get(
  "/dashboard",
  authMiddleware,
  roleMiddleware("CREATOR"),
  asyncHandler(controller.dashboard)
);

export default router;
import { Router } from "express";

import { TicketController } from "./ticket.controller";

import { authMiddleware } from "../../middleware/auth.middleware";

import { roleMiddleware } from "../../middleware/role.middleware";

import { validate } from "../../middleware/validate.middleware";

import { asyncHandler } from "../../shared/utils/asyncHandler";

import { verifyTicketSchema } from "./ticket.validation";

const router = Router();

const controller = new TicketController();

router.post(
  "/verify",
  authMiddleware,
  roleMiddleware("CREATOR"),
  validate(verifyTicketSchema),
  asyncHandler(controller.verify)
);

export default router;
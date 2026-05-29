import { Router } from "express";

import { TicketController } from "./ticket.controller";

import { authMiddleware } from "../../middleware/auth.middleware";

import { roleMiddleware } from "../../middleware/role.middleware";

const router = Router();

const controller = new TicketController();

router.post(
  "/verify",
  authMiddleware,
  roleMiddleware("CREATOR"),
  controller.verify
);

export default router;
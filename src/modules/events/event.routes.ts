import { Router } from "express";

import { EventController } from "./event.controller";

import { authMiddleware } from "../../middleware/auth.middleware";

import { roleMiddleware } from "../../middleware/role.middleware";

import { validate } from "../../middleware/validate.middleware";

import { createEventSchema } from "./event.validation";

import { TicketController } from "../tickets/ticket.controller";

import { ReminderController } from "../reminders/reminder.controller";

import { asyncHandler } from "../../shared/utils/asyncHandler";

const router = Router();

const controller = new EventController();

const ticketController = new TicketController();

const reminderController =
  new ReminderController();

router.get(
  "/",
  asyncHandler(controller.getAll)
);

router.get(
  "/creator/me",
  authMiddleware,
  roleMiddleware("CREATOR"),
  asyncHandler(controller.creatorEvents)
);

router.get(
  "/:slug",
  asyncHandler(controller.getOne)
);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("CREATOR"),
  validate(createEventSchema),
  asyncHandler(controller.create)
);

router.post(
  "/:id/book",
  authMiddleware,
  roleMiddleware("EVENTEE"),
  asyncHandler(ticketController.book)
);

router.post(
  "/:id/reminders",
  authMiddleware,
  roleMiddleware("EVENTEE"),
  asyncHandler(reminderController.create)
);

export default router;
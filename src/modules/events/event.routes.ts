import { Router } from "express";

import { EventController } from "./event.controller";

import { authMiddleware } from "../../middleware/auth.middleware";

import { roleMiddleware } from "../../middleware/role.middleware";

import { validate } from "../../middleware/validate.middleware";

import { createEventSchema } from "./event.validation";

import { TicketController } from "../tickets/ticket.controller";

const router = Router();

const controller = new EventController();

const ticketController = new TicketController();

router.get("/", controller.getAll);


router.get(
  "/creator/me",
  authMiddleware,
  roleMiddleware("CREATOR"),
  controller.creatorEvents
);

router.get("/:slug", controller.getOne);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("CREATOR"),
  validate(createEventSchema),
  controller.create
);

router.post(
  "/:id/book",
  authMiddleware,
  roleMiddleware("EVENTEE"),
  ticketController.book
);

export default router;
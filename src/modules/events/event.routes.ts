import { Router } from "express";
import { EventController } from "./event.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { roleMiddleware } from "../../middleware/role.middleware";
import { validate } from "../../middleware/validate.middleware";
import { createEventSchema, updateEventSchema, idParamSchema } from "./event.validation";
import { ReminderController } from "../reminders/reminder.controller";
import { PaymentController } from "../payments/payment.controller";
import { asyncHandler } from "../../shared/utils/asyncHandler";

const router = Router();

const controller = new EventController();

const reminderController =
  new ReminderController();

const paymentController =
  new PaymentController();

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
  "/:id/attendees",
  authMiddleware,
  roleMiddleware("CREATOR"),
  validate(idParamSchema, "params"),
  asyncHandler(controller.attendees)
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
  validate(idParamSchema, "params"),
  asyncHandler(
    paymentController.initializeBooking
  )
);

router.post(
  "/:id/reminders",
  authMiddleware,
  roleMiddleware(
    "EVENTEE",
    "CREATOR"
  ),
  validate(idParamSchema, "params"),
  asyncHandler(reminderController.create)
);

router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware("CREATOR"),
  validate(idParamSchema, "params"),
  validate(updateEventSchema),
  asyncHandler(controller.update)
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("CREATOR"),
  validate(idParamSchema, "params"),
  asyncHandler(controller.delete)
);

export default router;
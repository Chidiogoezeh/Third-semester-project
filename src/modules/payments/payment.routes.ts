import express, { Router } from "express";
import { PaymentController } from "./payment.controller";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { authMiddleware } from "../../middleware/auth.middleware";
import { roleMiddleware } from "../../middleware/role.middleware";

const router = Router();

const controller =
  new PaymentController();

router.post(
  "/checkout/:id",
  authMiddleware,
  asyncHandler(
    controller.initializeBooking
  )
);

router.get(
  "/creator",
  authMiddleware,
  roleMiddleware("CREATOR"),
  asyncHandler(
    controller.creatorPayments
  )
);

router.post(
  "/webhook",
  express.raw({
    type: "application/json"
  }),
  asyncHandler(
    controller.webhook
  )
);
export default router;
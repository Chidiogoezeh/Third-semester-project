import express, { Router } from "express";

import { PaymentController } from "./payment.controller";

import { asyncHandler } from "../../shared/utils/asyncHandler";

import { authMiddleware } from "../../middleware/auth.middleware";

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

router.post(
  "/webhook",
  express.raw({
    type: "application/json"
  }),
  asyncHandler(
    controller.webhook
  )
);

router.get(
  "/verify/:reference",
  asyncHandler(
    controller.verify
  )
);

export default router;
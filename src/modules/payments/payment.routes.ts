import { Router } from "express";

import { PaymentController } from "./payment.controller";

import { asyncHandler } from "../../shared/utils/asyncHandler";

const router = Router();

const controller =
  new PaymentController();

router.post(
  "/initialize",
  asyncHandler(controller.initialize)
);

router.post(
  "/webhook",
  asyncHandler(controller.webhook)
);

export default router;
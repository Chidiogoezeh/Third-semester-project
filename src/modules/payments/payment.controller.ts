import { Request, Response } from "express";

import { PaymentService } from "./payment.service";

import { successResponse } from "../../shared/utils/response";

import { ReconciliationService } from "./reconciliation.service";

const service = new PaymentService();

const reconciliationService =
  new ReconciliationService();

export class PaymentController {
  initializeBooking = async (
    req: Request<{ id: string }>,
    res: Response
  ) => {
    const result =
      await service.createBookingSession(
        req.params.id,
        req.user!.userId
      );

    return successResponse(
      res,
      "Checkout initialized",
      result
    );
  };

  webhook = async (
    req: Request,
    res: Response
  ) => {
    const payload = Buffer.isBuffer(
      req.body
    )
      ? req.body.toString("utf8")
      : JSON.stringify(req.body);

    const result =
      await service.verifyWebhook(
        payload,
        req.headers[
          "x-paystack-signature"
        ] as string
      );

    return successResponse(
      res,
      "Webhook verified",
      result
    );
  };

  verify = async (
    req: Request<{ reference: string }>,
    res: Response
  ) => {
    const result =
      await service.verifyPayment(
        req.params.reference
      );

    return successResponse(
      res,
      "Payment verified",
      result
    );
  };
  reconcile = async (
    req: Request<{ reference: string }>,
    res: Response
  ) => {
    const result =
      await reconciliationService.reconcilePayment(
        req.params.reference
      );

    return successResponse(
      res,
      "Payment reconciled",
      result
    );
  };
}
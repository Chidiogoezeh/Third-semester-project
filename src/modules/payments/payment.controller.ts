import { Request, Response } from "express";

import { PaymentService } from "./payment.service";

import { successResponse } from "../../shared/utils/response";

const service = new PaymentService();

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
}
import { Request, Response } from "express";

import { PaymentService } from "./payment.service";

import { successResponse } from "../../shared/utils/response";

const service = new PaymentService();

export class PaymentController {
  initialize = async (
    req: Request,
    res: Response
  ) => {
    const result =
      await service.initializePayment(
        req.body
      );

    return successResponse(
      res,
      "Payment initialized",
      result
    );
  };

  webhook = async (
    req: Request,
    res: Response
  ) => {
    const result =
      await service.verifyWebhook(
        req.body.toString(),
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
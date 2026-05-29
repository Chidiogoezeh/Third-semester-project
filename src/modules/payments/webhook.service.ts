import crypto from "crypto";

import { env } from "../../config/env";

export class WebhookService {
  verifySignature(
    payload: string,
    signature: string
  ) {
    return (
      crypto
        .createHmac(
          "sha512",
          env.PAYSTACK_WEBHOOK_SECRET
        )
        .update(payload)
        .digest("hex") === signature
    );
  }
}
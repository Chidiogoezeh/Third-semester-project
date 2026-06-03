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
          env.PAYSTACK_SECRET_KEY
        )
        .update(payload)
        .digest("hex") === signature
    );
  }
}
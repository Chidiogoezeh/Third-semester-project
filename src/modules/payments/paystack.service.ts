import { env } from "../../config/env";
import { AppError } from "../../shared/errors/appError";

const PAYSTACK_BASE_URL =
  "https://api.paystack.co";

export class PaystackService {
  async initializeTransaction(data: {
    email: string;
    amount: number;
    reference: string;
  }) {
    const response = await fetch(
      `${PAYSTACK_BASE_URL}/transaction/initialize`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: data.email,
          amount: data.amount * 100,
          reference: data.reference
        })
      }
    );

    const result = await response.json();

    if (!result.status) {
      throw AppError.badRequest(
        result.message ??
        "Failed to initialize transaction"
      );
    }

    return result.data;
  }
}
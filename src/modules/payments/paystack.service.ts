import { paystackConfig } from "../../config/paystack";

export class PaystackService {
  async initializeTransaction(data: {
    email: string;
    amount: number;
    reference: string;
  }) {
    const response = await fetch(
      `${paystackConfig.App_Url}/transaction/initialize`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${paystackConfig.secretKey}`,
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
      throw new Error(
        result.message ||
        "Failed to initialize transaction"
      );
    }

    return result.data;
  }

  async verifyTransaction(
    reference: string
  ) {
    const response = await fetch(
      `${paystackConfig.App_Url}/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${paystackConfig.secretKey}`
        }
      }
    );

    const result = await response.json();

    return result;
  }
}
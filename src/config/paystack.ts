import { env } from "./env";

export const paystackConfig = {
  secretKey: env.PAYSTACK_SECRET_KEY,
  webhookSecret: env.PAYSTACK_WEBHOOK_SECRET,
  baseUrl: "https://api.paystack.co"
};
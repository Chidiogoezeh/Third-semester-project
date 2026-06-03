import { env } from "./env";

export const paystackConfig = {
  secretKey: env.PAYSTACK_SECRET_KEY,
  App_Url: "https://api.paystack.co"
};
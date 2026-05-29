import dotenv from "dotenv";

dotenv.config();

function getEnv(key: string): string {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }

  return value;
}

export const env = {
  PORT: Number(process.env.PORT) || 5000,

  NODE_ENV: process.env.NODE_ENV || "development",

  DATABASE_URL: getEnv("DATABASE_URL"),

  JWT_SECRET: getEnv("JWT_SECRET"),

  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1d",

  BCRYPT_SALT_ROUNDS: Number(process.env.BCRYPT_SALT_ROUNDS) || 12,

  PAYSTACK_SECRET_KEY: getEnv("PAYSTACK_SECRET_KEY"),

  PAYSTACK_WEBHOOK_SECRET: getEnv("PAYSTACK_WEBHOOK_SECRET"),

  REDIS_URL: process.env.REDIS_URL || "",

  CLIENT_URL: process.env.CLIENT_URL || "*",

  SMTP_HOST: process.env.SMTP_HOST || "",

  SMTP_PORT: Number(
    process.env.SMTP_PORT
  ) || 587,

  SMTP_USER: process.env.SMTP_USER || "",

  SMTP_PASS: process.env.SMTP_PASS || "",

  SMTP_FROM:
    process.env.SMTP_FROM ||
    "noreply@eventful.com",
};
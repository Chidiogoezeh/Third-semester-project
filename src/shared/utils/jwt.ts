import jwt from "jsonwebtoken";
import { env } from "../../config/env";

type Payload = {
  userId: string;
  role: string;
};

export function generateToken(payload: Payload) {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN
  });
}

export function verifyToken(token: string): Payload {
  return jwt.verify(token, env.JWT_SECRET) as Payload;
}
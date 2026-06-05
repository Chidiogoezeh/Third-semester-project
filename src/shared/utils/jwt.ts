import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../../config/env";
import { Role } from "@prisma/client";

type Payload = {
  userId: string;
  role: Role;
};

export function generateToken(
  payload: Payload
) {
  return jwt.sign(
    payload,
    env.JWT_SECRET,
    {
      expiresIn:
        env.JWT_EXPIRES_IN as SignOptions["expiresIn"]
    }
  );
}

export function verifyToken(
  token: string
): Payload {
  return jwt.verify(
    token,
    env.JWT_SECRET
  ) as Payload;
}
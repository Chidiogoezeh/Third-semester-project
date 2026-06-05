import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../../config/env";
import { AuthUser } from "../types/auth.types";

export function generateToken(
  payload: AuthUser
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
): AuthUser {
  return jwt.verify(
    token,
    env.JWT_SECRET
  ) as AuthUser;
}
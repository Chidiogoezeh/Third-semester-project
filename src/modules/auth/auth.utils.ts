import bcrypt from "bcrypt";

import { env } from "../../config/env";

export async function hashPassword(
  password: string
) {
  return bcrypt.hash(
    password,
    env.BCRYPT_SALT_ROUNDS
  );
}

export async function comparePassword(
  password: string,
  hashedPassword: string
) {
  return bcrypt.compare(
    password,
    hashedPassword
  );
}
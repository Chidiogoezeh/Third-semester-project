import bcrypt from "bcrypt";

import { AuthRepository } from "./auth.repository";

import { env } from "../../config/env";

import { BadRequestError } from "../../shared/errors/badRequest";

import { generateToken } from "../../shared/utils/jwt";

const repository = new AuthRepository();

export class AuthService {
  async register(data: {
    email: string;
    password: string;
    role: "CREATOR" | "EVENTEE";
  }) {
    const existingUser =
      await repository.findByEmail(
        data.email
      );

    if (existingUser) {
      throw new BadRequestError(
        "Email already exists"
      );
    }

    const hashedPassword =
      await bcrypt.hash(
        data.password,
        env.BCRYPT_SALT_ROUNDS
      );

    const user =
      await repository.createUser({
        ...data,
        password: hashedPassword
      });

    const token = generateToken({
      userId: user.id,
      role: user.role
    });

    // REMOVE PASSWORD
    const {
      password,
      ...safeUser
    } = user;

    return {
      token,
      user: safeUser
    };
  }

  async login(data: {
    email: string;
    password: string;
  }) {
    const user =
      await repository.findByEmail(
        data.email
      );

    if (!user) {
      throw new BadRequestError(
        "Invalid credentials"
      );
    }

    const isPasswordValid =
      await bcrypt.compare(
        data.password,
        user.password
      );

    if (!isPasswordValid) {
      throw new BadRequestError(
        "Invalid credentials"
      );
    }

    const token = generateToken({
      userId: user.id,
      role: user.role
    });

    // REMOVE PASSWORD
    const {
      password,
      ...safeUser
    } = user;

    return {
      token,
      user: safeUser
    };
  }
}
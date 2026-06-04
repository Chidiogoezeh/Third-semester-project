import { hashPassword, comparePassword } from "../../shared/utils/password";
import { AppError } from "../../shared/errors/appError";
import { generateToken } from "../../shared/utils/jwt";
import { prisma } from "../../config/database";

export class AuthService {
  async register(data: {
    email: string;
    password: string;
    role: "CREATOR" | "EVENTEE";
  }) {
    const existingUser =
      await prisma.user.findUnique({
        where: {
          email: data.email
        }
      });

    if (existingUser) {
      throw AppError.badRequest(
        "Email already exists"
      );
    }

    const hashedPassword =
      await hashPassword(
        data.password
      );

    const user =
      await prisma.user.create({
        data: {
          ...data,
          password: hashedPassword
        }
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
      await prisma.user.findUnique({
        where: {
          email: data.email
        }
      });

    if (!user) {
      throw AppError.badRequest(
        "Invalid credentials"
      );
    }

    const isPasswordValid =
      await comparePassword(
        data.password,
        user.password
      );

    if (!isPasswordValid) {
      throw AppError.badRequest(
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
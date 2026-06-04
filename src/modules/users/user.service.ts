import { AppError } from "../../shared/errors/appError";
import { prisma } from "../../config/database";

export class UserService {
  async getProfile(id: string) {
    const user =
      await prisma.user.findUnique({
        where: {
          id
        }
      });

    if (!user) {
      throw AppError.notFound(
        "User not found"
      );
    }

    return user;
  }

  async updateProfile(
    id: string,
    data: any
  ) {
    const user =
      await prisma.user.findUnique({
        where: {
          id
        }
      });

    if (!user) {
      throw AppError.notFound(
        "User not found"
      );
    }

    if (
      data.email &&
      data.email !== user.email
    ) {
      const existingUser =
        await prisma.user.findUnique({
          where: {
            email: data.email
          }
        });

      if (
        existingUser &&
        existingUser.id !== id
      ) {
        throw AppError.conflict(
          "Email already in use"
        );
      }
    }

    return prisma.user.update({
      where: {
        id
      },
      data
    });
  }
}
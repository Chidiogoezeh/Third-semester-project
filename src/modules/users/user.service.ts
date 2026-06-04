import { NotFoundError } from "../../shared/errors/notFound";
import { ConflictError } from "../../shared/errors/conflict";
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
      throw new NotFoundError(
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
      throw new NotFoundError(
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
        throw new ConflictError(
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
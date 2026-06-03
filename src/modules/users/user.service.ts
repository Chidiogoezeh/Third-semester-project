import { prisma } from "../../config/database";
import { UserRepository } from "./user.repository";
import { NotFoundError } from "../../shared/errors/notFound";
import { ConflictError } from "../../shared/errors/conflict";

const repository = new UserRepository();

export class UserService {
  async getProfile(id: string) {
    const user =
      await repository.findById(id);

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
      await repository.findById(id);

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
        await repository.findByEmail(
          data.email
        );

      if (
        existingUser &&
        existingUser.id !== id
      ) {
        throw new ConflictError(
          "Email already in use"
        );
      }
    }

    return repository.updateProfile(
      id,
      data
    );
  }
}
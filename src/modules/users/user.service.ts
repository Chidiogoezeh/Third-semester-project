import { UserRepository } from "./user.repository";

import { NotFoundError } from "../../shared/errors/notFound";

const repository =
  new UserRepository();

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

  async update(
    id: string,
    data: any
  ) {
    return prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true
      }
    });
  }
}
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

    const { password, ...safeUser } =
      user;

    return safeUser;
  }

  async updateProfile(
    id: string,
    data: any
  ) {
    const updatedUser =
      await repository.update(id, data);

    const {
      password,
      ...safeUser
    } = updatedUser;

    return safeUser;
  }
}
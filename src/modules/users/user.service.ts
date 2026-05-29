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

  async updateProfile(
    id: string,
    data: any
  ) {
    return repository.update(id, data);
  }
}
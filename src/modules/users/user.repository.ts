import { prisma } from "../../config/database";

export class UserRepository {
  async findById(id: string) {
    return prisma.user.findUnique({
      where: {
        id
      }
    });
  }

  async update(
    id: string,
    data: any
  ) {
    return prisma.user.update({
      where: {
        id
      },
      data
    });
  }
}
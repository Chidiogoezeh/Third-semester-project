import { prisma } from "../../config/database";

export class AuthRepository {
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: {
        email
      }
    });
  }

  async createUser(data: {
    email: string;
    password: string;
    role: "CREATOR" | "EVENTEE";
  }) {
    return prisma.user.create({
      data
    });
  }
}
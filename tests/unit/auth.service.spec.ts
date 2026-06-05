import { AuthService } from "../../src/modules/auth/auth.service";

jest.mock(
  "../../src/config/database",
  () => ({
    prisma: {
      user: {
        findUnique: jest.fn(),
        create: jest.fn()
      }
    }
  })
);

describe("Auth Service", () => {
  const service =
    new AuthService();

  it("should exist", () => {
    expect(service).toBeDefined();
  });
});
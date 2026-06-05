import {
  generateToken,
  verifyToken
} from "../../src/shared/utils/jwt";

describe("JWT Utility", () => {
  it("should generate and verify token", () => {
    const token = generateToken({
      userId: "123",
      role: "EVENTEE"
    });

    const decoded =
      verifyToken(token);

    expect(decoded.userId).toBe(
      "123"
    );

    expect(decoded.role).toBe(
      "EVENTEE"
    );
  });
});
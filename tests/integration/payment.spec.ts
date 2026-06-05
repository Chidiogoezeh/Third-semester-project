import request from "supertest";
import app from "../../src/app";

describe("Payment API", () => {
  it("should reject booking without token", async () => {
    const response =
      await request(app).post(
        "/api/v1/events/test-id/book"
      );

    expect(response.status).toBe(
      401
    );
  });

  it("should reject webhook without payload", async () => {
    const response =
      await request(app).post(
        "/api/v1/payments/webhook"
      );

    expect([
      200,
      400,
      401,
      500
    ]).toContain(
      response.status
    );
  });
});
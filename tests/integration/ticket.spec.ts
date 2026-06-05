import request from "supertest";
import app from "../../src/app";

describe("Ticket API", () => {
  it("should reject verification without token", async () => {
    const response =
      await request(app)
        .post(
          "/api/v1/tickets/verify"
        )
        .send({
          ticketToken:
            "123"
        });

    expect(response.status).toBe(
      401
    );
  });
});
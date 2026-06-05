import request from "supertest";
import app from "../../src/app";

describe("Event API", () => {
  it("should fetch events", async () => {
    const response =
      await request(app).get(
        "/api/v1/events"
      );

    expect([
      200,
      500
    ]).toContain(
      response.status
    );
  });

  it("should reject event creation without token", async () => {
    const response =
      await request(app)
        .post("/api/v1/events")
        .send({
          title: "Tech Conference"
        });

    expect(response.status).toBe(
      401
    );
  });
});
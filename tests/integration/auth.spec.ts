import request from "supertest";
import app from "../../src/app";

describe("Auth API", () => {
  it("GET unknown auth route should return 404", async () => {
    const response =
      await request(app).get(
        "/api/v1/auth/unknown"
      );

    expect(response.status).toBe(
      404
    );
  });

  it("register validation should fail", async () => {
    const response =
      await request(app)
        .post(
          "/api/v1/auth/register"
        )
        .send({});

    expect(response.status).toBe(
      400
    );
  });
});
const request = require("supertest");

const app = require("../app");

describe("Admin API", () => {
  describe("POST /api/admin/login", () => {
    test("should reject login when credentials are missing", async () => {
      const response = await request(app)
        .post("/api/admin/login")
        .send({});

      expect(response.status).toBe(400);

      expect(response.body.success).toBe(false);
    });

    test("should reject invalid admin credentials", async () => {
      const response = await request(app)
        .post("/api/admin/login")
        .send({
          email: "invalidadmin@example.com",
          password: "WrongPassword123",
        });

      expect(response.status).toBe(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe("Protected admin routes", () => {
    test("should reject unauthenticated pending practitioners request", async () => {
      const response = await request(app).get(
        "/api/admin/practitioners/pending"
      );

      expect(response.status).toBe(401);

      expect(response.body.success).toBe(false);
    });

    test("should reject unauthenticated practitioner verification request", async () => {
      const response = await request(app)
        .patch(
          "/api/admin/practitioners/invalid-id/verify"
        )
        .send({
          status: "approved",
        });

      expect(response.status).toBe(401);

      expect(response.body.success).toBe(false);
    });
  });
});
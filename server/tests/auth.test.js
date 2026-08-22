const request = require("supertest");

const app = require("../app");

describe("Authentication API", () => {
  const testEmail =
    `testuser${Date.now()}@example.com`;

  describe("POST /api/auth/register/user", () => {
    test("should register a new user", async () => {
      const response = await request(app)
        .post("/api/auth/register/user")
        .send({
          name: "Test User",
          email: testEmail,
          password: "Password123",
        });

      expect([201, 409]).toContain(response.status);

      expect(response.body).toHaveProperty(
        "success"
      );
    });

    test("should reject registration with missing fields", async () => {
      const response = await request(app)
        .post("/api/auth/register/user")
        .send({
          email: testEmail,
        });

      expect(response.status).toBe(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe("POST /api/auth/login", () => {
    test("should reject login when credentials are missing", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({});

      expect(response.status).toBe(400);

      expect(response.body.success).toBe(false);
    });

    test("should reject invalid login credentials", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "doesnotexist@example.com",
          password: "WrongPassword123",
        });

      expect(response.status).toBe(401);

      expect(response.body.success).toBe(false);
    });
  });
});
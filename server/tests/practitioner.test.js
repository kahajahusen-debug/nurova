const request = require("supertest");

const app = require("../app");

describe("Practitioner API", () => {
  const testEmail =
    `practitioner${Date.now()}@example.com`;

  describe("POST /api/practitioners/register", () => {
    test("should register a practitioner", async () => {
      const response = await request(app)
        .post("/api/practitioners/register")
        .send({
          name: "Test Practitioner",
          email: testEmail,
          password: "Password123",
          phone: "9876543210",
          specialization: "Yoga",
          experience: 5,
          qualification: "Certified Practitioner",
          bio: "Test practitioner profile",
        });

      expect([201, 409]).toContain(response.status);

      expect(response.body).toHaveProperty(
        "success"
      );
    });

    test("should reject practitioner registration with missing fields", async () => {
      const response = await request(app)
        .post("/api/practitioners/register")
        .send({
          name: "Test Practitioner",
          email: testEmail,
        });

      expect(response.status).toBe(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe("Protected practitioner routes", () => {
    test("should reject unauthenticated profile request", async () => {
      const response = await request(app).get(
        "/api/practitioners/profile"
      );

      expect(response.status).toBe(401);

      expect(response.body.success).toBe(false);
    });

    test("should reject unauthenticated documents request", async () => {
      const response = await request(app).get(
        "/api/practitioners/documents"
      );

      expect(response.status).toBe(401);

      expect(response.body.success).toBe(false);
    });
  });
});
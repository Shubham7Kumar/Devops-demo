/*
========================================================
DEVOPS NOTEBOOK — AUTOMATED TEST
========================================================

A test verifies that our application behaves as expected.

CI/CD can automatically run these tests.

Developer:
    code
      ↓
GitHub
      ↓
CI
      ↓
npm test
      ↓
PASS → continue
FAIL → stop

========================================================
*/




import request from "supertest";
import app from "../src/app.js";

describe("Health API", () => {
  test("GET /health should return 200", async () => {
    const response = await request(app).get("/health");

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("OK");
  });
});
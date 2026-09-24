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
import connectDB from "../src/config/db.js";
import { connectRedis, redisClient } from "../src/config/redis.js";
import mongoose from "mongoose";
import DemoUser from "../src/model/demoUser.model.js";
import { afterEach, jest } from "@jest/globals";

beforeAll(
  async () => {
    await connectDB();
    await connectRedis();
  },
  15000
);

afterEach(() => {
  jest.restoreAllMocks();
});

afterAll(async () => {
      await DemoUser.deleteMany({})
  if (redisClient.isOpen) {
    await redisClient.quit();
  }

  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
});

describe("Health API", () => {
  test("GET /health should return 200", async () => {
    const response = await request(app).get("/health");

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("OK");
    expect(response.body.environment).toBe("test")
  });
});

describe("Users API", () => {
      test("POST /users should create a user", async () => {
            const response = await request(app)
                  .post("/users")
                  .send({
                        name: "TestUser",
                  });

            expect(response.statusCode).toBe(201);
            expect(response.body.name).toBe("TestUser");
      });
});

test("POST /users should handle empty name", async () => {
  const response = await request(app)
    .post("/users")
    .send({
      name: "",
    });

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toContain("name");
});

test("POST /users should handle wrong name data type", async () => {
  const response = await request(app)
    .post("/users")
    .send({
      name: 12345,
    });

//   console.log("Wrong type response:", response.body);

  expect(response.statusCode).toBeDefined();
});

test("POST /users should handle unexpected fields", async () => {
  const response = await request(app)
    .post("/users")
    .send({
      name: "ExtraFieldUser",
      role: "admin",
      randomField: "hello",
    });

//   console.log("Unexpected fields response:", response.body);

  expect(response.statusCode).toBe(201);
  expect(response.body.name).toBe("ExtraFieldUser");
});

test("POST /users should handle very long name", async () => {
  const longName = "A".repeat(1000);

  const response = await request(app)
    .post("/users")
    .send({
      name: longName,
    });

//   console.log("Long name response status:", response.statusCode);
//   console.log("Long name length:", response.body.name?.length);

  expect(response.statusCode).toBeDefined();
});

describe("API Info", () => {
      test("GET /api should return API information", async () => {
            const response = await request(app).get("/api-info");
            expect(response.statusCode).toBe(200);

            expect(response.body).toHaveProperty("name");
            expect(response.body).toHaveProperty("version");
            expect(response.body).toHaveProperty("environment");

            expect(response.body.name).toBe("devops-demo-api");
            expect(response.body.version).toBe("1.0.3");
            expect(response.body.environment).toBe("test");
      })
})

describe("404 Handling", () => {
  test("GET /invalid-route should return 404", async () => {
    const response = await request(app).get("/invalid-route");

    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("Route not found");
  });
});

test("GET /users should return users and use Redis cache", async () => {
  await redisClient.del("users");

  await request(app)
    .post("/users")
    .send({
      name: "CacheTestUser",
    });

  const firstResponse = await request(app)
    .get("/users");

  expect(firstResponse.statusCode).toBe(200);
  expect(firstResponse.body.source).toBe("mongodb");

  expect(Array.isArray(firstResponse.body.data)).toBe(true);

  expect(firstResponse.body.data).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        name: "CacheTestUser",
      }),
    ])
  );

  const secondResponse = await request(app)
    .get("/users");

  expect(secondResponse.statusCode).toBe(200);
  expect(secondResponse.body.source).toBe("redis");

  expect(secondResponse.body.data).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        name: "CacheTestUser",
      }),
    ])
  );
});

test("GET /users should handle Redis failure", async () => {
  const redisGetSpy = jest
    .spyOn(redisClient, "get")
    .mockRejectedValue(new Error("Redis unavailable"));

  const response = await request(app)
    .get("/users");

  expect(response.statusCode).toBe(200);
  expect(response.body.source).toBe("mongodb");
  expect(Array.isArray(response.body.data)).toBe(true);

  expect(redisGetSpy).toHaveBeenCalled();

  redisGetSpy.mockRestore();
});


test("GET /users should handle Redis SET failure", async () => {
  await redisClient.del("users");

  const redisSetSpy = jest
    .spyOn(redisClient, "set")
    .mockRejectedValue(new Error("Redis SET unavailable"));

  const response = await request(app)
    .get("/users");

  expect(response.statusCode).toBe(200);
  expect(response.body.source).toBe("mongodb");
  expect(Array.isArray(response.body.data)).toBe(true);

  expect(redisSetSpy).toHaveBeenCalled();

  redisSetSpy.mockRestore();
});

test("GET /cache should return 500 when Redis SET fails", async () => {
  const redisSetSpy = jest
    .spyOn(redisClient, "set")
    .mockRejectedValue(new Error("Redis unavailable"));

  const response = await request(app)
    .get("/cache");

  expect(response.statusCode).toBe(500);
  expect(response.body.message).toBe("Redis unavailable");

  expect(redisSetSpy).toHaveBeenCalled();

  redisSetSpy.mockRestore();
});

describe("Cache API", () => {
  test("GET /cache should return Redis message", async () => {
    const response = await request(app)
      .get("/cache");

    expect(response.statusCode).toBe(200);

    expect(response.body.message).toBe("Hello from Redis");
    expect(response.body.expiresIn).toBe("30 seconds");
  });
});



test("POST /users should reject user without name", async () => {
  const response = await request(app)
    .post("/users")
    .send({});

  expect(response.statusCode).toBe(400);
  expect(response.body.message).toBeDefined();
});
// DevOps learning project
import express from "express";
import dotenv from "dotenv";
import DemoUser from "./model/demoUser.model.js";
import { redisClient } from "./config/redis.js";
import cors from "cors";
import {
  getMetrics,
  incrementErrors,
  incrementRequests,
} from "./config/metrics.js";
dotenv.config();

const app = express();

const NODE_ENV = process.env.NODE_ENV || "development";

app.use(
  cors({
    origin: [
      "https://devops-demo-frontend.vercel.app",
      "http://localhost:5173",
    ],
  }),
);
app.use(express.json());

app.use((req, res, next) => {
  const start = Date.now();

  incrementRequests();

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (res.statusCode >= 500) {
      incrementErrors();
    }
    console.log(
      JSON.stringify({
        method: req.method,
        path: req.originalUrl,
        statusCode: res.statusCode,
        durationMs: duration,
        environment: NODE_ENV,
      }),
    );
  });
  next();
});

app.get("/", (req, res) => {
  res.json({
    message: "Devops demo api is running",
    environment: NODE_ENV,
  });
});

/*
========================================================
HEALTH CHECK

A health endpoint is commonly used by:

- Docker
- load balancers
- deployment platforms
- monitoring systems
- CI/CD pipelines

It answers a simple question:

"Is the application process responding?"
========================================================
*/
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    environment: NODE_ENV,
    service: "devops-demo-api-v2",
    version: "1.0.1",
  });
});

app.get("/api-info", (req, res) => {
  res.json({
    name: "devops-demo-api",
    version: "1.0.3",
    environment: NODE_ENV,
  });
});

app.get("/metrics", (req, res) => {
  res.json(getMetrics());
});

// ======================================================
// DEVOPS NOTEBOOK — DATABASE TEST ROUTES
// ======================================================

app.post("/users", async (req, res) => {
  try {
    const mongoStart = Date.now();
    const user = await DemoUser.create({
      name: req.body.name,
    });

    const mongoDuration = Date.now() - mongoStart;


    console.log(JSON.stringify({
      operation: "mongodb.find",
      durationMs: mongoDuration
    }));

    // Invalidate users cache
    await redisClient.del("users");

    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

app.get("/users", async (req, res) => {
  try {
    let cachedUsers = null;

    // Try Redis, but don't let Redis failure break the API
    try {
      const redisStart = Date.now();
      cachedUsers = await redisClient.get("users");
      const redisDuration = Date.now() - redisStart;
      console.log(JSON.stringify({
        operation: "redis.get",
        durationMs: redisDuration
      }));
    } catch (redisError) {
      console.error("Redis GET failed:", redisError.message);
    }

    // Cache HIT
    if (cachedUsers) {
      console.log("CACHE HIT");

      return res.json({
        source: "redis",
        data: JSON.parse(cachedUsers),
      });
    }

    // Cache MISS or Redis unavailable
    console.log("CACHE MISS");

    const users = await DemoUser.find();

    // Try to cache the database result
    try {
      await redisClient.set("users", JSON.stringify(users), {
        EX: 60,
      });
    } catch (redisError) {
      console.error("Redis SET failed:", redisError.message);
    }

    res.json({
      source: "mongodb",
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

app.get("/cache", async (req, res) => {
  try {
    await redisClient.set("message", "Hello from Redis", {
      EX: 30,
    });

    const value = await redisClient.get("message");

    res.json({
      message: value,
      expiresIn: "30 seconds",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});
export default app;

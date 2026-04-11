import request from "supertest";
import { describe, expect, test } from "vitest";

import { createApp } from "../server.js";
import type { Env } from "../lib/env.js";
import { createLogger } from "../lib/logger.js";

const testEnv: Env = {
  NODE_ENV: "test",
  PORT: 4000,
  LOG_LEVEL: "error",
};

describe("GET /health", () => {
  test("returns service health metadata", async () => {
    const app = createApp({
      env: testEnv,
      logger: createLogger({ service: "api-test" }, "error"),
      startedAt: Date.now() - 2_000,
    });

    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
    expect(response.body.service).toBe("animated-resume-api");
    expect(response.body.environment).toBe("test");
    expect(response.body.uptimeSeconds).toBeGreaterThanOrEqual(2);
    expect(typeof response.body.timestamp).toBe("string");
  });

  test("returns not found for unknown routes", async () => {
    const app = createApp({
      env: testEnv,
      logger: createLogger({ service: "api-test" }, "error"),
      startedAt: Date.now(),
    });

    const response = await request(app).get("/missing-route");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Not Found" });
  });
});

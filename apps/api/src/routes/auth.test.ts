import request from "supertest";
import { describe, expect, test, vi } from "vitest";

import type { Env } from "../lib/env.js";
import { createLogger } from "../lib/logger.js";
import type { AuthRepository, AuthenticatedUser } from "../lib/supabase.js";
import { createApp } from "../server.js";

const testEnv: Env = {
  NODE_ENV: "test",
  PORT: 4000,
  LOG_LEVEL: "error",
  SUPABASE_URL: "http://127.0.0.1:54321",
  SUPABASE_ANON_KEY: "test-anon-key",
  SUPABASE_SERVICE_ROLE_KEY: "test-service-role-key",
};

const authenticatedUser: AuthenticatedUser = {
  id: "2db2de39-0a98-4593-a2ef-d421cf3fb954",
  email: "user@example.com",
};

describe("auth routes", () => {
  test("rejects missing auth token", async () => {
    const authRepository: AuthRepository = {
      validateAccessToken: vi.fn(async () => null),
      bootstrapPersonalAccount: vi.fn(async () => ({ accountId: "never-used" })),
    };

    const app = createApp({
      env: testEnv,
      logger: createLogger({ service: "api-test" }, "error"),
      authRepository,
    });

    const response = await request(app).get("/auth/session");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: "Unauthorized" });
    expect(authRepository.bootstrapPersonalAccount).not.toHaveBeenCalled();
  });

  test("rejects invalid auth token", async () => {
    const authRepository: AuthRepository = {
      validateAccessToken: vi.fn(async () => null),
      bootstrapPersonalAccount: vi.fn(async () => ({ accountId: "never-used" })),
    };

    const app = createApp({
      env: testEnv,
      logger: createLogger({ service: "api-test" }, "error"),
      authRepository,
    });

    const response = await request(app)
      .get("/auth/session")
      .set("authorization", "Bearer invalid-token");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: "Unauthorized" });
    expect(authRepository.bootstrapPersonalAccount).not.toHaveBeenCalled();
  });

  test("returns session details and bootstraps personal account idempotently", async () => {
    const personalAccountsByUser = new Map<string, string>();

    const authRepository: AuthRepository = {
      validateAccessToken: vi.fn(async (token: string) => {
        if (token === "valid-token") {
          return authenticatedUser;
        }
        return null;
      }),
      bootstrapPersonalAccount: vi.fn(async (user: AuthenticatedUser) => {
        const existingAccountId = personalAccountsByUser.get(user.id);
        if (existingAccountId) {
          return { accountId: existingAccountId };
        }
        const generatedAccountId = "7fc4604d-1f58-4a31-90f4-a322f7af9ef7";
        personalAccountsByUser.set(user.id, generatedAccountId);
        return { accountId: generatedAccountId };
      }),
    };

    const app = createApp({
      env: testEnv,
      logger: createLogger({ service: "api-test" }, "error"),
      authRepository,
    });

    const firstResponse = await request(app)
      .get("/auth/session")
      .set("authorization", "Bearer valid-token");
    const secondResponse = await request(app)
      .get("/auth/session")
      .set("authorization", "Bearer valid-token");

    expect(firstResponse.status).toBe(200);
    expect(secondResponse.status).toBe(200);
    expect(firstResponse.body.user).toEqual(authenticatedUser);
    expect(secondResponse.body.user).toEqual(authenticatedUser);
    expect(firstResponse.body.account.id).toBe(secondResponse.body.account.id);
    expect(authRepository.bootstrapPersonalAccount).toHaveBeenCalledTimes(2);
  });
});

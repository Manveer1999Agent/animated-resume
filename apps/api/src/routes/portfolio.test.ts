import { createEmptyPortfolioDraft } from "@animated-resume/contracts";
import request from "supertest";
import { describe, expect, test, vi } from "vitest";

import type { Env } from "../lib/env.js";
import { createLogger } from "../lib/logger.js";
import type {
  AuthRepository,
  AuthenticatedUser,
  PortfolioDraftRepository,
  StoredDraftRecord,
} from "../lib/supabase.js";
import { createApp } from "../server.js";

const testEnv: Env = {
  NODE_ENV: "test",
  PORT: 4000,
  LOG_LEVEL: "error",
  SUPABASE_URL: "http://127.0.0.1:54321",
  SUPABASE_ANON_KEY: "test-anon-key",
  SUPABASE_SERVICE_ROLE_KEY: "test-service-role-key",
  GEMINI_API_KEY: undefined,
};

const authenticatedUser: AuthenticatedUser = {
  id: "2db2de39-0a98-4593-a2ef-d421cf3fb954",
  email: "user@example.com",
};

const accountId = "7fc4604d-1f58-4a31-90f4-a322f7af9ef7";
const portfolioId = "11111111-1111-4111-8111-111111111111";
const draftId = "22222222-2222-4222-8222-222222222222";

function createAuthRepository(): AuthRepository {
  return {
    validateAccessToken: vi.fn(async (token: string) => {
      if (token === "valid-token") {
        return authenticatedUser;
      }
      return null;
    }),
    bootstrapPersonalAccount: vi.fn(async () => ({ accountId })),
  };
}

function createDraftRepository(): PortfolioDraftRepository {
  let storedDraft: StoredDraftRecord | null = null;

  return {
    async getOrCreateDraft() {
      if (!storedDraft) {
        storedDraft = {
          id: draftId,
          portfolioId,
          draft: createEmptyPortfolioDraft(portfolioId),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }
      return structuredClone(storedDraft);
    },
    async saveDraft(_accountId, draft) {
      const current = storedDraft ?? {
        id: draftId,
        portfolioId,
        draft: createEmptyPortfolioDraft(portfolioId),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      storedDraft = {
        id: current.id,
        portfolioId,
        draft: {
          ...draft,
          portfolioId,
        },
        createdAt: current.createdAt,
        updatedAt: new Date().toISOString(),
      };

      return structuredClone(storedDraft);
    },
  };
}

describe("portfolio routes", () => {
  test("rejects unauthorized draft reads", async () => {
    const app = createApp({
      env: testEnv,
      logger: createLogger({ service: "api-test" }, "error"),
      authRepository: createAuthRepository(),
      draftRepository: createDraftRepository(),
    });

    const response = await request(app).get("/portfolio/draft");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: "Unauthorized" });
  });

  test("returns the working draft for the authenticated account", async () => {
    const app = createApp({
      env: testEnv,
      logger: createLogger({ service: "api-test" }, "error"),
      authRepository: createAuthRepository(),
      draftRepository: createDraftRepository(),
    });

    const response = await request(app)
      .get("/portfolio/draft")
      .set("authorization", "Bearer valid-token");

    expect(response.status).toBe(200);
    expect(response.body.draft.portfolioId).toBe(portfolioId);
    expect(response.body.draft.metadata.completionScore).toBe(0);
  });

  test("updates section payloads and persists verification metadata", async () => {
    const app = createApp({
      env: testEnv,
      logger: createLogger({ service: "api-test" }, "error"),
      authRepository: createAuthRepository(),
      draftRepository: createDraftRepository(),
    });

    const response = await request(app)
      .put("/portfolio/draft/sections/experience")
      .set("authorization", "Bearer valid-token")
      .send({
        data: [
          {
            id: "33333333-3333-4333-8333-333333333333",
            company: "Animated Resume",
            role: "Founding Engineer",
            location: "Remote",
            employmentType: "full-time",
            startDate: "2024-01",
            endDate: null,
            isCurrent: true,
            summary: "Owns onboarding and publishing architecture.",
            highlights: ["Built the API contracts", "Shipped onboarding flows"],
          },
        ],
        verified: true,
      });

    expect(response.status).toBe(200);
    expect(response.body.draft.experience).toHaveLength(1);
    expect(response.body.draft.metadata.sectionStates.experience.verified).toBe(true);
    expect(response.body.draft.metadata.sectionStates.experience.lastVerifiedAt).toBeTruthy();
    expect(response.body.draft.metadata.completionScore).toBeGreaterThan(0);
  });
});

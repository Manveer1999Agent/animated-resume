import {
  createDefaultSectionConfidenceMap,
  createEmptyPortfolioDraft,
  type ImportJob,
} from "@animated-resume/contracts";
import request from "supertest";
import { describe, expect, test, vi } from "vitest";

import type { Env } from "../lib/env.js";
import { createLogger } from "../lib/logger.js";
import type {
  AuthRepository,
  AuthenticatedUser,
  CreateImportJobInput,
  ImportJobRepository,
  PortfolioDraftRepository,
  StoredDraftRecord,
  UpdateImportJobInput,
} from "../lib/supabase.js";
import { createApp } from "../server.js";
import type { GeminiResumeParser } from "../services/imports/runGeminiResumeParse.js";

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

function createImportRepository(): ImportJobRepository {
  const jobs = new Map<string, ImportJob>();

  return {
    async createJob(input: CreateImportJobInput) {
      const id = crypto.randomUUID();
      const now = new Date().toISOString();
      const job: ImportJob = {
        id,
        portfolioId: input.portfolioId,
        draftId: input.draftId,
        sourceType: input.sourceType,
        status: input.status,
        confidenceSummary: input.confidenceSummary,
        sectionStates: input.sectionStates,
        sectionWarnings: input.sectionWarnings,
        errorMessage: input.errorMessage ?? null,
        createdAt: now,
        updatedAt: now,
        completedAt: input.completedAt ?? null,
      };
      jobs.set(id, job);
      return structuredClone(job);
    },
    async updateJob(jobId: string, _accountId: string, input: UpdateImportJobInput) {
      const existing = jobs.get(jobId);
      if (!existing) {
        throw new Error("Missing import job");
      }

      const updated: ImportJob = {
        ...existing,
        draftId: input.draftId ?? existing.draftId,
        status: input.status ?? existing.status,
        confidenceSummary: input.confidenceSummary ?? existing.confidenceSummary,
        sectionStates: input.sectionStates ?? existing.sectionStates,
        sectionWarnings: input.sectionWarnings ?? existing.sectionWarnings,
        errorMessage: input.errorMessage ?? existing.errorMessage,
        completedAt: input.completedAt ?? existing.completedAt,
        updatedAt: new Date().toISOString(),
      };
      jobs.set(jobId, updated);
      return structuredClone(updated);
    },
    async getJob(_accountId: string, jobId: string) {
      const job = jobs.get(jobId);
      return job ? structuredClone(job) : null;
    },
  };
}

describe("import routes", () => {
  test("imports a resume into a normalized draft and exposes job status", async () => {
    const authRepository = createAuthRepository();
    const draftRepository = createDraftRepository();
    const importRepository = createImportRepository();
    const resumeParser: GeminiResumeParser = vi.fn(async () => ({
      profile: {
        fullName: "Jane Example",
        headline: "Senior Frontend Engineer",
        summary: "Builds polished product experiences.",
        email: "jane@example.com",
      },
      experience: [],
      projects: [],
      education: [],
      skills: {
        featured: ["React", "TypeScript"],
        groups: [{ label: "Frontend", items: ["React", "TypeScript"] }],
      },
      links: [],
      sectionStates: {
        ...createDefaultSectionConfidenceMap(),
        hero: {
          score: 0.92,
          fieldConfidence: { fullName: 0.98, headline: 0.86 },
          warnings: [],
          verified: false,
          lastVerifiedAt: null,
        },
        about: {
          score: 0.81,
          fieldConfidence: { summary: 0.81 },
          warnings: [],
          verified: false,
          lastVerifiedAt: null,
        },
        contact: {
          score: 0.95,
          fieldConfidence: { email: 0.95 },
          warnings: [],
          verified: false,
          lastVerifiedAt: null,
        },
        skills: {
          score: 0.88,
          fieldConfidence: { featured: 0.88 },
          warnings: [],
          verified: false,
          lastVerifiedAt: null,
        },
      },
    }));

    const app = createApp({
      env: testEnv,
      logger: createLogger({ service: "api-test" }, "error"),
      authRepository,
      draftRepository,
      importRepository,
      resumeParser,
    });

    const importResponse = await request(app)
      .post("/imports/resume")
      .set("authorization", "Bearer valid-token")
      .send({ resumeText: "Jane Example\nSenior Frontend Engineer" });

    expect(importResponse.status).toBe(200);
    expect(importResponse.body.job.status).toBe("succeeded");
    expect(importResponse.body.draft.profile.fullName).toBe("Jane Example");
    expect(importResponse.body.draft.metadata.sourceType).toBe("resume");
    expect(importResponse.body.draft.metadata.completionScore).toBeGreaterThan(0);

    const statusResponse = await request(app)
      .get(`/imports/jobs/${importResponse.body.job.id}`)
      .set("authorization", "Bearer valid-token");

    expect(statusResponse.status).toBe(200);
    expect(statusResponse.body.job.id).toBe(importResponse.body.job.id);
  });

  test("rejects invalid resume import payloads", async () => {
    const resumeParser: GeminiResumeParser = vi.fn(async () => {
      throw new Error("should not be called");
    });

    const app = createApp({
      env: testEnv,
      logger: createLogger({ service: "api-test" }, "error"),
      authRepository: createAuthRepository(),
      draftRepository: createDraftRepository(),
      importRepository: createImportRepository(),
      resumeParser,
    });

    const response = await request(app)
      .post("/imports/resume")
      .set("authorization", "Bearer valid-token")
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Invalid request body");
    expect(resumeParser).not.toHaveBeenCalled();
  });

  test("maps LinkedIn basic identity into the normalized draft", async () => {
    const app = createApp({
      env: testEnv,
      logger: createLogger({ service: "api-test" }, "error"),
      authRepository: createAuthRepository(),
      draftRepository: createDraftRepository(),
      importRepository: createImportRepository(),
      resumeParser: vi.fn(async () => {
        throw new Error("unused");
      }),
    });

    const response = await request(app)
      .post("/imports/linkedin-basic")
      .set("authorization", "Bearer valid-token")
      .send({
        fullName: "Jane Example",
        headline: "Senior Frontend Engineer",
        location: "Toronto, CA",
        summary: "Builds design systems and frontend platforms.",
        email: "jane@example.com",
        linkedinUrl: "https://linkedin.com/in/jane-example",
      });

    expect(response.status).toBe(200);
    expect(response.body.job.status).toBe("succeeded");
    expect(response.body.draft.metadata.sourceType).toBe("linkedin-basic");
    expect(response.body.draft.links).toContainEqual({
      type: "linkedin",
      label: "LinkedIn",
      url: "https://linkedin.com/in/jane-example",
    });
  });
});

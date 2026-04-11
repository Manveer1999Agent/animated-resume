import {
  createDefaultSectionConfidenceMap,
  createEmptyPortfolioDraft,
  type ImportJob,
  type PortfolioDraft,
} from "@animated-resume/contracts";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, RouterProvider } from "react-router-dom";
import { afterEach, describe, expect, test, vi } from "vitest";

import { createAppRouter } from "../../app/router";
import { WizardLayout } from "./components/WizardLayout";

const portfolioId = "11111111-1111-4111-8111-111111111111";
const resumeJobId = "33333333-3333-4333-8333-333333333333";
const linkedInJobId = "44444444-4444-4444-8444-444444444444";
const failedJobId = "55555555-5555-4555-8555-555555555555";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

function createDraftWithSectionStates(sectionOverrides: Partial<PortfolioDraft["metadata"]["sectionStates"]>) {
  const draft = createEmptyPortfolioDraft(portfolioId);
  draft.metadata.sectionStates = {
    ...createDefaultSectionConfidenceMap(),
    ...sectionOverrides,
  };
  draft.metadata.completionScore = 58;
  draft.metadata.sourceType = "resume";
  return draft;
}

function createJob(overrides: Partial<ImportJob>): ImportJob {
  return {
    id: resumeJobId,
    portfolioId,
    draftId: "22222222-2222-4222-8222-222222222222",
    sourceType: "resume",
    status: "processing",
    confidenceSummary: {
      overall: 0.64,
      sections: {
        hero: 0.92,
        about: 0.52,
        experience: 0.74,
        projects: 0,
        education: 0.68,
        skills: 0.81,
        contact: 0.9,
      },
    },
    sectionStates: createDefaultSectionConfidenceMap(),
    sectionWarnings: [],
    errorMessage: null,
    createdAt: "2026-04-11T10:00:00.000Z",
    updatedAt: "2026-04-11T10:00:00.000Z",
    completedAt: null,
    ...overrides,
  };
}

function createResumeDraft(): PortfolioDraft {
  return createDraftWithSectionStates({
    hero: {
      score: 0.93,
      fieldConfidence: { fullName: 0.98, headline: 0.89 },
      warnings: [],
      verified: false,
      lastVerifiedAt: null,
    },
    about: {
      score: 0.64,
      fieldConfidence: { summary: 0.64 },
      warnings: ["Summary looks sparse."],
      verified: false,
      lastVerifiedAt: null,
    },
    experience: {
      score: 0.78,
      fieldConfidence: { highlights: 0.78 },
      warnings: [],
      verified: false,
      lastVerifiedAt: null,
    },
    projects: {
      score: 0,
      fieldConfidence: {},
      warnings: [],
      verified: false,
      lastVerifiedAt: null,
    },
    education: {
      score: 0.71,
      fieldConfidence: { institution: 0.71 },
      warnings: ["Education dates need confirmation."],
      verified: false,
      lastVerifiedAt: null,
    },
    skills: {
      score: 0.83,
      fieldConfidence: { featured: 0.83 },
      warnings: [],
      verified: false,
      lastVerifiedAt: null,
    },
    contact: {
      score: 0.88,
      fieldConfidence: { email: 0.88 },
      warnings: [],
      verified: false,
      lastVerifiedAt: null,
    },
  });
}

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("onboarding shell", () => {
  test("renders wizard progress and navigation controls", () => {
    render(
      <MemoryRouter>
        <WizardLayout
          title="Build your first animated resume"
          description="Import your information and review what needs attention."
          stepIndex={0}
          stepCount={5}
          backTo="/"
          primaryAction={<button type="button">Continue</button>}
        >
          <p>Child content</p>
        </WizardLayout>
      </MemoryRouter>,
    );

    expect(screen.getByText("Step 1 of 5")).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Build your first animated resume" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Back" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Continue" })).toBeTruthy();
    expect(screen.getByText("Child content")).toBeTruthy();
  });

  test("lets the user move from welcome to source selection and manual start", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input);

        if (url.endsWith("/portfolio/draft")) {
          return jsonResponse({ draft: createEmptyPortfolioDraft(portfolioId) });
        }

        throw new Error(`Unhandled request: ${url}`);
      }),
    );

    const router = createAppRouter({
      isAuthenticated: true,
      initialEntries: ["/app/onboarding/welcome"],
    });

    render(<RouterProvider router={router} />);

    fireEvent.click(await screen.findByRole("button", { name: "Choose a source" }));
    expect(await screen.findByRole("heading", { name: "Choose how to start" })).toBeTruthy();

    fireEvent.click(await screen.findByRole("button", { name: "Start manually" }));

    expect(await screen.findByRole("heading", { name: "Verification hub" })).toBeTruthy();
  });

  test("routes a successful resume import into the verification hub", async () => {
    const draft = createResumeDraft();
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input);

        if (url.endsWith("/imports/resume") && init?.method === "POST") {
          return jsonResponse({
            job: createJob({ id: resumeJobId, status: "succeeded", sourceType: "resume" }),
            draft,
          });
        }

        if (url.endsWith(`/imports/jobs/${resumeJobId}`)) {
          return jsonResponse({
            job: createJob({ id: resumeJobId, status: "succeeded", sourceType: "resume" }),
          });
        }

        if (url.endsWith("/portfolio/draft")) {
          return jsonResponse({ draft });
        }

        throw new Error(`Unhandled request: ${url}`);
      }),
    );

    const router = createAppRouter({
      isAuthenticated: true,
      initialEntries: ["/app/onboarding/resume"],
    });

    render(<RouterProvider router={router} />);

    fireEvent.change(await screen.findByLabelText("Resume text"), {
      target: { value: "Jane Example\nSenior Frontend Engineer" },
    });
    fireEvent.click(await screen.findByRole("button", { name: "Start import" }));

    expect(await screen.findByRole("heading", { name: "Verification hub" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Needs review", level: 2 })).toBeTruthy();
    expect(screen.getByText("Projects")).toBeTruthy();
  });

  test("routes a successful LinkedIn basic import into the verification hub", async () => {
    const draft = createResumeDraft();
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input);

        if (url.endsWith("/imports/linkedin-basic") && init?.method === "POST") {
          return jsonResponse({
            job: createJob({
              id: linkedInJobId,
              status: "succeeded",
              sourceType: "linkedin-basic",
            }),
            draft,
          });
        }

        if (url.endsWith(`/imports/jobs/${linkedInJobId}`)) {
          return jsonResponse({
            job: createJob({
              id: linkedInJobId,
              status: "succeeded",
              sourceType: "linkedin-basic",
            }),
          });
        }

        if (url.endsWith("/portfolio/draft")) {
          return jsonResponse({ draft });
        }

        throw new Error(`Unhandled request: ${url}`);
      }),
    );

    const router = createAppRouter({
      isAuthenticated: true,
      initialEntries: ["/app/onboarding/source"],
    });

    render(<RouterProvider router={router} />);

    fireEvent.change(await screen.findByLabelText("Full name"), {
      target: { value: "Jane Example" },
    });
    fireEvent.change(screen.getByLabelText("LinkedIn URL"), {
      target: { value: "https://linkedin.com/in/jane-example" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Use LinkedIn basic" }));

    expect(await screen.findByRole("heading", { name: "Verification hub" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Ready", level: 2 })).toBeTruthy();
  });

  test("shows recovery options when an import job fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input);

        if (url.endsWith(`/imports/jobs/${failedJobId}`)) {
          return jsonResponse({
            job: createJob({
              id: failedJobId,
              status: "failed",
              errorMessage: "Resume parsing failed.",
            }),
          });
        }

        throw new Error(`Unhandled request: ${url}`);
      }),
    );

    const router = createAppRouter({
      isAuthenticated: true,
      initialEntries: [`/app/onboarding/processing?jobId=${failedJobId}`],
    });

    render(<RouterProvider router={router} />);

    expect(await screen.findByText("Import needs another try")).toBeTruthy();
    expect(screen.getByRole("link", { name: "Try again" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Choose another source" })).toBeTruthy();
  });

  test("shows a recovery state when processing loads without a job id", async () => {
    const router = createAppRouter({
      isAuthenticated: true,
      initialEntries: ["/app/onboarding/processing"],
    });

    render(<RouterProvider router={router} />);

    expect(await screen.findByText("Missing import job")).toBeTruthy();
    expect(screen.getByRole("link", { name: "Choose another source" })).toBeTruthy();
  });

  test("hands off into the dashboard from the verification hub", async () => {
    const draft = createResumeDraft();
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input);

        if (url.endsWith("/portfolio/draft")) {
          return jsonResponse({ draft });
        }

        throw new Error(`Unhandled request: ${url}`);
      }),
    );

    const router = createAppRouter({
      isAuthenticated: true,
      initialEntries: ["/app/onboarding/verification"],
    });

    render(<RouterProvider router={router} />);

    fireEvent.click(await screen.findByRole("button", { name: "Continue to workspace" }));

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "Dashboard" })).toBeTruthy();
    });

    expect(
      screen.getByText(
        "Your draft is in the workspace. Detailed section verification is the next milestone in the editor flow.",
      ),
    ).toBeTruthy();
  });
});

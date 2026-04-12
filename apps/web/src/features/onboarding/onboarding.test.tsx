import { cleanup, render, screen } from "@testing-library/react";
import { RouterProvider } from "react-router-dom";
import { afterEach, describe, expect, test, vi } from "vitest";

import { createAppRouter } from "../../app/router";
import * as onboardingApi from "./api";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("onboarding wizard", () => {
  test("renders welcome step with progress and continue action", async () => {
    const router = createAppRouter({
      isAuthenticated: true,
      initialEntries: ["/onboarding/welcome"],
    });

    render(<RouterProvider router={router} />);

    expect(await screen.findByRole("heading", { name: "Welcome to Animated Resume" })).toBeTruthy();
    expect(screen.getByText("Step 1 of 5")).toBeTruthy();
    expect(screen.getByRole("link", { name: "Continue" }).getAttribute("href")).toBe(
      "/onboarding/source",
    );
  });

  test("moves through source and upload steps with back and continue links", async () => {
    const router = createAppRouter({
      isAuthenticated: true,
      initialEntries: ["/onboarding/source"],
    });

    render(<RouterProvider router={router} />);

    expect(await screen.findByRole("heading", { name: "Choose your starting source" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Back" }).getAttribute("href")).toBe(
      "/onboarding/welcome",
    );
    expect(screen.getByRole("link", { name: "Continue" }).getAttribute("href")).toBe(
      "/onboarding/upload",
    );
  });

  test("disables continue during processing and enables on completion", async () => {
    vi.spyOn(onboardingApi, "pollImportStatus").mockResolvedValue({
      jobId: "demo-import-job",
      status: "complete",
    });

    const router = createAppRouter({
      isAuthenticated: true,
      initialEntries: ["/onboarding/processing"],
    });

    render(<RouterProvider router={router} />);

    expect(await screen.findByRole("heading", { name: "Processing your resume" })).toBeTruthy();
    expect(
      (await screen.findByRole("link", { name: "Continue to verification" })).getAttribute(
        "href",
      ),
    ).toBe("/onboarding/verification");
  });

  test("redirects unauthenticated users away from onboarding routes", async () => {
    const router = createAppRouter({
      isAuthenticated: false,
      initialEntries: ["/onboarding/welcome"],
    });

    render(<RouterProvider router={router} />);

    expect(await screen.findByRole("heading", { name: "Sign in" })).toBeTruthy();
  });
});

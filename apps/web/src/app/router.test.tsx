import { cleanup, render, screen } from "@testing-library/react";
import { RouterProvider } from "react-router-dom";
import { afterEach, describe, expect, test } from "vitest";

import { createAppRouter } from "./router";

afterEach(() => {
  cleanup();
});

describe("app routing", () => {
  test("renders marketing route for public home", async () => {
    const router = createAppRouter({
      isAuthenticated: false,
      initialEntries: ["/"],
    });

    render(<RouterProvider router={router} />);

    expect(
      await screen.findByRole("heading", { name: "Animated Resume" }),
    ).toBeTruthy();
  });

  test("redirects unauthenticated users away from product routes", async () => {
    const router = createAppRouter({
      isAuthenticated: false,
      initialEntries: ["/app/dashboard"],
    });

    render(<RouterProvider router={router} />);

    expect(await screen.findByRole("heading", { name: "Sign in" })).toBeTruthy();
  });

  test("renders dashboard for authenticated product route", async () => {
    const router = createAppRouter({
      isAuthenticated: true,
      initialEntries: ["/app/dashboard"],
    });

    render(<RouterProvider router={router} />);

    expect(await screen.findByRole("heading", { name: "Dashboard" })).toBeTruthy();
  });

  test("renders onboarding welcome for authenticated onboarding route", async () => {
    const router = createAppRouter({
      isAuthenticated: true,
      initialEntries: ["/app/onboarding/welcome"],
    });

    render(<RouterProvider router={router} />);

    expect(
      await screen.findByRole("heading", { name: "Build your first animated resume" }),
    ).toBeTruthy();
    expect(screen.queryByRole("heading", { name: "Workspace" })).toBeNull();
  });
});

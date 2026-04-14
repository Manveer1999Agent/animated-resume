import {
  Navigate,
  Outlet,
  createBrowserRouter,
  type RouteObject,
  createMemoryRouter,
} from "react-router-dom";

import { MarketingShell } from "./layouts/MarketingShell";
import { ProductShell } from "./layouts/ProductShell";
import { SignInPage } from "../features/auth/pages/SignInPage";
import { SignUpPage } from "../features/auth/pages/SignUpPage";
import { DashboardPage } from "../features/dashboard/pages/DashboardPage";
import { TemplateSelectorPage } from "../features/dashboard/pages/TemplateSelectorPage";
import { createOnboardingRouteGroup } from "../features/onboarding/routes";

type CreateRouterOptions = {
  isAuthenticated: boolean;
  initialEntries?: string[];
};

import { LandingPage } from "../features/landing/pages/LandingPage";

function RequireAuth({ isAuthenticated }: { isAuthenticated: boolean }) {
  if (!isAuthenticated) {
    return <Navigate to="/auth/sign-in" replace />;
  }
  return <Outlet />;
}

function buildRoutes(isAuthenticated: boolean): RouteObject[] {
  return [
    {
      element: <MarketingShell />,
      children: [
        { path: "/", element: <LandingPage /> },
        { path: "/auth/sign-in", element: <SignInPage /> },
        { path: "/auth/sign-up", element: <SignUpPage /> },
      ],
    },
    {
      element: <RequireAuth isAuthenticated={isAuthenticated} />,
      children: [
        createOnboardingRouteGroup(),
        {
          path: "/app",
          children: [
            {
              element: <MarketingShell />,
              children: [
                { path: "templates", element: <TemplateSelectorPage /> },
              ],
            },
            {
              element: <ProductShell />,
              children: [
                { index: true, element: <Navigate to="/app/templates" replace /> },
                { path: "dashboard", element: <DashboardPage /> },
              ],
            },
          ],
        },
      ],
    },
    { path: "*", element: <Navigate to="/" replace /> },
  ];
}

export function createAppRouter(
  options: CreateRouterOptions,
): ReturnType<typeof createMemoryRouter> {
  const router: ReturnType<typeof createMemoryRouter> = createMemoryRouter(
    buildRoutes(options.isAuthenticated),
    {
      initialEntries: options.initialEntries ?? ["/"],
    },
  );
  return router;
}

export function createBrowserAppRouter(): ReturnType<typeof createBrowserRouter> {
  // Pass true or dynamically check auth here for development
  const router: ReturnType<typeof createBrowserRouter> = createBrowserRouter(
    buildRoutes(true),
  );
  return router;
}

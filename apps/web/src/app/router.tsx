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

type CreateRouterOptions = {
  isAuthenticated: boolean;
  initialEntries?: string[];
};

function LandingPage() {
  return (
    <section className="panel">
      <h1>Animated Resume</h1>
      <p>Build an interactive, recruiter-ready portfolio from your professional data.</p>
    </section>
  );
}

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
      path: "/app",
      element: <RequireAuth isAuthenticated={isAuthenticated} />,
      children: [
        {
          element: <ProductShell />,
          children: [
            { index: true, element: <Navigate to="/app/dashboard" replace /> },
            { path: "dashboard", element: <DashboardPage /> },
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
  const router: ReturnType<typeof createBrowserRouter> = createBrowserRouter(
    buildRoutes(false),
  );
  return router;
}

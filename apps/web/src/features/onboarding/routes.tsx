import { Navigate, type RouteObject } from "react-router-dom";

import { WizardLayout } from "./components/WizardLayout";
import { ImportSourcePage } from "./pages/ImportSourcePage";
import { ManualFormPage } from "./pages/ManualFormPage";
import { VerificationHubPage } from "./pages/VerificationHubPage";
import { WelcomePage } from "./pages/WelcomePage";

export function createOnboardingRouteGroup(): RouteObject {
  return {
    path: "/onboarding",
    element: <WizardLayout />,
    children: [
      { index: true, element: <Navigate to="/onboarding/welcome" replace /> },
      { path: "welcome", element: <WelcomePage /> },
      { path: "source", element: <ImportSourcePage /> },
      { path: "form", element: <ManualFormPage /> },
      { path: "verification", element: <VerificationHubPage /> },
    ],
  };
}

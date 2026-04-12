import { Navigate, type RouteObject } from "react-router-dom";

import { WizardLayout } from "./components/WizardLayout";
import { ImportProcessingPage } from "./pages/ImportProcessingPage";
import { ImportSourcePage } from "./pages/ImportSourcePage";
import { ResumeUploadPage } from "./pages/ResumeUploadPage";
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
      { path: "upload", element: <ResumeUploadPage /> },
      { path: "processing", element: <ImportProcessingPage /> },
      { path: "verification", element: <VerificationHubPage /> },
    ],
  };
}

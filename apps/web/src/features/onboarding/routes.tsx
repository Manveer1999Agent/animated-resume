import { Navigate, type RouteObject } from "react-router-dom";

import { ImportProcessingPage } from "./pages/ImportProcessingPage";
import { ImportSourcePage } from "./pages/ImportSourcePage";
import { ResumeUploadPage } from "./pages/ResumeUploadPage";
import { VerificationHubPage } from "./pages/VerificationHubPage";
import { WelcomePage } from "./pages/WelcomePage";

export function createOnboardingRoutes(): RouteObject {
  return {
    path: "onboarding",
    children: [
      { index: true, element: <Navigate to="/app/onboarding/welcome" replace /> },
      { path: "welcome", element: <WelcomePage /> },
      { path: "source", element: <ImportSourcePage /> },
      { path: "resume", element: <ResumeUploadPage /> },
      { path: "processing", element: <ImportProcessingPage /> },
      { path: "verification", element: <VerificationHubPage /> },
    ],
  };
}

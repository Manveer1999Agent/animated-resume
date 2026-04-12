import { useLocation } from "react-router-dom";

export function DashboardPage() {
  const location = useLocation();
  const fromOnboarding =
    typeof location.state === "object" &&
    location.state !== null &&
    "onboardingHandoff" in location.state &&
    Boolean((location.state as { onboardingHandoff?: boolean }).onboardingHandoff);

  return (
    <section className="panel">
      <h1>Dashboard</h1>
      <p>
        {fromOnboarding
          ? "Your draft is in the workspace. Detailed section verification is the next milestone in the editor flow."
          : "Your portfolio workspace will be wired in subsequent Phase 1 issues."}
      </p>
    </section>
  );
}

import {
  Link,
  Outlet,
  useLocation,
} from "react-router-dom";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

type WizardStep = {
  path: string;
  title: string;
};

type WizardControls = {
  continueTo?: string;
  continueLabel?: string;
  continueDisabled?: boolean;
};

type WizardControlsContextValue = { setControls: (controls: WizardControls) => void };

const wizardSteps: WizardStep[] = [
  { path: "/onboarding/welcome", title: "Welcome" },
  { path: "/onboarding/source", title: "Choose source" },
  { path: "/onboarding/upload", title: "Upload resume" },
  { path: "/onboarding/processing", title: "Processing" },
  { path: "/onboarding/verification", title: "Verify sections" },
];

const WizardControlsContext = createContext<WizardControlsContextValue | null>(null);

function getStepIndex(pathname: string): number {
  const found = wizardSteps.findIndex((step) => step.path === pathname);
  return found === -1 ? 0 : found;
}

export function useWizardControls(controls: WizardControls) {
  const context = useContext(WizardControlsContext);

  useEffect(() => {
    context?.setControls(controls);
    return () => {
      context?.setControls({});
    };
  }, [context, controls.continueDisabled, controls.continueLabel, controls.continueTo]);
}

export function WizardLayout() {
  const location = useLocation();
  const [controls, setControls] = useState<WizardControls>({});
  const controlsContext = useMemo(() => ({ setControls }), [setControls]);

  const stepIndex = getStepIndex(location.pathname);
  const step = wizardSteps[stepIndex];
  const backTo = stepIndex > 0 ? wizardSteps[stepIndex - 1]?.path : undefined;
  const defaultContinueTo = wizardSteps[stepIndex + 1]?.path ?? "/app/dashboard";
  const continueTo = controls.continueTo ?? defaultContinueTo;
  const continueLabel = controls.continueLabel ?? (stepIndex === wizardSteps.length - 1 ? "Go to dashboard" : "Continue");
  const progress = Math.round(((stepIndex + 1) / wizardSteps.length) * 100);

  return (
    <WizardControlsContext.Provider value={controlsContext}>
      <div className="marketing-shell">
        <header className="shell-header">
          <strong>Onboarding Wizard</strong>
          <span>{`Step ${stepIndex + 1} of ${wizardSteps.length}`}</span>
        </header>
        <section className="panel">
          <p style={{ marginTop: 0, color: "var(--ar-color-text-muted)" }}>{step.title}</p>
          <div
            aria-label="Progress"
            style={{
              background: "var(--ar-color-accent-soft)",
              borderRadius: "999px",
              height: "8px",
              marginBottom: "var(--ar-space-5)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                background: "var(--ar-color-accent)",
                height: "100%",
                transition: "width 180ms ease-out",
                width: `${progress}%`,
              }}
            />
          </div>
          <Outlet />
          <footer
            style={{
              borderTop: "1px solid var(--ar-color-border)",
              display: "flex",
              gap: "var(--ar-space-3)",
              justifyContent: "space-between",
              marginTop: "var(--ar-space-5)",
              paddingTop: "var(--ar-space-4)",
            }}
          >
            {backTo ? <Link to={backTo}>Back</Link> : <span />}
            {controls.continueDisabled ? (
              <button disabled>{continueLabel}</button>
            ) : (
              <Link to={continueTo}>{continueLabel}</Link>
            )}
          </footer>
        </section>
      </div>
    </WizardControlsContext.Provider>
  );
}

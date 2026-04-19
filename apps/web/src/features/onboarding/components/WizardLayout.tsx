import {
  Link,
  Outlet,
  useLocation,
} from "react-router-dom";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Sparkles, Bell, ArrowRight, ArrowLeft } from "lucide-react";
import "./WizardLayout.css";

type WizardStep = {
  path: string;
  title: string;
};

type WizardControls = {
  continueTo?: string;
  continueLabel?: string;
  continueDisabled?: boolean;
  hideContinue?: boolean;
  skipTo?: string;
};

type WizardControlsContextValue = { setControls: (controls: WizardControls) => void };

const wizardSteps: WizardStep[] = [
  { path: "/onboarding/welcome", title: "Welcome" },
  { path: "/onboarding/source", title: "Data Import" },
  { path: "/onboarding/form", title: "Form Details" },
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

  // Theme support consistent with MarketingShell
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "dark"
  );
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const stepIndex = getStepIndex(location.pathname);
  const backTo = stepIndex > 0 ? wizardSteps[stepIndex - 1]?.path : undefined;
  const defaultContinueTo = wizardSteps[stepIndex + 1]?.path ?? "/app/dashboard";
  const continueTo = controls.continueTo ?? defaultContinueTo;
  const continueLabel = controls.continueLabel ?? (stepIndex === wizardSteps.length - 1 ? "Go to dashboard" : "Next Step");

  return (
    <WizardControlsContext.Provider value={controlsContext}>
      <div className="wizard-shell">
        <header className="wizard-header">
          <div className="header-logo">
            <div className="logo-icon">
              <Sparkles size={18} />
            </div>
            <span className="logo-text">PortfoliAI</span>
          </div>

          <div className="header-actions">
            <Link to="#" className="header-link">Privacy Policy</Link>
            <Link to="#" className="header-link">Terms of Service</Link>
            <button
              onClick={toggleTheme}
              style={{
                background: 'transparent', border: '1px solid var(--ar-color-border)',
                borderRadius: '8px', padding: '4px 8px', cursor: 'pointer',
                color: 'var(--ar-color-text-primary)', fontSize: '0.875rem'
              }}
            >
              {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
            </button>
            <button className="notification-btn">
              <Bell size={20} />
              <span className="notification-dot"></span>
            </button>
            <div className="avatar">
              <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-4.jpg" alt="User Profile" />
            </div>
          </div>
        </header>

        <main className="wizard-main">
          <Outlet />

          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            {backTo ? (
              <Link to={backTo} style={{
                padding: '0.75rem 1.5rem', borderRadius: '12px', color: 'var(--ar-color-text-muted)', fontWeight: 500,
                textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem',
                transition: 'color 0.2s'
              }}>
                <ArrowLeft size={16} /> Back
              </Link>
            ) : <div />}

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {!controls.hideContinue && (
                controls.continueDisabled ? (
                  <button disabled style={{
                      padding: '0.75rem 2rem', borderRadius: '12px', background: 'linear-gradient(to right, #3B82F6, #8B5CF6)',
                      color: 'white', fontWeight: 600, border: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem',
                      opacity: 0.5, cursor: 'not-allowed', boxShadow: '0 0 15px rgba(59, 130, 246, 0.4)'
                  }}>
                    {continueLabel} <ArrowRight size={16} />
                  </button>
                ) : (
                  <Link to={continueTo} style={{
                      padding: '0.75rem 2rem', borderRadius: '12px', background: 'linear-gradient(to right, #3B82F6, #8B5CF6)',
                      color: 'white', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem',
                      boxShadow: '0 0 15px rgba(59, 130, 246, 0.4)'
                  }}>
                    {continueLabel} <ArrowRight size={16} />
                  </Link>
                )
              )}
            </div>
          </div>
        </main>
      </div>
    </WizardControlsContext.Provider>
  );
}

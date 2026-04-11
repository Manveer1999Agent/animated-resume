import { useNavigate } from "react-router-dom";

import { WizardLayout } from "../components/WizardLayout";

export function WelcomePage() {
  const navigate = useNavigate();

  return (
    <WizardLayout
      title="Build your first animated resume"
      description="Import your information, understand what looks solid, and continue into the workspace with a structured draft."
      stepIndex={0}
      stepCount={5}
      primaryAction={
        <button
          className="wizard-primary-button"
          type="button"
          onClick={() => navigate("/app/onboarding/source")}
        >
          Choose a source
        </button>
      }
    >
      <div className="wizard-card-grid">
        <article className="wizard-info-card">
          <p className="wizard-eyebrow">Guided setup</p>
          <h2>Three ways to start, one normalized draft</h2>
          <p>
            Paste a resume, use LinkedIn basic identity details, or start from an empty draft.
            The flow keeps progress visible and ends at a verification checkpoint before you
            continue into the workspace.
          </p>
        </article>
        <article className="wizard-info-card">
          <p className="wizard-eyebrow">What happens next</p>
          <ul className="wizard-list">
            <li>Choose how you want to seed your portfolio</li>
            <li>Wait while the draft is prepared and normalized</li>
            <li>Review which sections are ready and which need attention</li>
          </ul>
        </article>
      </div>
    </WizardLayout>
  );
}

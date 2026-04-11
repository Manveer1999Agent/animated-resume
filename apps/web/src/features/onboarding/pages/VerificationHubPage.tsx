import {
  sectionKeys,
  type PortfolioDraft,
  type SectionConfidence,
  type SectionKey,
} from "@animated-resume/contracts";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { getDraft, getErrorMessage } from "../api";
import { WizardLayout } from "../components/WizardLayout";

type SectionSummary = {
  key: SectionKey;
  label: string;
  confidence: SectionConfidence;
};

type GroupedSections = {
  ready: SectionSummary[];
  review: SectionSummary[];
  missing: SectionSummary[];
};

const sectionLabels: Record<SectionKey, string> = {
  hero: "Profile",
  about: "About",
  experience: "Experience",
  projects: "Projects",
  education: "Education",
  skills: "Skills",
  contact: "Links & contact",
};

function groupSections(draft: PortfolioDraft): GroupedSections {
  return sectionKeys.reduce<GroupedSections>(
    (groups, key) => {
      const confidence = draft.metadata.sectionStates[key];
      const summary: SectionSummary = {
        key,
        label: sectionLabels[key],
        confidence,
      };

      if (confidence.score === 0) {
        groups.missing.push(summary);
      } else if (confidence.score < 0.75 || confidence.warnings.length > 0) {
        groups.review.push(summary);
      } else {
        groups.ready.push(summary);
      }

      return groups;
    },
    {
      ready: [],
      review: [],
      missing: [],
    },
  );
}

function formatScore(score: number): string {
  return `${Math.round(score * 100)}% confidence`;
}

export function VerificationHubPage() {
  const navigate = useNavigate();
  const [draft, setDraft] = useState<PortfolioDraft | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadDraft() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await getDraft();
        if (!cancelled) {
          setDraft(response.draft);
        }
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(getErrorMessage(error));
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadDraft();

    return () => {
      cancelled = true;
    };
  }, []);

  const groupedSections = useMemo(() => {
    if (!draft) {
      return null;
    }

    return groupSections(draft);
  }, [draft]);

  function renderGroup(title: string, items: SectionSummary[], tone: "ready" | "review" | "missing") {
    return (
      <section className="wizard-status-section">
        <div className="wizard-inline-header">
          <div>
            <h2>{title}</h2>
            <p className="wizard-description">
              {items.length === 0 ? "No sections in this bucket right now." : `${items.length} sections`}
            </p>
          </div>
          <span className={`wizard-status-chip wizard-status-chip-${tone}`}>{items.length}</span>
        </div>

        <div className="wizard-status-list">
          {items.length === 0 ? (
            <article className="wizard-status-card wizard-status-card-empty">
              <p>Nothing here yet.</p>
            </article>
          ) : (
            items.map((item) => (
              <article className="wizard-status-card" key={item.key}>
                <div className="wizard-inline-header">
                  <div>
                    <h3>{item.label}</h3>
                    <p className="wizard-description">{formatScore(item.confidence.score)}</p>
                  </div>
                  <span className={`wizard-status-chip wizard-status-chip-${tone}`}>
                    {tone === "ready"
                      ? "Ready"
                      : tone === "review"
                        ? "Needs review"
                        : "Missing"}
                  </span>
                </div>
                {item.confidence.warnings.length > 0 ? (
                  <ul className="wizard-list">
                    {item.confidence.warnings.map((warning) => (
                      <li key={warning}>{warning}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="wizard-description">
                    {tone === "ready"
                      ? "This section looks stable enough for the next workspace step."
                      : tone === "review"
                        ? "Review this section before you treat it as recruiter-ready."
                        : "You can add this section once detailed editors are available in the workspace flow."}
                  </p>
                )}
              </article>
            ))
          )}
        </div>
      </section>
    );
  }

  let content: JSX.Element;

  if (isLoading) {
    content = (
      <div className="wizard-processing-panel">
        <div className="wizard-spinner" aria-hidden="true" />
        <div>
          <h2>Loading your draft</h2>
          <p>We’re collecting the latest section readiness details.</p>
        </div>
      </div>
    );
  } else if (errorMessage) {
    content = (
      <div className="wizard-error-panel" role="alert">
        <strong>We couldn&apos;t load the verification hub.</strong>
        <p>{errorMessage}</p>
        <div className="wizard-action-group">
          <button
            className="wizard-secondary-button"
            type="button"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
          <Link className="wizard-link-button" to="/app/onboarding/source">
            Start another import
          </Link>
        </div>
      </div>
    );
  } else if (!groupedSections) {
    content = (
      <div className="wizard-error-panel" role="alert">
        <strong>No draft available</strong>
        <p>There is no draft data available to verify yet.</p>
      </div>
    );
  } else {
    content = (
      <div className="wizard-status-grid">
        <article className="wizard-info-card">
          <p className="wizard-eyebrow">Checkpoint</p>
          <h2>Use this as your readiness snapshot</h2>
          <p>
            Detailed section editing is the next workspace step. For now, this hub tells you what
            looks strong, what still needs a careful pass, and which sections remain sparse.
          </p>
        </article>
        {renderGroup("Ready", groupedSections.ready, "ready")}
        {renderGroup("Needs review", groupedSections.review, "review")}
        {renderGroup("Missing or weak", groupedSections.missing, "missing")}
      </div>
    );
  }

  return (
    <WizardLayout
      title="Verification hub"
      description="Review which parts of the normalized draft are strong enough to trust and which parts still need a careful follow-up."
      stepIndex={4}
      stepCount={5}
      backTo="/app/onboarding/source"
      primaryAction={
        <button
          className="wizard-primary-button"
          type="button"
          onClick={() => navigate("/app/dashboard", { state: { onboardingHandoff: true } })}
        >
          Continue to workspace
        </button>
      }
      secondaryAction={
        <Link className="wizard-secondary-button wizard-link-inline" to="/app/onboarding/source">
          Start another import
        </Link>
      }
    >
      {content}
    </WizardLayout>
  );
}

import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { getDraft, getErrorMessage, getImportJob } from "../api";
import { WizardLayout } from "../components/WizardLayout";

type ProcessingState =
  | { kind: "loading"; label: string }
  | { kind: "failed"; message: string }
  | { kind: "missing-job" };

export function ImportProcessingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get("jobId");
  const [state, setState] = useState<ProcessingState>(
    jobId
      ? { kind: "loading", label: "We’re preparing your draft." }
      : { kind: "missing-job" },
  );

  useEffect(() => {
    const activeJobId = jobId;

    if (!activeJobId) {
      setState({ kind: "missing-job" });
      return;
    }

    const resolvedJobId: string = activeJobId;

    let cancelled = false;
    let timeoutId: number | undefined;

    async function loadJob() {
      try {
        const { job } = await getImportJob(resolvedJobId);
        if (cancelled) {
          return;
        }

        if (job.status === "failed") {
          setState({
            kind: "failed",
            message: job.errorMessage ?? "The import failed before a draft was prepared.",
          });
          return;
        }

        if (job.status === "succeeded") {
          await getDraft();
          if (cancelled) {
            return;
          }
          navigate("/app/onboarding/verification", { replace: true });
          return;
        }

        setState({
          kind: "loading",
          label:
            job.status === "queued"
              ? "Your import is queued. We’ll move into draft processing shortly."
              : "We’re normalizing your content into a structured draft.",
        });

        timeoutId = window.setTimeout(() => {
          void loadJob();
        }, 800);
      } catch (error) {
        if (!cancelled) {
          setState({
            kind: "failed",
            message: getErrorMessage(error),
          });
        }
      }
    }

    void loadJob();

    return () => {
      cancelled = true;
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [jobId, navigate]);

  let content: JSX.Element;

  if (state.kind === "missing-job") {
    content = (
      <div className="wizard-error-panel" role="alert">
        <strong>Missing import job</strong>
        <p>We couldn&apos;t find an import job to monitor for this screen.</p>
        <div className="wizard-action-group">
          <Link className="wizard-secondary-button wizard-link-inline" to="/app/onboarding/source">
            Choose another source
          </Link>
        </div>
      </div>
    );
  } else if (state.kind === "failed") {
    content = (
      <div className="wizard-error-panel" role="alert">
        <strong>Import needs another try</strong>
        <p>{state.message}</p>
        <div className="wizard-action-group">
          <Link className="wizard-secondary-button wizard-link-inline" to="/app/onboarding/resume">
            Try again
          </Link>
          <Link className="wizard-link-button" to="/app/onboarding/source">
            Choose another source
          </Link>
        </div>
      </div>
    );
  } else {
    content = (
      <div className="wizard-processing-panel">
        <div className="wizard-spinner" aria-hidden="true" />
        <div>
          <h2>Processing your import</h2>
          <p>{state.label}</p>
        </div>
      </div>
    );
  }

  return (
    <WizardLayout
      title="Processing your draft"
      description="This step watches the import job and routes you into the verification checkpoint as soon as the draft is ready."
      stepIndex={3}
      stepCount={5}
      backTo="/app/onboarding/source"
    >
      {content}
    </WizardLayout>
  );
}

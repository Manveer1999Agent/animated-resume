import { type PropsWithChildren, type ReactNode } from "react";
import { Link } from "react-router-dom";

type WizardLayoutProps = PropsWithChildren<{
  title: string;
  description: string;
  stepIndex: number;
  stepCount: number;
  backTo?: string;
  primaryAction?: ReactNode;
  secondaryAction?: ReactNode;
}>;

export function WizardLayout({
  title,
  description,
  stepIndex,
  stepCount,
  backTo,
  primaryAction,
  secondaryAction,
  children,
}: WizardLayoutProps) {
  const progress = ((stepIndex + 1) / stepCount) * 100;

  return (
    <section className="wizard-shell">
      <div className="wizard-frame">
        <header className="wizard-header">
          <div className="wizard-copy">
            <p className="wizard-step-label">{`Step ${stepIndex + 1} of ${stepCount}`}</p>
            <h1>{title}</h1>
            <p className="wizard-description">{description}</p>
          </div>
          <div className="wizard-progress" aria-hidden="true">
            <span style={{ width: `${progress}%` }} />
          </div>
        </header>

        <div className="wizard-body">{children}</div>

        <footer className="wizard-actions">
          {backTo ? (
            <Link className="wizard-link-button" to={backTo}>
              Back
            </Link>
          ) : (
            <span />
          )}

          <div className="wizard-action-group">
            {secondaryAction}
            {primaryAction}
          </div>
        </footer>
      </div>
    </section>
  );
}

import { type ChangeEvent, type FormEvent, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getDraft,
  getErrorMessage,
  startLinkedInBasicImport,
} from "../api";
import { WizardLayout } from "../components/WizardLayout";

type LinkedInBasicFormState = {
  fullName: string;
  headline: string;
  location: string;
  summary: string;
  email: string;
  phone: string;
  website: string;
  linkedinUrl: string;
};

const initialLinkedInForm: LinkedInBasicFormState = {
  fullName: "",
  headline: "",
  location: "",
  summary: "",
  email: "",
  phone: "",
  website: "",
  linkedinUrl: "",
};

function normalizeNullable(value: string): string | null {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function ImportSourcePage() {
  const navigate = useNavigate();
  const [linkedInForm, setLinkedInForm] = useState<LinkedInBasicFormState>(initialLinkedInForm);
  const [activeAction, setActiveAction] = useState<"manual" | "linkedin" | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const linkedInPayload = useMemo(
    () => ({
      fullName: linkedInForm.fullName.trim(),
      headline: linkedInForm.headline.trim(),
      location: linkedInForm.location.trim(),
      summary: linkedInForm.summary.trim(),
      email: normalizeNullable(linkedInForm.email),
      phone: normalizeNullable(linkedInForm.phone),
      website: normalizeNullable(linkedInForm.website),
      linkedinUrl: linkedInForm.linkedinUrl.trim(),
    }),
    [linkedInForm],
  );

  function updateField(
    key: keyof LinkedInBasicFormState,
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { value } = event.target;
    setLinkedInForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function handleManualStart() {
    setActiveAction("manual");
    setErrorMessage(null);

    try {
      await getDraft();
      navigate("/app/onboarding/verification");
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setActiveAction(null);
    }
  }

  async function handleLinkedInSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setActiveAction("linkedin");
    setErrorMessage(null);

    try {
      const response = await startLinkedInBasicImport(linkedInPayload);
      navigate(`/app/onboarding/processing?jobId=${response.job.id}`);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setActiveAction(null);
    }
  }

  return (
    <WizardLayout
      title="Choose how to start"
      description="Every source flows into the same normalized draft model, so you can switch approaches without changing the overall onboarding path."
      stepIndex={1}
      stepCount={5}
      backTo="/app/onboarding/welcome"
    >
      {errorMessage ? (
        <div className="wizard-error-panel" role="alert">
          <strong>We couldn&apos;t continue.</strong>
          <p>{errorMessage}</p>
        </div>
      ) : null}

      <div className="wizard-card-grid">
        <article className="wizard-option-card">
          <p className="wizard-eyebrow">Resume import</p>
          <h2>Paste your resume content</h2>
          <p>Use your existing resume as the fastest path into a populated draft.</p>
          <button
            className="wizard-primary-button"
            type="button"
            onClick={() => navigate("/app/onboarding/resume")}
          >
            Use resume import
          </button>
        </article>

        <article className="wizard-option-card">
          <p className="wizard-eyebrow">Manual start</p>
          <h2>Begin with an empty draft</h2>
          <p>Create a clean draft now and review the sections that still need content.</p>
          <button
            className="wizard-secondary-button"
            type="button"
            disabled={activeAction === "manual"}
            onClick={() => {
              void handleManualStart();
            }}
          >
            {activeAction === "manual" ? "Preparing draft..." : "Start manually"}
          </button>
        </article>
      </div>

      <article className="wizard-info-card">
        <div className="wizard-inline-header">
          <div>
            <p className="wizard-eyebrow">LinkedIn basic</p>
            <h2>Seed your profile from public identity details</h2>
          </div>
          <p className="wizard-description">
            This captures a light profile seed rather than a full LinkedIn scrape.
          </p>
        </div>

        <form className="wizard-form-grid" onSubmit={handleLinkedInSubmit}>
          <label className="wizard-field">
            <span>Full name</span>
            <input
              required
              className="wizard-input"
              value={linkedInForm.fullName}
              onChange={(event) => updateField("fullName", event)}
            />
          </label>
          <label className="wizard-field">
            <span>Headline</span>
            <input
              className="wizard-input"
              value={linkedInForm.headline}
              onChange={(event) => updateField("headline", event)}
            />
          </label>
          <label className="wizard-field">
            <span>Location</span>
            <input
              className="wizard-input"
              value={linkedInForm.location}
              onChange={(event) => updateField("location", event)}
            />
          </label>
          <label className="wizard-field wizard-field-span-full">
            <span>LinkedIn URL</span>
            <input
              required
              type="url"
              className="wizard-input"
              value={linkedInForm.linkedinUrl}
              onChange={(event) => updateField("linkedinUrl", event)}
            />
          </label>
          <label className="wizard-field wizard-field-span-full">
            <span>Summary</span>
            <textarea
              className="wizard-textarea"
              rows={4}
              value={linkedInForm.summary}
              onChange={(event) => updateField("summary", event)}
            />
          </label>
          <label className="wizard-field">
            <span>Email</span>
            <input
              type="email"
              className="wizard-input"
              value={linkedInForm.email}
              onChange={(event) => updateField("email", event)}
            />
          </label>
          <label className="wizard-field">
            <span>Phone</span>
            <input
              className="wizard-input"
              value={linkedInForm.phone}
              onChange={(event) => updateField("phone", event)}
            />
          </label>
          <label className="wizard-field wizard-field-span-full">
            <span>Website</span>
            <input
              type="url"
              className="wizard-input"
              value={linkedInForm.website}
              onChange={(event) => updateField("website", event)}
            />
          </label>

          <div className="wizard-form-actions">
            <button
              className="wizard-primary-button"
              type="submit"
              disabled={activeAction === "linkedin"}
            >
              {activeAction === "linkedin" ? "Starting import..." : "Use LinkedIn basic"}
            </button>
          </div>
        </form>
      </article>
    </WizardLayout>
  );
}

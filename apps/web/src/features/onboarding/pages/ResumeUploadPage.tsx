import { type ChangeEvent, type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getErrorMessage, startResumeImport } from "../api";
import { WizardLayout } from "../components/WizardLayout";

export function ResumeUploadPage() {
  const navigate = useNavigate();
  const [fileName, setFileName] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await startResumeImport({
        resumeText,
        fileName: fileName.trim() || undefined,
      });
      navigate(`/app/onboarding/processing?jobId=${response.job.id}`);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  function updateField(
    setter: (value: string) => void,
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setter(event.target.value);
  }

  return (
    <WizardLayout
      title="Paste your resume"
      description="We will normalize your content into a structured portfolio draft and then show what needs review."
      stepIndex={2}
      stepCount={5}
      backTo="/app/onboarding/source"
      primaryAction={
        <button
          className="wizard-primary-button"
          form="resume-upload-form"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Starting import..." : "Start import"}
        </button>
      }
    >
      {errorMessage ? (
        <div className="wizard-error-panel" role="alert">
          <strong>Import couldn&apos;t start.</strong>
          <p>{errorMessage}</p>
        </div>
      ) : null}

      <form className="wizard-form-grid" id="resume-upload-form" onSubmit={handleSubmit}>
        <label className="wizard-field wizard-field-span-full">
          <span>File name</span>
          <input
            className="wizard-input"
            placeholder="resume.pdf"
            value={fileName}
            onChange={(event) => updateField(setFileName, event)}
          />
        </label>
        <label className="wizard-field wizard-field-span-full">
          <span>Resume text</span>
          <textarea
            required
            className="wizard-textarea wizard-textarea-lg"
            placeholder="Paste the contents of your resume here."
            value={resumeText}
            onChange={(event) => updateField(setResumeText, event)}
          />
        </label>
      </form>
    </WizardLayout>
  );
}

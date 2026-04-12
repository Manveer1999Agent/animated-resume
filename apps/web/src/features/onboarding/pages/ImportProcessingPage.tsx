import { useEffect, useState } from "react";

import { pollImportStatus } from "../api";
import { useWizardControls } from "../components/WizardLayout";

export function ImportProcessingPage() {
  const [status, setStatus] = useState<"loading" | "complete" | "failed">("loading");

  useEffect(() => {
    let alive = true;
    pollImportStatus("demo-import-job")
      .then((job) => {
        if (!alive) {
          return;
        }
        setStatus(job.status === "failed" ? "failed" : "complete");
      })
      .catch(() => {
        if (alive) {
          setStatus("failed");
        }
      });
    return () => {
      alive = false;
    };
  }, []);

  useWizardControls({
    continueTo: "/onboarding/verification",
    continueLabel: "Continue to verification",
    continueDisabled: status !== "complete",
  });

  return (
    <section>
      <h1>Processing your resume</h1>
      {status === "loading" && <p>Analyzing sections and confidence scores...</p>}
      {status === "complete" && (
        <p>Import complete. Continue to verify low-confidence sections.</p>
      )}
      {status === "failed" && (
        <p>Import failed. Use Back to retry upload without leaving onboarding.</p>
      )}
    </section>
  );
}

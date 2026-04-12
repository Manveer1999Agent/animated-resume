import { useState } from "react";

import { startResumeImport } from "../api";

export function ResumeUploadPage() {
  const [jobState, setJobState] = useState<string>("No upload started");

  return (
    <section>
      <h1>Upload your resume</h1>
      <p>We parse your file and map content into the structured onboarding draft.</p>
      <button
        onClick={async () => {
          const job = await startResumeImport();
          setJobState(`Import job started: ${job.jobId}`);
        }}
        type="button"
      >
        Simulate upload
      </button>
      <p style={{ color: "var(--ar-color-text-muted)" }}>{jobState}</p>
    </section>
  );
}

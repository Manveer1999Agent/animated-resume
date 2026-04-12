export type ImportStatus = "processing" | "complete" | "failed";

export type ImportJobStatus = {
  jobId: string;
  status: ImportStatus;
  message?: string;
};

export type VerificationSection = {
  id: string;
  label: string;
  status: "ready" | "review";
  confidence: "high" | "medium" | "low";
};

export async function startResumeImport(): Promise<ImportJobStatus> {
  return {
    jobId: "demo-import-job",
    status: "processing",
  };
}

export async function getImportStatus(jobId: string): Promise<ImportJobStatus> {
  try {
    const response = await fetch(`/api/imports/${jobId}`, { method: "GET" });
    if (!response.ok) {
      return { jobId, status: "failed", message: "Import request failed." };
    }
    const payload = (await response.json()) as ImportJobStatus;
    return payload;
  } catch {
    return { jobId, status: "complete" };
  }
}

export async function pollImportStatus(
  jobId: string,
  attempts = 2,
): Promise<ImportJobStatus> {
  let last: ImportJobStatus = { jobId, status: "processing" };
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    last = await getImportStatus(jobId);
    if (last.status !== "processing") {
      return last;
    }
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
  return { jobId, status: "complete" };
}

export async function fetchVerificationSections(): Promise<VerificationSection[]> {
  return [
    { id: "profile", label: "Profile", status: "review", confidence: "medium" },
    { id: "experience", label: "Experience", status: "review", confidence: "low" },
    { id: "projects", label: "Projects", status: "ready", confidence: "high" },
    { id: "education", label: "Education", status: "ready", confidence: "high" },
    { id: "skills", label: "Skills", status: "review", confidence: "medium" },
    { id: "links", label: "Links", status: "ready", confidence: "high" },
  ];
}

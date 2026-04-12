import {
  importDraftResponseSchema,
  importJobResponseSchema,
  linkedInBasicImportRequestSchema,
  portfolioDraftSchema,
  resumeImportRequestSchema,
  type LinkedInBasicImportRequest,
  type PortfolioDraft,
  type ResumeImportRequest,
} from "@animated-resume/contracts";

type DraftResponse = {
  draft: PortfolioDraft;
};

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function parseJson<T>(
  response: Response,
  parser: (json: unknown) => T,
): Promise<T> {
  const json = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      typeof json.error === "string"
        ? json.error
        : typeof json.message === "string"
          ? json.message
          : "Request failed";
    throw new ApiError(message, response.status);
  }

  return parser(json);
}

async function requestJson<T>(
  input: RequestInfo | URL,
  init: RequestInit | undefined,
  parser: (json: unknown) => T,
): Promise<T> {
  const response = await fetch(input, init);
  return parseJson(response, parser);
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}

export async function getDraft(): Promise<DraftResponse> {
  return requestJson("/portfolio/draft", undefined, (json) => {
    const payload = json as { draft?: unknown };
    return {
      draft: portfolioDraftSchema.parse(payload.draft),
    };
  });
}

export async function startResumeImport(
  payload: ResumeImportRequest,
) {
  const body = resumeImportRequestSchema.parse(payload);
  return requestJson(
    "/imports/resume",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
    importDraftResponseSchema.parse,
  );
}

export async function startLinkedInBasicImport(
  payload: LinkedInBasicImportRequest,
) {
  const body = linkedInBasicImportRequestSchema.parse(payload);
  return requestJson(
    "/imports/linkedin-basic",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
    importDraftResponseSchema.parse,
  );
}

export async function getImportJob(jobId: string) {
  return requestJson(`/imports/jobs/${jobId}`, undefined, importJobResponseSchema.parse);
}

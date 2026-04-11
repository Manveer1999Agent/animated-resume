import {
  importJobResponseSchema,
  importDraftResponseSchema,
  linkedInBasicImportRequestSchema,
  resumeImportRequestSchema,
} from "@animated-resume/contracts";
import { Router, type NextFunction, type Request, type Response } from "express";
import { z } from "zod";

import type { Logger } from "../lib/logger.js";
import type {
  AuthRepository,
  ImportJobRepository,
  PortfolioDraftRepository,
} from "../lib/supabase.js";
import { createRequireAuth, type AuthenticatedRequest } from "../middleware/requireAuth.js";
import { getDraft } from "../services/portfolio/getDraft.js";
import {
  buildImportConfidenceSummary,
  buildImportWarnings,
} from "../services/portfolio/draftUtils.js";
import { upsertDraft } from "../services/portfolio/upsertDraft.js";
import { mapLinkedInBasicToDraft } from "../services/imports/mapLinkedInBasicToDraft.js";
import { mapResumeToDraft } from "../services/imports/mapResumeToDraft.js";
import type { GeminiResumeParser } from "../services/imports/runGeminiResumeParse.js";

type ImportRouterContext = {
  authRepository: AuthRepository;
  draftRepository: PortfolioDraftRepository;
  importRepository: ImportJobRepository;
  resumeParser: GeminiResumeParser;
  logger: Logger;
};

function sendValidationError(res: Response, error: z.ZodError): void {
  res.status(400).json({
    error: "Invalid request body",
    details: error.flatten(),
  });
}

export function createImportRouter(context: ImportRouterContext): Router {
  const router = Router();
  const requireAuth = createRequireAuth(context.authRepository);
  const logger = context.logger.child({ scope: "imports" });

  router.post(
    "/imports/resume",
    requireAuth,
    async (req: Request, res: Response, next: NextFunction) => {
      const parsedRequest = resumeImportRequestSchema.safeParse(req.body);
      if (!parsedRequest.success) {
        sendValidationError(res, parsedRequest.error);
        return;
      }

      try {
        const authenticatedRequest = req as AuthenticatedRequest;
        const { accountId } = await context.authRepository.bootstrapPersonalAccount(
          authenticatedRequest.auth,
        );
        const currentDraft = await getDraft(accountId, context.draftRepository);

        const job = await context.importRepository.createJob({
          accountId,
          portfolioId: currentDraft.portfolioId,
          draftId: currentDraft.id,
          sourceType: "resume",
          status: "processing",
          confidenceSummary: buildImportConfidenceSummary(currentDraft.draft.metadata.sectionStates),
          sectionStates: currentDraft.draft.metadata.sectionStates,
          sectionWarnings: [],
        });

        try {
          const parsedResume = await context.resumeParser(parsedRequest.data);
          const mappedDraft = mapResumeToDraft(currentDraft.draft, parsedResume);
          const savedDraft = await upsertDraft(accountId, mappedDraft, context.draftRepository);
          const completedJob = await context.importRepository.updateJob(job.id, accountId, {
            draftId: savedDraft.id,
            status: "succeeded",
            confidenceSummary: buildImportConfidenceSummary(savedDraft.draft.metadata.sectionStates),
            sectionStates: savedDraft.draft.metadata.sectionStates,
            sectionWarnings: buildImportWarnings(savedDraft.draft.metadata.sectionStates),
            errorMessage: null,
            completedAt: new Date().toISOString(),
          });

          logger.info("imports.resume.succeeded", {
            accountId,
            jobId: completedJob.id,
            portfolioId: savedDraft.portfolioId,
          });

          res.status(200).json(importDraftResponseSchema.parse({
            job: completedJob,
            draft: savedDraft.draft,
          }));
        } catch (error) {
          const failedJob = await context.importRepository.updateJob(job.id, accountId, {
            status: "failed",
            errorMessage: error instanceof Error ? error.message : "Resume import failed",
            completedAt: new Date().toISOString(),
          });

          logger.error("imports.resume.failed", {
            accountId,
            jobId: failedJob.id,
            error: error instanceof Error ? error.message : "unknown",
          });

          res.status(422).json(importJobResponseSchema.parse({ job: failedJob }));
        }
      } catch (error) {
        next(error);
      }
    },
  );

  router.post(
    "/imports/linkedin-basic",
    requireAuth,
    async (req: Request, res: Response, next: NextFunction) => {
      const parsedRequest = linkedInBasicImportRequestSchema.safeParse(req.body);
      if (!parsedRequest.success) {
        sendValidationError(res, parsedRequest.error);
        return;
      }

      try {
        const authenticatedRequest = req as AuthenticatedRequest;
        const { accountId } = await context.authRepository.bootstrapPersonalAccount(
          authenticatedRequest.auth,
        );
        const currentDraft = await getDraft(accountId, context.draftRepository);
        const mappedDraft = mapLinkedInBasicToDraft(currentDraft.draft, parsedRequest.data);
        const savedDraft = await upsertDraft(accountId, mappedDraft, context.draftRepository);
        const job = await context.importRepository.createJob({
          accountId,
          portfolioId: savedDraft.portfolioId,
          draftId: savedDraft.id,
          sourceType: "linkedin-basic",
          status: "succeeded",
          confidenceSummary: buildImportConfidenceSummary(savedDraft.draft.metadata.sectionStates),
          sectionStates: savedDraft.draft.metadata.sectionStates,
          sectionWarnings: buildImportWarnings(savedDraft.draft.metadata.sectionStates),
          completedAt: new Date().toISOString(),
        });

        logger.info("imports.linkedin-basic.succeeded", {
          accountId,
          jobId: job.id,
          portfolioId: savedDraft.portfolioId,
        });

        res.status(200).json(importDraftResponseSchema.parse({
          job,
          draft: savedDraft.draft,
        }));
      } catch (error) {
        next(error);
      }
    },
  );

  router.get(
    "/imports/jobs/:jobId",
    requireAuth,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const authenticatedRequest = req as AuthenticatedRequest;
        const { accountId } = await context.authRepository.bootstrapPersonalAccount(
          authenticatedRequest.auth,
        );
        const job = await context.importRepository.getJob(accountId, req.params.jobId);

        if (!job) {
          res.status(404).json({ error: "Import job not found" });
          return;
        }

        res.status(200).json(importJobResponseSchema.parse({ job }));
      } catch (error) {
        next(error);
      }
    },
  );

  return router;
}

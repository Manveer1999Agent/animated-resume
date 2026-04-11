import {
  portfolioDraftSchema,
  portfolioSectionPayloadSchemas,
  sectionKeySchema,
  sectionUpdateRequestSchema,
} from "@animated-resume/contracts";
import { Router, type NextFunction, type Request, type Response } from "express";

import type { Logger } from "../lib/logger.js";
import type { AuthRepository, PortfolioDraftRepository } from "../lib/supabase.js";
import { createRequireAuth, type AuthenticatedRequest } from "../middleware/requireAuth.js";
import { getDraft } from "../services/portfolio/getDraft.js";
import { upsertDraft } from "../services/portfolio/upsertDraft.js";
import { updateSection } from "../services/portfolio/updateSection.js";

type PortfolioRouterContext = {
  authRepository: AuthRepository;
  draftRepository: PortfolioDraftRepository;
  logger: Logger;
};

export function createPortfolioRouter(context: PortfolioRouterContext): Router {
  const router = Router();
  const requireAuth = createRequireAuth(context.authRepository);
  const logger = context.logger.child({ scope: "portfolio" });

  router.get(
    "/portfolio/draft",
    requireAuth,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const authenticatedRequest = req as AuthenticatedRequest;
        const { accountId } = await context.authRepository.bootstrapPersonalAccount(
          authenticatedRequest.auth,
        );
        const draft = await getDraft(accountId, context.draftRepository);

        res.status(200).json({
          draft: draft.draft,
        });
      } catch (error) {
        next(error);
      }
    },
  );

  router.put(
    "/portfolio/draft",
    requireAuth,
    async (req: Request, res: Response, next: NextFunction) => {
      const parsedDraft = portfolioDraftSchema.safeParse(req.body);
      if (!parsedDraft.success) {
        res.status(400).json({
          error: "Invalid draft payload",
          details: parsedDraft.error.flatten(),
        });
        return;
      }

      try {
        const authenticatedRequest = req as AuthenticatedRequest;
        const { accountId } = await context.authRepository.bootstrapPersonalAccount(
          authenticatedRequest.auth,
        );
        const existingDraft = await getDraft(accountId, context.draftRepository);
        const savedDraft = await upsertDraft(
          accountId,
          {
            ...parsedDraft.data,
            portfolioId: existingDraft.portfolioId,
          },
          context.draftRepository,
        );

        logger.info("portfolio.draft.upserted", {
          accountId,
          portfolioId: savedDraft.portfolioId,
        });

        res.status(200).json({
          draft: savedDraft.draft,
        });
      } catch (error) {
        next(error);
      }
    },
  );

  router.put(
    "/portfolio/draft/sections/:sectionKey",
    requireAuth,
    async (req: Request, res: Response, next: NextFunction) => {
      const parsedSectionKey = sectionKeySchema.safeParse(req.params.sectionKey);
      if (!parsedSectionKey.success) {
        res.status(400).json({ error: "Invalid section key" });
        return;
      }

      const parsedBody = sectionUpdateRequestSchema.safeParse(req.body);
      if (!parsedBody.success) {
        res.status(400).json({
          error: "Invalid section update payload",
          details: parsedBody.error.flatten(),
        });
        return;
      }

      const payloadSchema = portfolioSectionPayloadSchemas[parsedSectionKey.data];
      const parsedSectionData = payloadSchema.safeParse(parsedBody.data.data);
      if (!parsedSectionData.success) {
        res.status(400).json({
          error: "Invalid section data",
          details: parsedSectionData.error.flatten(),
        });
        return;
      }

      try {
        const authenticatedRequest = req as AuthenticatedRequest;
        const { accountId } = await context.authRepository.bootstrapPersonalAccount(
          authenticatedRequest.auth,
        );
        const savedDraft = await updateSection(
          accountId,
          parsedSectionKey.data,
          parsedSectionData.data,
          parsedBody.data.verified,
          context.draftRepository,
        );

        logger.info("portfolio.section.updated", {
          accountId,
          portfolioId: savedDraft.portfolioId,
          sectionKey: parsedSectionKey.data,
        });

        res.status(200).json({
          draft: savedDraft.draft,
        });
      } catch (error) {
        next(error);
      }
    },
  );

  return router;
}

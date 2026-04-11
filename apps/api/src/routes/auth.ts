import { Router, type NextFunction, type Request, type Response } from "express";

import type { Logger } from "../lib/logger.js";
import type { AuthRepository } from "../lib/supabase.js";
import { createRequireAuth, type AuthenticatedRequest } from "../middleware/requireAuth.js";

type AuthRouterContext = {
  authRepository: AuthRepository;
  logger: Logger;
};

export function createAuthRouter(context: AuthRouterContext): Router {
  const router = Router();
  const requireAuth = createRequireAuth(context.authRepository);
  const logger = context.logger.child({ scope: "auth" });

  router.get(
    "/auth/session",
    requireAuth,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const authenticatedRequest = req as AuthenticatedRequest;
        const bootstrap = await context.authRepository.bootstrapPersonalAccount(
          authenticatedRequest.auth,
        );

        res.status(200).json({
          authenticated: true,
          user: authenticatedRequest.auth,
          account: {
            id: bootstrap.accountId,
          },
        });
      } catch (error) {
        next(error);
      }
    },
  );

  router.post("/auth/logout", (_req, res) => {
    logger.info("auth.logout.requested");
    res.status(204).send();
  });

  return router;
}

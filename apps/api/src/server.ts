import express, { type Express, type NextFunction, type Request, type Response } from "express";

import type { Env } from "./lib/env.js";
import type { Logger } from "./lib/logger.js";
import {
  createSupabaseAuthRepository,
  createSupabaseDraftRepository,
  createSupabaseImportRepository,
  type AuthRepository,
  type ImportJobRepository,
  type PortfolioDraftRepository,
} from "./lib/supabase.js";
import { createAuthRouter } from "./routes/auth.js";
import { createHealthRouter } from "./routes/health.js";
import { createImportRouter } from "./routes/imports.js";
import { createPortfolioRouter } from "./routes/portfolio.js";
import {
  createGeminiResumeParser,
  type GeminiResumeParser,
} from "./services/imports/runGeminiResumeParse.js";

type AppContext = {
  env: Env;
  logger: Logger;
  startedAt?: number;
  authRepository?: AuthRepository;
  draftRepository?: PortfolioDraftRepository;
  importRepository?: ImportJobRepository;
  resumeParser?: GeminiResumeParser;
};

type ServerContext = {
  app: Express;
  env: Env;
  logger: Logger;
};

export function createApp(context: AppContext): Express {
  const app = express();
  const startedAt = context.startedAt ?? Date.now();
  const requestLogger = context.logger.child({ scope: "http" });
  const authRepository = context.authRepository ?? createSupabaseAuthRepository(context.env);
  const draftRepository = context.draftRepository ?? createSupabaseDraftRepository(context.env);
  const importRepository = context.importRepository ?? createSupabaseImportRepository(context.env);
  const resumeParser = context.resumeParser ?? createGeminiResumeParser(context.env);

  app.use(express.json({ limit: "1mb" }));

  app.use((req: Request, _res: Response, next: NextFunction) => {
    requestLogger.info("request.received", { method: req.method, path: req.path });
    next();
  });

  app.use(
    createHealthRouter({
      service: "animated-resume-api",
      environment: context.env.NODE_ENV,
      startedAt,
    }),
  );
  app.use(createAuthRouter({ authRepository, logger: context.logger }));
  app.use(
    createImportRouter({
      authRepository,
      draftRepository,
      importRepository,
      resumeParser,
      logger: context.logger,
    }),
  );
  app.use(
    createPortfolioRouter({
      authRepository,
      draftRepository,
      logger: context.logger,
    }),
  );

  app.use((_req: Request, res: Response) => {
    res.status(404).json({ error: "Not Found" });
  });

  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    context.logger.error("request.failed", { message: err.message, stack: err.stack });
    res.status(500).json({ error: "Internal Server Error" });
  });

  return app;
}

export async function startServer({ app, env, logger }: ServerContext): Promise<void> {
  await new Promise<void>((resolve) => {
    app.listen(env.PORT, () => {
      logger.info("server.started", {
        port: env.PORT,
        environment: env.NODE_ENV,
      });
      resolve();
    });
  });
}

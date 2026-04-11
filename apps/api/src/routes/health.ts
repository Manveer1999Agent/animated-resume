import { Router } from "express";

export type HealthRouteContext = {
  service: string;
  environment: string;
  startedAt: number;
};

export function createHealthRouter(context: HealthRouteContext): Router {
  const router = Router();

  router.get("/health", (_req, res) => {
    res.status(200).json({
      status: "ok",
      service: context.service,
      environment: context.environment,
      uptimeSeconds: Math.floor((Date.now() - context.startedAt) / 1000),
      timestamp: new Date().toISOString(),
    });
  });

  return router;
}

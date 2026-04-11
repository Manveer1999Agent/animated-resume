import type { NextFunction, Request, Response } from "express";

import type { AuthRepository, AuthenticatedUser } from "../lib/supabase.js";

export type AuthenticatedRequest = Request & {
  auth: AuthenticatedUser;
};

function extractBearerToken(authorizationHeader: string | undefined): string | null {
  if (!authorizationHeader) {
    return null;
  }

  const [scheme, token] = authorizationHeader.split(" ");
  if (scheme !== "Bearer" || !token) {
    return null;
  }
  return token;
}

export function createRequireAuth(authRepository: AuthRepository) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token = extractBearerToken(req.header("authorization"));
    if (!token) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    try {
      const user = await authRepository.validateAccessToken(token);
      if (!user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      (req as AuthenticatedRequest).auth = user;
      next();
    } catch (error) {
      next(error);
    }
  };
}

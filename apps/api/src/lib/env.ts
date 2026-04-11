import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "staging", "production"]).default("development"),
  PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
  SUPABASE_URL: z.string().url().default("http://127.0.0.1:54321"),
  SUPABASE_ANON_KEY: z.string().min(1).default("dev-anon-key"),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).default("dev-service-role-key"),
});

export type Env = z.infer<typeof envSchema>;

export function loadEnv(input: NodeJS.ProcessEnv): Env {
  return envSchema.parse(input);
}

import { loadEnv } from "./lib/env.js";
import { createLogger } from "./lib/logger.js";
import { createApp, startServer } from "./server.js";

const env = loadEnv(process.env);
const logger = createLogger(
  { service: "api", environment: env.NODE_ENV },
  env.LOG_LEVEL,
);
const app = createApp({ env, logger });

await startServer({ app, env, logger });

type LogLevel = "debug" | "info" | "warn" | "error";

export type LogRecord = {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
};

type LoggerContext = Record<string, unknown>;

export interface Logger {
  debug: (message: string, context?: LoggerContext) => void;
  info: (message: string, context?: LoggerContext) => void;
  warn: (message: string, context?: LoggerContext) => void;
  error: (message: string, context?: LoggerContext) => void;
  child: (context: LoggerContext) => Logger;
}

const levelPriority: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

function emit(record: LogRecord): void {
  const line = JSON.stringify(record);
  if (record.level === "error" || record.level === "warn") {
    console.error(line);
    return;
  }
  console.log(line);
}

export function createLogger(
  baseContext: LoggerContext = {},
  minLevel: LogLevel = "info",
): Logger {
  const shouldLog = (level: LogLevel) => levelPriority[level] >= levelPriority[minLevel];

  const log = (level: LogLevel, message: string, context?: LoggerContext): void => {
    if (!shouldLog(level)) {
      return;
    }
    const mergedContext = { ...baseContext, ...(context ?? {}) };
    emit({
      timestamp: new Date().toISOString(),
      level,
      message,
      context: mergedContext,
    });
  };

  return {
    debug: (message, context) => log("debug", message, context),
    info: (message, context) => log("info", message, context),
    warn: (message, context) => log("warn", message, context),
    error: (message, context) => log("error", message, context),
    child: (context) => createLogger({ ...baseContext, ...context }, minLevel),
  };
}

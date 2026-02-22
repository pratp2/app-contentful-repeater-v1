import pino from "pino";

/**
 * Application logger (Pino) configured for console-friendly output during development.
 *
 * Uses `pino-pretty` for readable logs in non-production environments.
 */
const logger = pino({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "SYS:standard",
      ignore: "pid,hostname",
      singleLine: false,
    },
  },
});

/**
 * Log an informational message.
 *
 * @param message - Plain text message to log.
 * @param metadata - Optional structured metadata object.
 */
export const logInfo = (
  message: string,
  metadata: Record<string, unknown> = {},
): void => {
  logger.info(metadata, message);
};

/**
 * Log a debug message.
 *
 * @param message - Plain text message to log.
 * @param metadata - Optional structured metadata object.
 */
export const logDebug = (
  message: string,
  metadata: Record<string, unknown> = {},
): void => {
  logger.debug(metadata, message);
};

/**
 * Log a warning message.
 *
 * @param message - Plain text message to log.
 * @param metadata - Optional structured metadata object.
 */
export const logWarn = (
  message: string,
  metadata: Record<string, unknown> = {},
): void => {
  logger.warn(metadata, message);
};

/**
 * Log an error.
 *
 * Accepts an `Error` instance or a metadata object for structured logging.
 *
 * @param message - Plain text message describing the error context.
 * @param errorOrMetadata - Optional Error instance or metadata object.
 */
export const logError = (
  message: string,
  errorOrMetadata: Error | Record<string, unknown> = {},
): void => {
  if (errorOrMetadata instanceof Error) {
    logger.error(
      {
        error: errorOrMetadata.message,
        stack: errorOrMetadata.stack,
      },
      message,
    );
  } else {
    logger.error(errorOrMetadata, message);
  }
};

export default logger;

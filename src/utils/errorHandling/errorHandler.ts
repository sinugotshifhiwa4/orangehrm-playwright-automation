import type { ErrorDetails } from "./internals/types/error-handler.types.js";
import ErrorAnalyzer from "./internals/errorAnalyzer.js";
import { ErrorCacheManager } from "./internals/errorCacheManager.js";
import logger from "../../configuration/logger/winston/loggerManager.js";

export default class ErrorHandler {
  private static globalHandlersRegistered = false;

  /**
   * Registers process-level handlers for unhandledRejection and uncaughtException.
   * Safe to call multiple times — handlers are only registered once.
   *
   * Fix: previously unhandledRejection errors bypassed ErrorAnalyzer entirely
   * and were logged as raw strings with no source, environment, or structure.
   *
   * Call this once at test/process bootstrap (e.g. global setup).
   */
  public static registerGlobalHandlers(): void {
    if (this.globalHandlersRegistered) return;

    process.on("unhandledRejection", (reason: unknown) => {
      this.captureError(reason, "unhandledRejection");
    });

    process.on("uncaughtException", (error: Error) => {
      this.captureError(error, "uncaughtException");
    });

    this.globalHandlersRegistered = true;
  }

  /**
   * Captures an error and logs it in a structured format.
   *
   * Fix: passes environment into shouldLogError so the same error in different
   * environments (qa vs uat) is no longer silently dropped by deduplication.
   *
   * @param {unknown} error - The error to log.
   * @param {string} source - The source of the error.
   * @param {string} [context=""] - The context of the error.
   */
  public static captureError(
    error: unknown,
    source: string,
    context = "",
  ): void {
    if (!error) return;

    const environment = process.env.ENV || "qa";

    if (!ErrorCacheManager.shouldLogError(error, environment)) return;

    try {
      const details = ErrorAnalyzer.createErrorDetails(error, source, context);
      this.logStructuredError(details);
    } catch (loggingError) {
      this.handleLoggingFailure(loggingError, source);
    }
  }

  /**
   * Logs an error and then throws it.
   *
   * Fix: uses a stable reference — the same Error instance is both logged and
   * thrown, preventing the caller's catch block from logging it a second time
   * with a different hash (which would previously cause duplicate log entries).
   *
   * @param {string} source
   * @param {string} message
   */
  public static logAndThrow(source: string, message: string): never {
    const error = new Error(message);
    this.captureError(error, source);
    throw error;
  }

  /**
   * Logs an error message without throwing.
   * Suitable for non-fatal errors where execution should continue.
   *
   * @param {string} source
   * @param {string} message
   */
  public static log(source: string, message: string): void {
    const error = new Error(message);
    this.captureError(error, source);
  }

  /**
   * Logs an assertion/matcher failure at warn level rather than error level.
   * Use this for Playwright/Jest assertion failures that are expected test noise
   * and should be triaged separately from runtime errors.
   *
   * Fix: previously all errors used logger.error, mixing assertion noise with
   * real runtime failures and making triage harder.
   *
   * @param {unknown} error - The matcher/assertion error.
   * @param {string} source - The source context.
   * @param {string} [context=""] - Additional context.
   */
  public static captureAssertionError(
    error: unknown,
    source: string,
    context = "",
  ): void {
    if (!error) return;

    const environment = process.env.ENV || "qa";

    if (!ErrorCacheManager.shouldLogError(error, environment)) return;

    try {
      const details = ErrorAnalyzer.createErrorDetails(error, source, context);
      this.logStructuredWarning(details);
    } catch (loggingError) {
      this.handleLoggingFailure(loggingError, source);
    }
  }

  /**
   * Clears all sanitized messages and logged errors from the cache.
   */
  public static clearErrorCache(): void {
    ErrorCacheManager.clearAll();
  }

  private static logStructuredError(details: ErrorDetails): void {
    try {
      logger.error(JSON.stringify(details, null, 2));
    } catch {
      console.error("Error:", details);
    }
  }

  /**
   * Logs at warn level for assertion/matcher failures.
   */
  private static logStructuredWarning(details: ErrorDetails): void {
    try {
      logger.warn(JSON.stringify(details, null, 2));
    } catch {
      logger.warn("Warning:", details);
    }
  }

  private static handleLoggingFailure(
    loggingError: unknown,
    source: string,
  ): void {
    const fallbackError = {
      source,
      context: "Error Handler Failure",
      message: ErrorAnalyzer.getErrorMessage(loggingError),
      timestamp: new Date().toISOString(),
    };

    try {
      logger.error(fallbackError);
    } catch {
      console.error("ErrorHandler failure:", fallbackError);
    }
  }
}

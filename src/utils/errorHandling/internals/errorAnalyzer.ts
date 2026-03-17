import DataSanitizer from "../../sanitization/dataSanitizer.js";
import { ErrorCacheManager } from "./errorCacheManager.js";
import type {
  ErrorDetails,
  MatcherResult,
  MatcherError,
} from "./types/error-handler.types.js";

export default class ErrorAnalyzer {
  // Fix: expanded from ["message"] to cover common error shape variants.
  // The loop in handleObjectError now has meaningful alternatives to try.
  private static readonly MESSAGE_PROPS = [
    "message",
    "error",
    "detail",
    "reason",
    "description",
  ] as const;

  /**
   * Creates an ErrorDetails object from the given error, source, and context.
   * Stack traces are sanitized separately from messages to preserve Windows paths.
   *
   * @param {unknown} error - The error object to extract details from.
   * @param {string} source - The source of the error.
   * @param {string} [context=""] - The context of the error.
   * @returns {ErrorDetails}
   */
  public static createErrorDetails(
    error: unknown,
    source: string,
    context = "",
  ): ErrorDetails {
    if (!error) {
      return this.createEmptyErrorDetails(source, context);
    }

    const message = this.getErrorMessage(error);
    const additionalDetails = this.isErrorObject(error)
      ? this.extractAllErrorDetails(error)
      : {};

    // additionalDetails already excludes matcherResult via skipKeys,
    // so the explicit delete below is retained only as a safety net.
    const details: ErrorDetails = {
      source,
      context,
      message,
      timestamp: new Date().toISOString(),
      environment: process.env.ENV || "qa",
      ...additionalDetails,
    };

    delete details.matcherResult;

    return details;
  }

  /**
   * Gets the error message from the given error object.
   *
   * @param {unknown} error - The error object to get the message from.
   * @returns {string} The error message.
   */
  public static getErrorMessage(error: unknown): string {
    if (!error) return "";

    if (error instanceof Error) {
      return ErrorCacheManager.getSanitizedMessage(error.message);
    }

    if (typeof error === "string") {
      return ErrorCacheManager.getSanitizedMessage(error);
    }

    if (this.isErrorObject(error)) {
      return this.handleObjectError(error);
    }

    return JSON.stringify(error);
  }

  /**
   * Extracts all available details from an error object.
   *
   * Fix: stack traces are sanitized for ANSI/prefix but NOT passed through
   * SANITIZE_CHARS, preserving backslashes in Windows file paths.
   *
   * @param {Record<string, unknown>} error - The error object.
   * @returns {Record<string, unknown>}
   */
  private static extractAllErrorDetails(
    error: Record<string, unknown>,
  ): Record<string, unknown> {
    const details: Record<string, unknown> = {};

    const stack = this.getStackTrace(error);
    if (stack) details.stack = stack;

    const errorType = this.getErrorType(error);
    if (errorType) details.errorType = errorType;

    if (this.isMatcherError(error)) {
      Object.assign(details, this.extractMatcherDetails(error.matcherResult));
    }

    const sanitizedError = DataSanitizer.sanitizeErrorObject(error);

    const skipKeys = new Set([
      "name",
      "stack",
      "message",
      "constructor",
      "matcherResult",
    ]);

    for (const [key, value] of Object.entries(sanitizedError)) {
      if (!skipKeys.has(key) && !(key in details) && value != null) {
        details[key] = value;
      }
    }

    return details;
  }

  /**
   * Extracts and sanitizes the stack trace from an error object.
   * Uses getSanitizedMessage for ANSI/prefix removal but intentionally avoids
   * SANITIZE_CHARS so that Windows paths (backslashes) are preserved.
   *
   * @param {Record<string, unknown>} error
   * @returns {string | undefined}
   */
  private static getStackTrace(
    error: Record<string, unknown>,
  ): string | undefined {
    if ("stack" in error && typeof error.stack === "string") {
      const sanitized = ErrorCacheManager.getSanitizedMessage(error.stack);
      return sanitized.substring(0, 2000);
    }
    return undefined;
  }

  /**
   * Retrieves the error type or name from the given error object.
   *
   * @param {Record<string, unknown>} error
   * @returns {string | undefined}
   */
  private static getErrorType(
    error: Record<string, unknown>,
  ): string | undefined {
    if (error instanceof Error) {
      return error.constructor.name;
    }

    if (
      "name" in error &&
      typeof error.name === "string" &&
      error.name !== "Error"
    ) {
      return error.name;
    }

    return undefined;
  }

  /**
   * Extracts details from a MatcherResult object (Playwright / Jest).
   *
   * @param {MatcherResult} matcher
   * @returns {Record<string, unknown>}
   */
  private static extractMatcherDetails(
    matcher: MatcherResult,
  ): Record<string, unknown> {
    const details: Record<string, unknown> = {
      pass: matcher.pass,
      matcherName: matcher.name,
    };

    if (matcher.expected !== undefined) details.expected = matcher.expected;
    if (matcher.actual !== undefined) details.received = matcher.actual;
    else if (matcher.received !== undefined)
      details.received = matcher.received;

    if ("log" in matcher && Array.isArray(matcher.log)) {
      details.log = matcher.log;
    }

    return details;
  }

  private static isMatcherError(error: unknown): error is MatcherError {
    return (
      this.hasProperty(error, "matcherResult") &&
      this.isValidMatcherResult(error.matcherResult)
    );
  }

  private static isValidMatcherResult(
    matcherResult: unknown,
  ): matcherResult is MatcherResult {
    return (
      typeof matcherResult === "object" &&
      matcherResult !== null &&
      this.hasProperty(matcherResult, "message") &&
      this.hasProperty(matcherResult, "pass") &&
      typeof matcherResult.message === "string" &&
      typeof matcherResult.pass === "boolean"
    );
  }

  private static hasProperty<T extends PropertyKey>(
    obj: unknown,
    prop: T,
  ): obj is Record<T, unknown> {
    return typeof obj === "object" && obj !== null && prop in obj;
  }

  private static createEmptyErrorDetails(
    source: string,
    context: string,
  ): ErrorDetails {
    return {
      source,
      context,
      message: "Unknown error",
      timestamp: new Date().toISOString(),
      environment: process.env.ENV || "qa",
    };
  }

  private static isErrorObject(
    error: unknown,
  ): error is Record<string, unknown> {
    return error !== null && typeof error === "object";
  }

  /**
   * Attempts to extract a message string from a plain error object by checking
   * MESSAGE_PROPS in order. Falls back to JSON stringification.
   *
   * Fix: MESSAGE_PROPS now has multiple meaningful entries so the loop is useful.
   *
   * @param {Record<string, unknown>} error
   * @returns {string}
   */
  private static handleObjectError(error: Record<string, unknown>): string {
    for (const prop of this.MESSAGE_PROPS) {
      const value = error[prop];
      if (typeof value === "string" && value.trim()) {
        return ErrorCacheManager.getSanitizedMessage(value);
      }
    }

    return this.stringifyErrorObject(error);
  }

  private static stringifyErrorObject(
    errorObj: Record<string, unknown>,
  ): string {
    try {
      const stringified = JSON.stringify(errorObj);
      return stringified === "{}" ? "Empty object" : stringified;
    } catch {
      return "Object with circular references";
    }
  }
}

import ErrorHandler from "../../../../utils/errorHandling/errorHandler.js";

export default class InputSanitizer {
  /**
   * Sanitizes the input by trimming whitespace, after validating it is not empty.
   * @param value - The input value to sanitize.
   * @param method - The name of the calling method for logging context.
   * @returns The trimmed input value.
   */
  public static sanitize(value: string, method: string): string {
    InputSanitizer.validateNotEmpty(value, method);
    return value.trim();
  }

  /**
   * Validates that the given input value is not empty after trimming.
   * @param value - The input value to validate.
   * @param method - The name of the calling method for logging context.
   */
  private static validateNotEmpty(value: string, method: string): void {
    if (!value?.trim()) {
      ErrorHandler.logAndThrow(method, "Input value cannot be empty");
    }
  }
}

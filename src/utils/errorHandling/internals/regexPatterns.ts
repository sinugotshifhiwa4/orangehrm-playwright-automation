export class RegexPatterns {
  /**
   * Matches ANSI escape sequences used for terminal colors and formatting.
   * Pattern: ESC[ followed by optional numeric/semicolon parameters and a letter.
   * @example "\u001b[31m" (red text), "\u001b[0m" (reset)
   */
  public static readonly ANSI_ESCAPE = /\u001b\[[0-9;]*[a-zA-Z]/g;

  /**
   * Matches potentially dangerous characters in user-facing messages only.
   * Excludes backslashes to preserve Windows file paths in stack traces.
   */
  public static readonly SANITIZE_CHARS = /["'<>]/g;

  /**
   * Matches any PascalCase error type prefix at the start of a message.
   * Handles built-ins (TypeError, RangeError, etc.) and custom subclasses.
   * @example "TimeoutError: page timed out" → "page timed out"
   */
  public static readonly ERROR_PREFIX = /^[A-Z]\w*Error: /;
}

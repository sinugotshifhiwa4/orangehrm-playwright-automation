import { RegexPatterns } from "./regexPatterns.js";

export class ErrorCacheManager {
  private static readonly sanitizedMessages = new Map<string, string>();
  private static readonly loggedErrors = new Set<string>();
  private static readonly MAX_CACHE_SIZE = 5000;
  private static readonly EVICTION_RATIO = 0.4;

  /**
   * Sanitizes an error message by removing ANSI escape sequences,
   * special characters, and error prefixes, then trims and truncates to 500 chars.
   * Results are cached to avoid redundant work.
   *
   * Fix: `.substring(0, 500)` is now correctly called on the processed string,
   * not on an empty literal. Cache eviction now applies to sanitizedMessages too.
   *
   * @param {string} originalMessage - The error message to sanitize.
   * @returns {string} - The sanitized error message.
   */
  public static getSanitizedMessage(originalMessage: string): string {
    if (!originalMessage) return "";

    const cached = this.sanitizedMessages.get(originalMessage);
    if (cached !== undefined) return cached;

    const sanitized = originalMessage
      .replace(RegexPatterns.ANSI_ESCAPE, "")
      .replace(RegexPatterns.SANITIZE_CHARS, "")
      .replace(RegexPatterns.ERROR_PREFIX, "")
      .trim()
      .split("\n")[0]
      .substring(0, 500); // Fix: was `"".substring(0, 500)` — never truncated before

    if (this.sanitizedMessages.size >= this.MAX_CACHE_SIZE) {
      this.evictOldSanitizedMessages(); // Fix: sanitizedMessages now also evicts
    }

    this.sanitizedMessages.set(originalMessage, sanitized);
    return sanitized;
  }

  /**
   * Determines whether an error should be logged based on a composite key
   * that includes environment and a timestamp bucket (1-minute windows).
   *
   * Fix: previously hashed only on error content, so the same error in different
   * environments or across retries was silently dropped. Now distinct events log.
   *
   * @param {unknown} error - The error to check.
   * @param {string} [environment=""] - The environment the error occurred in.
   * @returns {boolean} - Whether the error should be logged.
   */
  public static shouldLogError(error: unknown, environment = ""): boolean {
    const errorKey = this.generateErrorKey(error, environment);

    if (this.loggedErrors.has(errorKey)) return false;

    if (this.loggedErrors.size >= this.MAX_CACHE_SIZE) {
      this.evictOldEntries();
    }

    this.loggedErrors.add(errorKey);
    return true;
  }

  /**
   * Evicts the oldest EVICTION_RATIO fraction of entries from loggedErrors.
   */
  private static evictOldEntries(): void {
    const entriesToRemove = Math.floor(
      this.loggedErrors.size * this.EVICTION_RATIO,
    );
    const iterator = this.loggedErrors.values();

    for (let i = 0; i < entriesToRemove; i++) {
      const entry = iterator.next();
      if (!entry.done) {
        this.loggedErrors.delete(entry.value);
      }
    }
  }

  /**
   * Evicts the oldest EVICTION_RATIO fraction of entries from sanitizedMessages.
   * Fix: previously sanitizedMessages had no eviction and could grow unbounded.
   */
  private static evictOldSanitizedMessages(): void {
    const entriesToRemove = Math.floor(
      this.sanitizedMessages.size * this.EVICTION_RATIO,
    );
    const iterator = this.sanitizedMessages.keys();

    for (let i = 0; i < entriesToRemove; i++) {
      const entry = iterator.next();
      if (!entry.done) {
        this.sanitizedMessages.delete(entry.value);
      }
    }
  }

  /**
   * Generates a unique key for an error incorporating its content, environment,
   * and a 1-minute timestamp bucket so repeated errors in different contexts
   * are not collapsed into a single deduplicated entry.
   *
   * @param {unknown} error - The error to generate a key for.
   * @param {string} environment - The environment context.
   * @returns {string} - The unique composite key.
   */
  private static generateErrorKey(error: unknown, environment: string): string {
    const minuteBucket = Math.floor(Date.now() / 60_000).toString();

    let contentKey: string;
    if (error instanceof Error) {
      contentKey = error.stack || `${error.name}:${error.message}`;
    } else {
      contentKey = typeof error === "string" ? error : JSON.stringify(error);
    }

    return this.hashString(`${environment}:${minuteBucket}:${contentKey}`);
  }

  /**
   * Hashes a string to a 32-bit integer using a djb2-style algorithm.
   * @param {string} str - The string to hash.
   * @returns {string} - The hashed string representation.
   */
  private static hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash + str.charCodeAt(i)) & 0xffffffff;
    }
    return hash.toString();
  }

  /**
   * Clears all sanitized messages and logged errors from the cache.
   */
  public static clearAll(): void {
    this.sanitizedMessages.clear();
    this.loggedErrors.clear();
  }
}

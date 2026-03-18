import EnvironmentDetector from "../environment/detector/environmentDetector.js";

export default class TimeoutManager {
  // Default multiplier for CI environments
  private static CI_MULTIPLIER = 2;

  /**
   * Returns a timeout value in milliseconds, adjusted for CI environments.
   * If running in a CI environment, the timeout will be multiplied by the provided ciMultiplier.
   * @param {number} timeoutInMs - The timeout value in milliseconds.
   * @param {number} [ciMultiplier=TimeoutManager.CI_MULTIPLIED] - The multiplier for CI environments.
   * @returns {number} - The adjusted timeout value in milliseconds.
   */
  public static timeout(
    timeoutInMs: number,
    ciMultiplier: number = TimeoutManager.CI_MULTIPLIER,
  ): number {
    return EnvironmentDetector.isCI()
      ? timeoutInMs * ciMultiplier
      : timeoutInMs;
  }

  /**
   * Scales a numeric value in CI environments.
   * Useful for retries, polling attempts, thresholds, etc.
   * @param value - Base numeric value
   * @param multiplier - Multiplier for CI environments
   * @returns Adjusted value
   */
  public static scale(
    value: number,
    multiplier: number = TimeoutManager.CI_MULTIPLIER,
  ): number {
    return EnvironmentDetector.isCI() ? value * multiplier : value;
  }
}

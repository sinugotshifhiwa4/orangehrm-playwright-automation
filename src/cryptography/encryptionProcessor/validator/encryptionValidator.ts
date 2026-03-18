import { AsyncFileManager } from "../../../utils/fileManager/asyncFileManager.js";
import EnvironmentConfigManager from "../../../configuration/environment/manager/environmentConfigManager.js";
import { CRYPTO_CONSTANTS } from "../../types/crypto.config.js";
import ErrorHandler from "../../../utils/errorHandling/errorHandler.js";
import logger from "../../../configuration/logger/winston/loggerManager.js";

export default class EncryptionValidator {
  /**
   * Validates encryption status of specified environment variables
   * @param envVarNames - Array of environment variable names to validate
   * @returns Object mapping variable names to their encryption status
   */
  public static async validateEncryption(
    envVarNames: string[],
  ): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {};
    const envVars = await this.loadEnvironmentVariables(
      EnvironmentConfigManager.getCurrentEnvFilePath(),
    );

    for (const envVarName of envVarNames) {
      const value = envVars[envVarName];

      if (!value) {
        ErrorHandler.log(
          "validateEncryption",
          `Environment variable not found: ${envVarName}`,
        );
        results[envVarName] = false;
      } else {
        results[envVarName] = this.isEncrypted(value);
      }
    }

    logger.info(`Encryption validation results: ${JSON.stringify(results)}`);

    return results;
  }

  /**
   * Checks if all specified variables are encrypted
   */
  public static async areAllEncrypted(envVarNames: string[]): Promise<boolean> {
    const results = await this.validateEncryption(envVarNames);
    return Object.values(results).every((isEncrypted) => isEncrypted);
  }

  /**
   * Gets a list of unencrypted variables
   */
  public static async getUnencryptedVariables(
    envVarNames: string[],
  ): Promise<string[]> {
    const results = await this.validateEncryption(envVarNames);
    return Object.entries(results)
      .filter(([, isEncrypted]) => !isEncrypted)
      .map(([envVarName]) => envVarName);
  }

  /**
   * Detailed validation results — sanitized (no value previews)
   */
  public static async getDetailedValidationResults(
    envVarNames: string[],
  ): Promise<
    {
      envVarName: string;
      isEncrypted: boolean;
      exists: boolean;
    }[]
  > {
    const envVars = await this.loadEnvironmentVariables(
      EnvironmentConfigManager.getCurrentEnvFilePath(),
    );

    return envVarNames.map((envVarName) => {
      const value = envVars[envVarName];
      const exists = Boolean(value);

      return {
        envVarName,
        isEncrypted: exists ? this.isEncrypted(value) : false,
        exists,
      };
    });
  }

  /**
   * Loads env vars from file
   */
  private static async loadEnvironmentVariables(
    filePath: string,
  ): Promise<Record<string, string>> {
    const exists = await AsyncFileManager.doesFileExist(filePath);

    if (!exists) {
      ErrorHandler.logAndThrow(
        "loadEnvironmentVariables",
        `Environment file not found: ${filePath}`,
      );
    }

    const envContent = await AsyncFileManager.readFile(filePath);
    return this.parseEnvironmentContent(envContent);
  }

  /**
   * Parse .env content
   */
  private static parseEnvironmentContent(
    content: string,
  ): Record<string, string> {
    const envVars: Record<string, string> = {};

    content.split("\n").forEach((line) => {
      const trimmedLine = line.trim();

      if (!trimmedLine || trimmedLine.startsWith("#")) return;

      const [key, ...valueParts] = trimmedLine.split("=");

      if (key && valueParts.length > 0) {
        envVars[key.trim()] = valueParts.join("=").trim();
      }
    });

    return envVars;
  }

  /**
   * Validates encrypted format
   */
  private static isEncrypted(value: string): boolean {
    if (!value || typeof value !== "string") {
      return false;
    }

    // Must start with ENC2:
    if (!value.startsWith(CRYPTO_CONSTANTS.FORMAT.PREFIX)) {
      return false;
    }

    const withoutPrefix = value.substring(
      CRYPTO_CONSTANTS.FORMAT.PREFIX.length,
    );
    const parts = withoutPrefix.split(CRYPTO_CONSTANTS.FORMAT.SEPARATOR);

    if (parts.length !== CRYPTO_CONSTANTS.FORMAT.EXPECTED_PARTS) {
      return false;
    }

    const [version, salt, iv, encrypted] = parts;

    if (version !== CRYPTO_CONSTANTS.FORMAT.VERSION) {
      return false;
    }

    // Validate base64 without printing the content
    const base64Regex = /^[A-Za-z0-9+/]+=*$/;
    const partsToCheck = { salt, iv, encrypted };

    for (const [name, part] of Object.entries(partsToCheck)) {
      if (!part || !base64Regex.test(part)) {
        ErrorHandler.log(
          "isEncrypted",
          `Failed: ${name} is invalid or not base64`,
        );
        return false;
      }
    }

    return true;
  }
}

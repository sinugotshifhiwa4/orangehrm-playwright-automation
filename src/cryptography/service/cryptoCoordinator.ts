import { expect } from "@playwright/test";
import SecureKeyGenerator from "../key/secureKeyGenerator.js";
import type { EnvironmentFileEncryptor } from "../encryptionProcessor/environmentFileEncryptor.js";
import EnvironmentConfigManager from "../../configuration/environment/manager/environmentConfigManager.js";
import SecretFileManager from "../../configuration/environment/manager/secretFileManager.js";
import EncryptionValidator from "../encryptionProcessor/validator/encryptionValidator.js";
import ErrorHandler from "../../utils/errorHandling/errorHandler.js";
import logger from "../../configuration/logger/winston/loggerManager.js";

export class CryptoCoordinator {
  private environmentFileEncryptor: EnvironmentFileEncryptor;

  constructor(environmentFileEncryptor: EnvironmentFileEncryptor) {
    this.environmentFileEncryptor = environmentFileEncryptor;
  }

  /**
   * Generates a new secret key and stores it in the environment file.
   * The generated secret key will overwrite any existing key with the same name.
   * @returns A promise resolving to the generated secret key.
   * @throws {Error} If there is an error generating or storing the secret key.
   */
  public async generateAndStoreSecretKey(): Promise<string> {
    try {
      // get the current env key
      const currentEnvKey = EnvironmentConfigManager.getCurrentEnvSecretKey();

      // generate a new secret key
      const result = SecureKeyGenerator.generateBase64SecretKey();

      // validate the secret key
      expect(result).toBeTruthy();

      // store the secret key
      await SecretFileManager.storeEnvironmentKey(currentEnvKey, result, {
        skipIfExists: true,
      });

      // ensure the secret key exists
      await SecretFileManager.ensureSecretKeyExists(currentEnvKey);

      logger.info(
        `Secret key "${currentEnvKey}" generated and stored successfully`,
      );

      return result;
    } catch (error) {
      ErrorHandler.captureError(
        error,
        "generateSecretKey",
        `Failed to generate secret key "${EnvironmentConfigManager.getCurrentEnvSecretKey()}"`,
      );
      throw error;
    }
  }

  public async encryptEnvironmentVariablesAndValidate(
    envVariables?: string[],
  ): Promise<void> {
    if (!envVariables) {
      ErrorHandler.logAndThrow(
        "encryptEnvironmentVariablesAndValidate",
        "envVariables must be provided",
      );
    }

    await this.encryptEnvironmentVariables(envVariables);
    await this.validateEncryptedVariables(envVariables);
  }

  /**
   * Encrypts environment variables specified by `envVariables` using the current secret key.
   * @param {string[]} envVariables - Optional list of environment variables to encrypt.
   * @returns {Promise<void>} - Promise resolved when encryption is complete.
   */
  private async encryptEnvironmentVariables(
    envVariables?: string[],
  ): Promise<void> {
    try {
      await this.environmentFileEncryptor.encryptEnvironmentVariables(
        envVariables,
      );
    } catch (error) {
      ErrorHandler.captureError(
        error,
        "encryptEnvironmentVariables",
        "Failed to encrypt environment variables",
      );
      throw error;
    }
  }

  /**
   * Validates that environment variables are encrypted without exposing values
   * @param envVariables - Variables to validate
   * @returns Promise resolving if valid, throwing if not
   */
  private async validateEncryptedVariables(
    envVariables: string[],
  ): Promise<void> {
    try {
      await EncryptionValidator.validateEncryption(envVariables);
    } catch (error) {
      ErrorHandler.captureError(
        error,
        "validateEncryptedVariables",
        "Encrypted variables validation failed",
      );
      throw error;
    }
  }
}

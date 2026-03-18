import { test } from "../../fixtures/test.fixture.js";
import logger from "../../src/configuration/logger/winston/loggerManager.js";

/**
 * List of environment variables to process
 */
const ENV_VARIABLES_TO_PROCESS = [
  "PORTAL_ADMIN_USERNAME",
  "PORTAL_ADMIN_PASSWORD",
  "PORTAL_GENERAL_USERNAME",
  "PORTAL_GENERAL_PASSWORD",
];

test.describe.serial(
  "Encryption Flow",
  { tag: "@encryption-lifecycle" },
  () => {
    test("should generate secret key", async ({ cryptoCoordinator }) => {
      await cryptoCoordinator.generateAndStoreSecretKey();
      logger.info("Assertion Passed: Secret key generated successfully");
    });

    test("should encrypt and validate environment variables", async ({
      cryptoCoordinator,
    }) => {
      await cryptoCoordinator.encryptEnvironmentVariablesAndValidate(
        ENV_VARIABLES_TO_PROCESS,
      );
      logger.info(
        "Assertion Passed: Environment variables encrypted and validated successfully",
      );
    });
  },
);

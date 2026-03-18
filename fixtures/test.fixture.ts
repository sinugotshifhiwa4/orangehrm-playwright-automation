import { test as baseTest, expect, type TestInfo } from "@playwright/test";
import AuthenticationSkipEvaluator from "../src/configuration/authentication/evaluator/authenticationSkipEvaluator.js";
import AuthenticationFileManager from "../src/configuration/authentication/storage/authenticationFileManager.js";
import { resolveRoleFromProject } from "../src/configuration/roles/projectRoleMap.const.js";

// Cryptography
import { EncryptionVariableResolver } from "../src/cryptography/encryptionProcessor/internal/encryptionVariableResolver.js";
import { VariableEncryptionExecutor } from "../src/cryptography/encryptionProcessor/internal/variableEncryptionExecutor.js";
import { EncryptionOperationLogger } from "../src/cryptography/encryptionProcessor/internal/encryptionOperationLogger.js";
import { EnvironmentFileEncryptor } from "../src/cryptography/encryptionProcessor/environmentFileEncryptor.js";
import { CryptoService } from "../src/cryptography/service/cryptoService.js";
import { CryptoCoordinator } from "../src/cryptography/service/cryptoCoordinator.js";

// Utils

import { TestContext } from "../src/utils/dataStore/manager/testContext.js";
import { RuntimeEnvVariableResolver } from "../src/configuration/environment/runtimeVariableResolver/runtimeEnvVariableResolver.js";

type TestFixtures = {
  testInfo: TestInfo;

  // Cryptography
  encryptionVariableResolver: EncryptionVariableResolver;
  variableEncryptionExecutor: VariableEncryptionExecutor;
  encryptionOperationLogger: EncryptionOperationLogger;
  environmentFileEncryptor: EnvironmentFileEncryptor;
  cryptoService: CryptoService;
  cryptoCoordinator: CryptoCoordinator;

  runtimeResolver: RuntimeEnvVariableResolver;
  testContext: TestContext;
};

export const test = baseTest.extend<TestFixtures>({
  /**
   * Zooms the page to a scale of 0.70 when it loads.
   * Ignores pages that cannot be zoomed.
   */
  page: async ({ page }, use) => {
    page.on("load", async () => {
      try {
        await page.evaluate(() => {
          document.body.style.zoom = "0.70";
        });
      } catch {}
    });

    await use(page);
  },

  testInfo: async ({}, use, testInfo: TestInfo) => {
    await use(testInfo);
  },

  // Cryptography
  encryptionVariableResolver: async ({}, use) => {
    await use(new EncryptionVariableResolver());
  },

  variableEncryptionExecutor: async ({}, use) => {
    await use(new VariableEncryptionExecutor());
  },

  encryptionOperationLogger: async ({}, use) => {
    await use(new EncryptionOperationLogger());
  },

  environmentFileEncryptor: async (
    { encryptionVariableResolver, variableEncryptionExecutor },
    use,
  ) => {
    await use(
      new EnvironmentFileEncryptor(
        encryptionVariableResolver,
        variableEncryptionExecutor,
      ),
    );
  },

  cryptoService: async ({}, use) => {
    await use(new CryptoService());
  },

  cryptoCoordinator: async ({ environmentFileEncryptor }, use) => {
    await use(new CryptoCoordinator(environmentFileEncryptor));
  },

  runtimeResolver: async ({}, use) => {
    await use(new RuntimeEnvVariableResolver());
  },

  testContext: async ({}, use) => {
    await use(new TestContext());
  },

  /**
   * Saves the authentication state to a file for the given role.
   * The file path is determined by the AuthenticationFileManager based on the resolved role.
   *
   * @param testInfo - The test info used to resolve the role and check for skip tags
   * @returns A promise that resolves to true if the authentication state was saved successfully, or undefined if the test is tagged with @skip-auth
   * @throws If the role cannot be resolved or the authentication state cannot be saved
   */
  storageState: async ({}, use, testInfo) => {
    const shouldSkipAuth =
      AuthenticationSkipEvaluator.shouldSkipAuthenticationIfNeeded(testInfo, [
        "@skip-auth",
      ]);

    if (shouldSkipAuth) {
      await use(undefined);
      return;
    }

    const role = resolveRoleFromProject(testInfo);

    const filePath = role
      ? AuthenticationFileManager.getFilePath(role)
      : undefined;

    await use(filePath);
  },
});

export { expect };

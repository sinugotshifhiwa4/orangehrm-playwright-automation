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

import { RuntimeEnvVariableResolver } from "../src/configuration/environment/runtimeVariableResolver/runtimeEnvVariableResolver.js";
import { AuthenticationStatePersister } from "../src/configuration/authentication/state/internal/authenticationStatePersister.js";
import { LoginOrchestrator } from "../src/configuration/authentication/state/loginOrchestrator.js";
import { AuthenticationExecutor } from "../src/configuration/authentication/state/authenticationExecutor.js";
import { TestContext } from "../src/utils/dataStore/manager/testContext.js";

import { LoginPage } from "../src/layers/ui/pages/loginPage/loginPage.js";

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
  authStatePersister: AuthenticationStatePersister;
  loginOrchestrator: LoginOrchestrator;
  authenticationExecutor: AuthenticationExecutor;
  testContext: TestContext;

  loginPage: LoginPage;
};

export const test = baseTest.extend<TestFixtures>({
  /**
   * Page fixture with zoom applied to make elements more visible.
   * Excludes tests marked with @authenticate as they already have the zoom applied.
   * @param {Page} page - Page instance to use.
   * @param {TestInfo} testInfo - Test information.
   * @returns {Promise<void>}
   */
  page: async ({ page }, use, testInfo) => {
    const isAuthTest = testInfo.title.includes("@authenticate");

    if (!isAuthTest) {
      await page.addInitScript(() => {
        document.addEventListener("DOMContentLoaded", () => {
          document.body.style.zoom = "0.70";
        });
      });
    }

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
  authStatePersister: async ({ page }, use) => {
    await use(new AuthenticationStatePersister(page));
  },

  loginOrchestrator: async (
    { page, runtimeResolver, authStatePersister },
    use,
  ) => {
    await use(new LoginOrchestrator(page, runtimeResolver, authStatePersister));
  },
  authenticationExecutor: async (
    { page, runtimeResolver, loginOrchestrator, loginPage },
    use,
  ) => {
    await use(
      new AuthenticationExecutor(
        page,
        runtimeResolver,
        loginOrchestrator,
        loginPage,
      ),
    );
  },

  testContext: async ({}, use) => {
    await use(new TestContext());
  },

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
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

import { test } from "../../../../fixtures/test.fixture.js";
import logger from "../../../../src/configuration/logger/winston/loggerManager.js";

test.describe("Login Test Suite", { tag: ["@regression", "@sanity"] }, () => {
  // Invalid credentials
  const INVALID_USERNAME = "General_User";
  const INVALID_PASSWORD = "Password@123";

  test.beforeEach(async ({ loginOrchestrator }) => {
    await loginOrchestrator.navigateToPortal();
  });

  test("should login successfully with valid credentials", async ({
    sideBarMenu,
  }) => {
    await sideBarMenu.verifySideBarElementsAreVisible();
    logger.info("Verified: Login successful");
  });

  test(
    "should display error for invalid credentials",
    { tag: "@skip-auth" },
    async ({ loginOrchestrator, loginPage }) => {
      await loginOrchestrator.loginWithInvalidCredentials(
        async () => await loginPage.login(INVALID_USERNAME, INVALID_PASSWORD),
        async () => await loginPage.verifyInvalidLoginErrorMessageIsVisible(),
      );
      logger.info("Verified: Login failed");
    },
  );
});

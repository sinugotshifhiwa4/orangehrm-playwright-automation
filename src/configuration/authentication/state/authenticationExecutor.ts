import { type Page } from "@playwright/test";
import { BasePage } from "../../../layers/ui/base/basePage.js";
import type { RuntimeEnvVariableResolver } from "../../environment/runtimeVariableResolver/runtimeEnvVariableResolver.js";
import type { LoginOrchestrator } from "./loginOrchestrator.js";
import type { LoginPage } from "../../../layers/ui/pages/loginPage/loginPage.js";
import type { AuthRole } from "../storage/internal/authentication.constants.js";
import ErrorHandler from "../../../utils/errorHandling/errorHandler.js";
import logger from "../../logger/winston/loggerManager.js";

export class AuthenticationExecutor extends BasePage {
  private resolver: RuntimeEnvVariableResolver;
  private loginOrchestrator: LoginOrchestrator;
  private loginPage: LoginPage;

  constructor(
    page: Page,
    resolver: RuntimeEnvVariableResolver,
    loginOrchestrator: LoginOrchestrator,
    loginPage: LoginPage,
  ) {
    super(page);
    this.resolver = resolver;
    this.loginOrchestrator = loginOrchestrator;
    this.loginPage = loginPage;
  }

  /**
   * Logs into the portal using the provided AuthRole.
   * This function retrieves the username and password for the given role, and then logs into the portal.
   * If the login attempt is successful, an authentication session state is created for the given role.
   * @param role - The AuthRole to log into the portal with.
   * @returns A promise that resolves when the login attempt has been validated, or throws an error if the login attempt fails.
   */
  public async run(role: AuthRole): Promise<void> {
    try {
      const { username, password } =
        await this.resolver.getPortalCredentials(role);

      await this.loginOrchestrator.loginWithValidCredentials(
        async () => await this.loginPage.login(username, password),
        async () =>
          await this.loginPage.verifyInvalidLoginErrorMessageIsNotVisible(),
        role,
      );

      logger.info(`Authentication session state created for role: ${role}`);
    } catch (error) {
      ErrorHandler.captureError(error, "run", "Failed to log into portal");
      throw error;
    }
  }
}

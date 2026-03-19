import type { Page } from "@playwright/test";
import { BasePage } from "../../../layers/ui/base/basePage.js";
import type { RuntimeEnvVariableResolver } from "../../environment/runtimeVariableResolver/runtimeEnvVariableResolver.js";
import type { AuthenticationStatePersister } from "./internal/authenticationStatePersister.js";
import type { AuthRole } from "../storage/internal/authentication.constants.js";
import ErrorHandler from "../../../utils/errorHandling/errorHandler.js";

export class LoginOrchestrator extends BasePage {
  private resolver: RuntimeEnvVariableResolver;
  private authStatePersister: AuthenticationStatePersister;

  constructor(
    page: Page,
    resolver: RuntimeEnvVariableResolver,
    authStatePersister: AuthenticationStatePersister,
  ) {
    super(page);
    this.resolver = resolver;
    this.authStatePersister = authStatePersister;
  }

  /**
   * Navigates to the portal base URL.
   * @returns A promise that resolves when navigation is complete.
   */
  public async navigateToPortal(): Promise<void> {
    const portalUrl = this.resolver.getPortalBaseUrl();
    await this.navigation.navigateToUrl(portalUrl, "navigateToPortal");
  }

  /**
   * Logs into the portal with valid credentials, and then verifies the success.
   * This function will navigate to the portal base URL, perform the login action, verify the success of the login, and then save the authentication state for the given role.
   *
   * @param loginFn - A function that performs the login action.
   * @param validateLoginFn - A function that validates the success of the login attempt.
   * @param role - The role to save the authentication state for.
   * @returns A promise that resolves when the login attempt has been validated.
   * @throws Error if the login attempt fails.
   */
  public async loginWithValidCredentials(
    loginFn: () => Promise<void>,
    validateLoginFn: () => Promise<void>,
    role: AuthRole,
  ): Promise<void> {
    try {
      await this.navigateToPortal();
      await loginFn();
      await validateLoginFn();
      await this.authStatePersister.saveAuthenticationState(role);
    } catch (error) {
      ErrorHandler.captureError(
        error,
        "loginWithValidCredentials",
        "Failed to log into portal",
      );
      throw error;
    }
  }

  /**
   * Logs into the portal with invalid credentials, and then verifies the failure.
   * @param loginFn - A function that performs the login action.
   * @param validateInvalidLoginFn - A function that validates the failure of the login attempt.
   * @returns A promise that resolves when the login attempt has been validated.
   * @throws Error if the login attempt fails.
   */
  public async loginWithInvalidCredentials(
    loginFn: () => Promise<void>,
    validateInvalidLoginFn: () => Promise<void>,
  ): Promise<void> {
    try {
      await this.navigateToPortal();
      await loginFn();
      await validateInvalidLoginFn();
    } catch (error) {
      ErrorHandler.captureError(
        error,
        "loginWithInvalidCredentials",
        "Failed to verify invalid login",
      );
      throw error;
    }
  }
}

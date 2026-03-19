import type { Page, Locator } from "@playwright/test";
import { BasePage } from "../../base/basePage.js";

export class LoginPage extends BasePage {
  public readonly companyLogo: Locator;
  public readonly usernameInput: Locator;
  public readonly passwordInput: Locator;
  public readonly loginButton: Locator;
  private readonly invalidLoginErrorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.companyLogo = page.getByRole("img", { name: "company-branding" });
    this.usernameInput = page.getByRole("textbox", { name: "username" });
    this.passwordInput = page.getByRole("textbox", { name: "password" });
    this.loginButton = page.getByRole("button", { name: "Login" });
    this.invalidLoginErrorMessage = page
      .getByRole("alert")
      .locator("div")
      .filter({ hasText: "Invalid credentials" });
  }

  // Assertions

  /**
   * Verifies that the company logo is visible.
   * This method calls the verification method for the company logo.
   * The method returns a promise that resolves when the verification succeeds, or rejects with an error if it fails.
   * @returns A promise that resolves when the verification succeeds.
   */
  public async verifyCompanyLogoIsVisible(): Promise<void> {
    await this.elementAssertions.verifyElementState(
      this.companyLogo,
      "verifyCompanyLogoIsVisible",
      "visible",
      "company logo",
    );
  }

  /**
   * Verifies that the username input field is visible.
   * @returns A promise that resolves when the verification succeeds, or rejects with an error if it fails.
   */
  public async verifyUsernameInputIsVisible(): Promise<void> {
    await this.elementAssertions.verifyElementState(
      this.usernameInput,
      "verifyUsernameInputIsVisible",
      "visible",
      "username input",
    );
  }

  /**
   * Verifies that the password input field is visible.
   * @returns A promise that resolves when the verification succeeds, or rejects with an error if it fails.
   */
  public async verifyPasswordInputIsVisible(): Promise<void> {
    await this.elementAssertions.verifyElementState(
      this.passwordInput,
      "verifyPasswordInputIsVisible",
      "visible",
      "password input",
    );
  }

  /**
   * Verifies that the login button is visible.
   * @returns A promise that resolves when the verification succeeds, or rejects with an error if it fails.
   */
  public async verifyLoginButtonIsVisible(): Promise<void> {
    await this.elementAssertions.verifyElementState(
      this.loginButton,
      "verifyLoginButtonIsVisible",
      "visible",
      "login button",
    );
  }

  /**
   * Verifies that the invalid login error message is visible.
   * This method calls the verification methods for the element state.
   * The method returns a promise that resolves when the element is visible.
   * @returns Promise that resolves when the element is visible.
   */
  public async verifyInvalidLoginErrorMessageIsVisible(): Promise<void> {
    await this.elementAssertions.verifyElementState(
      this.invalidLoginErrorMessage,
      "verifyInvalidLoginErrorMessageIsVisible",
      "visible",
      "invalid login error message",
    );
  }

  /**
   * Verifies that the invalid login error message is not visible.
   * This method checks if the invalid login error message is hidden.
   * @returns A promise that resolves when the verification succeeds, or rejects with an error if it fails.
   */
  public async verifyInvalidLoginErrorMessageIsNotVisible(): Promise<void> {
    await this.elementAssertions.verifyElementState(
      this.invalidLoginErrorMessage,
      "verifyInvalidLoginErrorMessageIsNotVisible",
      "hidden",
      "invalid login error message",
    );
  }

  // Actions

  /**
   * Fills the username input field with the provided username.
   * @param username The username to fill the input field with.
   * @returns A promise that resolves when the username has been filled successfully.
   */
  public async fillUsernameInput(username: string): Promise<void> {
    await this.element.fillElement(
      this.usernameInput,
      "fillUsernameInput",
      username,
      "username input",
    );
  }

  /**
   * Fills the password input field with the provided password.
   * @param password The password to fill the input field with.
   * @returns A promise that resolves when the password has been filled successfully.
   */
  public async fillPasswordInput(password: string): Promise<void> {
    await this.element.fillElement(
      this.passwordInput,
      "fillPasswordInput",
      password,
      "password input",
    );
  }

  /**
   * Clicks the login button.
   * @returns A promise that resolves when the button has been clicked.
   */
  public async clickLoginButton(): Promise<void> {
    await this.element.clickElement(
      this.loginButton,
      "clickLoginButton",
      "login button",
    );
  }

  // Interactions

  /**
   * Logs into the portal using the provided username and password.
   * This method first fills in the username and password fields, and then clicks the login button.
   * @param username - The username to log in with.
   * @param password - The password to log in with.
   * @returns A promise that resolves when the login attempt has been made.
   */
  public async login(username: string, password: string): Promise<void> {
    await this.fillUsernameInput(username);
    await this.fillPasswordInput(password);
    await this.clickLoginButton();
  }

  /**
   * Verifies that all login elements are visible.
   * This method calls the verification methods for the company logo, username input, password input, and login button.
   * The method returns a promise that resolves when all elements are visible.
   * @returns Promise that resolves when all elements are visible.
   */
  public async verifyLoginElementsAreVisible(): Promise<void> {
    await Promise.all([
      this.verifyCompanyLogoIsVisible(),
      this.verifyUsernameInputIsVisible(),
      this.verifyPasswordInputIsVisible(),
      this.verifyLoginButtonIsVisible(),
    ]);
  }
}

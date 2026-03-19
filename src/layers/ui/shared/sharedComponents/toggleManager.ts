import { type Locator, expect } from "@playwright/test";
import { BasePage } from "../../base/basePage.js";
import type { ToggleState } from "./types/toggle.type.js";
import ErrorHandler from "../../../../utils/errorHandling/errorHandler.js";
import logger from "../../../../configuration/logger/winston/loggerManager.js";

export class ToggleManager extends BasePage {
  /**
   * Sets the toggle state of an element.
   * @param element The Locator of the element to toggle.
   * @param callerMethodName The name of the method that called this function.
   * @param state The desired toggle state of the element.
   * @param options Optional: options for the toggle state action.
   * @param options.waitForState Optional: if true, waits for the toggle state to be confirmed.
   * @param options.force Optional: if true, forces the toggle state to be changed, even if it's already in the desired state.
   * @returns A promise that resolves when the toggle state has been set.
   */
  public async setToggleState(
    element: Locator,
    callerMethodName: string,
    state: ToggleState,
    options?: { waitForState?: boolean; force?: boolean },
  ): Promise<void> {
    const desiredState = state.isChecked;
    const currentState = await this.getToggleState(element, callerMethodName);

    const waitForState = options?.waitForState ?? false;
    const force = options?.force ?? false;

    if (currentState !== desiredState) {
      await this.element.clickElement(
        element,
        callerMethodName,
        `${callerMethodName} Toggle`,
        { force },
      );

      if (waitForState) {
        await this.waitForToggleState(element, callerMethodName, desiredState);
      }
    }

    logger.info(
      `${callerMethodName} Toggle is now ${desiredState ? "enabled" : "disabled"}`,
    );
  }

  /**
   * Retrieves the toggle state of an element.
   * Supports both shadcn components (data-state) and standard ARIA toggles (aria-checked).
   * @param element The element locator.
   * @param callerMethodName The name of the calling method for logging.
   * @returns Boolean indicating the toggle state of the element.
   */
  public async getToggleState(
    element: Locator,
    callerMethodName: string,
  ): Promise<boolean> {
    try {
      const dataState = await element.getAttribute("data-state");
      const isChecked =
        dataState !== null
          ? dataState === "checked"
          : (await element.getAttribute("aria-checked")) === "true";

      logger.debug(`${callerMethodName} Toggle state: ${isChecked}`);
      return isChecked;
    } catch (error) {
      ErrorHandler.captureError(
        error,
        "getToggleState",
        `Failed to get ${callerMethodName} toggle state`,
      );
      throw error;
    }
  }

  /**
   * Waits for the toggle state of an element to match the expected state.
   * Supports both shadcn components (data-state) and standard ARIA toggles (aria-checked).
   *
   * Uses expect.poll so the attribute is re-read on every tick — avoiding the
   * previous bug where data-state was snapshotted once before the DOM settled
   * after the click, causing a false "unchecked" reading on every retry.
   *
   * @param element The Locator of the element to wait for.
   * @param callerMethodName The name of the method that called this function.
   * @param expectedState The expected toggle state of the element.
   * @param timeout Optional: the timeout for the waitForToggleState action.
   * @returns A promise that resolves when the toggle state has been confirmed.
   */
  public async waitForToggleState(
    element: Locator,
    callerMethodName: string,
    expectedState: boolean,
    timeout = 20_000,
  ): Promise<void> {
    try {
      await element.waitFor({ state: "attached", timeout });
      await element.waitFor({ state: "visible", timeout });

      // Re-evaluate the attribute on every poll tick rather than snapshotting
      // it once. Prefers data-state when present, falls back to aria-checked.
      await expect
        .poll(
          async () => {
            const dataState = await element.getAttribute("data-state");
            if (dataState !== null) {
              return dataState === "checked";
            }
            return (await element.getAttribute("aria-checked")) === "true";
          },
          {
            timeout,
            message: `Timed out waiting for ${callerMethodName} toggle to become ${expectedState}`,
          },
        )
        .toBe(expectedState);

      logger.debug(
        `${callerMethodName} toggle confirmed as ${
          expectedState ? "enabled" : "disabled"
        }`,
      );
    } catch (error) {
      ErrorHandler.captureError(
        error,
        "waitForToggleState",
        `Timed out waiting for ${callerMethodName} toggle to become ${expectedState}`,
      );
      throw error;
    }
  }
}

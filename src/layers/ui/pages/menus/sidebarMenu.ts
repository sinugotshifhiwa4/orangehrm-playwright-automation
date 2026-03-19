import { type Page, type Locator, expect } from "@playwright/test";
import { BasePage } from "../../base/basePage.js";
import type { SidebarMenuOptions } from "./types/menu.type.js";
import ErrorHandler from "../../../../utils/errorHandling/errorHandler.js";
import logger from "../../../../configuration/logger/winston/loggerManager.js";

export class SideBarMenu extends BasePage {
  private readonly banner: Locator;
  private readonly searchInput: Locator;
  private readonly adminMenu: Locator;
  private readonly pimMenu: Locator;
  private readonly leaveMenu: Locator;
  private readonly timeMenu: Locator;
  private readonly recruitmentMenu: Locator;
  private readonly myInfoMenu: Locator;
  private readonly performanceMenu: Locator;
  private readonly dashboardMenu: Locator;
  private readonly directoryMenu: Locator;
  private readonly maintenanceMenu: Locator;
  private readonly claimMenu: Locator;
  private readonly buzzMenu: Locator;

  private readonly collapseSideMenuButton: Locator;
  private readonly expandSideMenuButton: Locator;
  private readonly collapsedBrand: Locator;
  private readonly collapsedMenuItems: Locator;
  private readonly expandedMenuItems: Locator;

  constructor(page: Page) {
    super(page);
    this.banner = page.getByRole("link", { name: "client brand banner" });
    this.searchInput = page.getByRole("textbox", { name: "Search" });
    this.adminMenu = page.getByRole("link", { name: "Admin" });
    this.pimMenu = page.getByRole("link", { name: "PIM" });
    this.leaveMenu = page.getByRole("link", { name: "Leave" });
    this.timeMenu = page.getByRole("link", { name: "Time" });
    this.recruitmentMenu = page.getByRole("link", { name: "Recruitment" });
    this.myInfoMenu = page.getByRole("link", { name: "My Info" });
    this.performanceMenu = page.getByRole("link", { name: "Performance" });
    this.dashboardMenu = page.getByRole("link", { name: "Dashboard" });
    this.directoryMenu = page.getByRole("link", { name: "Directory" });
    this.maintenanceMenu = page.getByRole("link", { name: "Maintenance" });
    this.claimMenu = page.getByRole("link", { name: "Claim" });
    this.buzzMenu = page.getByRole("link", { name: "Buzz" });

    this.collapseSideMenuButton = page
      .locator("div.oxd-main-menu-search button")
      .filter({ has: page.locator("i.oxd-icon.bi-chevron-left") });

    this.expandSideMenuButton = page
      .locator("div.oxd-main-menu-search button")
      .filter({ has: page.locator("i.oxd-icon.bi-chevron-right") });

    this.collapsedBrand = page.locator("oxd-brand toggled");
    this.collapsedMenuItems = page.locator("oxd-main-menu-item toggle");
    this.expandedMenuItems = page.locator(
      ".oxd-main-menu a.oxd-main-menu-item span",
    );
  }

  // Assertions

  /**
   * Verifies that all sidebar elements are visible.
   * This method calls the verification methods for the banner, search input, admin menu, PIM menu, leave menu, time menu, recruitment menu, my info menu, performance menu, dashboard menu, directory menu, maintenance menu, claim menu, and buzz menu.
   * The method returns a promise that resolves when all elements are visible.
   * @returns A promise that resolves when all elements are visible.
   */
  public async verifySideBarElementsAreVisible(): Promise<void> {
    await Promise.all([
      this.verifyBannerIsVisible(),
      this.verifySearchInputIsVisible(),
      this.verifyAdminMenuIsVisible(),
      this.verifyPimMenuIsVisible(),
      this.verifyLeaveMenuIsVisible(),
      this.verifyTimeMenuIsVisible(),
      this.verifyRecruitmentMenuIsVisible(),
      this.verifyMyInfoMenuIsVisible(),
      this.verifyPerformanceMenuIsVisible(),
      this.verifyDashboardMenuIsVisible(),
      this.verifyDirectoryMenuIsVisible(),
      this.verifyMaintenanceMenuIsVisible(),
      this.verifyClaimMenuIsVisible(),
      this.verifyBuzzMenuIsVisible(),
    ]);
  }

  /**
   * Verifies that the banner element is visible.
   * @returns A promise that resolves when the verification succeeds, or rejects with an error if it fails.
   */
  public async verifyBannerIsVisible(): Promise<void> {
    await this.elementAssertions.verifyElementState(
      this.banner,
      "verifyBannerIsVisible",
      "visible",
      "banner",
    );
  }

  /**
   * Verifies that the search input element is visible.
   * This method calls the verification method for the element state.
   * The method returns a promise that resolves when the verification succeeds, or rejects with an error if it fails.
   * @returns A promise that resolves when the verification succeeds, or rejects with an error if it fails.
   */
  private async verifySearchInputIsVisible(): Promise<void> {
    await this.elementAssertions.verifyElementState(
      this.searchInput,
      "verifySearchInputIsVisible",
      "visible",
      "search input",
    );
  }

  /**
   * Verifies that the Admin menu element is visible.
   * @returns A promise that resolves when the verification succeeds, or rejects with an error if it fails.
   */
  private async verifyAdminMenuIsVisible(): Promise<void> {
    await this.elementAssertions.verifyElementState(
      this.adminMenu,
      "verifyAdminMenuIsVisible",
      "visible",
      "admin menu",
    );
  }

  /**
   * Verifies that the PIM menu element is visible.
   * @returns A promise that resolves when the verification succeeds, or rejects with an error if it fails.
   */
  private async verifyPimMenuIsVisible(): Promise<void> {
    await this.elementAssertions.verifyElementState(
      this.pimMenu,
      "verifyPimMenuIsVisible",
      "visible",
      "pim menu",
    );
  }

  /**
   * Verifies that the Leave menu element is visible.
   * @returns A promise that resolves when the verification succeeds, or rejects with an error if it fails.
   */
  private async verifyLeaveMenuIsVisible(): Promise<void> {
    await this.elementAssertions.verifyElementState(
      this.leaveMenu,
      "verifyLeaveMenuIsVisible",
      "visible",
      "leave menu",
    );
  }

  /**
   * Verifies that the Time menu element is visible.
   * @returns A promise that resolves when the verification succeeds, or rejects with an error if it fails.
   */
  private async verifyTimeMenuIsVisible(): Promise<void> {
    await this.elementAssertions.verifyElementState(
      this.timeMenu,
      "verifyTimeMenuIsVisible",
      "visible",
      "time menu",
    );
  }

  /**
   * Verifies that the Recruitment menu element is visible.
   * @returns A promise that resolves when the verification succeeds, or rejects with an error if it fails.
   */
  private async verifyRecruitmentMenuIsVisible(): Promise<void> {
    await this.elementAssertions.verifyElementState(
      this.recruitmentMenu,
      "verifyRecruitmentMenuIsVisible",
      "visible",
      "recruitment menu",
    );
  }

  /**
   * Verifies that the My Info menu element is visible.
   * @returns A promise that resolves when the verification succeeds, or rejects with an error if it fails.
   */
  private async verifyMyInfoMenuIsVisible(): Promise<void> {
    await this.elementAssertions.verifyElementState(
      this.myInfoMenu,
      "verifyMyInfoMenuIsVisible",
      "visible",
      "my info menu",
    );
  }

  /**
   * Verifies that the Performance menu element is visible.
   * @returns A promise that resolves when the verification succeeds, or rejects with an error if it fails.
   */
  private async verifyPerformanceMenuIsVisible(): Promise<void> {
    await this.elementAssertions.verifyElementState(
      this.performanceMenu,
      "verifyPerformanceMenuIsVisible",
      "visible",
      "performance menu",
    );
  }

  /**
   * Verifies that the Dashboard menu element is visible.
   * @returns A promise that resolves when the verification succeeds, or rejects with an error if it fails.
   */
  private async verifyDashboardMenuIsVisible(): Promise<void> {
    await this.elementAssertions.verifyElementState(
      this.dashboardMenu,
      "verifyDashboardMenuIsVisible",
      "visible",
      "dashboard menu",
    );
  }

  /**
   * Verifies that the Directory menu element is visible.
   * @returns A promise that resolves when the verification succeeds, or rejects with an error if it fails.
   */
  private async verifyDirectoryMenuIsVisible(): Promise<void> {
    await this.elementAssertions.verifyElementState(
      this.directoryMenu,
      "verifyDirectoryMenuIsVisible",
      "visible",
      "directory menu",
    );
  }

  /**
   * Verifies that the Maintenance menu element is visible.
   * @returns A promise that resolves when the verification succeeds, or rejects with an error if it fails.
   */
  private async verifyMaintenanceMenuIsVisible(): Promise<void> {
    await this.elementAssertions.verifyElementState(
      this.maintenanceMenu,
      "verifyMaintenanceMenuIsVisible",
      "visible",
      "maintenance menu",
    );
  }

  /**
   * Verifies that the Claim menu element is visible.
   * @returns A promise that resolves when the verification succeeds, or rejects with an error if it fails.
   */
  private async verifyClaimMenuIsVisible(): Promise<void> {
    await this.elementAssertions.verifyElementState(
      this.claimMenu,
      "verifyClaimMenuIsVisible",
      "visible",
      "claim menu",
    );
  }

  /**
   * Verifies that the Buzz menu element is visible.
   * @returns A promise that resolves when the verification succeeds, or rejects with an error if it fails.
   */
  private async verifyBuzzMenuIsVisible(): Promise<void> {
    await this.elementAssertions.verifyElementState(
      this.buzzMenu,
      "verifyBuzzMenuIsVisible",
      "visible",
      "buzz menu",
    );
  }

  // Actions

  /**
   * Fills the search input field with the provided keyword.
   * @param keyword The search term to enter into the search input field.
   * @returns A promise that resolves when the search input is filled.
   */
  private async fillSearchInput(keyword: string): Promise<void> {
    await this.element.fillElement(
      this.searchInput,
      "fillSearchInput",
      keyword,
      "search input",
    );
  }

  /**
   * Clicks on the Admin menu item in the sidebar.
   * @returns A promise that resolves when the admin menu is clicked.
   */
  private async clickAdminMenu(): Promise<void> {
    await this.element.clickElement(
      this.adminMenu,
      "clickAdminMenu",
      "admin menu",
    );
  }

  /**
   * Clicks on the PIM menu item in the sidebar.
   * @returns A promise that resolves when the PIM menu is clicked.
   */
  private async clickPimMenu(): Promise<void> {
    await this.element.clickElement(this.pimMenu, "clickPimMenu", "pim menu");
  }

  /**
   * Clicks on the Leave menu item in the sidebar.
   * @returns A promise that resolves when the leave menu is clicked.
   */
  private async clickLeaveMenu(): Promise<void> {
    await this.element.clickElement(
      this.leaveMenu,
      "clickLeaveMenu",
      "leave menu",
    );
  }

  /**
   * Clicks on the Time menu item in the sidebar.
   * @returns A promise that resolves when the time menu is clicked.
   */
  private async clickTimeMenu(): Promise<void> {
    await this.element.clickElement(
      this.timeMenu,
      "clickTimeMenu",
      "time menu",
    );
  }

  /**
   * Clicks on the Recruitment menu item in the sidebar.
   * @returns A promise that resolves when the recruitment menu is clicked.
   */
  private async clickRecruitmentMenu(): Promise<void> {
    await this.element.clickElement(
      this.recruitmentMenu,
      "clickRecruitmentMenu",
      "recruitment menu",
    );
  }

  /**
   * Clicks on the My Info menu item in the sidebar.
   * @returns A promise that resolves when the my info menu is clicked.
   */
  private async clickMyInfoMenu(): Promise<void> {
    await this.element.clickElement(
      this.myInfoMenu,
      "clickMyInfoMenu",
      "my info menu",
    );
  }

  /**
   * Clicks on the Performance menu item in the sidebar.
   * @returns A promise that resolves when the performance menu is clicked.
   */
  private async clickPerformanceMenu(): Promise<void> {
    await this.element.clickElement(
      this.performanceMenu,
      "clickPerformanceMenu",
      "performance menu",
    );
  }

  /**
   * Clicks on the Dashboard menu item in the sidebar.
   * @returns A promise that resolves when the dashboard menu is clicked.
   */
  private async clickDashboardMenu(): Promise<void> {
    await this.element.clickElement(
      this.dashboardMenu,
      "clickDashboardMenu",
      "dashboard menu",
    );
  }

  /**
   * Clicks on the Directory menu item in the sidebar.
   * @returns A promise that resolves when the directory menu is clicked.
   */
  private async clickDirectoryMenu(): Promise<void> {
    await this.element.clickElement(
      this.directoryMenu,
      "clickDirectoryMenu",
      "directory menu",
    );
  }

  /**
   * Clicks on the Maintenance menu item in the sidebar.
   * @returns A promise that resolves when the maintenance menu is clicked.
   */
  private async clickMaintenanceMenu(): Promise<void> {
    await this.element.clickElement(
      this.maintenanceMenu,
      "clickMaintenanceMenu",
      "maintenance menu",
    );
  }

  /**
   * Clicks on the Claim menu item in the sidebar.
   * @returns A promise that resolves when the claim menu is clicked.
   */
  private async clickClaimMenu(): Promise<void> {
    await this.element.clickElement(
      this.claimMenu,
      "clickClaimMenu",
      "claim menu",
    );
  }

  /**
   * Clicks on the Buzz menu item in the sidebar.
   * @returns A promise that resolves when the buzz menu is clicked.
   */
  private async clickBuzzMenu(): Promise<void> {
    await this.element.clickElement(
      this.buzzMenu,
      "clickBuzzMenu",
      "buzz menu",
    );
  }

  // Expand and collapse side menu

  /**
   * Verifies that only logos are visible when the sidebar is collapsed.
   * This method performs the complete workflow: verifies collapse button visibility,
   * collapses the sidebar, verifies the collapsed logo state, and checks menu items based on state.
   * @param sideBarMenuState The state configuration for the sidebar menu.
   * @returns A promise that resolves when all verifications are complete.
   */
  public async verifyOnlyLogosAreVisibleWhenSidebarIsCollapsed(
    sideBarMenuState: SidebarMenuOptions,
  ): Promise<void> {
    await this.verifyCollapseSideMenuButtonIsVisible();
    await this.clickCollapseSideMenuButton();
    await this.verifyCollapsedLogoHiddenWhenSidebarExpanded();
    await this.verifySideMenuItemsBasedOnState(sideBarMenuState);
  }

  /**
   * Verifies the sidebar state based on the provided configuration.
   * This method performs the complete workflow to verify sidebar state: verifies collapse button,
   * collapses the sidebar, verifies logo visibility, and checks menu items.
   * @param sideBarMenuState The state configuration for the sidebar menu.
   * @returns A promise that resolves when all state verifications are complete.
   */
  public async verifySidebarState(
    sideBarMenuState: SidebarMenuOptions,
  ): Promise<void> {
    await this.verifyCollapseSideMenuButtonIsVisible();
    await this.clickCollapseSideMenuButton();
    await this.verifyCollapsedLogoHiddenWhenSidebarExpanded();
    await this.verifySideMenuItemsBasedOnState(sideBarMenuState);
  }

  /**
   * Verifies that the collapse side menu button is visible.
   * @returns A promise that resolves when the verification succeeds, or rejects with an error if it fails.
   */
  private async verifyCollapseSideMenuButtonIsVisible(): Promise<void> {
    await this.elementAssertions.verifyElementState(
      this.collapseSideMenuButton,
      "verifyCollapseSideMenuButtonIsVisible",
      "visible",
      "collapse side menu button",
    );
  }

  /**
   * Verifies that the expand side menu button is visible.
   * @returns A promise that resolves when the verification succeeds, or rejects with an error if it fails.
   */
  private async verifyExpandSideMenuButtonIsVisible(): Promise<void> {
    await this.elementAssertions.verifyElementState(
      this.expandSideMenuButton,
      "verifyExpandSideMenuButtonIsVisible",
      "visible",
      "expand side menu button",
    );
  }

  /**
   * Clicks the collapse side menu button to collapse the sidebar.
   * @returns A promise that resolves when the button is clicked.
   */
  private async clickCollapseSideMenuButton(): Promise<void> {
    await this.element.clickElement(
      this.collapseSideMenuButton,
      "clickCollapseSideMenuButton",
      "collapse side menu button",
    );
  }

  /**
   * Clicks the expand side menu button to expand the sidebar.
   * @returns A promise that resolves when the button is clicked.
   */
  private async clickExpandSideMenuButton(): Promise<void> {
    await this.element.clickElement(
      this.expandSideMenuButton,
      "clickExpandSideMenuButton",
      "expand side menu button",
    );
  }

  /**
   * Verifies that the collapsed sidebar shows only the logo.
   * @returns A promise that resolves when the verification succeeds, or rejects with an error if it fails.
   */
  private async verifyCollapsedSidebarShowsOnlyLogo(): Promise<void> {
    await this.elementAssertions.verifyElementState(
      this.collapsedBrand,
      "verifyCollapsedSidebarShowsOnlyLogo",
      "visible",
      "brand logo",
    );
  }

  /**
   * Verifies that the collapsed logo is hidden when the sidebar is expanded.
   * @returns A promise that resolves when the verification succeeds, or rejects with an error if it fails.
   */
  private async verifyCollapsedLogoHiddenWhenSidebarExpanded(): Promise<void> {
    await this.elementAssertions.verifyElementState(
      this.collapsedBrand,
      "verifyCollapsedLogoHiddenWhenSidebarExpanded",
      "hidden",
      "collapsed brand logo",
    );
  }

  /**
   * Verifies the side menu items based on the provided state configuration.
   * Routes to either expanded or collapsed menu verification based on the state.
   * @param sideBarMenuState The state configuration for the sidebar menu.
   * @returns A promise that resolves when the verification is complete.
   * @throws Error if sidebar menu state is not provided.
   */
  public async verifySideMenuItemsBasedOnState(
    sideBarMenuState: SidebarMenuOptions,
  ): Promise<void> {
    if (!sideBarMenuState) {
      ErrorHandler.logAndThrow(
        "verifySideMenuItemsBasedOnState",
        "Sidebar menu state must be provided",
      );
    }

    if (sideBarMenuState.state === "expanded") {
      await this.verifyExpandedSideMenu();
    } else if (sideBarMenuState.state === "collapsed") {
      await this.verifyCollapsedSideMenu();
    }
  }

  /**
   * Verifies that the sidebar is in expanded state with all menu item labels visible.
   * Waits for expanded menu items, retrieves their text content, validates the text,
   * and asserts the correct number of menu items (12).
   * @returns A promise that resolves when all expanded menu verifications are complete.
   */
  private async verifyExpandedSideMenu(): Promise<void> {
    await this.expandedMenuItems.first().waitFor({ state: "visible" });
    const expandedItems = await this.expandedMenuItems.all();
    const expandedItemTexts = await this.getMenuItemsText(expandedItems);

    this.assertMenuItemsHaveValidText(expandedItemTexts);
    this.assertMenuItemCount(expandedItemTexts.length, 12);

    logger.info(
      `Verified: Sidebar expanded — ${expandedItemTexts.length} labels for menu items present.`,
    );
  }

  /**
   * Verifies that the sidebar is in collapsed state with only icons visible and no text labels.
   * Performs the collapse action, waits for the collapse button to hide,
   * then verifies icons are visible and no text labels are present.
   * @returns A promise that resolves when all collapsed menu verifications are complete.
   */
  private async verifyCollapsedSideMenu(): Promise<void> {
    await this.verifyCollapseSideMenuButtonIsVisible();
    await this.clickCollapseSideMenuButton();
    await this.collapseSideMenuButton.waitFor({ state: "hidden" });

    await this.verifyCollapsedMenuIcons();
    await this.verifyNoTextLabelsInCollapsedMenu();
  }

  /**
   * Verifies that all collapsed menu item icons are visible.
   * Iterates through all collapsed menu item icons and verifies each one is visible.
   * @returns A promise that resolves when all icon verifications are complete.
   */
  private async verifyCollapsedMenuIcons(): Promise<void> {
    const collapsedIcons = await this.collapsedMenuItems.all();

    for (const icon of collapsedIcons) {
      await this.elementAssertions.verifyElementState(
        icon,
        "verifyCollapsedMenuIcons",
        "visible",
        "collapsed menu item icon",
      );
    }
  }

  /**
   * Verifies that no text labels are present in the collapsed menu.
   * Retrieves all text labels from collapsed menu items, validates they are empty,
   * and asserts that the count of non-empty labels is zero.
   * @returns A promise that resolves when the verification is complete.
   */
  private async verifyNoTextLabelsInCollapsedMenu(): Promise<void> {
    const collapsedLabels = await this.collapsedMenuItems
      .locator("span.oxd-main-menu-item--name")
      .all();

    const collapsedTexts = await this.getMenuItemsText(collapsedLabels);

    this.assertMenuItemsHaveValidText(collapsedTexts);

    for (const text of collapsedTexts) {
      expect(text.trim()).toBe("");
    }

    expect(collapsedTexts.length).toBe(0);
    logger.info(
      `Verified: Sidebar collapsed — only icons visible; ${collapsedTexts.length} labels for menu items present.`,
    );
  }

  /**
   * Asserts that all menu items have valid text labels.
   * Iterates through the provided array of text labels and checks that each label is a valid string and not empty.
   * @param texts An array of text labels to check.
   */
  private assertMenuItemsHaveValidText(texts: string[]): void {
    for (const text of texts) {
      expect(typeof text).toBe("string");
      expect(text.trim()).not.toBe("");
    }
  }

  /**
   * Asserts that the actual number of menu items matches the expected number.
   * @param actual The actual number of menu items.
   * @param expected The expected number of menu items.
   */
  private assertMenuItemCount(actual: number, expected: number): void {
    expect(actual).toBe(expected);
  }

  /**
   * Retrieves text content from each element in a locator array.
   * Iterates through all provided locators and extracts their text content,
   * trimming whitespace from each text value.
   * @param locator The array of Locators to retrieve text content from.
   * @returns A promise that resolves with an array of trimmed text content from all matching elements.
   */
  private async getMenuItemsText(locator: Locator[]): Promise<string[]> {
    const menuItemTexts: string[] = [];

    for (let i = 0; i < locator.length; i++) {
      const text = await this.elementAssertions.getElementProperty<string>(
        locator[i],
        "getMenuItemsText",
        "textContent",
        `menu item: ${i + 1}`,
        undefined,
      );
      menuItemTexts.push(text.trim());
    }

    return menuItemTexts;
  }
}

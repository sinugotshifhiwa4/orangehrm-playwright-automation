import { defineConfig, devices } from "@playwright/test";
import { TIMEOUTS } from "./src/configuration/timeouts/timeout.config.js";
import EnvironmentDetector from "./src/configuration/environment/detector/environmentDetector.js";
import { shouldSkipBrowserInit } from "./src/utils/shared/skipBrowserInitFlag.js";
import WorkerAllocator from "./src/configuration/execution/workerAllocator.js";

// check if running in CI
const isCI = EnvironmentDetector.isCI();

// check if browser init should be skipped
const skipBrowserInit = shouldSkipBrowserInit();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  timeout: TIMEOUTS.test,
  expect: {
    timeout: TIMEOUTS.expect,
  },
  testDir: "./tests",
  globalSetup: "./src/configuration/environment/global/globalSetup.ts",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: WorkerAllocator.getOptimalWorkerCount("10-percent"),
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: isCI
    ? [["blob", { outputDir: "blob-report", alwaysReport: true }]]
    : [["html", { open: "always" }], ["line"]],

  grep:
    typeof process.env.PLAYWRIGHT_GREP === "string"
      ? new RegExp(`(^|\\s)${process.env.PLAYWRIGHT_GREP}(\\s|$)`)
      : process.env.PLAYWRIGHT_GREP || /.*/,

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    trace: "retain-on-failure",
    video: "retain-on-failure",
    screenshot: "on",
    headless: isCI ? true : false,
  },

  /* Configure projects for major browsers */
  projects: [
    ...(!skipBrowserInit
      ? [
          {
            name: "setup-admin-user",
            use: { ...devices["Desktop Chrome"] },
            testMatch: /.*\.admin-user\.setup\.ts/,
          },
          {
            name: "setup-general-user",
            use: { ...devices["Desktop Chrome"] },
            testMatch: /.*\.general-user\.setup\.ts/,
          },
        ]
      : []),
    {
      name: "admin-user",
      dependencies: skipBrowserInit ? [] : ["setup-admin-user"],
    },

    {
      name: "general-user",
      dependencies: skipBrowserInit ? [] : ["setup-general-user"],
    },
  ],
});

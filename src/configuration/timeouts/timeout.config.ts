import TimeoutManager from "./timeoutManager.js";

/**
 * TIMEOUTS
 *
 * Centralized timeout definitions for the project.
 *
 * - TEST_TIMEOUT: Maximum duration for a single test.
 * - EXPECT_TIMEOUT: Maximum duration for assertions.
 * - API_TIMEOUT: Common API timeouts for different operations like standard requests,
 *   uploads, downloads, health checks, and connection attempts.
 * - DB_TIMEOUT: Database-related timeouts for queries, transactions, migrations,
 *   connections, requests, pool acquisition, and idle connections.
 *
 * All timeouts are defined in milliseconds and wrapped using TimeoutManager.timeout
 * for consistent handling across tests and runtime operations.
 */
export const TIMEOUTS = {
  test: TimeoutManager.timeout(120_000),
  expect: TimeoutManager.timeout(50_000),

  api: {
    standard: TimeoutManager.timeout(10_000),
    upload: TimeoutManager.timeout(60_000),
    download: TimeoutManager.timeout(90_000),
    healthCheck: TimeoutManager.timeout(3_000),
    connection: TimeoutManager.timeout(8_000),
  },

  db: {
    query: TimeoutManager.timeout(15_000),
    transaction: TimeoutManager.timeout(30_000),
    migration: TimeoutManager.timeout(120_000),
    connection: TimeoutManager.timeout(10_000),
    request: TimeoutManager.timeout(10_000),
    poolAcquisition: TimeoutManager.timeout(10_000),
    idle: TimeoutManager.timeout(10_000),
  },
} as const;

/**
 * Exports the TIMEOUTS object for use in other modules.
 */
export const {
  test: TEST_TIMEOUT,
  expect: EXPECT_TIMEOUT,
  api: API_TIMEOUT,
  db: DB_TIMEOUT,
} = TIMEOUTS;

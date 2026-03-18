# Execution Timing System

## Overview

The **Execution Timing System** provides centralized, environment-aware control over timeouts and execution-related thresholds across the framework.

It ensures:

- ⏱️ Consistent timeout management
- 🌍 Automatic adjustment for CI environments
- 🔁 Reusable timing configurations across modules
- ⚡ Improved stability in slower environments (CI/CD)

---

## Core Idea

> **All time-based values are centrally defined and automatically scaled based on the execution environment.**

This prevents flaky tests and avoids hardcoded timeout values scattered across the codebase.

---

## Architecture

### Components

| Component             | Responsibility                               |
| --------------------- | -------------------------------------------- |
| `TimeoutManager`      | Applies environment-based scaling logic      |
| `TIMEOUTS`            | Centralized timeout definitions              |
| `EnvironmentDetector` | Determines runtime environment (CI vs local) |

---

## Execution Flow

### 1. Define Base Timeout

```ts
TimeoutManager.timeout(10_000);
```

---

### 2. Detect Environment

```ts
EnvironmentDetector.isCI();
```

---

### 3. Apply Scaling

- Local → unchanged
- CI → multiplied by defined factor

```ts
CI_MULTIPLIER = 2;
```

---

### 4. Use in System

```ts
timeout: TIMEOUTS.test,
expect: {
  timeout: TIMEOUTS.expect,
}
```

---

## Usage

### Standard Timeout

```ts
const timeout = TimeoutManager.timeout(5000);
```

---

### Scaling Non-Timeout Values

```ts
const retries = TimeoutManager.scale(3);
```

- Useful for:
  - retries
  - polling intervals
  - thresholds

---

### Centralized Constants

```ts
TIMEOUTS.api.standard;
TIMEOUTS.db.query;
```

---

## Timeout Categories

### 🧪 Test

- `test` → Full test execution limit
- `expect` → Assertion timeout

---

### 🌐 API

- `standard` → Regular requests
- `upload` → File uploads
- `download` → File downloads
- `healthCheck` → Service health checks
- `connection` → API connection setup

---

### 🗄️ Database

- `query` → Standard queries
- `transaction` → DB transactions
- `migration` → Schema migrations
- `connection` → DB connection
- `request` → Request execution
- `poolAcquisition` → Connection pool
- `idle` → Idle timeout

---

## Environment Behavior

| Environment | Behavior                 |
| ----------- | ------------------------ |
| Local       | Uses base timeout values |
| CI/CD       | Applies multiplier (×2)  |

---

## Design Principles

- **Centralization** → All timeouts defined in one place
- **Environment Awareness** → Automatic CI scaling
- **Consistency** → Same timeout strategy across modules
- **Flexibility** → Supports both timeouts and generic scaling
- **Stability First** → Reduces flaky failures in CI

---

## Best Practices

- ✅ Always use `TIMEOUTS` instead of hardcoding values
- ✅ Use `TimeoutManager.scale()` for retries/polling
- ✅ Keep base values realistic (not overly large)
- ✅ Adjust CI multiplier if pipeline performance changes

---

## Anti-Patterns (Avoid)

- ❌ Hardcoding timeouts in tests or services
- ❌ Using different timeout strategies across modules
- ❌ Ignoring CI performance differences
- ❌ Over-inflating timeouts instead of fixing root issues

---

## When to Use

Use the **Execution Timing System** when:

- Defining timeouts for tests, APIs, or DB operations
- Handling retries or polling logic
- Running tests in CI/CD environments

---

## Integration with Other Systems

- 🔗 Works with **Test Framework (Playwright)** for test and assertion timeouts
- 🔗 Uses **Environment Detection System** to determine CI behavior
- 🔗 Supports **File Management & API Systems** for consistent timing

---

## Example (Playwright Configuration)

```ts
export default defineConfig({
  timeout: TIMEOUTS.test,
  expect: {
    timeout: TIMEOUTS.expect,
  },
});
```

---

## Summary

The **Execution Timing System** provides:

- Centralized and consistent timeout management
- Automatic environment-based scaling
- Improved reliability in CI environments
- A clean and reusable timing strategy across the framework

It ensures stable, predictable, and maintainable execution behavior across all environments.

---

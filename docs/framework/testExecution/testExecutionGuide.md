# Test Execution System

## Overview

The **Test Execution System** provides a flexible and scalable way to run Playwright tests using:

- 🧩 Layer-based execution (UI, API, DB)
- 👥 Role-based test isolation (admin, general users)
- 🔐 Integrated role-based authentication system
- 🏷️ Tag-driven test filtering (sanity, regression, etc.)
- ⚙️ Dynamic runtime configuration via environment variables

---

## Core Idea

> **Tests should be executed by intent, not by file paths.**

The system abstracts:

- Test location (layer)
- User role (project)
- Test scope (tags)
- Authentication handling

into a **single command interface**.

---

## Architecture

### Components

| Component         | Responsibility                                  |
| ----------------- | ----------------------------------------------- |
| `test-layers.mjs` | Resolves layer + role and executes Playwright   |
| NPM Scripts       | Provide simplified commands for each test type  |
| Playwright Config | Handles project mapping and tag filtering       |
| Fixtures          | Manage authentication and storage state         |
| Tag System        | Controls test selection and behavior            |
| Role-Based Auth   | Handles login, storage state, and session reuse |

---

## Execution Flow

### 1. Test run starts

User executes a command:

```bash
npx cross-env ENV=dev USER_ROLE=admin-user npm run test:ui
```

---

### 2. Script Resolution

```js
const role = process.env.USER_ROLE || "general-user";
const layer = process.env.TEST_LAYER || "ui";
```

- Determines **user role**
- Determines **test layer**

---

### 3. Layer Mapping

```js
const layerPaths = {
  ui: "tests/layers/ui",
  api: "tests/layers/api",
  db: "tests/layers/db",
};
```

---

### 4. Playwright Execution

```js
execSync(`npx playwright test ${path} --project=${role}`);
```

---

### 5. Authentication Injection

Authentication is automatically handled via fixtures.

- Role is resolved from the Playwright project
- Storage state is injected dynamically
- Tests run already authenticated

📄 Full details: [Role-Based Authentication Execution](../configuration/roleBasedAuth/roleBasedAuthExecution.md)

---

### 6. Automatic Pre-Test Validation

Before any test runs, the framework automatically executes validation checks via `pretest:*` scripts.

This includes:

- TypeScript type checking
- ESLint validation

No manual action is required.

---

## Usage

### Run UI Tests

```bash
npx cross-env ENV=dev USER_ROLE=admin-user npm run test:ui
```

---

### Run API Tests

```bash
npx cross-env ENV=dev USER_ROLE=general-user npm run test:api
```

---

### Run DB Tests

```bash
npx cross-env ENV=dev USER_ROLE=general-user npm run test:db
```

---

## Tag-Based Execution

### Example: Run Sanity Tests

```bash
npx cross-env PLAYWRIGHT_GREP=@sanity ENV=dev USER_ROLE=admin-user npm run test:ui
```

---

### Example: Run Regression Tests

```bash
npx cross-env PLAYWRIGHT_GREP=@regression ENV=dev USER_ROLE=admin-user npm run test:ui
```

---

## Tag System

### Definition in Tests

```ts
test.describe("Login Suite", { tag: ["@regression", "@sanity"] }, () => {
```

---

### Single Test Tag

```ts
test("should skip auth", { tag: "@skip-auth" }, async () => {
```

---

### Playwright Configuration

```ts
grep:
  typeof process.env.PLAYWRIGHT_GREP === "string"
    ? new RegExp(`(^|\\s)${process.env.PLAYWRIGHT_GREP}(\\s|$)`)
    : process.env.PLAYWRIGHT_GREP || /.*/,
```

---

### Behavior

| Tag           | Purpose                      |
| ------------- | ---------------------------- |
| `@sanity`     | Critical test coverage       |
| `@regression` | Full regression suite        |
| `@skip-auth`  | Skips authentication fixture |

---

## Authentication Strategy

Authentication is fully automated and role-based.

Instead of handling login manually in tests:

- Setup tests authenticate once per role
- Storage state is persisted
- Fixtures inject the session automatically

📄 Full details: [Role-Based Authentication Execution](../configuration/roleBasedAuth/roleBasedAuthExecution.md)

---

## Authentication Setup

Run setup explicitly when needed:

### Admin User

```bash
npm run test:auth:admin
```

---

### General User

```bash
npm run test:auth:general
```

---

## Environment Strategy

### Runtime Variables

| Variable          | Purpose              |
| ----------------- | -------------------- |
| `ENV`             | Target environment   |
| `USER_ROLE`       | Playwright project   |
| `TEST_LAYER`      | Test layer selection |
| `PLAYWRIGHT_GREP` | Tag filtering        |

---

## Available Scripts

| Script        | Description           |
| ------------- | --------------------- |
| `test:ui`     | Run UI tests          |
| `test:api`    | Run API tests         |
| `test:db`     | Run DB tests          |
| `test:failed` | Run last failed tests |
| `ui`          | Open Playwright UI    |
| `debug`       | Debug tests           |
| `report`      | View HTML report      |

---

## Design Principles

- **Execution by Intent** → Layer + role + tags
- **Seamless Auth Integration** → No manual login in tests
- **Separation of Concerns** → UI/API/DB isolation
- **Reusability** → One script for all layers
- **Scalability** → Easily extend roles and layers
- **Consistency** → Same commands across environments

---

## Anti-Patterns (Avoid)

- ❌ Running tests without proper role selection
- ❌ Bypassing role-based authentication system
- ❌ Mixing layers in a single run
- ❌ Hardcoding test paths
- ❌ Manually handling authentication
- ❌ Ignoring tag-based execution

---

## Summary

The **Test Execution System** provides:

- 🧩 Clean layer-based test organization
- 👥 Robust role-based execution
- 🔐 Fully automated authentication via fixtures
- 🏷️ Flexible tag filtering
- ⚙️ Centralized and scalable test orchestration

👉 For authentication internals and execution flow, refer to:
📄 Full details: [Role-Based Authentication Execution](../configuration/roleBasedAuth/roleBasedAuthExecution.md)

---

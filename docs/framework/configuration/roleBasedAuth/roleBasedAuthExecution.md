# Role-Based Authentication Execution

## Overview

The framework supports **role-based authentication setup** using Playwright projects.

Each role (e.g. `ADMIN`, `GENERAL`) has:

- A **dedicated setup test**
- A **mapped Playwright project**
- A **persisted authentication state file**

This allows tests to run with pre-authenticated sessions without repeating login steps.

---

## Core Idea

> **Authentication is executed once per role and reused across tests.**

- Setup projects perform login
- Storage state is saved per role
- Dependent projects reuse that state automatically via fixture

---

## Architecture

### Components

| Component                | Responsibility                           |
| ------------------------ | ---------------------------------------- |
| `PROJECT_ROLE_MAP`       | Maps Playwright project → AuthRole       |
| `resolveRoleFromProject` | Resolves role dynamically at runtime     |
| Setup Tests              | Perform login and save auth state        |
| Playwright Projects      | Control execution order via dependencies |
| `storageState` Fixture   | Injects correct auth state into tests    |
| `.auth/*.json`           | Persisted storage state per role         |

---

## Role Resolution

Role is resolved dynamically using the project name:

```ts
const PROJECT_ROLE_MAP: Record<string, AuthRole> = {
  "setup-admin-user": "ADMIN",
  "setup-general-user": "GENERAL",
  "admin-user": "ADMIN",
  "general-user": "GENERAL",
};
```

### Resolver

```ts
resolveRoleFromProject(testInfo);
```

### Behavior

- Reads `testInfo.project.name`
- Maps it to a role (`ADMIN`, `GENERAL`)
- Throws error if mapping is missing

---

## Playwright Project Configuration

```ts
projects: [
  {
    name: "setup-admin-user",
    testMatch: /.*\.admin-user\.setup\.ts/,
  },
  {
    name: "setup-general-user",
    testMatch: /.*\.general-user\.setup\.ts/,
  },
  {
    name: "admin-user",
    dependencies: ["setup-admin-user"],
  },
  {
    name: "general-user",
    dependencies: ["setup-general-user"],
  },
];
```

---

## Execution Flow

### 1. Global Setup

Before any test runs:

- Environment is initialized
- Auth state directory is created/reset
- Empty auth files are generated for all roles

```bash
.auth/
  ├── admin-user.json
  └── general-user.json
```

---

### 2. Run Setup Project

Example: Admin authentication

```bash
npx cross-env ENV=dev npm run test:auth:admin
```

---

### 3. Pre-Test Checks

Before execution:

- TypeScript validation (`tsc`)
- ESLint checks

---

### 4. Environment Initialization

- Loads `.env.secret`
- Loads `.env.dev`
- Decrypts credentials (local only)
- Validates required config

---

### 5. Authentication Execution

Setup test:

- Navigates to login page
- Fetches credentials via resolver
- Performs login
- Verifies success
- Saves storage state

---

### 6. Storage State Persistence

Example output:

```bash
.auth/admin-user.json
.auth/general-user.json
```

Log confirmation:

```
Authentication session state created for role: ADMIN
```

---

### 7. Storage State Injection (Fixture)

After setup completes, all tests automatically receive the correct authenticated session via a custom fixture.

#### Implementation

```ts
storageState: async ({ }, use, testInfo) => {
  const shouldSkipAuth =
    AuthenticationSkipEvaluator.shouldSkipAuthenticationIfNeeded(testInfo, [
      "@skip-auth",
    ]);

  if (shouldSkipAuth) {
    await use(undefined);
    return;
  }

  const role = resolveRoleFromProject(testInfo);

  const filePath = role
    ? AuthenticationFileManager.getFilePath(role)
    : undefined;

  await use(filePath);
},
```

#### Behavior

- Detects if test should skip authentication (`@skip-auth`)
- Resolves role using project name
- Fetches correct `.auth/*.json` file
- Injects it into Playwright automatically

#### Result

Tests run **already authenticated**, with no login steps required.

---

## Available Commands

### Admin Authentication

```bash
npx cross-env ENV=dev npm run test:auth:admin
```

Runs:

```json
"test:auth:admin": "npx playwright test tests/layers/ui/authentication/Auth.admin-user.setup.ts --project=setup-admin-user"
```

---

### General User Authentication

```bash
npx cross-env ENV=dev npm run test:auth:general
```

Runs:

```json
"test:auth:general": "npx playwright test tests/layers/ui/authentication/Auth.general-user.setup.ts --project=setup-general-user"
```

---

## Important Behavior

### 🔁 Auth State Reset

On every run (CI or Local):

- Existing auth state is **cleared**
- New empty state files are created

This guarantees:

- No stale sessions
- No cross-test contamination

---

### 🔗 Project Dependencies

```ts
{
  name: "admin-user",
  dependencies: ["setup-admin-user"],
}
```

Meaning:

- `setup-admin-user` runs first
- Then `admin-user` tests execute with stored session

---

## Example Execution Output

```
Environment successfully initialized
Initialized auth state file for ADMIN
Initialized auth state file for GENERAL

Running setup-admin-user...

Navigated to login page
Filled credentials
Clicked login

Authentication session state created for role: ADMIN
```

---

## File Structure

```
.auth/
  ├── admin-user.json
  └── general-user.json

tests/
  └── layers/ui/authentication/
        ├── Auth.admin-user.setup.ts
        └── Auth.general-user.setup.ts
```

---

## Design Principles

- **Single Responsibility** → Setup tests only handle authentication
- **Role Isolation** → Each role has its own state file
- **Deterministic Execution** → Dependencies enforce order
- **Fail Fast** → Missing role mapping throws immediately
- **Zero Test Awareness** → Tests don’t manage auth manually
- **Secure Handling** → Credentials resolved via runtime system

---

## Anti-Patterns (Avoid)

- ❌ Running UI tests without executing auth setup
- ❌ Hardcoding credentials inside tests
- ❌ Manually editing `.auth` files
- ❌ Bypassing `resolveRoleFromProject`
- ❌ Manually setting `storageState` in tests
- ❌ Mixing roles within a single test

---

## Summary

The **Role-Based Authentication System** provides:

- 🔐 Clean separation of user roles
- ⚡ Fast test execution via session reuse
- 🔁 Reliable and repeatable authentication setup
- 🧩 Seamless integration with runtime configuration
- 🧠 Fully automated auth state injection via fixture

---

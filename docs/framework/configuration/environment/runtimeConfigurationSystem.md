# Runtime Configuration System

## Overview

The **Runtime Configuration System** dynamically manages all environment-dependent behavior at runtime.

It ensures:

- 🌍 Automatic environment detection (CI vs local)
- 🔐 Secure credential resolution
- ⚙️ Zero-config environment switching
- 👥 Multi-user (role-based) authentication support

---

## Core Idea

> **Tests should never care where they run.**
> The system abstracts all environment differences behind a single resolver.

---

## Architecture

### Components

| Component                    | Responsibility                             |
| ---------------------------- | ------------------------------------------ |
| `EnvironmentDetector`        | Detects CI and environment stage           |
| `EnvironmentVariables`       | Provides static local env values           |
| `RuntimeEnvVariableResolver` | Resolves values dynamically at runtime     |
| `EnvironmentConfigManager`   | Validation, decryption, and config control |
| `globalSetup`                | Bootstraps environment + authentication    |

---

## Execution Flow

### 1. Test run starts

Playwright triggers:

```ts
globalSetup: "./src/configuration/environment/global/globalSetup.ts",
```

---

### 2. Environment Detection

```ts
EnvironmentDetector.isCI();
```

- If **CI** → skip env file loading
- If **Local** → load environment configuration

---

### 3. Configuration Initialization

| Environment | Behavior                          |
| ----------- | --------------------------------- |
| CI          | Reset authentication state only   |
| Local       | Load env files + reset auth state |

---

### 4. Runtime Resolution

All values are resolved through:

```ts
const resolver = new RuntimeEnvVariableResolver();
```

---

## Usage

### Base URL

```ts
const baseUrl = resolver.getPortalBaseUrl();
```

---

### Role-Based Credentials

```ts
const credentials = await resolver.getPortalCredentials("ADMIN");
```

---

## Environment Strategies

### CI Strategy

- Uses raw environment variables
- No decryption layer
- Optimized for pipelines

```bash
CI_PORTAL_BASE_URL=
CI_PORTAL_ADMIN_USERNAME=
CI_PORTAL_ADMIN_PASSWORD=
```

---

### Local Strategy

- Uses environment files
- Credentials are encrypted
- Decrypted at runtime using a secret key

---

## Multi-User Support

Supports role-based authentication:

- `ADMIN`
- `GENERAL`

Easily extendable for additional roles.

---

## Security Model

- 🔐 Encrypted credentials (local)
- 🔑 Environment-based secret keys
- ✅ Mandatory validation before use

---

## Design Principles

- **Single Source of Truth** → All access via resolver
- **Environment Agnostic** → Same tests everywhere
- **Fail Fast** → Invalid config throws immediately
- **Secure by Default** → No plain-text secrets locally

---

## Anti-Patterns (Avoid)

- ❌ Accessing `process.env` directly in tests
- ❌ Hardcoding credentials
- ❌ Mixing CI and local config logic
- ❌ Bypassing the resolver

---

## Summary

The **Runtime Configuration System** provides a:

- Clean abstraction over environment complexity
- Secure and scalable credential handling
- Consistent developer experience across environments

---

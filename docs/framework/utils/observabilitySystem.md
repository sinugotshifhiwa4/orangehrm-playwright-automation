# Observability System

## Overview

The **Observability System** provides structured error handling, secure data logging, and intelligent sanitization across the framework.

It ensures:

- 🧠 Centralized error processing
- 🧹 Automatic sensitive data sanitization
- 🪵 Structured, environment-aware logging
- 🔁 Error deduplication to reduce noise

---

## Core Idea

> **All errors flow through a single controlled pipeline before being logged.**

This guarantees consistency, security, and clarity in all logs.

---

## Architecture

### Components

| Component           | Responsibility                                   |
| ------------------- | ------------------------------------------------ |
| `ErrorHandler`      | Entry point for capturing and controlling errors |
| `ErrorAnalyzer`     | Extracts structured error details                |
| `DataSanitizer`     | Masks sensitive data                             |
| `ErrorCacheManager` | Deduplicates repeated errors                     |
| `LoggerManager`     | Provides singleton logger instance               |
| `LoggerFactory`     | Configures transports and formatting             |

---

## Execution Flow

### 1. Error Occurs

Errors can originate from:

- Test failures
- API responses
- Runtime exceptions
- Unhandled promises

---

### 2. Error Capture

```ts
ErrorHandler.captureError(error, source, context);
```

- Entry point for all errors
- Prevents direct logging from tests/services

---

### 3. Deduplication

```ts
ErrorCacheManager.shouldLogError(error, environment);
```

- Prevents repeated logging of identical errors
- Environment-aware (same error in QA ≠ UAT)

---

### 4. Error Analysis

```ts
ErrorAnalyzer.createErrorDetails(...)
```

Extracts:

- message
- stack trace
- error type
- matcher details (Playwright/Jest)
- additional metadata

---

### 5. Data Sanitization

```ts
DataSanitizer.sanitizeErrorObject(...)
```

- Masks sensitive fields (tokens, passwords, etc.)
- Removes unsafe characters
- Prevents leaking secrets into logs

---

### 6. Structured Logging

```ts
logger.error(JSON.stringify(details, null, 2));
```

- Logs structured JSON (not raw strings)
- Output handled by Winston transports:
  - File logs (per level)
  - Console logs (environment-based)

---

## Usage

### Standard Error Logging

```ts
ErrorHandler.captureError(error, "LoginService", "User login failed");
```

---

### Log and Throw

```ts
ErrorHandler.logAndThrow("UserService", "User not found");
```

---

### Assertion Failures (Non-Critical)

```ts
ErrorHandler.captureAssertionError(error, "UserTest");
```

---

## Environment Behavior

| Environment | Console Log Level |
| ----------- | ----------------- |
| dev / qa    | debug             |
| uat         | info              |
| preprod     | warn              |
| prod        | error             |

---

## Security Model

- 🔐 Sensitive fields automatically masked
- 🧹 Stack traces sanitized (without breaking paths)
- 🚫 No raw error objects logged
- ✅ Safe for CI logs and shared environments

---

## Design Principles

- **Single Entry Point** → All errors go through `ErrorHandler`
- **Separation of Concerns**
  - Error handling ≠ logging ≠ sanitization

- **Structured Logging** → JSON over plain text
- **Noise Reduction** → Deduplication via cache
- **Secure by Default** → No sensitive data leaks

---

## Anti-Patterns (Avoid)

- ❌ Using `logger.error()` directly in tests
- ❌ Logging raw error objects
- ❌ Skipping sanitization
- ❌ Bypassing `ErrorHandler`
- ❌ Duplicating error logs in catch blocks

---

## Summary

The **Observability System** provides a:

- Unified error handling pipeline
- Secure and consistent logging strategy
- Clean separation between processing and output
- Scalable foundation for debugging and monitoring

---

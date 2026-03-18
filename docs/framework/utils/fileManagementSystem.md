# File Management System

## Overview

The **File Management System** provides a unified, secure, and consistent way to interact with the file system across the framework.

It ensures:

- 📁 Standardized file and directory operations (sync & async)
- 🔒 Safe path handling and validation
- 🧠 Centralized error handling and logging
- 🔁 Reusable utilities for file manipulation

---

## Core Idea

> **All file operations are abstracted through a shared base layer with consistent validation, normalization, and error handling.**

This prevents duplication, reduces bugs, and enforces safe file access patterns.

---

## Architecture

### Components

| Component          | Responsibility                                             |
| ------------------ | ---------------------------------------------------------- |
| `BaseFileManager`  | Shared utilities (normalization, validation, helpers)      |
| `AsyncFileManager` | Non-blocking file operations (preferred for runtime)       |
| `SyncFileManager`  | Blocking operations (used where sync behavior is required) |
| `FileEncoding`     | Standardized encoding types                                |

---

## Execution Flow

### 1. Path Input

All operations begin with a user-provided path:

```ts
AsyncFileManager.readFile("logs/output.json");
```

---

### 2. Path Normalization

```ts
normalize(inputPath);
```

- Resolves relative paths → absolute paths
- Removes unsafe patterns
- Prevents null byte injection

---

### 3. Path Validation

```ts
validate(filePath, paramName);
```

- Ensures required arguments exist
- Prevents invalid file formats (e.g. trailing `/` for files)
- Enforces consistent input rules

---

### 4. File Operation Execution

Examples:

- Read / Write file
- Create directory
- Delete file
- Check existence
- Access validation

---

### 5. Error Handling & Logging

All failures are routed through:

```ts
ErrorHandler.captureError(...)
```

- Structured error logging
- Consistent error reporting
- Integration with Observability System

---

## Usage

### Async (Recommended)

```ts
await AsyncFileManager.writeFile("logs/test.json", data, "testData");
```

```ts
const content = await AsyncFileManager.readFile("logs/test.json");
```

---

### Sync (Controlled Use)

```ts
SyncFileManager.writeFile("logs/test.json", data, "testData");
```

```ts
const content = SyncFileManager.readFile("logs/test.json");
```

---

## Key Features

### 📁 Path Safety

- All paths are normalized and resolved
- Prevents malformed or unsafe paths
- Ensures cross-platform consistency

---

### 🔄 Async vs Sync Strategy

| Type  | Use Case                          |
| ----- | --------------------------------- |
| Async | Default for test execution & APIs |
| Sync  | Setup, config loading, utilities  |

---

### 🔐 Validation Layer

- Prevents invalid file operations early
- Reduces runtime failures
- Enforces consistency across all methods

---

### 🧠 Intelligent Error Handling

- All errors are centralized
- No direct `try/catch` logging scattered across codebase
- Fully integrated with logging system

---

## Design Principles

- **Single Source of Truth** → Shared logic in `BaseFileManager`
- **Separation of Concerns**
  - Path handling ≠ file execution

- **Consistency First** → Same validation everywhere
- **Safe by Default** → All paths sanitized and validated
- **Flexible Execution** → Async and Sync support

---

## Best Practices

- ✅ Prefer `AsyncFileManager` for most operations
- ✅ Always provide meaningful `keyName` when writing files
- ✅ Use `ensureDirectory` / `ensureFile` for safe creation
- ✅ Use `checkAccess` before critical operations

---

## Anti-Patterns (Avoid)

- ❌ Using `fs` directly in tests or services
- ❌ Bypassing normalization/validation
- ❌ Hardcoding relative paths without resolution
- ❌ Mixing sync and async operations unnecessarily
- ❌ Logging file errors manually instead of using `ErrorHandler`

---

## Summary

The **File Management System** provides:

- A unified abstraction over file system operations
- Secure and validated path handling
- Centralized error management
- Flexible sync and async execution

It ensures reliability, consistency, and maintainability across all file interactions in the framework.

---

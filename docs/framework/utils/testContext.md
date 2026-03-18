# Test Context System

## Overview

The **Test Context System** provides a centralized, in-memory data store used during test execution.

It enables:

- 🧠 Shared state between test steps
- 🔁 Reuse of dynamically generated data
- 📦 Decoupling between test logic and data flow
- ⚡ Fast, in-memory access without external dependencies

---

## Core Idea

> **Test data generated during execution is stored once and reused across steps through a controlled context object.**

This eliminates the need for global variables and reduces tight coupling between test components.

---

## Architecture

### Component

| Component     | Responsibility                 |
| ------------- | ------------------------------ |
| `TestContext` | In-memory key-value data store |

---

## Execution Flow

### 1. Store Data

```ts id="r6e0t2"
testContext.set("userId", createdUser.id);
```

- Saves dynamic data during execution
- Accessible across steps and services

---

### 2. Retrieve Data

```ts id="0zmt9p"
const userId = testContext.get<string>("userId");
```

- Strongly typed retrieval
- Throws error if key does not exist

---

### 3. Validate Existence (Optional)

```ts id="i0m2rb"
if (testContext.has("userId")) {
  // safe usage
}
```

---

### 4. Cleanup

```ts id="fwpl1g"
testContext.clear();
```

- Ensures no data leakage between tests

---

## Usage

### Typical Scenario

```ts id="ytr9lt"
// Step 1: Create user
const user = await api.createUser();
testContext.set("userId", user.id);

// Step 2: Use stored value
const userId = testContext.get<string>("userId");
await api.getUser(userId);
```

---

## Key Features

### ⚡ In-Memory Storage

- No external dependencies (DB, files, etc.)
- Fast read/write operations

---

### 🔑 Key-Based Access

- Flexible key-value storage
- Supports any data type (`unknown`)

---

### 🧠 Strongly Typed Retrieval

- Generic `get<T>()` ensures type safety at usage level

---

### 🚨 Controlled Error Handling

```ts id="9vjqz9"
ErrorHandler.logAndThrow(...)
```

- Prevents silent failures
- Ensures missing data is caught early

---

## Design Principles

- **Single Responsibility** → Only manages execution data
- **Simplicity First** → Minimal abstraction, maximum clarity
- **Explicit Access** → No hidden or implicit data flow
- **Fail Fast** → Missing keys throw immediately
- **Isolation** → Data cleared between test runs

---

## Best Practices

- ✅ Use meaningful keys (e.g. `userId`, `orderReference`)
- ✅ Store only data needed across steps
- ✅ Clear context before/after each test
- ✅ Use `has()` when optional data is expected

---

## Anti-Patterns (Avoid)

- ❌ Using global variables instead of context
- ❌ Storing large datasets unnecessarily
- ❌ Overloading context with unrelated data
- ❌ Skipping `clear()` between tests
- ❌ Using unclear keys like `"data1"` or `"temp"`

---

## When to Use

Use **Test Context** when:

- You need to share data between test steps
- Data is generated dynamically (IDs, tokens, responses)
- You want to avoid tight coupling between services

---

## When NOT to Use

Avoid using it for:

- ❌ Static configuration → use Config System
- ❌ Persistent storage → use File Management System
- ❌ Cross-test data sharing → use external storage

---

## Integration with Other Systems

- 🔗 Works with **API / UI layers** to store runtime data
- 🔗 Uses **ErrorHandler** for consistent error reporting
- 🔗 Complements **File Management System** (temporary vs persistent storage)

---

## Summary

The **Test Context System** provides:

- A simple and reliable in-memory data store
- Safe and explicit data sharing between test steps
- Strong error handling for missing data
- Isolation and consistency across test executions

It ensures clean, maintainable, and decoupled test workflows.

---

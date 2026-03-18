# Browser Context Management System

## Overview

The **Browser Context Management System** provides a structured and reusable way to manage Playwright browser contexts and pages during test execution.

It ensures:

- 🌐 Isolated browser sessions per test
- 📄 Consistent page creation and handling
- 🔁 Controlled lifecycle management (create, reuse, cleanup)
- ⚡ Reliable handling of multi-page interactions

---

## Core Idea

> **All browser contexts and pages are created, managed, and cleaned through a centralized manager to ensure isolation and consistency.**

This prevents state leakage between tests and simplifies browser interaction logic.

---

## Architecture

### Components

| Component                | Responsibility                                |
| ------------------------ | --------------------------------------------- |
| `BrowserContextManager`  | Manages creation, lifecycle, and interactions |
| `BrowserContextWithPage` | Typed structure for context + page pairing    |

---

## Execution Flow

### 1. Create Context

```ts id="t1h2kf"
const { context, page } = await contextManager.createDefaultContext();
```

- Creates a new isolated browser context
- Opens a fresh page within that context

---

### 2. Use Page

```ts id="0h6t2p"
await page.goto("https://example.com");
```

- Perform test actions
- Interact with UI

---

### 3. Handle Multi-Page Scenarios

```ts id="0xkp0p"
const newPage = await contextManager.clickAndWaitForNewPage(page, async () => {
  await page.click("#open-new-tab");
});
```

- Waits for new page event
- Ensures page is fully loaded before returning

---

### 4. Cleanup

```ts id="8c4g6m"
await contextManager.close(context);
```

- Safely closes context
- Prevents memory leaks

---

## Context Types

### 🌐 Default Context

```ts id="q7e7c1"
createDefaultContext();
```

- Uses Playwright default settings
- Suitable for most test scenarios

---

### 🧼 Isolated Context

```ts id="g0vsm9"
createIsolatedContext();
```

- Explicitly removes storage state
- Ensures no cookies/session data
- Ideal for authentication or clean-state testing

---

## Key Features

### 🔒 Test Isolation

- Each test runs in its own browser context
- Prevents cross-test contamination

---

### 📄 Page Lifecycle Management

- Ensures page is always created with context
- Simplifies test setup

---

### 🔁 Multi-Page Handling

- Built-in support for new tab/window scenarios
- Eliminates flaky timing issues

---

### 🧠 Typed Context Object

```ts id="i3r6sv"
BrowserContextWithPage;
```

- Ensures consistent structure
- Improves readability and type safety

---

## Design Principles

- **Isolation First** → Each test gets a clean context
- **Single Responsibility** → Manager handles lifecycle only
- **Consistency** → Standardized context + page creation
- **Reliability** → Handles async browser events safely
- **Simplicity** → Minimal abstraction over Playwright

---

## Best Practices

- ✅ Create a new context per test
- ✅ Always close contexts after use
- ✅ Use `clickAndWaitForNewPage` for new tab flows
- ✅ Prefer isolated context for auth/session tests

---

## Anti-Patterns (Avoid)

- ❌ Reusing the same context across tests
- ❌ Manually handling `waitForEvent("page")` everywhere
- ❌ Forgetting to close contexts
- ❌ Mixing multiple responsibilities into test code

---

## When to Use

Use the **Browser Context Management System** when:

- Creating new browser sessions
- Handling multi-tab or popup scenarios
- Ensuring test isolation
- Managing page lifecycle cleanly

---

## Integration with Other Systems

- 🔗 Works with **Execution Timing System** for timeouts
- 🔗 Supports **Test Context System** for storing page-related data
- 🔗 Integrates with **Observability System** for error handling

---

## Example Usage

```ts id="5wclg4"
const contextManager = new BrowserContextManager(browser);

const { context, page } = await contextManager.createDefaultContext();

await page.goto("https://example.com");

await contextManager.close(context);
```

---

## Summary

The **Browser Context Management System** provides:

- A consistent way to manage browser contexts and pages
- Reliable test isolation
- Simplified multi-page handling
- Clean lifecycle management

It ensures stable, maintainable, and scalable browser interactions across the test framework.

---

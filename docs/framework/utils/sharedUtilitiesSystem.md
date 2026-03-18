# Core Utilities System

## Overview

The **Core Utilities System** provides a collection of reusable, low-level helper functions used across the entire framework.

It ensures:

- 🔁 Reusability of common logic
- 🧹 Clean and consistent data handling
- ⚡ Reduced duplication across modules
- 🧱 A stable foundation for higher-level systems

---

## Core Idea

> **All common, cross-cutting logic is centralized into reusable utilities to keep the framework clean, consistent, and maintainable.**

---

## Architecture

### Components

| Component               | Responsibility                             |
| ----------------------- | ------------------------------------------ |
| `DateFormatter`         | Date formatting and ID generation          |
| `ParsingUtils`          | String, number, and data parsing utilities |
| `SystemInfo`            | System-level metadata (e.g., username)     |
| `shouldSkipBrowserInit` | Environment-based execution control        |

---

## Utility Categories

---

### 🕒 Date & ID Utilities

#### Purpose

Handles date formatting and unique identifier generation.

#### Features

- Standardized timestamp formatting
- Reusable date formatting logic
- Unique ID generation for test data

#### Example

```ts
const timestamp = DateFormatter.formatLocalTime();
const id = DateFormatter.generateId("TEST");
```

---

### 🔍 Parsing Utilities

#### Purpose

Provides robust parsing and normalization for:

- Strings
- Numbers
- Currency values
- Percentages
- Dates

#### Key Capabilities

- Removes inconsistent whitespace (including non-breaking spaces)
- Handles UI-formatted values (e.g., "1,234.50", "10%")
- Converts strings to strongly typed values
- Validates numeric inputs
- Aggregates and calculates values

---

#### Example Usage

```ts
const value = ParsingUtils.parseCurrency("R 1,234.50");
const percentage = ParsingUtils.parsePercentage("10%");
const numbers = ParsingUtils.parseToNumbers(["1,000", "2,000"]);
```

---

#### Data Validation

```ts
ParsingUtils.assertValidNumber(total, "Total Amount", "Invoice Validation");
```

---

#### Date Validation

```ts
const isValid = ParsingUtils.isValidDate("24 Feb 2026");
```

---

### 💻 System Utilities

#### Purpose

Provides access to system-level information.

#### Example

```ts
const username = SystemInfo.getCurrentUsername();
```

- Useful for logging, reporting, and audit trails

---

### ⚙️ Execution Control Utilities

#### Purpose

Controls runtime behavior using environment variables.

#### Example

```ts
if (shouldSkipBrowserInit()) {
  // Skip browser setup
}
```

#### Use Case

- Running API-only tests
- Skipping UI setup in CI pipelines
- Improving execution speed

---

## Design Principles

- **Reusability First** → Shared logic lives in one place
- **Simplicity** → Lightweight, focused utilities
- **Consistency** → Standard formatting and parsing rules
- **Reliability** → Handles edge cases (spaces, formats, invalid input)
- **Framework Agnostic** → Can be reused outside Playwright

---

## Best Practices

- ✅ Use utilities instead of duplicating logic
- ✅ Keep utilities pure and stateless
- ✅ Add new utilities only if reusable across modules
- ✅ Validate data before using it in assertions

---

## Anti-Patterns (Avoid)

- ❌ Putting business logic inside utilities
- ❌ Creating utilities used in only one place
- ❌ Mixing responsibilities (e.g., parsing + API calls)
- ❌ Ignoring normalization before parsing

---

## When to Use

Use the **Core Utilities System** when:

- Formatting dates or generating IDs
- Parsing UI values into usable data
- Validating inputs
- Accessing system-level information
- Controlling execution via environment variables

---

## Integration with Other Systems

- 🔗 Used by **Observability System** (logging timestamps, errors)
- 🔗 Supports **Test Context System** (data normalization)
- 🔗 Works with **Execution Timing System** (ID generation for runs)
- 🔗 Used in **Browser Context System** (conditional execution)

---

## Summary

The **Core Utilities System** provides:

- Centralized reusable helper functions
- Clean and consistent data handling
- Strong parsing and validation capabilities
- Environment-aware execution helpers

It acts as the **foundation layer** that supports all other systems in the framework.

---

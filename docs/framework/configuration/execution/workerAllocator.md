# WorkerAllocator

## Overview

`WorkerAllocator` dynamically determines the optimal number of Playwright workers based on:

- 🖥️ Available CPU cores
- 🔀 CI sharding configuration
- ⚙️ Local execution strategy

It ensures efficient resource usage across both **local development** and **CI pipelines**.

---

## Key Features

- Automatically adapts to machine CPU capacity
- Supports **CI sharding** via environment variables
- Provides configurable **local execution strategies**
- Guarantees a minimum of **1 worker**
- Built-in validation with structured error handling

---

## Usage

## Allocation Modes

### 1. CI Mode (Sharding Enabled)

Activated when:

```bash
SHARD_INDEX=<number>
SHARD_TOTAL=<number>
```

#### Behavior

- Divides total CPU cores across all shards
- Distributes remaining cores to early shards
- Ensures fair and balanced execution

#### Example

| Total Cores | Shards | Distribution |
| ----------- | ------ | ------------ |
| 8           | 3      | 3, 3, 2      |

---

### 2. Local Mode (Strategy-Based)

Used when no sharding variables are present.

#### Available Strategies

| Strategy     | Description       |
| ------------ | ----------------- |
| `all-cores`  | Use all CPU cores |
| `75-percent` | Use 75% of cores  |
| `50-percent` | Use 50% of cores  |
| `25-percent` | Use 25% of cores  |
| `10-percent` | Use 10% of cores  |

#### Example

```ts
WorkerAllocator.getOptimalWorkerCount("10-percent");
```

---

## Environment Variables (CI)

| Variable      | Description                   |
| ------------- | ----------------------------- |
| `SHARD_INDEX` | Current shard (1-based index) |
| `SHARD_TOTAL` | Total number of shards        |

---

## Validation Rules

- `SHARD_INDEX` must be between `1` and `SHARD_TOTAL`
- `SHARD_TOTAL` must be ≥ 1
- Unknown strategies will throw an error
- Minimum workers = **1**

---

## Best Practices

- ✅ Use `"10-percent"` or `"25-percent"` locally to avoid CPU overload
- ✅ Use CI sharding for large test suites
- ✅ Avoid `"all-cores"` on shared environments
- ✅ Keep shard count ≤ total CPU cores for optimal performance

---

## Summary

`WorkerAllocator` provides a **smart, scalable, and environment-aware** way to control Playwright concurrency—improving performance while preventing resource exhaustion.

---

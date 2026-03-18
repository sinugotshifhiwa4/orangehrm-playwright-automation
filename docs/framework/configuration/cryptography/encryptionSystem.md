# Encryption System

## Overview

The **Encryption System** provides a fully automated and secure mechanism for protecting sensitive data (such as environment credentials) within the framework.

It ensures:

- 🔒 Strong encryption using **AES-GCM**
- 🧠 Secure key derivation via **Argon2**
- 🛡️ Integrity verification using **HMAC**
- ⚡ Zero manual handling of cryptographic operations
- 📦 Standardized encrypted value format

---

## Core Idea

> **Encryption and decryption are fully managed by the framework and require no manual cryptographic handling.**

All sensitive values are automatically:

- Validated
- Encrypted
- Verified
- Decrypted at runtime

---

## Architecture

### Components

| Component            | Responsibility                             |
| -------------------- | ------------------------------------------ |
| `CryptoCoordinator`  | Orchestrates the full encryption lifecycle |
| `CryptoEncryption`   | Handles encryption logic                   |
| `CryptoDecryption`   | Handles decryption and validation          |
| `CryptoArgon2`       | Derives secure keys                        |
| `CryptoHmac`         | Ensures data integrity                     |
| `SecureKeyGenerator` | Generates cryptographic primitives         |

---

## Execution Flow

### 1. Secret Key Initialization

- A secure secret key is generated and stored
- Used as the root for all encryption operations

---

### 2. Environment Processing

- Framework scans configured environment variables
- Only supported variables are processed

---

### 3. Automatic Encryption

- Plaintext values are:
  - Encrypted using AES-GCM
  - Signed using HMAC
  - Converted into a structured encrypted format

---

### 4. Storage

- Encrypted values replace plaintext in `.env` files
- No plaintext credentials remain

---

### 5. Runtime Decryption

- Values are automatically:
  - Parsed
  - Validated
  - Decrypted when accessed

---

## Encrypted Value Format

```text
ENC2:v1:<salt>:<iv>:<cipherText>:<hmac>
```

- `ENC2` → Format identifier
- `v1` → Versioning support
- Remaining fields → Secure encoded components

---

## Key Features

### 🔒 Fully Automated Encryption

- No manual encryption logic required
- Handled entirely by the framework

---

### 🧠 Secure Key Derivation

- Argon2 ensures strong resistance to brute-force attacks

---

### 🛡️ Built-in Integrity Validation

- HMAC verification prevents tampering

---

### 📦 Versioned Payload Structure

- Supports backward compatibility and future upgrades

---

### 🔁 Transparent Decryption

- Decryption happens automatically at runtime
- No developer intervention required

---

## Environment Integration

### Supported Variables

- Predefined list of environment variables are encrypted
- Ensures consistency and avoids accidental exposure

---

### Running Encryption

```bash
npx cross-env SKIP_BROWSER_INIT=true PLAYWRIGHT_GREP=@encryption-lifecycle ENV=<env> npm run test:encryption
```

---

### Execution Behavior

- Generates secret key (if not present)
- Encrypts all supported variables
- Validates encrypted output
- Updates environment file automatically

---

## Design Principles

- **Automation First** → No manual crypto usage
- **Security by Default** → Strong algorithms enforced
- **Fail Fast** → Invalid data is rejected early
- **Consistency** → Standard format across all environments
- **Minimal Exposure** → No plaintext persistence

---

## Best Practices

- ✅ Run encryption immediately after setting up environment files
- ✅ Keep secret keys secure and out of version control
- ✅ Use only supported environment variables
- ✅ Re-run encryption when credentials change

---

## Anti-Patterns (Avoid)

- ❌ Manually modifying encrypted values
- ❌ Storing plaintext credentials after encryption
- ❌ Bypassing the encryption lifecycle
- ❌ Sharing secret keys

---

## When to Use

Use the **Encryption System** when:

- Managing environment credentials
- Setting up new environments
- Updating sensitive configuration values
- Ensuring secure test execution

---

## Integration with Other Systems

- 🔗 Works with **Environment Configuration System**
- 🔗 Integrated into **Test Execution Lifecycle**
- 🔗 Used by **Fixtures** for secure value access
- 🔗 Connected to **Error Handling System** for validation

---

## Summary

The **Encryption System** provides:

- Fully automated credential protection
- Strong, modern cryptographic security
- Transparent runtime decryption
- Clean and consistent environment handling

It ensures sensitive data is **secure by default**, without adding complexity to the developer workflow.

---

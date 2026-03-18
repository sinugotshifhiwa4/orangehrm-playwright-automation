import { webcrypto, timingSafeEqual } from "crypto";
import { CRYPTO_CONSTANTS } from "../../types/crypto.config.js";
import { FileEncoding } from "../../../utils/fileManager/internal/fileEncoding.enum.js";
import ErrorHandler from "../../../utils/errorHandling/errorHandler.js";

type BinaryLike = ArrayBuffer | ArrayBufferView;

export default class CryptoWebOperations {
  private static textEncoder = new TextEncoder();

  /**
   * Computes HMAC using Web Crypto API
   */
  public static async computeHMAC(
    key: webcrypto.CryptoKey,
    data: BinaryLike,
  ): Promise<string> {
    try {
      const signature = await webcrypto.subtle.sign(
        "HMAC",
        key,
        CryptoWebOperations.toUint8Array(data),
      );

      return Buffer.from(signature).toString(FileEncoding.BASE64);
    } catch (error) {
      ErrorHandler.captureError(
        error,
        "computeHMAC",
        "Failed to compute HMAC.",
      );
      throw error;
    }
  }

  /**
   * Constant-time comparison
   */
  public static constantTimeCompare(
    firstValue: string,
    secondValue: string,
  ): boolean {
    if (!firstValue || !secondValue) return false;

    try {
      const computed = Buffer.from(firstValue, FileEncoding.BASE64);
      const received = Buffer.from(secondValue, FileEncoding.BASE64);

      if (computed.length !== received.length) return false;
      if (computed.length === 0) return false;

      return timingSafeEqual(computed, received);
    } catch (error) {
      ErrorHandler.captureError(
        error,
        "constantTimeCompare",
        "Failed constant-time comparison",
      );
      return false;
    }
  }

  /**
   * Encrypts data using AES-GCM
   */
  public static async encryptBuffer(
    iv: BinaryLike,
    key: webcrypto.CryptoKey,
    value: string,
  ): Promise<ArrayBuffer> {
    try {
      return await webcrypto.subtle.encrypt(
        {
          name: CRYPTO_CONSTANTS.ALGORITHM.CIPHER,
          iv: CryptoWebOperations.toUint8Array(iv),
        },
        key,
        CryptoWebOperations.textEncoder.encode(value),
      );
    } catch (error) {
      ErrorHandler.captureError(
        error,
        "encryptBuffer",
        "Failed to encrypt with AES-GCM.",
      );
      throw error;
    }
  }

  /**
   * Decrypts data using AES-GCM
   */
  public static async decryptBuffer(
    iv: BinaryLike,
    key: webcrypto.CryptoKey,
    cipherBuffer: BinaryLike,
  ): Promise<ArrayBuffer> {
    try {
      return await webcrypto.subtle.decrypt(
        {
          name: CRYPTO_CONSTANTS.ALGORITHM.CIPHER,
          iv: CryptoWebOperations.toUint8Array(iv),
        },
        key,
        CryptoWebOperations.toUint8Array(cipherBuffer),
      );
    } catch (error) {
      const errorAsError = error as Error;
      ErrorHandler.captureError(
        error,
        "decryptBuffer",
        `Failed to decrypt with AES-GCM, message: ${errorAsError.message}`,
      );
      throw error;
    }
  }

  /**
   * Imports a key for AES-GCM encryption/decryption using Web Crypto API
   * @param keyBuffer - The Buffer containing the key to import
   * @returns A Promise resolving to the imported CryptoKey
   * @throws {Error} - If the key importation fails
   */
  public static async importKeyForCrypto(
    keyBuffer: Buffer,
  ): Promise<webcrypto.CryptoKey> {
    try {
      return await webcrypto.subtle.importKey(
        "raw",
        CryptoWebOperations.bufferToUint8Array(keyBuffer),
        { name: CRYPTO_CONSTANTS.ALGORITHM.CIPHER },
        false,
        CRYPTO_CONSTANTS.ALGORITHM.KEY_USAGE,
      );
    } catch (error) {
      ErrorHandler.captureError(
        error,
        "importKeyForCrypto",
        "Failed to import key for Web Crypto API.",
      );
      throw error;
    }
  }

  /**
   * Imports a key for HMAC computation using Web Crypto API
   * @param keyBuffer - The Buffer containing the key to import
   * @returns A Promise resolving to the imported CryptoKey
   * @throws {Error} - If the key importation fails
   */
  public static async importKeyForHMAC(
    keyBuffer: Buffer,
  ): Promise<webcrypto.CryptoKey> {
    try {
      return await webcrypto.subtle.importKey(
        "raw",
        CryptoWebOperations.bufferToUint8Array(keyBuffer),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign", "verify"],
      );
    } catch (error) {
      ErrorHandler.captureError(
        error,
        "importKeyForHMAC",
        "Failed to import key for HMAC.",
      );
      throw error;
    }
  }

  /**
   * Converts a Buffer to a Uint8Array.
   * @param buffer The Buffer to convert
   * @returns A new Uint8Array containing the converted data
   */
  private static bufferToUint8Array(buffer: Buffer): Uint8Array<ArrayBuffer> {
    const ab = new ArrayBuffer(buffer.byteLength);
    new Uint8Array(ab).set(buffer);
    return new Uint8Array(ab);
  }

  /**
   * Converts a BinaryLike object to a Uint8Array.
   * Supports conversion from Uint8Array, ArrayBuffer, and ArrayBufferView objects.
   * @param data The BinaryLike object to convert
   * @returns A new Uint8Array containing the converted data
   */
  private static toUint8Array(data: BinaryLike): Uint8Array<ArrayBuffer> {
    if (data instanceof Uint8Array) {
      return new Uint8Array(
        data.buffer.slice(
          data.byteOffset,
          data.byteOffset + data.byteLength,
        ) as ArrayBuffer,
      );
    }

    if (data instanceof ArrayBuffer) {
      return new Uint8Array(data.slice(0));
    }

    // ArrayBufferView (DataView, Int32Array, etc.)
    return new Uint8Array(
      data.buffer.slice(
        data.byteOffset,
        data.byteOffset + data.byteLength,
      ) as ArrayBuffer,
    );
  }
}

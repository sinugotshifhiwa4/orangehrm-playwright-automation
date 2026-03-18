/**
 * Represents the result of encrypting variables in an environment file.
 */
export interface EncryptionExecutionResult {
  updatedLines: string[];
  encryptedCount: number;
}

/**
 * Represents the result of categorizing variables into three groups: toEncrypt, alreadyEncrypted, and emptyValues.
 */
export interface VariableResolutionResult {
  toEncrypt: Record<string, string>;
  alreadyEncrypted: string[];
  emptyValues: string[];
  notFound: string[];
}

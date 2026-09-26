import crypto from "node:crypto";

/**
 * Computes the SHA-256 cryptographic hash of string content or buffer
 */
export function calculateSHA256(content: string | Buffer): string {
  return crypto.createHash("sha256").update(content).digest("hex");
}

import { createHash } from "crypto"

/**
 * Simple password hashing function using Node.js built-in crypto
 * This is a replacement for bcrypt to avoid build issues
 * Note: In a production app, you should use a proper password hashing library
 */
export async function hashPassword(password: string): Promise<string> {
  // Add a simple salt - in production, use a unique salt per user
  const salt = "website-analyzer-salt"
  return createHash("sha256")
    .update(salt + password)
    .digest("hex")
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const hashedInput = await hashPassword(password)
  return hashedInput === hash
}

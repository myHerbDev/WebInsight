import { sql, safeDbOperation, isNeonAvailable } from "./neon-db"
import { redis, safeRedisOperation, CACHE_KEYS, CACHE_TTL } from "./upstash-redis"
import bcrypt from "bcryptjs"
import { randomBytes } from "crypto"

export interface AuthUser {
  id: string
  email: string
  created_at: string
}

export interface Session {
  id: string
  userId: string
  email: string
  expiresAt: string
}

// Generate session ID
function generateSessionId(): string {
  return randomBytes(32).toString("hex")
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return bcrypt.hash(password, saltRounds)
}

// Verify password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

// Create user
export async function createUser(email: string, password: string): Promise<AuthUser | null> {
  if (!isNeonAvailable()) {
    return null
  }

  try {
    const passwordHash = await hashPassword(password)
    const userId = randomBytes(16).toString("hex")

    const result = await sql`
      INSERT INTO users (id, email, password_hash, created_at, updated_at)
      VALUES (${userId}, ${email}, ${passwordHash}, NOW(), NOW())
      RETURNING id, email, created_at
    `

    return result[0] || null
  } catch (error) {
    console.error("Error creating user:", error)
    return null
  }
}

// Authenticate user
export async function authenticateUser(email: string, password: string): Promise<AuthUser | null> {
  if (!isNeonAvailable()) {
    return null
  }

  try {
    const result = await sql`
      SELECT id, email, password_hash, created_at
      FROM users
      WHERE email = ${email}
    `

    const user = result[0]
    if (!user) {
      return null
    }

    const isValidPassword = await verifyPassword(password, user.password_hash)
    if (!isValidPassword) {
      return null
    }

    return {
      id: user.id,
      email: user.email,
      created_at: user.created_at,
    }
  } catch (error) {
    console.error("Error authenticating user:", error)
    return null
  }
}

// Create session
export async function createSession(user: AuthUser): Promise<string | null> {
  const sessionId = generateSessionId()
  const expiresAt = new Date(Date.now() + CACHE_TTL.SESSION * 1000).toISOString()

  const session: Session = {
    id: sessionId,
    userId: user.id,
    email: user.email,
    expiresAt,
  }

  const success = await safeRedisOperation(
    async () => {
      await redis!.setex(CACHE_KEYS.USER_SESSION(sessionId), CACHE_TTL.SESSION, JSON.stringify(session))
      return true
    },
    false,
    "Error creating session",
  )

  return success ? sessionId : null
}

// Get session
export async function getSession(sessionId: string): Promise<Session | null> {
  const sessionData = await safeRedisOperation(
    async () => {
      const data = await redis!.get(CACHE_KEYS.USER_SESSION(sessionId))
      return data ? JSON.parse(data as string) : null
    },
    null,
    "Error getting session",
  )

  if (!sessionData) {
    return null
  }

  // Check if session is expired
  if (new Date(sessionData.expiresAt) < new Date()) {
    await deleteSession(sessionId)
    return null
  }

  return sessionData
}

// Delete session
export async function deleteSession(sessionId: string): Promise<void> {
  await safeRedisOperation(
    async () => {
      await redis!.del(CACHE_KEYS.USER_SESSION(sessionId))
    },
    undefined,
    "Error deleting session",
  )
}

// Get user by ID
export async function getUserById(userId: string): Promise<AuthUser | null> {
  if (!isNeonAvailable()) {
    return null
  }

  return safeDbOperation(
    async () => {
      const result = await sql`
        SELECT id, email, created_at
        FROM users
        WHERE id = ${userId}
      `
      return result[0] || null
    },
    null,
    "Error getting user by ID",
  )
}

// Check if user exists
export async function userExists(email: string): Promise<boolean> {
  if (!isNeonAvailable()) {
    return false
  }

  return safeDbOperation(
    async () => {
      const result = await sql`
        SELECT id FROM users WHERE email = ${email}
      `
      return result.length > 0
    },
    false,
    "Error checking if user exists",
  )
}

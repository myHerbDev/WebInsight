/**
 * Very-lightweight, in-memory auth helpers.
 * ❗️ Replace with a real auth implementation (Supabase, Clerk, etc.)
 * before going to production.
 */

import { randomBytes } from "crypto"

type User = {
  id: string
  email: string
  passwordHash: string
  createdAt: Date
}

type Session = {
  token: string
  userId: string
  createdAt: Date
  expiresAt: Date
}

/* ------------------------------------------------------------------ */
/*  In-memory stores (REQUEST-SCOPED in Next.js)                    */
/* ------------------------------------------------------------------ */
const users = new Map<string, User>() // key: email
const sessions = new Map<string, Session>() // key: token

/* ------------------------------------------------------------------ */
/*  Utility helpers                                                   */
/* ------------------------------------------------------------------ */
function hash(input: string) {
  // ❗️NOT secure – for demo only.
  return Buffer.from(input).toString("base64url")
}
function genToken() {
  return randomBytes(24).toString("base64url")
}

/* ------------------------------------------------------------------ */
/*  Public API (named exports)                                        */
/* ------------------------------------------------------------------ */

/**
 * Returns the current session (or null) given a token string.
 */
export async function getSession(token?: string): Promise<Session | null> {
  if (!token) return null
  const session = sessions.get(token)
  if (!session) return null
  if (session.expiresAt.getTime() < Date.now()) {
    sessions.delete(token)
    return null
  }
  return session
}

/**
 * Checks the supplied credentials and returns a session token if valid.
 */
export async function authenticateUser(email: string, password: string) {
  const user = users.get(email.toLowerCase())
  if (!user) return null
  if (user.passwordHash !== hash(password)) return null

  const token = genToken()
  const session: Session = {
    token,
    userId: user.id,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days
  }
  sessions.set(token, session)
  return session
}

/**
 * Creates a new session for the given user id.
 */
export async function createSession(userId: string) {
  const token = genToken()
  const session: Session = {
    token,
    userId,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  }
  sessions.set(token, session)
  return session
}

/**
 * Registers a new user (returns null if email is taken).
 */
export async function createUser(email: string, password: string) {
  email = email.toLowerCase()
  if (users.has(email)) return null

  const user: User = {
    id: crypto.randomUUID(),
    email,
    passwordHash: hash(password),
    createdAt: new Date(),
  }
  users.set(email, user)
  return user
}

/**
 * Returns true if a user with the given email already exists.
 */
export async function userExists(email: string) {
  return users.has(email.toLowerCase())
}

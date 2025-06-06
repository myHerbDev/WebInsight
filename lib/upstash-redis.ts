import { Redis } from "@upstash/redis"

// Initialize Redis connection
let redis: Redis | null = null

try {
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    redis = new Redis({
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN,
    })
    console.log("Upstash Redis connection initialized")
  } else {
    console.warn("Redis environment variables not found - Redis will not be available")
  }
} catch (error) {
  console.error("Failed to initialize Redis:", error)
}

// Check if Redis is available
export function isRedisAvailable(): boolean {
  return redis !== null && !!process.env.KV_REST_API_URL && !!process.env.KV_REST_API_TOKEN
}

// Cache key generators
export const CACHE_KEYS = {
  ANALYSIS: (url: string) => `analysis:${encodeURIComponent(url)}`,
  USER_SESSION: (sessionId: string) => `session:${sessionId}`,
  USER_DATA: (userId: string) => `user:${userId}`,
  CONTENT_GENERATION: (id: string) => `content:${id}`,
}

// Cache TTL (Time To Live) in seconds
export const CACHE_TTL = {
  ANALYSIS: 24 * 60 * 60, // 24 hours
  SESSION: 7 * 24 * 60 * 60, // 7 days
  USER_DATA: 60 * 60, // 1 hour
  CONTENT: 60 * 60, // 1 hour
}

// Safe Redis operation wrapper
export async function safeRedisOperation<T>(
  operation: () => Promise<T>,
  fallback: T,
  errorMessage = "Redis operation failed",
): Promise<T> {
  if (!isRedisAvailable()) {
    console.warn("Redis not available, using fallback")
    return fallback
  }

  try {
    return await operation()
  } catch (error) {
    console.error(errorMessage, error)
    return fallback
  }
}

// Export the redis instance
export { redis }

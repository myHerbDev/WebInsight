import { Redis } from "@upstash/redis"

// Check if Upstash Redis is configured
export const isRedisConfigured = (): boolean => {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)
}

// Create Redis client
let redis: Redis | null = null

if (isRedisConfigured()) {
  try {
    redis = new Redis({
      url: process.env.KV_REST_API_URL!,
      token: process.env.KV_REST_API_TOKEN!,
    })
    console.log("Upstash Redis client initialized successfully")
  } catch (error) {
    console.warn("Failed to initialize Redis client:", error)
    redis = null
  }
} else {
  console.log("Redis environment variables not found - using fallback mode")
}

// Helper function to safely handle Redis operations
export async function safeRedisOperation<T>(
  operation: () => Promise<T>,
  fallbackValue: T,
  errorMessage = "Redis operation failed",
): Promise<T> {
  try {
    if (!redis) {
      console.warn("Redis not available, using fallback")
      return fallbackValue
    }

    console.log("Executing Redis operation...")
    const result = await operation()
    console.log("Redis operation completed successfully")
    return result
  } catch (error: any) {
    console.error(errorMessage, error)

    // Log additional error details
    if (error.name) {
      console.error("Redis error name:", error.name)
    }
    if (error.cause) {
      console.error("Redis error cause:", error.cause)
    }

    return fallbackValue
  }
}

// Check if Redis is available
export function isRedisAvailable(): boolean {
  return redis !== null && isRedisConfigured()
}

// Get Redis client
export function getRedisClient() {
  return redis
}

// Cache utilities
export const CACHE_KEYS = {
  ANALYSIS: (url: string) => `analysis:${url}`,
  USER_SESSION: (sessionId: string) => `session:${sessionId}`,
  USER_DATA: (userId: string) => `user:${userId}`,
  HOSTING_PROVIDERS: "hosting_providers",
  GENERATED_CONTENT: (analysisId: string) => `content:${analysisId}`,
}

export const CACHE_TTL = {
  ANALYSIS: 24 * 60 * 60, // 24 hours
  SESSION: 7 * 24 * 60 * 60, // 7 days
  USER_DATA: 60 * 60, // 1 hour
  HOSTING_PROVIDERS: 24 * 60 * 60, // 24 hours
  GENERATED_CONTENT: 24 * 60 * 60, // 24 hours
}

// Export the Redis client
export { redis }

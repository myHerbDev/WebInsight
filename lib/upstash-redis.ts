import { Redis } from "@upstash/redis"

export const isRedisAvailable = (): boolean => {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)
}

let redisSingleton: Redis | null = null

function getRedisClient(): Redis | null {
  if (!redisSingleton) {
    if (isRedisAvailable()) {
      try {
        redisSingleton = new Redis({
          url: process.env.KV_REST_API_URL!,
          token: process.env.KV_REST_API_TOKEN!,
        })
      } catch (e) {
        console.error("Failed to initialize Upstash Redis client:", e)
        redisSingleton = null // Ensure it's null if init fails
      }
    } else {
      // console.warn("Upstash Redis not configured. Caching operations will be mocked or will fail.");
    }
  }
  return redisSingleton
}

export const redis = getRedisClient()

export const CACHE_KEYS = {
  ANALYSIS: (url: string) => `analysis:${Buffer.from(url).toString("base64")}`, // Base64 encode URL for safe key
  USER_SESSION: (sessionId: string) => `session:${sessionId}`,
  HOSTING_PROVIDERS: "hosting_providers",
}

export const CACHE_TTL = {
  ANALYSIS: 60 * 60 * 24, // 24 hours
  SESSION: 60 * 60 * 24 * 7, // 7 days
  DEFAULT: 60 * 60, // 1 hour
}

export async function safeRedisOperation<T>(
  operation: (redisClient: Redis) => Promise<T>,
  fallbackValue: T,
  errorMessage = "Redis operation failed",
): Promise<T> {
  const currentRedisClient = getRedisClient() // Get potentially re-initialized client
  if (!currentRedisClient) {
    // console.warn("Redis not available, returning fallback for:", errorMessage)
    return fallbackValue
  }
  try {
    return await operation(currentRedisClient)
  } catch (error: any) {
    console.error(`${errorMessage}:`, error)
    // Optionally, rethrow as a SafeError
    // For now, just returning fallback
    // throw new SafeError(errorMessage, "REDIS_ERROR", 500, { originalError: error.message });
    return fallbackValue
  }
}

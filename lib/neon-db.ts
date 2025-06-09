import { neon } from "@neondatabase/serverless"

// Configure Neon client (optional, based on environment)
// neonConfig.fetchOptions = { cache: 'no-store' }; // Example: Disable caching for fetch
// neonConfig.wsProxy = (host) => `${host}:5433/v1`; // Example: Custom WebSocket proxy

export const isNeonAvailable = (): boolean => {
  return Boolean(process.env.DATABASE_URL || process.env.POSTGRES_URL)
}

let sqlSingleton: any

function getNeonSql() {
  if (!sqlSingleton) {
    const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL
    if (!dbUrl) {
      console.warn("Neon DB URL not found. Database operations will be mocked or will fail.")
      // Return a mock sql function or throw error, depending on desired behavior
      sqlSingleton = async () => {
        console.error("Neon DB not configured. Query was not executed.")
        return [] // Mock empty result
      }
    } else {
      try {
        sqlSingleton = neon(dbUrl)
      } catch (e) {
        console.error("Failed to initialize Neon SQL client:", e)
        sqlSingleton = async () => {
          console.error("Neon DB client failed to initialize. Query was not executed.")
          return []
        }
      }
    }
  }
  return sqlSingleton
}

export const sql = getNeonSql()

export async function safeDbOperation<T>(
  operation: () => Promise<T>,
  fallbackValue: T,
  errorMessage = "Database operation failed",
): Promise<T> {
  if (!isNeonAvailable()) {
    // console.warn("Neon DB not available, returning fallback for:", errorMessage)
    return fallbackValue
  }
  try {
    return await operation()
  } catch (error: any) {
    console.error(`${errorMessage}:`, error)
    // Optionally, rethrow as a SafeError or a specific DB error type
    // For now, just returning fallback to prevent app crashes
    // throw new SafeError(errorMessage, "DB_ERROR", 500, { originalError: error.message });
    return fallbackValue
  }
}

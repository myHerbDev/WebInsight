import { neon } from "@neondatabase/serverless"

// Initialize Neon connection
let sql: ReturnType<typeof neon> | null = null

try {
  if (process.env.DATABASE_URL) {
    sql = neon(process.env.DATABASE_URL)
    console.log("Neon database connection initialized")
  } else {
    console.warn("DATABASE_URL not found - Neon database will not be available")
  }
} catch (error) {
  console.error("Failed to initialize Neon database:", error)
}

// Check if Neon is available
export function isNeonAvailable(): boolean {
  return sql !== null && !!process.env.DATABASE_URL
}

// Safe database operation wrapper
export async function safeDbOperation<T>(
  operation: () => Promise<T>,
  fallback: T,
  errorMessage = "Database operation failed",
): Promise<T> {
  if (!isNeonAvailable()) {
    console.warn("Neon database not available, using fallback")
    return fallback
  }

  try {
    return await operation()
  } catch (error) {
    console.error(errorMessage, error)
    return fallback
  }
}

// Export the sql instance
export { sql }

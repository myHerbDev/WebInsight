import { neon } from "@neondatabase/serverless"

// Check if Neon is configured
export const isNeonConfigured = (): boolean => {
  return Boolean(process.env.DATABASE_URL)
}

// Create Neon SQL client
let sql: any = null

if (isNeonConfigured()) {
  try {
    sql = neon(process.env.DATABASE_URL!)
    console.log("Neon database client initialized successfully")
  } catch (error) {
    console.warn("Failed to initialize Neon client:", error)
    sql = null
  }
} else {
  console.log("Neon DATABASE_URL not found - using fallback mode")
}

// Helper function to safely handle database operations
export async function safeDbOperation<T>(
  operation: () => Promise<T>,
  fallbackValue: T,
  errorMessage = "Database operation failed",
): Promise<T> {
  try {
    if (!sql) {
      console.warn("Neon not available, using fallback")
      return fallbackValue
    }

    console.log("Executing database operation...")
    const result = await operation()
    console.log("Database operation completed successfully")
    return result
  } catch (error: any) {
    console.error(errorMessage, error)

    // Log additional error details
    if (error.code) {
      console.error("Database error code:", error.code)
    }
    if (error.detail) {
      console.error("Database error detail:", error.detail)
    }

    return fallbackValue
  }
}

// Check if Neon is available
export function isNeonAvailable(): boolean {
  return sql !== null && isNeonConfigured()
}

// Get Neon SQL client
export function getNeonClient() {
  return sql
}

// Database interfaces
export interface WebsiteAnalysis {
  id: string
  url: string
  title: string
  summary: string
  key_points: string[]
  keywords: string[]
  sustainability_score: number
  performance_score: number
  script_optimization_score: number
  content_quality_score: number
  security_score: number
  improvements: string[]
  content_stats: any
  raw_data: any
  hosting_provider_name?: string
  ssl_certificate?: boolean
  created_at: string
  updated_at: string
}

export interface GeneratedContent {
  id: string
  analysis_id: string
  content_type: string
  tone: string
  content: string
  markdown?: string
  created_at: string
}

export interface HostingProvider {
  id: string
  name: string
  website: string
  sustainability_score: number
  performance_rating: number
  green_energy: boolean
  carbon_neutral: boolean
  renewable_energy_percentage: number
  data_center_locations: string[]
  certifications: string[]
  pricing_model: string
  features: string[]
  created_at: string
}

export interface User {
  id: string
  email: string
  password_hash: string
  created_at: string
  updated_at: string
}

export interface SavedAnalysis {
  id: string
  user_id: string
  analysis_id: string
  created_at: string
}

export interface Favorite {
  id: string
  user_id: string
  analysis_id: string
  created_at: string
}

// Export the SQL client
export { sql }

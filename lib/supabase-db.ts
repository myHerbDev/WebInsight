import { createClient } from "@supabase/supabase-js"
import { isSupabaseConfigured } from "./supabase"

// Check if we're in a browser environment
const isBrowser = typeof window !== "undefined"

// Check if we're in build time (no environment variables available)
const isBuildTime = process.env.NODE_ENV === "production" && !process.env.VERCEL

// Get environment variables safely
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

let supabaseAdmin: any = null

// Only create Supabase client if:
// 1. Not during build time
// 2. Environment variables are available
// 3. We're in a server environment or have proper config
if (!isBuildTime && supabaseUrl && supabaseServiceKey && !isBrowser) {
  try {
    supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
    console.log("Supabase admin client initialized successfully")
  } catch (error) {
    console.warn("Failed to initialize Supabase client:", error)
    supabaseAdmin = null
  }
} else {
  if (isBuildTime) {
    console.log("Build time detected - skipping Supabase initialization")
  } else if (!supabaseUrl || !supabaseServiceKey) {
    console.log("Supabase environment variables not found - using fallback mode")
  } else if (isBrowser) {
    console.log("Browser environment detected - server-side Supabase not initialized")
  }
}

// Helper function to safely handle database operations
export async function safeDbOperation<T>(
  operation: () => Promise<T>,
  fallbackValue: T,
  errorMessage = "Database operation failed",
): Promise<T> {
  // Always return fallback during build time
  if (isBuildTime) {
    console.log("Build time - returning fallback value")
    return fallbackValue
  }

  try {
    if (!supabaseAdmin) {
      console.warn("Supabase not available, using fallback")
      return fallbackValue
    }
    return await operation()
  } catch (error) {
    console.error(errorMessage, error)
    return fallbackValue
  }
}

// Check if Supabase is available
export function isSupabaseAvailable(): boolean {
  return !isBuildTime && supabaseAdmin !== null && isSupabaseConfigured()
}

// Get Supabase client safely (for runtime use only)
export function getSupabaseClient() {
  if (isBuildTime) {
    console.warn("Attempted to get Supabase client during build time")
    return null
  }
  return supabaseAdmin
}

// Database table interfaces
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

// Export the client for direct use when needed (with safety check)
export { supabaseAdmin }

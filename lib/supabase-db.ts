import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Create a Supabase client for server-side operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// Helper function to safely handle database operations
export async function safeDbOperation<T>(
  operation: () => Promise<T>,
  fallbackValue: T,
  errorMessage = "Database operation failed",
): Promise<T> {
  try {
    if (!supabaseUrl || !supabaseServiceKey) {
      console.warn("Supabase not configured, using fallback")
      return fallbackValue
    }
    return await operation()
  } catch (error) {
    console.error(errorMessage, error)
    return fallbackValue
  }
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

import { createClient } from "@supabase/supabase-js"
import { supabase, isSupabaseConfigured } from "./supabase"
import type { WebsiteData } from "@/types/website-data"

// Check if we're in a browser environment
const isBrowser = typeof window !== "undefined"

// Check if we're in build time (no environment variables available)
const isBuildTime = process.env.NODE_ENV === "production" && !process.env.VERCEL

// Get environment variables safely - support both direct and prefixed env vars
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.POSTGRES_NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.POSTGRES_SUPABASE_SERVICE_ROLE_KEY
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.POSTGRES_NEXT_PUBLIC_SUPABASE_ANON_KEY

let supabaseAdmin: any = null

// Only create Supabase client if:
// 1. Not during build time
// 2. Environment variables are available
// 3. We're in a server environment or have proper config
if (!isBuildTime && supabaseUrl && (supabaseServiceKey || supabaseAnonKey) && !isBrowser) {
  try {
    // Use service role key if available, otherwise use anon key
    const key = supabaseServiceKey || supabaseAnonKey

    supabaseAdmin = createClient(supabaseUrl, key, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
    console.log("✅ Supabase admin client initialized successfully for purple-book project")
  } catch (error) {
    console.warn("❌ Failed to initialize Supabase client:", error)
    supabaseAdmin = null
  }
} else {
  if (isBuildTime) {
    console.log("🔄 Build time detected - skipping Supabase initialization")
  } else if (!supabaseUrl || (!supabaseServiceKey && !supabaseAnonKey)) {
    console.log("⚠️ Supabase environment variables not found - using fallback mode")
    console.log("Environment check:", {
      supabaseUrl: supabaseUrl ? "✓" : "✗",
      supabaseServiceKey: supabaseServiceKey ? "✓" : "✗",
      supabaseAnonKey: supabaseAnonKey ? "✓" : "✗",
    })
  } else if (isBrowser) {
    console.log("🌐 Browser environment detected - server-side Supabase not initialized")
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
    console.log("🔄 Build time - returning fallback value")
    return fallbackValue
  }

  try {
    if (!supabaseAdmin) {
      console.warn("⚠️ Supabase not available, using fallback")
      return fallbackValue
    }
    return await operation()
  } catch (error) {
    console.error(`❌ ${errorMessage}:`, error)
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
    console.warn("⚠️ Attempted to get Supabase client during build time")
    return null
  }
  return supabaseAdmin
}

// Database table interfaces for purple-book project
export interface WebsiteAnalysis {
  id: string
  url: string
  title: string
  description?: string
  summary: string
  key_points: string[]
  keywords: string[]
  sustainability_score: number
  performance_score: number
  security_score: number
  seo_score: number
  content_quality_score: number
  script_optimization_score: number
  improvements: string[]
  content_stats: any
  technical_data: any
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
  title?: string
  content: string
  sections?: any
  word_count: number
  reading_time: number
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
  description?: string
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  email: string
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

// Database interface for website analyses
export interface DatabaseWebsiteAnalysis {
  id: string
  url: string
  title: string | null
  summary: string | null
  performance_score: number
  sustainability_score: number
  security_score: number
  content_quality_score: number
  script_optimization_score: number
  key_points: string[]
  keywords: string[]
  improvements: string[]
  hosting_provider_name: string | null
  ssl_certificate: boolean
  server_location: string | null
  ip_address: string | null
  subdomains: string[]
  content_stats: any
  raw_data: any
  created_at: string
  updated_at: string
}

// Database interface for generated content
export interface DatabaseGeneratedContent {
  id: string
  analysis_id: string | null
  content_type: string
  title: string
  content: string
  markdown: string | null
  summary: string | null
  key_points: string[]
  tone: string
  word_count: number
  reading_time: number
  sections: any
  website_url: string | null
  user_id: string | null
  is_favorite: boolean
  created_at: string
  updated_at: string
}

// Database interface for hosting providers
export interface DatabaseHostingProvider {
  id: string
  name: string
  sustainability_score: number
  green_energy: boolean
  carbon_neutral: boolean
  renewable_energy_percentage: number
  data_center_efficiency: number
  certifications: string[]
  description: string | null
  website_url: string | null
  pricing_info: any
  features: string[]
  created_at: string
  updated_at: string
}

// Save website analysis to database
export async function saveWebsiteAnalysis(data: WebsiteData): Promise<string | null> {
  if (!isSupabaseConfigured()) {
    console.warn("Supabase not configured, skipping database save")
    return null
  }

  try {
    const { data: result, error } = await supabase.rpc("save_website_analysis", {
      p_url: data.url,
      p_title: data.title || null,
      p_summary: data.summary || null,
      p_performance_score: data.performance_score || 0,
      p_sustainability_score: data.sustainability_score || 0,
      p_security_score: data.security_score || 0,
      p_content_quality_score: data.content_quality_score || 0,
      p_script_optimization_score: data.script_optimization_score || 0,
      p_key_points: data.keyPoints || [],
      p_keywords: data.keywords || [],
      p_improvements: data.improvements || [],
      p_hosting_provider_name: data.hosting_provider_name || null,
      p_ssl_certificate: data.ssl_certificate || false,
      p_server_location: data.server_location || null,
      p_ip_address: data.ip_address || null,
      p_subdomains: data.subdomains || [],
      p_content_stats: data.contentStats || {},
      p_raw_data: data.rawData || {},
    })

    if (error) {
      console.error("Error saving website analysis:", error)
      return null
    }

    console.log("✅ Website analysis saved to database:", result)
    return result
  } catch (error) {
    console.error("Database save error:", error)
    return null
  }
}

// Save generated content to database
export async function saveGeneratedContent(content: {
  analysisId?: string
  contentType: string
  title: string
  content: string
  markdown?: string
  summary?: string
  keyPoints?: string[]
  tone?: string
  wordCount?: number
  readingTime?: number
  sections?: any
  websiteUrl?: string
  userId?: string
}): Promise<string | null> {
  if (!isSupabaseConfigured()) {
    console.warn("Supabase not configured, skipping content save")
    return null
  }

  try {
    const { data: result, error } = await supabase.rpc("save_generated_content", {
      p_analysis_id: content.analysisId || null,
      p_content_type: content.contentType,
      p_title: content.title,
      p_content: content.content,
      p_markdown: content.markdown || null,
      p_summary: content.summary || null,
      p_key_points: content.keyPoints || [],
      p_tone: content.tone || "professional",
      p_word_count: content.wordCount || 0,
      p_reading_time: content.readingTime || 0,
      p_sections: content.sections || [],
      p_website_url: content.websiteUrl || null,
      p_user_id: content.userId || null,
    })

    if (error) {
      console.error("Error saving generated content:", error)
      return null
    }

    console.log("✅ Generated content saved to database:", result)
    return result
  } catch (error) {
    console.error("Database content save error:", error)
    return null
  }
}

// Get hosting provider recommendations
export async function getHostingRecommendations(minSustainabilityScore = 80): Promise<DatabaseHostingProvider[]> {
  if (!isSupabaseConfigured()) {
    console.warn("Supabase not configured, returning empty recommendations")
    return []
  }

  try {
    const { data, error } = await supabase.rpc("get_hosting_recommendations", {
      target_sustainability_score: minSustainabilityScore,
    })

    if (error) {
      console.error("Error fetching hosting recommendations:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Database hosting recommendations error:", error)
    return []
  }
}

// Get recent website analyses
export async function getRecentAnalyses(limit = 10): Promise<DatabaseWebsiteAnalysis[]> {
  if (!isSupabaseConfigured()) {
    return []
  }

  try {
    const { data, error } = await supabase
      .from("website_analyses")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("Error fetching recent analyses:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Database recent analyses error:", error)
    return []
  }
}

// Get user's generated content
export async function getUserGeneratedContent(userId: string, limit = 20): Promise<DatabaseGeneratedContent[]> {
  if (!isSupabaseConfigured()) {
    return []
  }

  try {
    const { data, error } = await supabase
      .from("generated_content")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("Error fetching user generated content:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Database user content error:", error)
    return []
  }
}

// Search website analyses
export async function searchWebsiteAnalyses(query: string, limit = 10): Promise<DatabaseWebsiteAnalysis[]> {
  if (!isSupabaseConfigured()) {
    return []
  }

  try {
    const { data, error } = await supabase
      .from("website_analyses")
      .select("*")
      .or(`url.ilike.%${query}%,title.ilike.%${query}%,summary.ilike.%${query}%`)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("Error searching website analyses:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Database search error:", error)
    return []
  }
}

// Get analysis by ID
export async function getAnalysisById(id: string): Promise<DatabaseWebsiteAnalysis | null> {
  if (!isSupabaseConfigured()) {
    return null
  }

  try {
    const { data, error } = await supabase.from("website_analyses").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching analysis by ID:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Database get analysis error:", error)
    return null
  }
}

// Update analysis favorite status
export async function toggleAnalysisFavorite(userId: string, analysisId: string): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    return false
  }

  try {
    // Check if already favorited
    const { data: existing } = await supabase
      .from("favorites")
      .select("id")
      .eq("user_id", userId)
      .eq("analysis_id", analysisId)
      .single()

    if (existing) {
      // Remove from favorites
      const { error } = await supabase.from("favorites").delete().eq("user_id", userId).eq("analysis_id", analysisId)

      if (error) {
        console.error("Error removing favorite:", error)
        return false
      }
    } else {
      // Add to favorites
      const { error } = await supabase.from("favorites").insert({
        user_id: userId,
        analysis_id: analysisId,
      })

      if (error) {
        console.error("Error adding favorite:", error)
        return false
      }
    }

    return true
  } catch (error) {
    console.error("Database toggle favorite error:", error)
    return false
  }
}

// Get user's favorite analyses
export async function getUserFavorites(userId: string): Promise<DatabaseWebsiteAnalysis[]> {
  if (!isSupabaseConfigured()) {
    return []
  }

  try {
    const { data, error } = await supabase
      .from("favorites")
      .select(`
      website_analyses (*)
    `)
      .eq("user_id", userId)
      .order("favorited_at", { ascending: false })

    if (error) {
      console.error("Error fetching user favorites:", error)
      return []
    }

    return data?.map((item: any) => item.website_analyses).filter(Boolean) || []
  } catch (error) {
    console.error("Database user favorites error:", error)
    return []
  }
}

export default {
  saveWebsiteAnalysis,
  saveGeneratedContent,
  getHostingRecommendations,
  getRecentAnalyses,
  getUserGeneratedContent,
  searchWebsiteAnalyses,
  getAnalysisById,
  toggleAnalysisFavorite,
  getUserFavorites,
}

import { createClient } from "@supabase/supabase-js"

// Get environment variables with fallbacks for build time
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

// Client-side Supabase client (singleton pattern)
let supabaseClient: ReturnType<typeof createClient> | null = null

export function getSupabaseClient() {
  // Return null if environment variables are not available
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase environment variables not configured")
    return null
  }

  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
  }
  return supabaseClient
}

// Server-side Supabase client
export function createServerSupabaseClient() {
  // Return null if environment variables are not available
  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn("Supabase server environment variables not configured")
    return null
  }

  return createClient(supabaseUrl, supabaseServiceKey)
}

// Helper function to check if Supabase is configured
export function isSupabaseConfigured() {
  return !!(supabaseUrl && supabaseAnonKey)
}

// Database types
export interface User {
  id: string
  email: string
  created_at: string
  is_temporary?: boolean
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

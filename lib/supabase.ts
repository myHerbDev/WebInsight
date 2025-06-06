import { createClient } from "@supabase/supabase-js"

// Supabase configuration with fallbacks
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.POSTGRES_NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.POSTGRES_NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Helper function to check if Supabase is available
export function isSupabaseConfigured() {
  return !!(supabaseUrl && supabaseAnonKey)
}

// Create Supabase client with error handling - only if configured
export const supabase = isSupabaseConfigured() ? createClient(supabaseUrl, supabaseAnonKey) : null

// Test connection function
export async function testSupabaseConnection() {
  try {
    if (!isSupabaseConfigured()) {
      console.warn("Supabase credentials not configured")
      return false
    }

    if (!supabase) {
      console.warn("Supabase client not initialized")
      return false
    }

    const { data, error } = await supabase.from("website_analyses").select("count").limit(1)

    if (error) {
      console.error("Supabase connection test failed:", error.message)
      return false
    }

    console.log("✅ Supabase connection successful")
    return true
  } catch (error) {
    console.error("Supabase connection error:", error)
    return false
  }
}

export default supabase

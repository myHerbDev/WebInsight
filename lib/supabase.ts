import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import { type CookieOptions, createServerClient } from "@supabase/ssr"

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Check if Supabase is configured
export const isSupabaseConfigured = (): boolean => {
  return Boolean(supabaseUrl && (supabaseAnonKey || supabaseServiceKey))
}

// Create a Supabase client for browser-side usage
export const createBrowserClient = () => {
  if (!isSupabaseConfigured()) {
    console.warn("Supabase is not configured. Using mock client.")
    return createMockClient()
  }

  try {
    return createClient(supabaseUrl!, supabaseAnonKey!)
  } catch (error) {
    console.error("Failed to create Supabase client:", error)
    return createMockClient()
  }
}

// Create a Supabase client for server-side usage with cookies
export const createServerSupabaseClient = () => {
  if (!isSupabaseConfigured()) {
    console.warn("Supabase is not configured. Using mock client.")
    return createMockClient()
  }

  try {
    // Use service role key if available, otherwise use anon key
    const key = supabaseServiceKey || supabaseAnonKey

    // Create server client with cookies
    const cookieStore = cookies()

    return createServerClient(supabaseUrl!, key!, {
      cookies: {
        get: (name: string) => {
          return cookieStore.get(name)?.value
        },
        set: (name: string, value: string, options: CookieOptions) => {
          cookieStore.set({ name, value, ...options })
        },
        remove: (name: string, options: CookieOptions) => {
          cookieStore.set({ name, value: "", ...options })
        },
      },
    })
  } catch (error) {
    console.error("Failed to create server Supabase client:", error)
    return createMockClient()
  }
}

// Create a mock client for when Supabase is not configured
function createMockClient() {
  return {
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: null }),
          order: () => ({
            limit: () => Promise.resolve({ data: [], error: null }),
          }),
        }),
        order: () => ({
          limit: () => Promise.resolve({ data: [], error: null }),
        }),
      }),
      insert: () => Promise.resolve({ data: null, error: null }),
      update: () => Promise.resolve({ data: null, error: null }),
      delete: () => Promise.resolve({ data: null, error: null }),
    }),
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      signUp: () => Promise.resolve({ data: { user: null }, error: null }),
      signIn: () => Promise.resolve({ data: { user: null }, error: null }),
      signOut: () => Promise.resolve({ error: null }),
    },
  }
}

// Default client for direct imports
const supabase = createBrowserClient()
export default supabase

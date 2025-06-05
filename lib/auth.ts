import { createServerSupabaseClient, isSupabaseConfigured } from "./supabase"

export async function getCurrentUser() {
  if (!isSupabaseConfigured()) {
    return null
  }

  const supabase = createServerSupabaseClient()
  if (!supabase) {
    return null
  }

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      return null
    }

    return {
      id: user.id,
      email: user.email || "",
      created_at: user.created_at || new Date().toISOString(),
    }
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

export async function verifyToken(token: string) {
  if (!isSupabaseConfigured()) {
    return null
  }

  const supabase = createServerSupabaseClient()
  if (!supabase) {
    return null
  }

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token)

    if (error || !user) {
      return null
    }

    return {
      id: user.id,
      email: user.email || "",
      created_at: user.created_at || new Date().toISOString(),
    }
  } catch (error) {
    console.error("Error verifying token:", error)
    return null
  }
}

import { getSupabaseClient, createServerSupabaseClient } from "./supabase"

// Client-side auth functions
export async function signUpWithEmail(email: string, password: string) {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function signInWithEmail(email: string, password: string) {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function signOut() {
  const supabase = getSupabaseClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    throw new Error(error.message)
  }
}

export async function getCurrentUser() {
  const supabase = getSupabaseClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error) {
    throw new Error(error.message)
  }

  return user
}

// Server-side auth functions
export async function getServerUser(accessToken?: string) {
  const supabase = createServerSupabaseClient()

  if (accessToken) {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(accessToken)

    if (error) {
      return null
    }

    return user
  }

  return null
}

// Legacy password hashing functions (kept for compatibility)
export async function hashPassword(password: string): Promise<string> {
  // Supabase handles password hashing automatically
  // This function is kept for API compatibility but not used
  return password
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  // Supabase handles password verification automatically
  // This function is kept for API compatibility but not used
  return password === hashedPassword
}

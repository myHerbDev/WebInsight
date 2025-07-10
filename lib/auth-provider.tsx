"use client"

import { createContext, useContext, type ReactNode } from "react"

interface AuthUser {
  id: string
  email: string
  name?: string
}

interface AuthContextValue {
  user: AuthUser | null
  loading: boolean
  isConfigured: boolean
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
  signUp: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  // Simplified auth provider - no actual authentication
  const value: AuthContextValue = {
    user: null,
    loading: false,
    isConfigured: false,
    signIn: async () => ({ success: false, error: "Authentication disabled" }),
    signOut: async () => {},
    signUp: async () => ({ success: false, error: "Authentication disabled" }),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used inside <AuthProvider>")
  }
  return context
}

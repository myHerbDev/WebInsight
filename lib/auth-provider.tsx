"use client"

import type React from "react"
import { createContext, useCallback, useContext, useEffect, useState } from "react"

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */
interface User {
  email: string
}
export type AuthResponse = { error?: string }

interface AuthContextValue {
  user: User | null
  loading: boolean
  isConfigured: boolean
  /** POST /api/user/login */
  signIn: (email: string, password: string) => Promise<AuthResponse>
  /** POST /api/user/signup */
  signUp: (email: string, password: string) => Promise<AuthResponse>
  /** Clears local state + hits logout endpoint (if it exists) */
  signOut: () => Promise<void>
}

/* ------------------------------------------------------------------ */
/*  Context                                                           */
/* ------------------------------------------------------------------ */
const AuthContext = createContext<AuthContextValue | null>(null)

/* ------------------------------------------------------------------ */
/*  Provider                                                          */
/* ------------------------------------------------------------------ */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isConfigured, setIsConfigured] = useState(true)

  /* -------- Fetch session on mount ------------------------------- */
  useEffect(() => {
    async function bootstrap() {
      try {
        // quick OPTIONS to see if route exists
        const heartbeat = await fetch("/api/user/login", { method: "OPTIONS" })
        setIsConfigured(heartbeat.ok)

        if (heartbeat.ok) {
          const res = await fetch("/api/user/data")
          if (res.ok) {
            const data: User = await res.json()
            setUser(data)
          }
        }
      } catch {
        setIsConfigured(false)
      } finally {
        setLoading(false)
      }
    }
    bootstrap()
  }, [])

  /* -------- Helpers ---------------------------------------------- */
  const signIn = useCallback(async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const res = await fetch("/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      if (!res.ok) {
        const { error } = await res.json()
        return { error: error ?? "Login failed. Please try again." }
      }
      const data: User = await res.json()
      setUser(data)
      return {}
    } catch (err) {
      return { error: (err as Error).message }
    }
  }, [])

  const signUp = useCallback(async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const res = await fetch("/api/user/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      if (!res.ok) {
        const { error } = await res.json()
        return { error: error ?? "Signup failed. Please try again." }
      }
      const data: User = await res.json()
      setUser(data)
      return {}
    } catch (err) {
      return { error: (err as Error).message }
    }
  }, [])

  const signOut = useCallback(async () => {
    try {
      await fetch("/api/user/logout", { method: "POST" })
    } catch {
      /* route might not exist – ignore */
    } finally {
      setUser(null)
    }
  }, [])

  const value: AuthContextValue = {
    user,
    loading,
    isConfigured,
    signIn,
    signUp,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/* ------------------------------------------------------------------ */
/*  Hook                                                              */
/* ------------------------------------------------------------------ */
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>")
  return ctx
}

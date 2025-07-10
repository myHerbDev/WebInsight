"use client"

import React, { createContext, useContext, useState, useCallback } from "react"

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
type AuthResponse = { error?: string }

interface AuthContextValue {
  /** `true` when auth routes are reachable (basic heartbeat). */
  isConfigured: boolean
  /** Sign a user in – returns `{ error?: string }` */
  signIn: (email: string, password: string) => Promise<AuthResponse>
  /** Register a new user – returns `{ error?: string }` */
  signUp: (email: string, password: string) => Promise<AuthResponse>
}

/* ------------------------------------------------------------------ */
/*  Context                                                            */
/* ------------------------------------------------------------------ */
const AuthContext = createContext<AuthContextValue | undefined>(undefined)

/* ------------------------------------------------------------------ */
/*  Provider                                                           */
/* ------------------------------------------------------------------ */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isConfigured, setIsConfigured] = useState(true)

  /* --- Helpers ---------------------------------------------------- */
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
      return {}
    } catch (err) {
      return { error: (err as Error).message }
    }
  }, [])

  /* --- Basic availability check on mount -------------------------- */
  React.useEffect(() => {
    fetch("/api/user/login", { method: "OPTIONS" })
      .then((r) => setIsConfigured(r.ok))
      .catch(() => setIsConfigured(false))
  }, [])

  return <AuthContext.Provider value={{ isConfigured, signIn, signUp }}>{children}</AuthContext.Provider>
}

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>")
  return ctx
}

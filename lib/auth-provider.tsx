"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

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
  signUp: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [isConfigured] = useState(true) // Simplified for now

  // Check for existing session on mount
  useEffect(() => {
    checkSession()
  }, [])

  const checkSession = async () => {
    try {
      const response = await fetch("/api/user/data", {
        method: "GET",
        credentials: "include",
      })

      if (response.ok) {
        const userData = await response.json()
        if (userData.user) {
          setUser(userData.user)
        }
      }
    } catch (error) {
      console.error("Session check failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      })

      const data = await response.json()

      if (response.ok && data.user) {
        setUser(data.user)
        return { success: true }
      } else {
        return { success: false, error: data.error || "Login failed" }
      }
    } catch (error) {
      return { success: false, error: "Network error" }
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      })

      const data = await response.json()

      if (response.ok && data.user) {
        setUser(data.user)
        return { success: true }
      } else {
        return { success: false, error: data.error || "Signup failed" }
      }
    } catch (error) {
      return { success: false, error: "Network error" }
    }
  }

  const signOut = async () => {
    try {
      await fetch("/api/user/logout", {
        method: "POST",
        credentials: "include",
      })
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setUser(null)
    }
  }

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

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

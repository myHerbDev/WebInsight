"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface AuthContextType {
  user: User | null
  isLoading: boolean
}

interface User {
  id: string
  email: string
  name?: string
  // Add other user properties as needed
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
})

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Attempt to load user from session/localStorage or an API endpoint
    const checkUserSession = async () => {
      setIsLoading(true)
      try {
        // Example: fetch('/api/user/session');
        // If using localStorage for simple persistence (not recommended for sensitive data without proper security)
        const storedUser = localStorage.getItem("wscrapierr-user")
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error("Failed to load user session", error)
        // setUser(null); // Ensure user is null if session check fails
      } finally {
        setIsLoading(false)
      }
    }
    checkUserSession()
  }, [])

  return <AuthContext.Provider value={{ user, isLoading }}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

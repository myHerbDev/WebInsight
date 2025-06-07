"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (userData: UserData) => Promise<void> // Replace UserData with your actual login data type
  logout: () => Promise<void>
  signup: (signupData: SignupData) => Promise<void> // Replace SignupData with your actual signup data type
}

interface User {
  id: string
  email: string
  name?: string
  // Add other user properties as needed
}

// Define these types based on your API request bodies
interface UserData {
  email?: string
  password?: string
  // other login fields
}

interface SignupData {
  email?: string
  password?: string
  name?: string
  // other signup fields
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

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

  const login = async (userData: UserData) => {
    setIsLoading(true)
    try {
      // Replace with your actual API call
      const response = await fetch("/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Login failed")
      }
      const loggedInUser: User = await response.json()
      setUser(loggedInUser)
      localStorage.setItem("wscrapierr-user", JSON.stringify(loggedInUser)) // Persist user
    } catch (error) {
      console.error("Login error:", error)
      throw error // Re-throw to be caught by UI
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (signupData: SignupData) => {
    setIsLoading(true)
    try {
      // Replace with your actual API call
      const response = await fetch("/api/user/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupData),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Signup failed")
      }
      const newUser: User = await response.json()
      setUser(newUser)
      localStorage.setItem("wscrapierr-user", JSON.stringify(newUser)) // Persist user
    } catch (error) {
      console.error("Signup error:", error)
      throw error // Re-throw to be caught by UI
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      // Replace with your actual API call if needed (e.g., to invalidate session server-side)
      // await fetch('/api/user/logout', { method: 'POST' });
      setUser(null)
      localStorage.removeItem("wscrapierr-user") // Clear persisted user
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return <AuthContext.Provider value={{ user, isLoading, login, logout, signup }}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

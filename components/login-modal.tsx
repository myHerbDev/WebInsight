"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, X, AlertCircle } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { isSupabaseConfigured } from "@/lib/supabase"

interface LoginModalProps {
  onClose: () => void
  onLoginSuccess: (userId: string) => void
}

export function LoginModal({ onClose, onLoginSuccess }: LoginModalProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Check if Supabase is configured
  const supabaseConfigured = isSupabaseConfigured()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!supabaseConfigured) {
      toast({
        title: "Service Unavailable",
        description: "Authentication service is not configured. Please try again later.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Dynamic import to avoid loading Supabase when not configured
      const { createClientComponentClient } = await import("@supabase/auth-helpers-nextjs")
      const supabase = createClientComponentClient()

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }

      if (data.user) {
        onLoginSuccess(data.user.id)
        toast({
          title: "Success!",
          description: "Logged in successfully.",
        })
        onClose()
      }
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to log in. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-md relative">
        <Button variant="ghost" size="icon" className="absolute right-4 top-4" onClick={onClose}>
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">Welcome Back</h2>
          <p className="text-gray-500 dark:text-gray-400">Sign in to your account</p>
        </div>

        {!supabaseConfigured ? (
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Authentication Unavailable</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              The authentication service is currently not configured. You can still use the website analyzer without
              logging in.
            </p>
            <Button onClick={onClose} variant="outline" className="w-full">
              Continue Without Login
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-teal-600" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        )}

        {supabaseConfigured && (
          <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Don't have an account?{" "}
            <button className="text-purple-600 dark:text-purple-400 hover:underline">Sign up</button>
          </div>
        )}
      </div>
    </div>
  )
}

// Also export as default for compatibility
export default LoginModal

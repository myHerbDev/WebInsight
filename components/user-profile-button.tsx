"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { User, LogOut, Settings, BarChart3 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"
import { isSupabaseConfigured } from "@/lib/supabase"

interface UserProfileButtonProps {
  user: any
  onLogout: () => void
}

export function UserProfileButton({ user, onLogout }: UserProfileButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const supabaseConfigured = isSupabaseConfigured()

  const handleLogout = async () => {
    if (!supabaseConfigured) {
      onLogout()
      return
    }

    setIsLoading(true)
    try {
      // Dynamic import to avoid loading Supabase when not configured
      const { createClientComponentClient } = await import("@supabase/auth-helpers-nextjs")
      const supabase = createClientComponentClient()

      const { error } = await supabase.auth.signOut()
      if (error) {
        throw error
      }

      onLogout()
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      })
    } catch (error) {
      console.error("Logout error:", error)
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <User className="h-5 w-5" />
          <span className="sr-only">User menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium">{user.email || "User"}</p>
          <p className="text-xs text-muted-foreground">{supabaseConfigured ? "Authenticated" : "Guest User"}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <BarChart3 className="mr-2 h-4 w-4" />
          <span>My Analyses</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} disabled={isLoading}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>{isLoading ? "Logging out..." : "Log out"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserProfileButton

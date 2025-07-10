"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { User, LogOut, Settings } from "lucide-react"
import { useAuth } from "@/lib/auth-provider"
import { LoginModal } from "@/components/login-modal"

export function UserProfileButton() {
  const { user, signOut, loading } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(false)

  if (loading) {
    return (
      <Button variant="ghost" size="sm" disabled>
        <User className="h-4 w-4" />
      </Button>
    )
  }

  if (!user) {
    return (
      <>
        <Button variant="ghost" size="sm" onClick={() => setShowLoginModal(true)}>
          <User className="h-4 w-4 mr-2" />
          Sign In
        </Button>
        {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
      </>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <User className="h-4 w-4 mr-2" />
          Account
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem onClick={signOut}>
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

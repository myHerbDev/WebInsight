"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LoginModal } from "@/components/login-modal"
import { useAuth } from "@/lib/auth-provider"
import { Loader2, LogOut, Settings, User } from "lucide-react"

export function UserProfileButton() {
  const [showLoginModal, setShowLoginModal] = useState(false)
  const { user, signOut, isLoading } = useAuth()

  const handleSignOut = async () => {
    await signOut()
  }

  if (isLoading) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <Loader2 className="h-5 w-5 animate-spin" />
      </Button>
    )
  }

  if (!user) {
    return (
      <>
        <Button
          variant="default"
          className="bg-gradient-to-r from-purple-600 to-teal-600 hover:from-purple-700 hover:to-teal-700"
          onClick={() => setShowLoginModal(true)}
        >
          Login
        </Button>
        {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
      </>
    )
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <User className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-green-500" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="px-2 py-1.5">
            <p className="text-sm font-medium">{user.email}</p>
            <p className="text-xs text-muted-foreground">Logged in</p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <a href="/profile">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a href="/settings">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </a>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

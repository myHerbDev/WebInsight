"use client"

import { cn } from "@/lib/utils"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { UserProfileButton } from "@/components/user-profile-button" // Assuming this exists
import { SignUpModal } from "@/components/sign-up-modal" // Assuming this exists
import { LoginModal } from "@/components/login-modal"
import { useAuth } from "@/components/auth-provider"
import {
  Menu,
  Settings,
  BarChart3,
  FileText,
  Users,
  LifeBuoy,
  BotMessageSquare,
  Star,
  FolderGit2,
  SearchCheck,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"

export function Header() {
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showSignUpModal, setShowSignUpModal] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const pathname = usePathname()
  const { user, isLoading } = useAuth() // Assuming useAuth provides user and isLoading
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const navLinks = [
    { href: "/", label: "Analyze", icon: SearchCheck },
    { href: "/hosting", label: "Hosting Intel", icon: BarChart3 },
    { href: "/content-studio", label: "Content Studio", icon: BotMessageSquare },
    { href: "/compare", label: "Compare Sites", icon: FolderGit2 },
    { href: "/saved", label: "Saved Reports", icon: Star },
  ]

  const accountLinks = [
    { href: "/profile", label: "Profile", icon: Users },
    { href: "/settings", label: "Settings", icon: Settings },
    { href: "/support", label: "Support", icon: LifeBuoy },
    { href: "/docs", label: "Docs", icon: FileText },
  ]

  const renderNavLinks = (isMobile = false) =>
    navLinks.map((link) => (
      <Link
        key={link.href}
        href={link.href}
        onClick={() => isMobile && setShowMobileMenu(false)}
        className={cn(
          "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
          pathname === link.href
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
          isMobile && "text-base py-3",
        )}
      >
        <link.icon className="h-4 w-4 mr-2" />
        {link.label}
      </Link>
    ))

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" aria-label="Toggle Menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0 w-72">
              <div className="p-6 border-b">
                <Logo size="md" />
              </div>
              <nav className="flex flex-col gap-2 p-4">
                {renderNavLinks(true)}
                <div className="my-2 border-t"></div>
                {accountLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setShowMobileMenu(false)}
                    className={cn(
                      "flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                      pathname === link.href && "bg-primary/10 text-primary",
                    )}
                  >
                    <link.icon className="h-4 w-4 mr-2" />
                    {link.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          <div className="hidden md:block">
            <Logo size="md" />
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-1">{renderNavLinks()}</nav>

        <div className="flex items-center gap-2">
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          )}
          {!isLoading &&
            (user ? (
              <UserProfileButton />
            ) : (
              <>
                <Button variant="ghost" onClick={() => setShowLoginModal(true)} className="hidden sm:inline-flex">
                  Log In
                </Button>
                <Button
                  onClick={() => setShowSignUpModal(true)}
                  className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:opacity-90 text-white"
                >
                  Sign Up
                </Button>
              </>
            ))}
          {isLoading && <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />}
        </div>
      </div>
      {/* Modals (assuming they exist and are styled) */}
      <SignUpModal
        isOpen={showSignUpModal}
        onClose={() => setShowSignUpModal(false)}
        onLoginClick={() => {
          setShowSignUpModal(false)
          setShowLoginModal(true)
        }}
      />
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSignUpClick={() => {
          setShowLoginModal(false)
          setShowSignUpModal(true)
        }}
      />
    </header>
  )
}

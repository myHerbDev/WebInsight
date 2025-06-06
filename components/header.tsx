"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { UserProfileButton } from "@/components/user-profile-button"
import { SignUpModal } from "@/components/sign-up-modal"
import { LoginModal } from "@/components/login-modal"
import { useAuth } from "@/lib/auth-provider"
import { Menu, BarChart2, FileText, BookOpen, HelpCircle, Sparkles } from "lucide-react"

export function Header() {
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showSignUpModal, setShowSignUpModal] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const pathname = usePathname()
  const { user, isLoading } = useAuth()

  const routes = [
    {
      href: "/",
      label: "Dashboard",
      icon: <BarChart2 className="h-4 w-4 mr-2" />,
      active: pathname === "/",
    },
    {
      href: "/ai-content",
      label: "AI Content",
      icon: <Sparkles className="h-4 w-4 mr-2" />,
      active: pathname === "/ai-content",
    },
    {
      href: "/docs",
      label: "Documentation",
      icon: <FileText className="h-4 w-4 mr-2" />,
      active: pathname === "/docs" || pathname?.startsWith("/docs/"),
    },
    {
      href: "/blog",
      label: "Blog",
      icon: <BookOpen className="h-4 w-4 mr-2" />,
      active: pathname === "/blog",
    },
    {
      href: "/support",
      label: "Support",
      icon: <HelpCircle className="h-4 w-4 mr-2" />,
      active: pathname === "/support",
    },
  ]

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Toggle Menu">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <div className="px-7">
                <Link href="/" className="flex items-center" onClick={() => setShowMobileMenu(false)}>
                  <Logo />
                </Link>
              </div>
              <nav className="flex flex-col gap-4 px-2 mt-8">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    onClick={() => setShowMobileMenu(false)}
                    className={`flex items-center px-4 py-2 text-sm rounded-md hover:bg-accent ${
                      route.active ? "bg-accent font-medium" : ""
                    }`}
                  >
                    {route.icon}
                    {route.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          <Link href="/" className="hidden md:flex">
            <Logo />
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={`px-3 py-2 text-sm font-medium rounded-md hover:bg-accent flex items-center ${
                route.active ? "bg-accent" : ""
              }`}
            >
              {route.icon}
              {route.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {!isLoading && !user ? (
            <>
              <Button variant="ghost" onClick={() => setShowLoginModal(true)} className="hidden md:flex">
                Log In
              </Button>
              <Button onClick={() => setShowSignUpModal(true)}>Sign Up</Button>
            </>
          ) : (
            <UserProfileButton />
          )}
        </div>
      </div>
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

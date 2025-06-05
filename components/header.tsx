"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Globe, BarChart3 } from "lucide-react"
import { UserProfileButton } from "@/components/user-profile-button"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Hosting", href: "/hosting" },
    { name: "Compare", href: "/compare" },
    { name: "Blog", href: "/blog" },
    { name: "Docs", href: "/docs" },
    { name: "Support", href: "/support" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Globe className="h-8 w-8 text-purple-600" />
                <BarChart3 className="absolute -bottom-1 -right-1 h-4 w-4 text-teal-600" />
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-teal-600 bg-clip-text text-transparent">
                  WebInSight
                </span>
              </div>
            </div>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <Link href="/" className="flex items-center space-x-2" onClick={() => setIsOpen(false)}>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Globe className="h-6 w-6 text-purple-600" />
                  <BarChart3 className="absolute -bottom-1 -right-1 h-3 w-3 text-teal-600" />
                </div>
                <span className="font-bold bg-gradient-to-r from-purple-600 to-teal-600 bg-clip-text text-transparent">
                  WebInSight
                </span>
              </div>
            </Link>
            <nav className="flex flex-col space-y-3 mt-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="transition-colors hover:text-foreground/80 text-foreground/60"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Link href="/" className="flex items-center space-x-2 md:hidden">
              <div className="relative">
                <Globe className="h-6 w-6 text-purple-600" />
                <BarChart3 className="absolute -bottom-1 -right-1 h-3 w-3 text-teal-600" />
              </div>
              <span className="font-bold bg-gradient-to-r from-purple-600 to-teal-600 bg-clip-text text-transparent">
                WebInSight
              </span>
            </Link>
          </div>
          <nav className="flex items-center space-x-2">
            <UserProfileButton />
          </nav>
        </div>
      </div>
    </header>
  )
}

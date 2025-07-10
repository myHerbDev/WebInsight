"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sun, MoonStar } from "lucide-react"
import { useTheme } from "next-themes"
import Image from "next/image"

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/hosting", label: "Hosting" },
  { href: "/recommendations", label: "Recommendations" },
]

export function Header() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur supports-[backdrop-filter]:bg-white/40 dark:supports-[backdrop-filter]:bg-black/40 bg-white/80 dark:bg-black/80 border-b border-transparent">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/placeholder-logo.png"
            alt="WSfynder Logo"
            width={32}
            height={32}
            priority
            className="rounded-md shadow-sm"
          />
          <span className="font-semibold text-lg tracking-tight bg-gradient-to-r from-fuchsia-500 via-cyan-500 to-sky-400 bg-clip-text text-transparent">
            WSfynder
          </span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "transition-colors hover:text-sky-500",
                pathname === item.href
                  ? "text-sky-600 dark:text-sky-400 font-medium"
                  : "text-gray-700 dark:text-gray-300",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          aria-label="Toggle theme"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <MoonStar className="h-5 w-5" />}
        </Button>
      </div>
    </header>
  )
}

/* default export so either import style works */
export default Header

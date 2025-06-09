"use client"

import {
  Moon,
  Sun,
  User,
  LogOut,
  Settings,
  UserCircle2,
  BarChartHorizontalBig,
  Compass,
  ShieldCheck,
  Lightbulb,
  LayoutGrid,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", label: "Analyze", icon: BarChartHorizontalBig },
  { href: "/compare", label: "Compare", icon: Compass },
  { href: "/hosting", label: "Hosting", icon: ShieldCheck },
  { href: "/recommendations", label: "Recommendations", icon: Lightbulb },
]

export function Header() {
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-b border-white/20 dark:border-slate-700/20">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center" aria-label="WebInSight Home">
          <Logo size="md" showText={true} />
        </Link>

        <nav className="hidden md:flex items-center space-x-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "futuristic-nav-item flex items-center space-x-2",
                  isActive ? "active text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-300",
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
            className="rounded-full w-10 h-10 bg-white/10 dark:bg-slate-800/50 backdrop-blur-md hover:bg-white/20 dark:hover:bg-slate-700/50"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full w-10 h-10 bg-white/10 dark:bg-slate-800/50 backdrop-blur-md hover:bg-white/20 dark:hover:bg-slate-700/50"
                aria-label="User menu"
              >
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 futuristic-card mt-1 p-1">
              <DropdownMenuItem
                asChild
                className="cursor-pointer rounded-lg hover:bg-white/10 dark:hover:bg-slate-700/50"
              >
                <Link href="/profile" className="flex items-center py-2 px-3">
                  <UserCircle2 className="h-4 w-4 mr-2.5 text-gray-500 dark:text-gray-400" /> Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                asChild
                className="cursor-pointer rounded-lg hover:bg-white/10 dark:hover:bg-slate-700/50"
              >
                <Link href="/settings" className="flex items-center py-2 px-3">
                  <Settings className="h-4 w-4 mr-2.5 text-gray-500 dark:text-gray-400" /> Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-200/50 dark:bg-gray-700/50 my-1" />
              <DropdownMenuItem className="flex items-center text-red-600 dark:text-red-400 hover:bg-red-50/20 dark:hover:bg-red-900/20 py-2 px-3 cursor-pointer rounded-lg">
                <LogOut className="h-4 w-4 mr-2.5" /> Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full w-10 h-10 bg-white/10 dark:bg-slate-800/50 backdrop-blur-md hover:bg-white/20 dark:hover:bg-slate-700/50"
                  aria-label="Open navigation menu"
                >
                  <LayoutGrid className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 futuristic-card mt-1 p-1">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
                  return (
                    <DropdownMenuItem
                      key={item.href}
                      asChild
                      className={cn(
                        "cursor-pointer rounded-lg",
                        isActive
                          ? "bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400"
                          : "hover:bg-white/10 dark:hover:bg-slate-700/50",
                      )}
                    >
                      <Link href={item.href} className="flex items-center space-x-2.5 py-2 px-3">
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    </DropdownMenuItem>
                  )
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}

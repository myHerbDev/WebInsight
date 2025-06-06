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
    <header className="sticky top-0 z-50 w-full border-b border-border/60 glass-morphism">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center" aria-label="WebInSight Home">
          <Logo size="md" showText={true} />
        </Link>

        <nav className="hidden md:flex items-center space-x-1.5">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group relative px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 flex items-center space-x-2 card-hover-lift",
                  isActive
                    ? "text-foreground bg-primary-gradient/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 transition-colors",
                    isActive ? "text-primary-gradient-start" : "text-muted-foreground group-hover:text-foreground",
                  )}
                />
                <span>{item.label}</span>
                {isActive && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary-gradient"></span>}
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
            className="text-muted-foreground hover:text-foreground hover:bg-accent/50"
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
                className="text-muted-foreground hover:text-foreground hover:bg-accent/50"
                aria-label="User menu"
              >
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-card border-border shadow-lg rounded-xl mt-1">
              <DropdownMenuItem asChild className="cursor-pointer hover:bg-accent/70">
                <Link href="/profile" className="flex items-center py-2 px-3">
                  <UserCircle2 className="h-4 w-4 mr-2.5 text-muted-foreground" /> Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer hover:bg-accent/70">
                <Link href="/settings" className="flex items-center py-2 px-3">
                  <Settings className="h-4 w-4 mr-2.5 text-muted-foreground" /> Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border/70 my-1" />
              <DropdownMenuItem className="flex items-center text-destructive hover:!bg-destructive/10 py-2 px-3 cursor-pointer">
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
                  className="text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  aria-label="Open navigation menu"
                >
                  <LayoutGrid className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-card border-border shadow-lg rounded-xl mt-1">
                {navItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <DropdownMenuItem key={item.href} asChild className="cursor-pointer hover:bg-accent/70">
                      <Link href={item.href} className="flex items-center space-x-2.5 py-2 px-3">
                        <Icon className="h-4 w-4 text-muted-foreground" />
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

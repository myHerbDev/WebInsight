"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, BookOpen, Zap, Code, Rocket, HelpCircle, FileText } from "lucide-react"

const sidebarNavItems = [
  {
    title: "Getting Started",
    href: "/docs",
    icon: BookOpen,
  },
  {
    title: "Quick Start",
    href: "/docs/quick-start",
    icon: Zap,
  },
  {
    title: "API Reference",
    href: "/docs/api",
    icon: Code,
  },
  {
    title: "Examples",
    href: "/docs/examples",
    icon: Rocket,
  },
  {
    title: "FAQ",
    href: "/docs/faq",
    icon: HelpCircle,
  },
  {
    title: "Changelog",
    href: "/docs/changelog",
    icon: FileText,
  },
]

interface DocsLayoutProps {
  children: React.ReactNode
}

export default function DocsLayout({ children }: DocsLayoutProps) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="p-6">
        <h2 className="text-lg font-semibold">Documentation</h2>
        <p className="text-sm text-muted-foreground">
          Learn how to use WSfynder to analyze and optimize your websites.
        </p>
      </div>
      <ScrollArea className="flex-1 px-6">
        <div className="space-y-2">
          {sidebarNavItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                  pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                )}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className="h-4 w-4" />
                {item.title}
              </Link>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <div className="hidden w-64 border-r bg-background md:block">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden fixed top-20 left-4 z-40">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1">
        <main className="container mx-auto px-4 py-8 md:px-8">{children}</main>
      </div>
    </div>
  )
}

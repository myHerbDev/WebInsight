"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, BookOpen, Zap, Code, Settings, HelpCircle, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  {
    title: "Getting Started",
    items: [
      { title: "Introduction", href: "/docs", icon: BookOpen },
      { title: "Quick Start", href: "/docs/quick-start", icon: Zap },
    ],
  },
  {
    title: "API Reference",
    items: [
      { title: "API Overview", href: "/docs/api", icon: Code },
      { title: "Authentication", href: "/docs/api/auth", icon: Settings },
      { title: "Endpoints", href: "/docs/api/endpoints", icon: FileText },
    ],
  },
  {
    title: "Guides",
    items: [
      { title: "Website Analysis", href: "/docs/guides/analysis", icon: BookOpen },
      { title: "Performance Optimization", href: "/docs/guides/performance", icon: Zap },
      { title: "Sustainability Metrics", href: "/docs/guides/sustainability", icon: Zap },
    ],
  },
  {
    title: "Support",
    items: [
      { title: "FAQ", href: "/docs/faq", icon: HelpCircle },
      { title: "Contact", href: "/docs/contact", icon: HelpCircle },
    ],
  },
]

function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 border-r bg-gray-50/50 dark:bg-gray-900/50">
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4">Documentation</h2>
        <ScrollArea className="h-[calc(100vh-200px)]">
          <nav className="space-y-6">
            {navigation.map((section) => (
              <div key={section.title}>
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">{section.title}</h3>
                <ul className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors",
                            pathname === item.href
                              ? "bg-purple-100 text-purple-900 dark:bg-purple-900 dark:text-purple-100"
                              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800",
                          )}
                        >
                          <Icon className="h-4 w-4" />
                          {item.title}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </ScrollArea>
      </div>
    </div>
  )
}

function MobileSidebar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="md:hidden bg-transparent">
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Documentation</h2>
          <ScrollArea className="h-[calc(100vh-200px)]">
            <nav className="space-y-6">
              {navigation.map((section) => (
                <div key={section.title}>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">{section.title}</h3>
                  <ul className="space-y-1">
                    {section.items.map((item) => {
                      const Icon = item.icon
                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            onClick={() => setOpen(false)}
                            className={cn(
                              "flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors",
                              pathname === item.href
                                ? "bg-purple-100 text-purple-900 dark:bg-purple-900 dark:text-purple-100"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800",
                            )}
                          >
                            <Icon className="h-4 w-4" />
                            {item.title}
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))}
            </nav>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Mobile Header */}
        <div className="md:hidden border-b p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold">Documentation</h1>
            <MobileSidebar />
          </div>
        </div>

        {/* Content */}
        <main className="p-6 md:p-8">{children}</main>
      </div>
    </div>
  )
}

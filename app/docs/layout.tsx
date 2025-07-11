"use client"

import type React from "react"
import { useState, Suspense } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Book,
  Code,
  FileText,
  HelpCircle,
  Menu,
  MessageSquare,
  Search,
  Shield,
  Users,
  ExternalLink,
} from "lucide-react"

const navigationItems = [
  {
    title: "Getting Started",
    icon: Book,
    items: [
      { title: "Introduction", href: "/docs" },
      { title: "Quick Start", href: "/docs/quick-start" },
      { title: "Authentication", href: "/docs/authentication" },
    ],
  },
  {
    title: "API Reference",
    icon: Code,
    items: [
      { title: "Overview", href: "/docs/api" },
      { title: "Website Analysis", href: "/docs/api/analyze" },
      { title: "Content Generation", href: "/docs/api/generate" },
      { title: "Hosting Providers", href: "/docs/api/hosting" },
      { title: "Comparisons", href: "/docs/api/comparisons" },
      { title: "Export", href: "/docs/api/export" },
    ],
  },
  {
    title: "Guides",
    icon: FileText,
    items: [
      { title: "Website Analysis", href: "/docs/guides/analysis" },
      { title: "Sustainability Metrics", href: "/docs/guides/sustainability" },
      { title: "Performance Optimization", href: "/docs/guides/performance" },
      { title: "Security Assessment", href: "/docs/guides/security" },
    ],
  },
  {
    title: "Resources",
    icon: Users,
    items: [
      { title: "Blog", href: "/blog" },
      { title: "Support", href: "/support" },
      { title: "Community", href: "/docs/community" },
      { title: "Changelog", href: "/docs/changelog" },
    ],
  },
  {
    title: "Legal",
    icon: Shield,
    items: [
      { title: "Privacy Policy", href: "/privacy" },
      { title: "Terms of Service", href: "/terms" },
      { title: "Cookie Policy", href: "/docs/cookies" },
    ],
  },
]

interface DocsLayoutProps {
  children: React.ReactNode
}

function SidebarContent() {
  const [searchQuery, setSearchQuery] = useState("")
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/docs" && pathname === "/docs") return true
    if (href !== "/docs" && pathname.startsWith(href)) return true
    return false
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search documentation..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Navigation */}
      <nav className="space-y-6">
        {navigationItems.map((section) => {
          const Icon = section.icon
          return (
            <div key={section.title}>
              <div className="flex items-center gap-2 mb-3">
                <Icon className="h-4 w-4 text-gray-500" />
                <h3 className="font-medium text-sm text-gray-900 dark:text-gray-100">{section.title}</h3>
              </div>
              <ul className="space-y-1 ml-6">
                {section.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`block px-3 py-2 text-sm rounded-md transition-colors ${
                        isActive(item.href)
                          ? "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </nav>

      {/* Quick Links */}
      <div className="border-t pt-6">
        <h3 className="font-medium text-sm text-gray-900 dark:text-gray-100 mb-3">Quick Links</h3>
        <div className="space-y-2">
          <Link
            href="/support"
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            <HelpCircle className="h-4 w-4" />
            Get Support
          </Link>
          <Link
            href="https://github.com/myHerbDev"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            <ExternalLink className="h-4 w-4" />
            GitHub
          </Link>
          <Link
            href="/blog"
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            <MessageSquare className="h-4 w-4" />
            Blog
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function DocsLayout({ children }: DocsLayoutProps) {
  return (
    <div className="flex-1 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 border-r bg-gray-50/50 dark:bg-gray-900/50">
        <ScrollArea className="h-[calc(100vh-4rem)] p-6">
          <SidebarContent />
        </ScrollArea>
      </aside>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden fixed top-20 left-4 z-40">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <ScrollArea className="h-full p-6">
            <SidebarContent />
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 lg:pl-0 pl-16">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <Suspense fallback={<div className="animate-pulse">Loading...</div>}>{children}</Suspense>
        </div>
      </main>
    </div>
  )
}

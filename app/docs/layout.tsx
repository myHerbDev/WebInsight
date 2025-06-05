"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Book, Code, FileText, HelpCircle, MessageSquare, Search, Shield, Users, ExternalLink } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Suspense } from "react"
import { useSearchParams } from "next/navigation"

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

export default function DocsLayout({ children }: DocsLayoutProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const isActive = (href: string) => {
    if (href === "/docs" && pathname === "/docs") return true
    if (href !== "/docs" && pathname.startsWith(href)) return true
    return false
  }

  const SidebarContent = () => (
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

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
      </main>
      <Footer />
    </>
  )
}

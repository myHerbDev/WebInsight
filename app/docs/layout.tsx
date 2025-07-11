import type React from "react"
import { Sidebar } from "@/components/ui/sidebar"
import { Book, FileText, Zap, Settings } from "lucide-react"

const sidebarItems = [
  {
    title: "Getting Started",
    icon: Book,
    items: [
      { title: "Introduction", href: "/docs" },
      { title: "Quick Start", href: "/docs/quick-start" },
    ],
  },
  {
    title: "API Reference",
    icon: FileText,
    items: [{ title: "Analysis API", href: "/docs/api" }],
  },
  {
    title: "Features",
    icon: Zap,
    items: [
      { title: "Performance Analysis", href: "/docs/features/performance" },
      { title: "Sustainability Metrics", href: "/docs/features/sustainability" },
      { title: "Security Audit", href: "/docs/features/security" },
    ],
  },
  {
    title: "Configuration",
    icon: Settings,
    items: [
      { title: "Environment Setup", href: "/docs/config/environment" },
      { title: "Advanced Options", href: "/docs/config/advanced" },
    ],
  },
]

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar className="w-64 border-r bg-gray-50/50">
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Documentation</h2>
          <nav className="space-y-4">
            {sidebarItems.map((section) => (
              <div key={section.title}>
                <div className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <section.icon className="w-4 h-4" />
                  <span>{section.title}</span>
                </div>
                <ul className="space-y-1 ml-6">
                  {section.items.map((item) => (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        className="block text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-2 py-1 rounded transition-colors"
                      >
                        {item.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </Sidebar>

      <main className="flex-1 overflow-auto">
        <div className="container mx-auto px-6 py-8">{children}</div>
      </main>
    </div>
  )
}

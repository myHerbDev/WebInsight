import type React from "react"
import { Sidebar, SidebarContent, SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Book, Zap, Code, HelpCircle } from "lucide-react"
import Link from "next/link"

const sidebarItems = [
  {
    title: "Getting Started",
    items: [
      { title: "Quick Start", href: "/docs/quick-start", icon: Zap },
      { title: "API Reference", href: "/docs/api", icon: Code },
    ],
  },
  {
    title: "Guides",
    items: [
      { title: "Documentation", href: "/docs", icon: Book },
      { title: "Support", href: "/support", icon: HelpCircle },
    ],
  },
]

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar className="w-64 border-r bg-gray-50/50">
          <SidebarContent>
            <ScrollArea className="h-full py-6 px-4">
              <div className="space-y-6">
                {sidebarItems.map((section) => (
                  <div key={section.title}>
                    <h3 className="mb-3 text-sm font-semibold text-gray-900 uppercase tracking-wider">
                      {section.title}
                    </h3>
                    <div className="space-y-1">
                      {section.items.map((item) => (
                        <Link key={item.href} href={item.href}>
                          <Button
                            variant="ghost"
                            className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                          >
                            <item.icon className="mr-3 h-4 w-4" />
                            {item.title}
                          </Button>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </SidebarContent>
        </Sidebar>
        <main className="flex-1 overflow-hidden">
          <div className="h-full">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  )
}

"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LinkIcon, Search, Sparkles } from "lucide-react"

interface WebsiteFormProps {
  onSubmit: (url: string) => void
}

export function WebsiteForm({ onSubmit }: WebsiteFormProps) {
  const [url, setUrl] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (url.trim()) {
      let formattedUrl = url.trim()
      if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
        formattedUrl = `https://${formattedUrl}`
      }
      onSubmit(formattedUrl)
    }
  }

  return (
    <div className="bg-gradient-to-br from-card via-secondary/10 to-card dark:from-slate-900 dark:via-slate-800/20 dark:to-slate-900 rounded-xl border border-border shadow-lg p-6 sm:p-10 mb-10 relative overflow-hidden">
      {/* Subtle background pattern or glow - optional */}
      <div className="absolute inset-0 opacity-5 dark:opacity-[0.03] bg-[radial-gradient(circle_at_center,_rgba(var(--brand-default-rgb),0.1)_0%,_transparent_70%)]"></div>

      <div className="text-center mb-8 relative z-10">
        <Sparkles className="h-12 w-12 text-brand-DEFAULT mx-auto mb-4 animate-pulse-glow filter drop-shadow-[0_0_8px_rgba(var(--brand-default-rgb),0.5)]" />
        <h2 className="text-3xl sm:text-4xl font-semibold text-foreground tracking-tight">
          Unlock Web <span className="text-brand-DEFAULT">InSights</span>
        </h2>
        <p className="text-muted-foreground mt-2 text-sm sm:text-base max-w-md mx-auto">
          Enter a URL to analyze its performance, content, and sustainability with AI.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 max-w-xl mx-auto relative z-10">
        <div className="relative group">
          <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-brand-DEFAULT transition-colors" />
          <Input
            type="text"
            placeholder="e.g., example.com or https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="pl-12 pr-4 h-14 rounded-lg text-base border-input focus:ring-2 focus:ring-brand-DEFAULT/50 focus:border-brand-DEFAULT bg-background/70 dark:bg-slate-800/50 backdrop-blur-sm"
            aria-label="Website URL"
          />
        </div>

        <Button
          type="submit"
          className="w-full h-14 bg-gradient-to-r from-brand-DEFAULT to-blue-500 hover:from-brand-dark hover:to-blue-600 text-primary-foreground font-medium rounded-lg text-base flex items-center justify-center space-x-2.5 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] focus:ring-4 focus:ring-brand-DEFAULT/30"
          aria-label="Analyze Website"
          disabled={!url.trim()}
        >
          <Search className="h-5 w-5" />
          <span>Analyze Website</span>
        </Button>
      </form>
    </div>
  )
}

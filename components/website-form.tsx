"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LinkIcon, Search, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface WebsiteFormProps {
  onSubmit: (url: string) => void
  className?: string
}

export function WebsiteForm({ onSubmit, className }: WebsiteFormProps) {
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
    <div
      id="website-analysis-form" // Added ID for scrolling
      className={cn(
        "rounded-3xl border border-white/20 shadow-2xl p-6 sm:p-8 relative overflow-hidden",
        "bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl w-full max-w-2xl mx-auto", // Centered and max-width
        className,
      )}
    >
      {/* Enhanced aurora glow */}
      <div
        className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] -z-10 opacity-30 dark:opacity-20 animate-aurora"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at center, hsl(var(--primary-gradient-start) / 0.4) 0%, transparent 35%), radial-gradient(ellipse at center, hsl(var(--primary-gradient-end) / 0.4) 0%, transparent 35%)",
        }}
      />

      <div className="text-center mb-6 relative z-10">
        {/* Title and Sparkles moved to app/page.tsx for better layout control */}
        <p className="text-muted-foreground text-sm sm:text-base max-w-lg mx-auto">
          Enter a website URL for an AI-powered analysis of its performance, content, SEO, and sustainability.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 max-w-xl mx-auto relative z-10">
        <div className="relative group">
          <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary-gradient-start transition-colors" />
          <Input
            type="text"
            placeholder="e.g., example.com or https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="pl-12 pr-4 h-14 rounded-full text-base border-input focus:ring-2 focus:ring-primary-gradient-start/50 focus:border-primary-gradient-start bg-background/80 dark:bg-slate-800/60 backdrop-blur-sm shadow-inner-soft"
            aria-label="Website URL"
          />
        </div>

        <Button
          type="submit"
          className={cn(
            "w-full h-14 text-primary-foreground font-semibold rounded-full text-base flex items-center justify-center space-x-2.5 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] focus:ring-4 focus:ring-primary-gradient-start/30",
            "bg-primary-gradient hover:opacity-90",
          )}
          style={{ backgroundSize: "200% auto" }}
          aria-label="Analyze Website"
          disabled={!url.trim()}
        >
          <Search className="h-5 w-5" />
          <span>Analyze Website</span>
          <ArrowRight className="h-5 w-5 opacity-70 group-hover:opacity-100 transition-opacity" />
        </Button>
      </form>
    </div>
  )
}

"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LinkIcon, Search, Sparkles, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

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
    <div
      className={cn(
        "rounded-xl border border-border/70 shadow-xl p-6 sm:p-10 mb-12 relative overflow-hidden",
        "bg-card dark:bg-card", // Cleaner card background
      )}
    >
      {/* Subtle gradient glow effect from corners */}
      <div
        className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] -z-10 opacity-20 dark:opacity-10 animate-aurora"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at center, hsl(var(--primary-gradient-start) / 0.3) 0%, transparent 40%), radial-gradient(ellipse at center, hsl(var(--primary-gradient-end) / 0.3) 0%, transparent 40%)",
        }}
      />

      <div className="text-center mb-8 relative z-10">
        <div className="inline-block p-3 rounded-full bg-primary-gradient mb-5 shadow-lg">
          <Sparkles className="h-8 w-8 text-white animate-pulse-glow filter drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
          Discover Your Web<span className="text-transparent bg-clip-text bg-primary-gradient">InSights</span>
        </h2>
        <p className="text-muted-foreground mt-3 text-sm sm:text-base max-w-lg mx-auto">
          Enter a website URL to receive an AI-powered analysis of its performance, content, SEO, and sustainability.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto relative z-10">
        <div className="relative group">
          <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary-gradient-start transition-colors" />
          <Input
            type="text"
            placeholder="e.g., example.com or https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="pl-12 pr-4 h-14 rounded-lg text-base border-input focus:ring-2 focus:ring-primary-gradient-start/50 focus:border-primary-gradient-start bg-background/80 dark:bg-slate-800/60 backdrop-blur-sm shadow-inner-soft"
            aria-label="Website URL"
          />
        </div>

        <Button
          type="submit"
          className={cn(
            "w-full h-14 text-primary-foreground font-semibold rounded-lg text-base flex items-center justify-center space-x-2.5 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] focus:ring-4 focus:ring-primary-gradient-start/30",
            "bg-primary-gradient hover:opacity-90", // Apply gradient background
          )}
          style={{ backgroundSize: "200% auto" }} // For potential hover gradient animation
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

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
    <div className="bg-card rounded-lg border border-border shadow-sm p-6 sm:p-8 mb-8">
      <div className="text-center mb-6">
        <Sparkles className="h-10 w-10 text-brand-DEFAULT mx-auto mb-3" />
        <h2 className="text-2xl sm:text-3xl font-semibold text-foreground">Unlock Web Insights</h2>
        <p className="text-muted-foreground mt-1 text-sm sm:text-base">
          Enter a URL to analyze its performance, content, and sustainability.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto">
        <div className="relative">
          <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="e.g., example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="pl-11 h-12 rounded-md text-base border-input focus:ring-2 focus:ring-ring focus:border-ring"
            aria-label="Website URL"
          />
        </div>

        <Button
          type="submit"
          className="w-full h-12 bg-brand-DEFAULT hover:bg-brand-dark text-primary-foreground font-medium rounded-md text-base flex items-center justify-center space-x-2 shadow-sm hover:shadow-md transition-shadow"
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

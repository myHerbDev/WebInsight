"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LinkIcon, Search } from "lucide-react" // Using Search icon for button

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
    <div className="bg-white dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 mb-8">
      <h2 className="text-xl sm:text-2xl font-semibold text-center mb-2 text-slate-800 dark:text-slate-200">
        Analyze Any Website
      </h2>
      <p className="text-center text-slate-600 dark:text-slate-400 mb-6 text-sm sm:text-base">
        Get key insights, content analysis, and sustainability metrics.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto">
        <div className="relative">
          <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500" />
          <Input
            type="text"
            placeholder="Enter website URL (e.g., example.com)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="pl-10 h-12 rounded-lg text-base border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-brand-DEFAULT dark:focus:ring-brand-light"
            aria-label="Website URL"
          />
        </div>

        <Button
          type="submit"
          className="w-full h-12 bg-brand-DEFAULT hover:bg-brand-dark text-white font-medium rounded-lg text-base flex items-center justify-center space-x-2"
          aria-label="Analyze Website"
        >
          <Search className="h-5 w-5" />
          <span>Analyze Website</span>
        </Button>
      </form>
    </div>
  )
}

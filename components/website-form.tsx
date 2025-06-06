"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface WebsiteFormProps {
  onSubmit: (url: string) => void
  className?: string
}

export function WebsiteForm({ onSubmit, className }: WebsiteFormProps) {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return

    setIsLoading(true)
    try {
      await onSubmit(url.trim())
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn("w-full max-w-2xl mx-auto", className)} id="website-analysis-form">
      <div className="relative group">
        <div className="absolute inset-0 bg-primary-gradient rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
        <div className="relative glass-card rounded-2xl p-2 shadow-2xl">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500" />
              <Input
                type="text"
                placeholder="Enter website URL (e.g., https://example.com)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="pl-12 pr-4 py-4 text-lg border-0 bg-transparent focus:ring-0 focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                disabled={isLoading}
              />
            </div>
            <Button
              type="submit"
              disabled={!url.trim() || isLoading}
              className="bg-primary-gradient hover:opacity-90 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shimmer hover-lift"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                  <span>Analyzing...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-5 w-5" />
                  <span>Analyze</span>
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>
      <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-4">
        Get instant insights on performance, sustainability, and optimization opportunities
      </p>
    </form>
  )
}

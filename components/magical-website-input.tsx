"use client"
import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sparkles, Search, Loader2 } from "lucide-react"

interface MagicalWebsiteInputProps {
  onAnalyze: (url: string) => void
  isLoading: boolean
}

export function MagicalWebsiteInput({ onAnalyze, isLoading }: MagicalWebsiteInputProps) {
  const [url, setUrl] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (url.trim() && !isLoading) {
      onAnalyze(url.trim())
    }
  }

  return (
    <div className="relative p-1 rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 shadow-2xl hover:shadow-purple-500/50 transition-shadow duration-300">
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 bg-background dark:bg-gray-900/80 backdrop-blur-md p-2 rounded-full"
      >
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="url"
            placeholder="Enter website URL (e.g., https://example.com)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full h-12 pl-12 pr-4 rounded-full text-base bg-transparent text-foreground placeholder-muted-foreground border-none focus:ring-0 focus:outline-none"
            required
            aria-label="Website URL to analyze"
          />
        </div>
        <Button
          type="submit"
          disabled={isLoading || !url.trim()}
          className="h-12 px-6 text-base font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full shadow-lg transition-all duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75 flex items-center justify-center"
          aria-label="Analyze Website"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <Sparkles className="h-5 w-5 mr-2 opacity-80" />
              Analyze
            </>
          )}
        </Button>
      </form>
    </div>
  )
}

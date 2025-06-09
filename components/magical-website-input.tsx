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
    if (url.trim()) {
      onAnalyze(url.trim())
    }
  }

  return (
    <div className="bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-700 dark:to-purple-800 p-8 md:p-12 rounded-b-xl">
      <div className="text-center mb-8">
        <Sparkles className="h-12 w-12 text-yellow-300 mx-auto mb-4 animate-pulse-slow" />
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Unlock Your Website's Potential</h2>
        <p className="text-purple-200 max-w-xl mx-auto">
          Enter any website URL to get instant AI-powered analysis on sustainability, performance, security, and more.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center gap-3 bg-white/20 dark:bg-black/20 p-2 rounded-full shadow-xl backdrop-blur-sm">
          <div className="relative flex-grow w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-300" />
            <Input
              type="url"
              placeholder="e.g., https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full h-14 pl-12 pr-4 rounded-full text-lg bg-transparent text-white placeholder-purple-300 border-none focus:ring-0 focus:outline-none"
              required
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading || !url.trim()}
            className="w-full sm:w-auto h-14 px-8 py-2 text-lg font-semibold bg-yellow-400 hover:bg-yellow-500 text-purple-800 rounded-full shadow-md transition-transform duration-150 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-opacity-50 flex items-center justify-center"
          >
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <>
                <Sparkles className="h-5 w-5 mr-2" />
                Analyze Now
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

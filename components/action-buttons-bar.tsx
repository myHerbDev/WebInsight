"use client"

import { Button } from "@/components/ui/button"
import { Compass, BarChart3, SparklesIcon } from "lucide-react"
import Link from "next/link"

export function ActionButtonsBar() {
  const handleAIAnalyticsClick = () => {
    const formElement = document.getElementById("website-analysis-form")
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth", block: "center" })
      const inputElement = formElement.querySelector('input[type="text"]') as HTMLInputElement | null
      inputElement?.focus()
    }
  }

  return (
    <div className="mt-10 mb-6 sm:mb-12 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 p-3 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md rounded-full shadow-lg border border-white/30 dark:border-slate-700/50 max-w-md mx-auto">
      <Button
        variant="ghost"
        size="lg"
        className="w-full sm:w-auto flex-1 text-foreground/80 hover:text-primary-gradient-start hover:bg-primary-gradient-start/10 rounded-full transition-all duration-300 group"
        asChild
      >
        <Link href="/hosting">
          <Compass className="h-5 w-5 mr-2 group-hover:animate-spin-slow" />
          Discover
        </Link>
      </Button>
      <Button
        variant="ghost"
        size="lg"
        className="w-full sm:w-auto flex-1 text-foreground/80 hover:text-primary-gradient-middle hover:bg-primary-gradient-middle/10 rounded-full transition-all duration-300 group"
        onClick={handleAIAnalyticsClick}
      >
        <BarChart3 className="h-5 w-5 mr-2 group-hover:animate-pulse" />
        AI Analytics
      </Button>
      <Button
        variant="ghost"
        size="lg"
        className="w-full sm:w-auto flex-1 text-foreground/80 hover:text-primary-gradient-end hover:bg-primary-gradient-end/10 rounded-full transition-all duration-300 group"
        asChild
      >
        {/* Assuming you have or will create a content generation page */}
        <Link href="/content-generator">
          <SparklesIcon className="h-5 w-5 mr-2 group-hover:animate-ping-slow" />
          Generate Content
        </Link>
      </Button>
    </div>
  )
}

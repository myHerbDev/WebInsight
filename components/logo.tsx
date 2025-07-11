"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { Sparkles } from "lucide-react"

interface LogoProps {
  size?: "sm" | "md" | "lg"
  showText?: boolean
  className?: string
}

export function Logo({ size = "md", showText = true, className }: LogoProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  }

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  }

  return (
    <Link href="/" className={cn("flex items-center space-x-2 group", className)}>
      <div className="relative">
        <div
          className={cn(
            "rounded-lg bg-gradient-to-br from-purple-600 via-blue-600 to-teal-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105",
            sizeClasses[size],
          )}
        >
          <Sparkles className="h-1/2 w-1/2 text-white" />
        </div>
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse" />
      </div>
      {showText && (
        <span
          className={cn(
            "font-bold tracking-tight bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent group-hover:from-purple-700 group-hover:via-blue-700 group-hover:to-teal-700 transition-all duration-300",
            textSizeClasses[size],
          )}
        >
          WSfynder
        </span>
      )}
    </Link>
  )
}

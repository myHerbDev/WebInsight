"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { Search, Zap } from "lucide-react"

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
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
  }

  return (
    <Link href="/" className={cn("flex items-center space-x-2 group", className)}>
      <div
        className={cn(
          "relative rounded-xl bg-gradient-to-br from-purple-600 via-blue-600 to-teal-600 p-2 shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:scale-105",
          sizeClasses[size],
        )}
      >
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-400/20 to-teal-400/20 blur-sm"></div>
        <div className="relative flex items-center justify-center">
          <Search className="h-4 w-4 text-white" />
          <Zap className="h-3 w-3 text-yellow-300 absolute -top-0.5 -right-0.5" />
        </div>
      </div>
      {showText && (
        <span
          className={cn(
            "font-bold tracking-tight bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent transition-all duration-300 group-hover:from-purple-500 group-hover:via-blue-500 group-hover:to-teal-500",
            textSizeClasses[size],
          )}
        >
          WSfynder
        </span>
      )}
    </Link>
  )
}

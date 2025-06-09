"use client"

import { Globe, Zap, Shield } from "lucide-react"

interface LogoProps {
  size?: "sm" | "md" | "lg"
  showText?: boolean
  className?: string
}

export function Logo({ size = "md", showText = true, className = "" }: LogoProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  }

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-3xl",
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="relative">
        {/* Main globe icon with gradient background */}
        <div
          className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-blue-500 via-purple-600 to-teal-500 p-1.5 shadow-lg`}
        >
          <Globe className="w-full h-full text-white" />
        </div>

        {/* Insight indicators */}
        <div className="absolute -top-1 -right-1">
          <div className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-sm">
            <Zap className="w-1.5 h-1.5 text-white" />
          </div>
        </div>

        <div className="absolute -bottom-1 -left-1">
          <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-sm">
            <Shield className="w-1.5 h-1.5 text-white" />
          </div>
        </div>
      </div>

      {showText && (
        <div className="flex flex-col">
          <h1
            className={`${textSizeClasses[size]} font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent leading-tight`}
          >
            WebInsight
          </h1>
          {size !== "sm" && (
            <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1">Analyze • Optimize • Sustain</p>
          )}
        </div>
      )}
    </div>
  )
}

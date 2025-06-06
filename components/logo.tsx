"use client"

import { cn } from "@/lib/utils"
import { Brain } from "lucide-react"

interface LogoProps {
  size?: "sm" | "md" | "lg"
  showText?: boolean
  className?: string
  iconOnly?: boolean
}

export function Logo({ size = "md", showText = true, className = "", iconOnly = false }: LogoProps) {
  const iconContainerSizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  }

  const iconSizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 w-5",
    lg: "w-6 h-6",
  }

  const textSizeClasses = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
  }

  return (
    <div className={cn("flex items-center", className)}>
      {/* Google-style minimalist logo container */}
      <div
        className={cn(
          iconContainerSizeClasses[size],
          "rounded-xl flex items-center justify-center shadow-lg relative overflow-visible",
          "bg-gradient-to-br from-blue-500 to-purple-600 hover:shadow-xl hover:scale-105 transition-all duration-300",
        )}
      >
        <Brain className={cn(iconSizeClasses[size], "text-white relative z-10")} />

        {/* Subtle glow effect */}
        <div className="absolute inset-0 bg-white opacity-20 blur-md rounded-xl"></div>
      </div>

      {!iconOnly && showText && (
        <h1 className={cn(textSizeClasses[size], "font-bold ml-3 tracking-tight")}>
          <span className="text-gray-800 dark:text-white">Web</span>
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">InSight</span>
        </h1>
      )}
    </div>
  )
}

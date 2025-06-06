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
    md: "w-5 h-5",
    lg: "w-6 h-6",
  }

  const textSizeClasses = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
  }

  return (
    <div className={cn("flex items-center", className)}>
      {/* Fixed logo container - removed overlapping shapes */}
      <div
        className={cn(
          iconContainerSizeClasses[size],
          "rounded-xl flex items-center justify-center text-white transition-all duration-300 ease-out relative overflow-visible",
          "bg-primary-gradient hover:shadow-lg hover:scale-105 shadow-md",
        )}
      >
        {/* Removed any background shapes that were covering the icon */}
        <Brain className={cn(iconSizeClasses[size], "relative z-10 drop-shadow-sm")} />

        {/* Optional glow effect */}
        <div className="absolute inset-0 rounded-xl bg-primary-gradient opacity-20 blur-sm scale-110 -z-10" />
      </div>

      {!iconOnly && showText && (
        <h1 className={cn(textSizeClasses[size], "font-semibold text-foreground ml-3 tracking-tight")}>
          Web<span className="text-transparent bg-clip-text bg-primary-gradient font-bold">InSight</span>
        </h1>
      )}
    </div>
  )
}

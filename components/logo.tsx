"use client"

import { cn } from "@/lib/utils"
import { Brain } from "lucide-react" // Using Zap or Brain for AI feel

interface LogoProps {
  size?: "sm" | "md" | "lg"
  showText?: boolean
  className?: string
  iconOnly?: boolean
}

export function Logo({ size = "md", showText = true, className = "", iconOnly = false }: LogoProps) {
  const iconContainerSizeClasses = {
    sm: "w-8 h-8", // Adjusted for new design
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

  const IconComponent = Brain // Or Zap, or a custom SVG path

  return (
    <div className={cn("flex items-center", className)}>
      <div
        className={cn(
          iconContainerSizeClasses[size],
          "rounded-lg flex items-center justify-center text-white transition-all duration-300 ease-out",
          "bg-primary-gradient hover:shadow-lg hover:scale-105", // Gradient background
        )}
        style={{ backgroundSize: "200% 200%" }} // For gradient animation if desired
      >
        <IconComponent className={cn(iconSizeClasses[size])} />
      </div>

      {!iconOnly && showText && (
        <h1 className={cn(textSizeClasses[size], "font-semibold text-foreground ml-2.5 tracking-tight")}>
          Web<span className="text-transparent bg-clip-text bg-primary-gradient">InSight</span>
        </h1>
      )}
    </div>
  )
}

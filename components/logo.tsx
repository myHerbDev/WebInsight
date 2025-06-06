"use client"

import { Search } from "lucide-react" // Changed icon to something simpler

interface LogoProps {
  size?: "sm" | "md" | "lg"
  showText?: boolean
  className?: string
}

export function Logo({ size = "md", showText = true, className = "" }: LogoProps) {
  const sizeClasses = {
    sm: "w-5 h-5", // Slightly smaller
    md: "w-6 h-6",
    lg: "w-8 h-8",
  }

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl", // Adjusted for balance
    lg: "text-2xl",
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className={`${sizeClasses[size]} rounded-md bg-brand-DEFAULT flex items-center justify-center text-white`}>
        <Search className="w-[60%] h-[60%]" />
      </div>

      {showText && (
        <h1 className={`${textSizeClasses[size]} font-semibold text-slate-800 dark:text-slate-200 tracking-tight`}>
          WebInSight
        </h1>
      )}
    </div>
  )
}

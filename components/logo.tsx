"use client"

import { Search } from "lucide-react"

interface LogoProps {
  size?: "sm" | "md" | "lg"
  showText?: boolean
  className?: string
}

export function Logo({ size = "md", showText = true, className = "" }: LogoProps) {
  const sizeClasses = {
    sm: "w-6 h-6", // Adjusted for better visual balance
    md: "w-7 h-7",
    lg: "w-9 h-9",
  }

  const iconSizeClasses = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  }

  const textSizeClasses = {
    sm: "text-xl", // Slightly larger for 'sm'
    md: "text-2xl",
    lg: "text-3xl",
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div
        className={`${sizeClasses[size]} rounded-md bg-brand-DEFAULT flex items-center justify-center text-white shadow-sm`}
      >
        <Search className={`${iconSizeClasses[size]}`} />
      </div>

      {showText && (
        <h1 className={`${textSizeClasses[size]} font-semibold text-slate-800 dark:text-slate-100 tracking-tight`}>
          Web<span className="text-brand-DEFAULT">InSight</span>
        </h1>
      )}
    </div>
  )
}

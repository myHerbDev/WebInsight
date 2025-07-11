import { cn } from "@/lib/utils"
import { Search, Zap } from "lucide-react"

interface LogoProps {
  size?: "sm" | "md" | "lg"
  showText?: boolean
  className?: string
}

export function Logo({ size = "md", showText = false, className }: LogoProps) {
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
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn("relative rounded-lg bg-gradient-to-br from-purple-500 to-teal-500 p-2", sizeClasses[size])}>
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-teal-600/20 rounded-lg"></div>
        <div className="relative flex items-center justify-center h-full w-full">
          <Search className="h-1/2 w-1/2 text-white" />
          <Zap className="h-1/3 w-1/3 text-white/80 absolute -bottom-0.5 -right-0.5" />
        </div>
      </div>
      {showText && (
        <span
          className={cn(
            "font-bold tracking-tight bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent",
            textSizeClasses[size],
          )}
        >
          WSfynder
        </span>
      )}
    </div>
  )
}

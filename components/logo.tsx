import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
  showText?: boolean
}

export function Logo({ className, size = "md", showText = true }: LogoProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  }

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn("rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 p-1.5", sizeClasses[size])}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-full w-full text-white"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
          <circle cx="11" cy="11" r="3" />
        </svg>
      </div>
      {showText && (
        <span
          className={cn(
            "font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent",
            textSizeClasses[size],
          )}
        >
          WSfynder
        </span>
      )}
    </div>
  )
}

import type React from "react"
import { cn } from "@/lib/utils"

interface GoogleStyleCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function GoogleStyleCard({ children, className, ...props }: GoogleStyleCardProps) {
  return (
    <div
      className={cn(
        "bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 overflow-hidden transition-all duration-300 ease-in-out",
        className,
      )}
      {...props}
    >
      <div className="p-6 md:p-8">{children}</div>
    </div>
  )
}

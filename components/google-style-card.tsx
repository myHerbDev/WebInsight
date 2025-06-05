"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface GoogleStyleCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
}

export function GoogleStyleCard({ children, className, hover = true, onClick }: GoogleStyleCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { y: -2, scale: 1.01 } : undefined}
      onClick={onClick}
      className={cn(
        "bg-white rounded-2xl shadow-sm border border-gray-100 p-6",
        "hover:shadow-lg hover:border-gray-200 transition-all duration-300",
        "backdrop-blur-sm bg-white/95",
        onClick && "cursor-pointer",
        className,
      )}
    >
      {children}
    </motion.div>
  )
}

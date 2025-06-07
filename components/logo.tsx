"use client"

import { cn } from "@/lib/utils"

import Link from "next/link"
import { Sparkles } from "lucide-react"
import { motion } from "framer-motion"

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
  showText?: boolean // Added to control text visibility explicitly
}

export function Logo({ size = "md", className = "", showText = true }: LogoProps) {
  const sizes = {
    sm: { icon: 16, text: "text-lg", container: "h-8" },
    md: { icon: 20, text: "text-xl", container: "h-10" },
    lg: { icon: 28, text: "text-2xl", container: "h-12" },
    xl: { icon: 36, text: "text-3xl", container: "h-16" },
  }

  const currentSize = sizes[size]

  return (
    <Link href="/" className={cn("flex items-center gap-2 group", className)}>
      <motion.div
        className={`relative flex items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-0.5 shadow-md group-hover:shadow-lg transition-shadow duration-300`}
        style={{ width: currentSize.icon * 1.8, height: currentSize.icon * 1.8 }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="absolute inset-0.5 bg-background rounded-[5px] flex items-center justify-center">
          <Sparkles
            size={currentSize.icon}
            className="text-transparent bg-clip-text bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 group-hover:animate-pulse"
          />
        </div>
        <motion.div
          className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0, 1, 0.8, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            delay: 0.2,
          }}
        />
      </motion.div>
      {showText && (
        <motion.span
          className={cn(
            currentSize.text,
            "font-bold tracking-tight text-foreground group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:via-purple-500 group-hover:to-pink-500 transition-all duration-300",
          )}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          WScrapierr
        </motion.span>
      )}
    </Link>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Globe, Zap, Shield, Sparkles, BarChart3, Search } from "lucide-react"
import { motion } from "framer-motion"

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl"
  showText?: boolean
  className?: string
  animated?: boolean
}

export function Logo({ size = "md", showText = true, className = "", animated = false }: LogoProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  }

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-3xl",
    xl: "text-4xl",
  }

  const iconSizeClasses = {
    sm: "w-1.5 h-1.5",
    md: "w-2 h-2",
    lg: "w-3 h-3",
    xl: "w-4 h-4",
  }

  const orbitSizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-6 h-6",
    xl: "w-8 h-8",
  }

  if (!isClient) {
    // Simple static version for SSR
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div
          className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-blue-500 via-purple-600 to-teal-500 p-1.5 shadow-lg`}
        >
          <Globe className="w-full h-full text-white" />
        </div>
        {showText && (
          <div className="flex flex-col">
            <h1
              className={`${textSizeClasses[size]} font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent leading-tight`}
            >
              WebInSight
            </h1>
            {size !== "sm" && (
              <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1">Analyze • Optimize • Sustain</p>
            )}
          </div>
        )}
      </div>
    )
  }

  // Enhanced animated version for client-side
  return (
    <div
      className={`flex items-center space-x-3 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        {/* Main globe with 3D effect */}
        <motion.div
          className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-blue-500 via-purple-600 to-teal-500 p-1.5 shadow-lg relative z-10`}
          animate={
            animated || isHovered
              ? {
                  rotateY: [0, 180, 360],
                  scale: [1, 1.05, 1],
                }
              : {}
          }
          transition={{
            duration: 3,
            ease: "easeInOut",
            repeat: animated ? Number.POSITIVE_INFINITY : 0,
            repeatDelay: animated ? 5 : 0,
          }}
        >
          <Globe className="w-full h-full text-white" />

          {/* Inner glow effect */}
          <div className="absolute inset-0 rounded-full bg-white/20 blur-sm z-0"></div>
        </motion.div>

        {/* Orbiting elements */}
        <motion.div
          className={`absolute ${orbitSizeClasses[size]} -top-1 -right-1 z-20`}
          animate={
            animated || isHovered
              ? {
                  rotate: [0, 360],
                  scale: [1, 1.1, 1],
                }
              : {}
          }
          transition={{
            duration: 4,
            ease: "linear",
            repeat: animated ? Number.POSITIVE_INFINITY : 0,
          }}
        >
          <div className="w-full h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
            <Zap className={`${iconSizeClasses[size]} text-white`} />
          </div>
        </motion.div>

        <motion.div
          className={`absolute ${orbitSizeClasses[size]} -bottom-1 -left-1 z-20`}
          animate={
            animated || isHovered
              ? {
                  rotate: [0, -360],
                  scale: [1, 1.1, 1],
                }
              : {}
          }
          transition={{
            duration: 5,
            ease: "linear",
            repeat: animated ? Number.POSITIVE_INFINITY : 0,
          }}
        >
          <div className="w-full h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
            <Shield className={`${iconSizeClasses[size]} text-white`} />
          </div>
        </motion.div>

        <motion.div
          className={`absolute ${orbitSizeClasses[size]} top-1/2 -translate-y-1/2 -right-2 z-20`}
          animate={
            animated || isHovered
              ? {
                  rotate: [0, 360],
                  scale: [1, 1.1, 1],
                }
              : {}
          }
          transition={{
            duration: 6,
            ease: "linear",
            repeat: animated ? Number.POSITIVE_INFINITY : 0,
            delay: 0.5,
          }}
        >
          <div className="w-full h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
            <Search className={`${iconSizeClasses[size]} text-white`} />
          </div>
        </motion.div>

        <motion.div
          className={`absolute ${orbitSizeClasses[size]} top-1/2 -translate-y-1/2 -left-2 z-20`}
          animate={
            animated || isHovered
              ? {
                  rotate: [0, -360],
                  scale: [1, 1.1, 1],
                }
              : {}
          }
          transition={{
            duration: 7,
            ease: "linear",
            repeat: animated ? Number.POSITIVE_INFINITY : 0,
            delay: 0.7,
          }}
        >
          <div className="w-full h-full bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
            <BarChart3 className={`${iconSizeClasses[size]} text-white`} />
          </div>
        </motion.div>

        {/* Glowing effect on hover */}
        {isHovered && (
          <motion.div
            className="absolute inset-0 rounded-full bg-blue-500/20 blur-md z-0"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1.5 }}
            exit={{ opacity: 0, scale: 0.8 }}
          />
        )}
      </div>

      {showText && (
        <motion.div
          className="flex flex-col"
          animate={isHovered ? { y: [0, -2, 0] } : {}}
          transition={{ duration: 0.5 }}
        >
          <motion.h1
            className={`${textSizeClasses[size]} font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent leading-tight`}
            animate={
              isHovered
                ? {
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }
                : {}
            }
            transition={{ duration: 3, ease: "easeInOut" }}
            style={{ backgroundSize: "200% 200%" }}
          >
            WebInSight
          </motion.h1>
          {size !== "sm" && (
            <div className="flex items-center space-x-1">
              <p className="text-xs text-gray-700 dark:text-gray-300 font-medium">Analyze</p>
              <Sparkles className="w-3 h-3 text-yellow-500" />
              <p className="text-xs text-gray-700 dark:text-gray-300 font-medium">Optimize</p>
              <Sparkles className="w-3 h-3 text-emerald-500" />
              <p className="text-xs text-gray-700 dark:text-gray-300 font-medium">Sustain</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}

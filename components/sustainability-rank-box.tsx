"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, Leaf, Award, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface SustainabilityRankBoxProps {
  score: number
  rank?: string
  className?: string
}

interface Star {
  id: number
  x: number
  y: number
  size: number
  color: string
  delay: number
  duration: number
}

export function SustainabilityRankBox({ score, rank, className = "" }: SustainabilityRankBoxProps) {
  const [stars, setStars] = useState<Star[]>([])
  const [isVisible, setIsVisible] = useState(false)

  // Generate random stars
  const generateStars = () => {
    const newStars: Star[] = []
    const colors = [
      "#FFD700", // Gold
      "#00FF7F", // Spring Green
      "#00CED1", // Dark Turquoise
      "#FF69B4", // Hot Pink
      "#9370DB", // Medium Purple
      "#32CD32", // Lime Green
      "#FF6347", // Tomato
      "#1E90FF", // Dodger Blue
    ]

    for (let i = 0; i < 20; i++) {
      newStars.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 2,
        duration: Math.random() * 2 + 1,
      })
    }
    setStars(newStars)
  }

  useEffect(() => {
    setIsVisible(true)
    generateStars()

    // Regenerate stars periodically
    const interval = setInterval(() => {
      generateStars()
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  const getRankText = (score: number) => {
    if (score >= 90) return "Exceptional"
    if (score >= 80) return "Excellent"
    if (score >= 70) return "Very Good"
    if (score >= 60) return "Good"
    if (score >= 50) return "Fair"
    return "Needs Improvement"
  }

  const getRankColor = (score: number) => {
    if (score >= 90) return "from-emerald-400 via-green-500 to-teal-600"
    if (score >= 80) return "from-green-400 via-emerald-500 to-cyan-600"
    if (score >= 70) return "from-lime-400 via-green-500 to-emerald-600"
    if (score >= 60) return "from-yellow-400 via-lime-500 to-green-600"
    if (score >= 50) return "from-orange-400 via-yellow-500 to-lime-600"
    return "from-red-400 via-orange-500 to-yellow-600"
  }

  const getIconColor = (score: number) => {
    if (score >= 80) return "text-green-500"
    if (score >= 60) return "text-yellow-500"
    return "text-orange-500"
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`relative ${className}`}
    >
      <Card className="relative overflow-hidden border-2 border-transparent bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 shadow-2xl">
        {/* Animated gradient border */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-r ${getRankColor(score)} opacity-20`}
          animate={{
            background: [
              `linear-gradient(45deg, ${getRankColor(score).split(" ")[1]}, ${getRankColor(score).split(" ")[3]})`,
              `linear-gradient(135deg, ${getRankColor(score).split(" ")[3]}, ${getRankColor(score).split(" ")[1]})`,
              `linear-gradient(225deg, ${getRankColor(score).split(" ")[1]}, ${getRankColor(score).split(" ")[3]})`,
            ],
          }}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />

        {/* Sparkling stars */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <AnimatePresence>
            {stars.map((star) => (
              <motion.div
                key={star.id}
                className="absolute"
                style={{
                  left: `${star.x}%`,
                  top: `${star.y}%`,
                }}
                initial={{ opacity: 0, scale: 0, rotate: 0 }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  scale: [0, 1, 1.2, 0],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: star.duration,
                  delay: star.delay,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatDelay: 1,
                  ease: "easeInOut",
                }}
              >
                <Sparkles size={star.size} style={{ color: star.color }} className="drop-shadow-lg" />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute w-2 h-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-full opacity-60"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-20, -40, -20],
                x: [-10, 10, -10],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Number.POSITIVE_INFINITY,
                delay: Math.random() * 2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        <CardContent className="relative z-10 p-8 text-center">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mb-6"
          >
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Leaf className={`h-6 w-6 ${getIconColor(score)}`} />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Sustainability Rank</h3>
              <Award className={`h-6 w-6 ${getIconColor(score)}`} />
            </div>
            <Badge
              variant="outline"
              className={`bg-gradient-to-r ${getRankColor(score)} text-white border-none px-4 py-1 text-sm font-medium`}
            >
              {rank || getRankText(score)}
            </Badge>
          </motion.div>

          {/* Score Display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8, type: "spring", bounce: 0.4 }}
            className="mb-6"
          >
            <div className="relative">
              <motion.div
                className={`text-6xl font-bold bg-gradient-to-r ${getRankColor(score)} bg-clip-text text-transparent`}
                animate={{
                  textShadow: [
                    "0 0 20px rgba(34, 197, 94, 0.5)",
                    "0 0 40px rgba(34, 197, 94, 0.8)",
                    "0 0 20px rgba(34, 197, 94, 0.5)",
                  ],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              >
                {score}%
              </motion.div>

              {/* Pulsing ring around score */}
              <motion.div
                className={`absolute inset-0 rounded-full border-4 border-gradient-to-r ${getRankColor(score)} opacity-30`}
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                style={{
                  background: `conic-gradient(from 0deg, transparent, rgba(34, 197, 94, 0.2), transparent)`,
                }}
              />
            </div>
          </motion.div>

          {/* Progress Indicator */}
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "100%" }}
            transition={{ delay: 0.8, duration: 1 }}
            className="mb-4"
          >
            <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className={`h-full bg-gradient-to-r ${getRankColor(score)} rounded-full relative`}
                initial={{ width: 0 }}
                animate={{ width: `${score}%` }}
                transition={{ delay: 1, duration: 1.5, ease: "easeOut" }}
              >
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                />
              </motion.div>
            </div>
          </motion.div>

          {/* Trend Indicator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-400"
          >
            <TrendingUp className={`h-4 w-4 ${getIconColor(score)}`} />
            <span>Environmental Impact Score</span>
          </motion.div>
        </CardContent>

        {/* Glow effect */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-r ${getRankColor(score)} opacity-10 blur-xl`}
          animate={{
            opacity: [0.1, 0.2, 0.1],
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
      </Card>
    </motion.div>
  )
}

"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Share2, Bookmark, TrendingUp, TrendingDown, Minus } from "lucide-react"
import type { ReactNode } from "react"

interface GoogleResultsCardProps {
  title: string
  url: string
  description: string
  score?: number
  scoreLabel?: string
  children?: ReactNode
  onShare?: () => void
  onBookmark?: () => void
  className?: string
}

export function GoogleResultsCard({
  title,
  url,
  description,
  score,
  scoreLabel,
  children,
  onShare,
  onBookmark,
  className = "",
}: GoogleResultsCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return "bg-green-50 text-green-700 border-green-200"
    if (score >= 60) return "bg-yellow-50 text-yellow-700 border-yellow-200"
    return "bg-red-50 text-red-700 border-red-200"
  }

  const getTrendIcon = (score: number) => {
    if (score >= 80) return <TrendingUp className="h-4 w-4 text-green-500" />
    if (score >= 60) return <Minus className="h-4 w-4 text-yellow-500" />
    return <TrendingDown className="h-4 w-4 text-red-500" />
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, scale: 1.01 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <Card className="google-card border-0 hover:google-shadow-xl group">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-xl font-medium text-blue-600 hover:text-blue-800 transition-colors duration-200 truncate">
                  <a href={url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {title}
                  </a>
                </h3>
                <ExternalLink className="h-4 w-4 text-gray-400 flex-shrink-0" />
              </div>

              <div className="flex items-center space-x-2 mb-2">
                <span className="text-sm text-green-700 font-medium">{url}</span>
                {score !== undefined && (
                  <div className="flex items-center space-x-1">
                    {getTrendIcon(score)}
                    <Badge variant="outline" className={getScoreBadgeColor(score)}>
                      {scoreLabel || `${score}%`}
                    </Badge>
                  </div>
                )}
              </div>

              <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{description}</p>
            </div>

            {(onShare || onBookmark) && (
              <div className="flex items-center space-x-1 ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {onBookmark && (
                  <Button variant="ghost" size="sm" onClick={onBookmark} className="h-8 w-8 p-0 hover:bg-gray-100">
                    <Bookmark className="h-4 w-4" />
                  </Button>
                )}
                {onShare && (
                  <Button variant="ghost" size="sm" onClick={onShare} className="h-8 w-8 p-0 hover:bg-gray-100">
                    <Share2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardHeader>

        {children && <CardContent className="pt-0">{children}</CardContent>}

        {/* Subtle hover effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 via-blue-50/20 to-blue-50/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />
      </Card>
    </motion.div>
  )
}

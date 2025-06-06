"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus, Zap, Shield, Search, BarChart3 } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import type { WebsiteData } from "@/types/website-data"

interface Metric {
  title: string
  value: number
  icon: LucideIcon
  description: string
  color: string
  unit?: string
}

interface GoogleMetricsGridProps {
  analysisData?: WebsiteData | null
}

export function GoogleMetricsGrid({ analysisData }: GoogleMetricsGridProps) {
  // Default metrics if no data is provided
  const defaultMetrics: Metric[] = [
    {
      title: "Performance",
      value: 0,
      icon: Zap,
      description: "No data available",
      color: "from-gray-400 to-gray-500",
      unit: "%",
    },
    {
      title: "SEO",
      value: 0,
      icon: Search,
      description: "No data available",
      color: "from-gray-400 to-gray-500",
      unit: "%",
    },
    {
      title: "Security",
      value: 0,
      icon: Shield,
      description: "No data available",
      color: "from-gray-400 to-gray-500",
      unit: "%",
    },
    {
      title: "Sustainability",
      value: 0,
      icon: BarChart3,
      description: "No data available",
      color: "from-gray-400 to-gray-500",
      unit: "%",
    },
  ]

  // Generate metrics from analysis data if available
  const metrics: Metric[] = analysisData
    ? [
        {
          title: "Performance",
          value: analysisData.performance_score || 0,
          icon: Zap,
          description: "Website loading speed and responsiveness",
          color: "from-blue-400 to-blue-600",
          unit: "%",
        },
        {
          title: "SEO",
          value: analysisData.seo_score || 0,
          icon: Search,
          description: "Search engine optimization score",
          color: "from-green-400 to-green-600",
          unit: "%",
        },
        {
          title: "Security",
          value: analysisData.security_score || 0,
          icon: Shield,
          description: "Website security and protection",
          color: "from-purple-400 to-purple-600",
          unit: "%",
        },
        {
          title: "Sustainability",
          value: analysisData.sustainability_score || 0,
          icon: BarChart3,
          description: "Environmental impact and efficiency",
          color: "from-teal-400 to-teal-600",
          unit: "%",
        },
      ]
    : defaultMetrics

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-green-500"
    if (score >= 60) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getTrendIcon = (score: number) => {
    if (score >= 80) return <TrendingUp className="h-4 w-4 text-green-500" />
    if (score >= 60) return <Minus className="h-4 w-4 text-yellow-500" />
    return <TrendingDown className="h-4 w-4 text-red-500" />
  }

  const getBadgeText = (score: number) => {
    if (score >= 90) return "Excellent"
    if (score >= 80) return "Good"
    if (score >= 60) return "Fair"
    return "Poor"
  }

  const getBadgeClass = (score: number) => {
    if (score >= 80) return "bg-green-50 text-green-700 border-green-200"
    if (score >= 60) return "bg-yellow-50 text-yellow-700 border-yellow-200"
    return "bg-red-50 text-red-700 border-red-200"
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => {
        const Icon = metric.icon
        const score = metric.value

        return (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -4, scale: 1.02 }}
          >
            <Card className="google-card border-0 hover:google-shadow-xl group relative overflow-hidden">
              {/* Gradient accent */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${metric.color}`} />

              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600 group-hover:text-gray-800 transition-colors">
                    {metric.title}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Icon className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                    {getTrendIcon(score)}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div
                    className={`text-3xl font-bold ${getScoreColor(score)} group-hover:scale-105 transition-transform`}
                  >
                    {score}
                    {metric.unit || "%"}
                  </div>
                  <Badge variant="outline" className={getBadgeClass(score)}>
                    {getBadgeText(score)}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <Progress value={score} className="h-2 bg-gray-100" />
                  <p className="text-xs text-gray-500 leading-relaxed">{metric.description}</p>
                </div>
              </CardContent>

              {/* Shimmer effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}

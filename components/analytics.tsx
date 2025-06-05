"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus, Shield, Zap, Globe, Users, AlertTriangle } from "lucide-react"
import { motion } from "framer-motion"
import type { WebsiteData } from "@/types/website-data"
import { useState, useEffect } from "react"

interface AnalyticsProps {
  data: WebsiteData
}

export function Analytics({ data }: AnalyticsProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Safe data extraction with fallbacks
  const safeData = {
    sustainability_score: data?.sustainability?.score || data?.sustainability_score || 0,
    performance_score: data?.sustainability?.performance || data?.performance_score || 0,
    script_optimization_score: data?.sustainability?.scriptOptimization || data?.script_optimization_score || 0,
    content_quality_score: data?.content_quality_score || 0,
    security_score: data?.security_score || 0,
    content_stats: data?.contentStats || {},
    hosting_provider_name: data?.hosting_provider_name || "Unknown",
    server_location: data?.server_location || "Unknown",
    ip_address: data?.ip_address || "Unknown",
  }

  const getScoreColor = (score: number) => {
    if (typeof score !== "number" || isNaN(score)) return "text-gray-500"
    if (score >= 80) return "text-green-600 dark:text-green-400"
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  const getProgressColor = (score: number) => {
    if (typeof score !== "number" || isNaN(score)) return "bg-gray-300"
    if (score >= 80) return "bg-green-500"
    if (score >= 60) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getTrendIcon = (score: number) => {
    if (typeof score !== "number" || isNaN(score)) {
      return <AlertTriangle className="h-4 w-4 text-gray-500" />
    }
    if (score >= 80) return <TrendingUp className="h-4 w-4 text-green-500" />
    if (score >= 60) return <Minus className="h-4 w-4 text-yellow-500" />
    return <TrendingDown className="h-4 w-4 text-red-500" />
  }

  const getBadgeText = (score: number) => {
    if (typeof score !== "number" || isNaN(score)) return "Unknown"
    if (score >= 80) return "Excellent"
    if (score >= 60) return "Good"
    return "Needs Work"
  }

  const getBadgeClass = (score: number) => {
    if (typeof score !== "number" || isNaN(score)) {
      return "border-gray-200 text-gray-700 bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:bg-gray-800"
    }
    if (score >= 80) {
      return "border-green-200 text-green-700 bg-green-50 dark:border-green-800 dark:text-green-300 dark:bg-green-900/20"
    }
    if (score >= 60) {
      return "border-yellow-200 text-yellow-700 bg-yellow-50 dark:border-yellow-800 dark:text-yellow-300 dark:bg-yellow-900/20"
    }
    return "border-red-200 text-red-700 bg-red-50 dark:border-red-800 dark:text-red-300 dark:bg-red-900/20"
  }

  const analytics = [
    {
      title: "Sustainability Score",
      value: safeData.sustainability_score,
      icon: Globe,
      description: "Overall environmental impact rating",
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Performance Score",
      value: safeData.performance_score,
      icon: Zap,
      description: "Website loading and optimization metrics",
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Security Score",
      value: safeData.security_score,
      icon: Shield,
      description: "Security headers and SSL configuration",
      color: "from-purple-500 to-violet-500",
    },
    {
      title: "Content Quality",
      value: safeData.content_quality_score,
      icon: Users,
      description: "Content structure and SEO optimization",
      color: "from-orange-500 to-red-500",
    },
  ]

  // Don't render until client-side to avoid hydration issues
  if (!isClient) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-2 bg-gray-200 rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {analytics.map((metric, index) => {
          const Icon = metric.icon
          const score = typeof metric.value === "number" ? metric.value : 0

          return (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="relative overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${metric.color}`} />
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {metric.title}
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <Icon className="h-4 w-4 text-gray-500" />
                      {getTrendIcon(score)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`text-3xl font-bold ${getScoreColor(score)}`}>
                        {typeof score === "number" && !isNaN(score) ? `${score}%` : "N/A"}
                      </div>
                      <Badge variant="outline" className={getBadgeClass(score)}>
                        {getBadgeText(score)}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <Progress value={typeof score === "number" && !isNaN(score) ? score : 0} className="h-2" />
                      <p className="text-xs text-gray-500 dark:text-gray-400">{metric.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-blue-500" />
              <span>Performance Breakdown</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Script Optimization</span>
                <span className={`font-semibold ${getScoreColor(safeData.script_optimization_score)}`}>
                  {typeof safeData.script_optimization_score === "number" && !isNaN(safeData.script_optimization_score)
                    ? `${safeData.script_optimization_score}%`
                    : "N/A"}
                </span>
              </div>
              <Progress
                value={
                  typeof safeData.script_optimization_score === "number" && !isNaN(safeData.script_optimization_score)
                    ? safeData.script_optimization_score
                    : 0
                }
                className="h-2"
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Content Quality</span>
                <span className={`font-semibold ${getScoreColor(safeData.content_quality_score)}`}>
                  {typeof safeData.content_quality_score === "number" && !isNaN(safeData.content_quality_score)
                    ? `${safeData.content_quality_score}%`
                    : "N/A"}
                </span>
              </div>
              <Progress
                value={
                  typeof safeData.content_quality_score === "number" && !isNaN(safeData.content_quality_score)
                    ? safeData.content_quality_score
                    : 0
                }
                className="h-2"
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Security Headers</span>
                <span className={`font-semibold ${getScoreColor(safeData.security_score)}`}>
                  {typeof safeData.security_score === "number" && !isNaN(safeData.security_score)
                    ? `${safeData.security_score}%`
                    : "N/A"}
                </span>
              </div>
              <Progress
                value={
                  typeof safeData.security_score === "number" && !isNaN(safeData.security_score)
                    ? safeData.security_score
                    : 0
                }
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        {/* Content Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-purple-500" />
              <span>Content Statistics</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(safeData.content_stats || {})
                .filter(([key, value]) => typeof value === "number")
                .slice(0, 6)
                .map(([key, value]) => (
                  <div key={key} className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {typeof value === "number" ? value : "N/A"}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hosting Information */}
      {safeData.hosting_provider_name && safeData.hosting_provider_name !== "Unknown" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="h-5 w-5 text-green-500" />
              <span>Hosting Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {safeData.hosting_provider_name}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Hosting Provider</div>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">{safeData.server_location}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Server Location</div>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100 font-mono">
                  {safeData.ip_address}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">IP Address</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

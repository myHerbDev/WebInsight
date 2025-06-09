// This file was already provided in the user's context and seems mostly fine.
// I will use the existing one and ensure it integrates.
// Key changes:
// - Ensure `WebsiteData` type is correctly imported and used.
// - Use `Progress` component correctly.
// - Ensure all icons are imported from lucide-react.
// - Check for client-side rendering needs (`useEffect` for `isClient`).
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Shield,
  Zap,
  Globe,
  Users,
  AlertTriangle,
  BarChart3,
  FileText,
} from "lucide-react"
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

  const safeData = {
    sustainability_score: data?.sustainability?.score ?? data?.sustainability_score ?? 0,
    performance_score: data?.sustainability?.performance ?? data?.performance_score ?? 0,
    script_optimization_score: data?.sustainability?.scriptOptimization ?? data?.script_optimization_score ?? 0,
    content_quality_score: data?.content_quality_score ?? 0,
    security_score: data?.security_score ?? 0,
    contentStats: data?.contentStats || {},
    hosting_provider_name: data?.hosting_provider_name || "Unknown",
    server_location: data?.server_location || "Unknown",
    ip_address: data?.ip_address || "Unknown",
  }

  const getScoreColor = (score: number) => {
    if (typeof score !== "number" || isNaN(score)) return "text-gray-500 dark:text-gray-400"
    if (score >= 80) return "text-green-600 dark:text-green-400"
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  const getProgressColorClass = (score: number) => {
    if (typeof score !== "number" || isNaN(score)) return "bg-gray-300 dark:bg-gray-600"
    if (score >= 80) return "bg-green-500"
    if (score >= 60) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getTrendIcon = (score: number) => {
    if (typeof score !== "number" || isNaN(score)) return <AlertTriangle className="h-4 w-4 text-gray-500" />
    if (score >= 80) return <TrendingUp className="h-4 w-4 text-green-500" />
    if (score >= 60) return <Minus className="h-4 w-4 text-yellow-500" />
    return <TrendingDown className="h-4 w-4 text-red-500" />
  }

  const getBadgeText = (score: number) => {
    if (typeof score !== "number" || isNaN(score)) return "N/A"
    if (score >= 80) return "Excellent"
    if (score >= 60) return "Good"
    return "Needs Work"
  }

  const getBadgeClass = (score: number) => {
    if (typeof score !== "number" || isNaN(score))
      return "border-gray-300 text-gray-500 bg-gray-100 dark:border-slate-600 dark:text-slate-400 dark:bg-slate-700"
    if (score >= 80)
      return "border-green-500 text-green-700 bg-green-100 dark:border-green-700 dark:text-green-300 dark:bg-green-900/30"
    if (score >= 60)
      return "border-yellow-500 text-yellow-700 bg-yellow-100 dark:border-yellow-700 dark:text-yellow-300 dark:bg-yellow-900/30"
    return "border-red-500 text-red-700 bg-red-100 dark:border-red-700 dark:text-red-300 dark:bg-red-900/30"
  }

  const analyticsMetrics = [
    {
      title: "Sustainability",
      value: safeData.sustainability_score,
      icon: Globe,
      description: "Overall environmental impact rating",
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Performance",
      value: safeData.performance_score,
      icon: Zap,
      description: "Website loading and optimization metrics",
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Security",
      value: safeData.security_score,
      icon: Shield,
      description: "Security headers and SSL configuration",
      color: "from-purple-500 to-violet-500",
    },
    {
      title: "Content Quality",
      value: safeData.content_quality_score,
      icon: FileText,
      description: "Content structure and SEO optimization",
      color: "from-orange-500 to-red-500",
    },
  ]

  if (!isClient) {
    // Basic SSR fallback
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="dark:bg-slate-700">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 dark:bg-slate-600 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 dark:bg-slate-600 rounded w-1/2 mb-2"></div>
                <div className="h-2 bg-gray-200 dark:bg-slate-600 rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {analyticsMetrics.map((metric, index) => {
          const Icon = metric.icon
          const score = typeof metric.value === "number" ? metric.value : 0
          return (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="relative overflow-hidden hover:shadow-lg transition-shadow duration-300 dark:bg-slate-700/50">
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${metric.color}`} />
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {metric.title}
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <Icon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
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
                      <Progress
                        value={typeof score === "number" && !isNaN(score) ? score : 0}
                        className={`h-2 [&>div]:${getProgressColorClass(score)}`}
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400">{metric.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="dark:bg-slate-700/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              <span>Detailed Scores</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "Script Optimization", value: safeData.script_optimization_score },
              { label: "Content Quality", value: safeData.content_quality_score },
              { label: "Security Headers", value: safeData.security_score },
            ].map((item) => (
              <div key={item.label} className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{item.label}</span>
                  <span className={`font-semibold ${getScoreColor(item.value)}`}>
                    {typeof item.value === "number" && !isNaN(item.value) ? `${item.value}%` : "N/A"}
                  </span>
                </div>
                <Progress
                  value={typeof item.value === "number" && !isNaN(item.value) ? item.value : 0}
                  className={`h-2 [&>div]:${getProgressColorClass(item.value)}`}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="dark:bg-slate-700/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-purple-500" />
              <span>Content Statistics</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(safeData.contentStats || {})
                .filter(([_, value]) => typeof value === "number" || typeof value === "string")
                .slice(0, 6)
                .map(([key, value]) => (
                  <div key={key} className="text-center p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{String(value)}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                      {key
                        .replace(/([A-Z])/g, " $1")
                        .replace(/_/g, " ")
                        .trim()}
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {safeData.hosting_provider_name && safeData.hosting_provider_name !== "Unknown" && (
        <Card className="dark:bg-slate-700/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="h-5 w-5 text-green-500" />
              <span>Hosting Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: "Hosting Provider", value: safeData.hosting_provider_name },
                { label: "Server Location", value: safeData.server_location },
                { label: "IP Address", value: safeData.ip_address, mono: true },
              ].map((item) => (
                <div key={item.label} className="text-center p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                  <div
                    className={`text-lg font-semibold text-gray-900 dark:text-gray-100 ${item.mono ? "font-mono" : ""}`}
                  >
                    {item.value}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{item.label}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

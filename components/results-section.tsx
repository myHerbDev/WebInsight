// This file was already provided in the user's context and seems mostly fine.
// I will use the existing one and ensure it integrates.
// Key changes:
// - Ensure `WebsiteData` type is correctly imported and used.
// - Simplify or mock `onSignUpClick`, `onSave`, `onFavorite` if auth is not fully implemented.
// - Ensure all icons are imported from lucide-react.
// - Check for client-side rendering needs (`useEffect` for `isClient`).
"use client"

import { useState, useEffect } from "react"
import { Analytics } from "@/components/analytics"
import { SustainabilityChart } from "@/components/sustainability-chart"
import { SocialShare } from "@/components/social-share"
import { ContentExport } from "@/components/content-export"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import {
  BarChart3,
  TrendingUp,
  Download,
  Heart,
  Bookmark,
  Globe,
  Shield,
  Zap,
  AlertCircle,
  FileText,
} from "lucide-react"
import type { WebsiteData } from "@/types/website-data"

interface ResultsSectionProps {
  data: WebsiteData
  onSignUpClick: (userId?: string) => void // Optional userId
  onSave: () => void
  onFavorite: () => void
  userId: string | null // Keep for potential future use
}

export function ResultsSection({ data, onSignUpClick, onSave, onFavorite, userId }: ResultsSectionProps) {
  const [isClient, setIsClient] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    // Basic SSR fallback
    return (
      <div className="w-full space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-1/3 mx-auto mb-4"></div>
        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-2/3 mx-auto mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-gray-200 dark:bg-slate-700 rounded-xl"></div>
          ))}
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <Card className="w-full dark:bg-slate-700">
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              No analysis data available. Please perform an analysis first.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const safeData: WebsiteData = {
    _id: data._id || "unknown-id",
    url: data.url || "N/A",
    title: data.title || "Website Analysis",
    summary: data.summary || "Analysis results are available below.",
    keyPoints: Array.isArray(data.keyPoints) ? data.keyPoints : [],
    keywords: Array.isArray(data.keywords) ? data.keywords : [],
    sustainability: data.sustainability || {
      score: 0,
      performance: 0,
      scriptOptimization: 0,
      duplicateContent: 0,
      improvements: [],
    },
    subdomains: Array.isArray(data.subdomains) ? data.subdomains : [],
    contentStats: data.contentStats || {},
    rawData: data.rawData || {},
    sustainability_score: data.sustainability_score ?? data.sustainability?.score ?? 0,
    performance_score: data.performance_score ?? data.sustainability?.performance ?? 0,
    script_optimization_score: data.script_optimization_score ?? data.sustainability?.scriptOptimization ?? 0,
    content_quality_score: data.content_quality_score ?? 0,
    security_score: data.security_score ?? 0,
    improvements: data.improvements ?? data.sustainability?.improvements ?? [],
    hosting_provider_name: data.hosting_provider_name || "Unknown",
    ssl_certificate: data.ssl_certificate || false,
    server_location: data.server_location || "Unknown",
    ip_address: data.ip_address || "Unknown",
  }

  const getOverallScore = () => {
    const scores = [
      safeData.sustainability_score,
      safeData.performance_score,
      safeData.security_score,
      safeData.content_quality_score,
    ].filter((score) => typeof score === "number" && !isNaN(score)) as number[]
    if (scores.length === 0) return 0
    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
  }
  const overallScore = getOverallScore()

  const getScoreColor = (score: number) => {
    if (typeof score !== "number" || isNaN(score)) return "text-gray-500 dark:text-gray-400"
    if (score >= 80) return "text-green-600 dark:text-green-400"
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  const getScoreBadgeVariant = (score: number): "default" | "secondary" | "destructive" | "outline" => {
    if (typeof score !== "number" || isNaN(score)) return "outline"
    if (score >= 80) return "default" // Using default for green-like, can customize further
    if (score >= 60) return "secondary" // Using secondary for yellow-like
    return "destructive"
  }

  const getScoreBadgeClass = (score: number) => {
    if (typeof score !== "number" || isNaN(score))
      return "border-gray-300 text-gray-500 bg-gray-100 dark:border-slate-600 dark:text-slate-400 dark:bg-slate-700"
    if (score >= 80)
      return "border-green-500 text-green-700 bg-green-100 dark:border-green-700 dark:text-green-300 dark:bg-green-900/30"
    if (score >= 60)
      return "border-yellow-500 text-yellow-700 bg-yellow-100 dark:border-yellow-700 dark:text-yellow-300 dark:bg-yellow-900/30"
    return "border-red-500 text-red-700 bg-red-100 dark:border-red-700 dark:text-red-300 dark:bg-red-900/30"
  }

  const getScoreBadgeText = (score: number) => {
    if (typeof score !== "number" || isNaN(score)) return "N/A"
    if (score >= 80) return "Excellent"
    if (score >= 60) return "Good"
    return "Needs Improvement"
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full space-y-6"
    >
      <div className="text-center space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4">
          <div className={`text-6xl font-bold ${getScoreColor(overallScore)}`}>{overallScore}%</div>
          <div className="text-left">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 break-all">{safeData.title}</h2>
            <Badge variant={getScoreBadgeVariant(overallScore)} className={`mt-1 ${getScoreBadgeClass(overallScore)}`}>
              {getScoreBadgeText(overallScore)}
            </Badge>
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">{safeData.summary}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button onClick={onSave} variant="outline" size="sm">
            <Bookmark className="mr-2 h-4 w-4" />
            Save Analysis
          </Button>
          <Button onClick={onFavorite} variant="outline" size="sm">
            <Heart className="mr-2 h-4 w-4" />
            Add to Favorites
          </Button>
          <SocialShare data={safeData} />
        </div>
      </div>

      {safeData.keyPoints.length > 0 && (
        <Card className="dark:bg-slate-700/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              <span>Key Findings</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {safeData.keyPoints.map((point, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start space-x-2"
                >
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">{point}</span>
                </motion.li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
          <TabsTrigger value="overview">
            <BarChart3 className="mr-2 h-4 w-4 sm:hidden md:inline-block" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <TrendingUp className="mr-2 h-4 w-4 sm:hidden md:inline-block" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="sustainability">
            <Globe className="mr-2 h-4 w-4 sm:hidden md:inline-block" />
            Sustainability
          </TabsTrigger>
          <TabsTrigger value="export">
            <Download className="mr-2 h-4 w-4 sm:hidden md:inline-block" />
            Export
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: "Sustainability", score: safeData.sustainability_score, icon: Globe, color: "green" },
              { title: "Performance", score: safeData.performance_score, icon: Zap, color: "blue" },
              { title: "Security", score: safeData.security_score, icon: Shield, color: "purple" },
              { title: "Content", score: safeData.content_quality_score, icon: FileText, color: "orange" },
            ].map((item) => {
              const Icon = item.icon
              const scoreValue = typeof item.score === "number" && !isNaN(item.score) ? `${item.score}%` : "N/A"
              return (
                <Card key={item.title} className="dark:bg-slate-700/50">
                  <CardContent className="p-4 text-center">
                    <Icon className={`h-8 w-8 text-${item.color}-500 dark:text-${item.color}-400 mx-auto mb-2`} />
                    <div className={`text-2xl font-bold ${getScoreColor(item.score || 0)}`}>{scoreValue}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{item.title}</div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
          {safeData.keywords.length > 0 && (
            <Card className="dark:bg-slate-700/50">
              <CardHeader>
                <CardTitle>Keywords</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {safeData.keywords.slice(0, 20).map((keyword, index) => (
                    <Badge key={index} variant="secondary">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        <TabsContent value="analytics" className="mt-4">
          <Analytics data={safeData} />
        </TabsContent>
        <TabsContent value="sustainability" className="mt-4">
          <SustainabilityChart data={safeData} />
        </TabsContent>
        <TabsContent value="export" className="mt-4">
          <ContentExport data={safeData} onSignUpClick={onSignUpClick} />
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}

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
import { BarChart3, TrendingUp, Download, Heart, Bookmark, Globe, Shield, Zap, Users, AlertCircle } from "lucide-react"
import type { WebsiteData } from "@/types/website-data"
import { SustainabilityRankBox } from "@/components/sustainability-rank-box"

interface ResultsSectionProps {
  data: WebsiteData
  onSignUpClick: (userId: string) => void
  onSave: () => void
  onFavorite: () => void
  userId: string | null
}

export function ResultsSection({ data, onSignUpClick, onSave, onFavorite, userId }: ResultsSectionProps) {
  const [isClient, setIsClient] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Safe data validation
  if (!data) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No analysis data available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Ensure data has required structure
  const safeData: WebsiteData = {
    _id: data._id || "unknown",
    url: data.url || "",
    title: data.title || "Website Analysis",
    summary: data.summary || "Analysis completed",
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
    // Backward compatibility
    sustainability_score: data.sustainability_score || data.sustainability?.score || 0,
    performance_score: data.performance_score || data.sustainability?.performance || 0,
    script_optimization_score: data.script_optimization_score || data.sustainability?.scriptOptimization || 0,
    content_quality_score: data.content_quality_score || 0,
    security_score: data.security_score || 0,
    improvements: data.improvements || data.sustainability?.improvements || [],
    hosting_provider_name: data.hosting_provider_name || "Unknown",
    ssl_certificate: data.ssl_certificate || false,
    server_location: data.server_location || "Unknown",
    ip_address: data.ip_address || "Unknown",
  }

  const getOverallScore = () => {
    const scores = [
      safeData.sustainability_score || 0,
      safeData.performance_score || 0,
      safeData.security_score || 0,
      safeData.content_quality_score || 0,
    ].filter((score) => typeof score === "number" && !isNaN(score))

    if (scores.length === 0) return 0
    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
  }

  const overallScore = getOverallScore()

  const getScoreColor = (score: number) => {
    if (typeof score !== "number" || isNaN(score)) return "text-gray-500"
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBadge = (score: number) => {
    if (typeof score !== "number" || isNaN(score)) return "Unknown"
    if (score >= 80) return "Excellent"
    if (score >= 60) return "Good"
    return "Needs Improvement"
  }

  // Don't render until client-side to avoid hydration issues
  if (!isClient) {
    return (
      <div className="w-full space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full space-y-6"
    >
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-4">
          <div className={`text-6xl font-bold ${getScoreColor(overallScore)}`}>{overallScore}%</div>
          <div className="text-left">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{safeData.title}</h2>
            <Badge
              variant="outline"
              className={`mt-1 ${
                overallScore >= 80
                  ? "border-green-200 text-green-700 bg-green-50"
                  : overallScore >= 60
                    ? "border-yellow-200 text-yellow-700 bg-yellow-50"
                    : "border-red-200 text-red-700 bg-red-50"
              }`}
            >
              {getScoreBadge(overallScore)}
            </Badge>
          </div>
        </div>

        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">{safeData.summary}</p>

        {/* Action Buttons */}
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

      {/* Key Points */}
      {safeData.keyPoints && safeData.keyPoints.length > 0 && (
        <Card>
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
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start space-x-2"
                >
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">{point}</span>
                </motion.li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="sustainability" className="flex items-center space-x-2">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">Sustainability</span>
          </TabsTrigger>
          <TabsTrigger value="export" className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <SustainabilityRankBox score={safeData.sustainability_score || 0} className="md:col-span-2" />

            <Card>
              <CardContent className="p-4 text-center">
                <Zap className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className={`text-2xl font-bold ${getScoreColor(safeData.performance_score || 0)}`}>
                  {typeof safeData.performance_score === "number" && !isNaN(safeData.performance_score)
                    ? `${safeData.performance_score}%`
                    : "N/A"}
                </div>
                <div className="text-sm text-gray-500">Performance</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Shield className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <div className={`text-2xl font-bold ${getScoreColor(safeData.security_score || 0)}`}>
                  {typeof safeData.security_score === "number" && !isNaN(safeData.security_score)
                    ? `${safeData.security_score}%`
                    : "N/A"}
                </div>
                <div className="text-sm text-gray-500">Security</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Users className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                <div className={`text-2xl font-bold ${getScoreColor(safeData.content_quality_score || 0)}`}>
                  {typeof safeData.content_quality_score === "number" && !isNaN(safeData.content_quality_score)
                    ? `${safeData.content_quality_score}%`
                    : "N/A"}
                </div>
                <div className="text-sm text-gray-500">Content</div>
              </CardContent>
            </Card>
          </div>

          {/* Keywords */}
          {safeData.keywords && safeData.keywords.length > 0 && (
            <Card>
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

        <TabsContent value="analytics">
          <Analytics data={safeData} />
        </TabsContent>

        <TabsContent value="sustainability">
          <SustainabilityChart data={safeData} />
        </TabsContent>

        <TabsContent value="export">
          <ContentExport data={safeData} onSignUpClick={onSignUpClick} />
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}

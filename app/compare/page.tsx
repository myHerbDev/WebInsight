"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  X,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Minus,
  Download,
  Sparkles,
  Zap,
  Shield,
  Globe,
  Star,
  Award,
  Plus,
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Logo } from "@/components/logo"

interface ComparisonData {
  id: string
  title: string
  url: string
  sustainability_score: number
  performance_score: number
  security_score: number
  content_quality_score: number
  hosting_provider_name: string
  ssl_certificate: boolean
  created_at: string
}

export default function ComparePage() {
  const [websites, setWebsites] = useState<ComparisonData[]>([])
  const [newUrl, setNewUrl] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [comparisonName, setComparisonName] = useState("")

  const analyzeWebsite = async (url: string) => {
    setIsAnalyzing(true)
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      })

      if (!response.ok) throw new Error("Analysis failed")

      const data = await response.json()

      const comparisonData: ComparisonData = {
        id: data._id,
        title: data.title,
        url: data.url,
        sustainability_score: data.sustainability_score || 0,
        performance_score: data.performance_score || 0,
        security_score: data.security_score || 0,
        content_quality_score: data.content_quality_score || 0,
        hosting_provider_name: data.hosting_provider_name || "Unknown",
        ssl_certificate: data.ssl_certificate || false,
        created_at: new Date().toISOString(),
      }

      setWebsites((prev) => [...prev, comparisonData])
      setNewUrl("")

      toast({
        title: "✨ Analysis Complete",
        description: `${data.title} has been added to comparison`,
      })
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze website. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const removeWebsite = (id: string) => {
    setWebsites((prev) => prev.filter((w) => w.id !== id))
  }

  const getAverageScores = () => {
    if (websites.length === 0) return { sustainability: 0, performance: 0, security: 0, content: 0 }

    return {
      sustainability: Math.round(websites.reduce((sum, w) => sum + w.sustainability_score, 0) / websites.length),
      performance: Math.round(websites.reduce((sum, w) => sum + w.performance_score, 0) / websites.length),
      security: Math.round(websites.reduce((sum, w) => sum + w.security_score, 0) / websites.length),
      content: Math.round(websites.reduce((sum, w) => sum + w.content_quality_score, 0) / websites.length),
    }
  }

  const getBestPerformer = (metric: keyof ComparisonData) => {
    if (websites.length === 0) return null
    return websites.reduce((best, current) => ((current[metric] as number) > (best[metric] as number) ? current : best))
  }

  const getScoreComparison = (score: number, average: number) => {
    const diff = score - average
    if (Math.abs(diff) < 5) return { icon: Minus, color: "text-gray-500", text: "Average" }
    if (diff > 0) return { icon: TrendingUp, color: "text-emerald-500", text: `+${diff}` }
    return { icon: TrendingDown, color: "text-red-500", text: `${diff}` }
  }

  const getScoreGradient = (score: number) => {
    if (score >= 90) return "from-emerald-500 to-green-500"
    if (score >= 80) return "from-green-500 to-lime-500"
    if (score >= 70) return "from-yellow-500 to-orange-500"
    if (score >= 60) return "from-orange-500 to-red-500"
    return "from-red-500 to-pink-500"
  }

  const saveComparison = async () => {
    if (websites.length < 2) {
      toast({
        title: "Insufficient Data",
        description: "Add at least 2 websites to save comparison",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch("/api/comparisons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: comparisonName || `Comparison ${new Date().toLocaleDateString()}`,
          analysis_ids: websites.map((w) => w.id),
          comparison_data: {
            websites,
            averages: getAverageScores(),
            created_at: new Date().toISOString(),
          },
        }),
      })

      if (response.ok) {
        toast({
          title: "✨ Comparison Saved",
          description: "Your comparison has been saved successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save comparison",
        variant: "destructive",
      })
    }
  }

  const exportComparison = () => {
    const csvContent = [
      ["Website", "URL", "Sustainability", "Performance", "Security", "Content Quality", "Hosting Provider", "SSL"],
      ...websites.map((w) => [
        w.title,
        w.url,
        w.sustainability_score,
        w.performance_score,
        w.security_score,
        w.content_quality_score,
        w.hosting_provider_name,
        w.ssl_certificate ? "Yes" : "No",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `website-comparison-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const averages = getAverageScores()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4 py-8">
        {/* Magical Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <Logo size="lg" showText={true} />
          </div>
          <div className="relative">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent mb-4">
              Website Comparison Tool
            </h1>
            <div className="absolute -top-2 -right-8">
              <Sparkles className="h-8 w-8 text-purple-500 animate-pulse" />
            </div>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Compare multiple websites side-by-side with magical insights. Discover performance differences, security
            gaps, and sustainability opportunities with our intelligent analysis.
          </p>
        </div>

        {/* Magical Add Website Form */}
        <Card className="mb-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-teal-500 rounded-lg">
                <Plus className="h-5 w-5 text-white" />
              </div>
              Add Website to Comparison
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                placeholder="Enter website URL (e.g., example.com)"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && newUrl && analyzeWebsite(newUrl)}
                className="flex-1 border-purple-200 focus:border-purple-500 text-lg py-6"
              />
              <Button
                onClick={() => newUrl && analyzeWebsite(newUrl)}
                disabled={isAnalyzing || !newUrl}
                className="bg-gradient-to-r from-purple-600 to-teal-600 hover:from-purple-700 hover:to-teal-700 text-white px-8 py-6 text-lg shadow-lg"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Zap className="h-5 w-5 mr-2" />
                    Add Website
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Comparison Actions */}
        {websites.length > 0 && (
          <div className="flex gap-4 mb-8">
            <Input
              placeholder="Comparison name (optional)"
              value={comparisonName}
              onChange={(e) => setComparisonName(e.target.value)}
              className="max-w-xs border-purple-200 focus:border-purple-500"
            />
            <Button onClick={saveComparison} variant="outline" className="border-purple-200 hover:bg-purple-50">
              <Star className="h-4 w-4 mr-2" />
              Save Comparison
            </Button>
            <Button onClick={exportComparison} variant="outline" className="border-purple-200 hover:bg-purple-50">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
        )}

        {websites.length === 0 ? (
          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="text-center py-16">
              <div className="relative mb-8">
                <BarChart3 className="h-24 w-24 mx-auto text-purple-300 dark:text-purple-700" />
                <div className="absolute -top-2 -right-2">
                  <Sparkles className="h-8 w-8 text-teal-500 animate-bounce" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-4">Ready to Compare Websites?</h3>
              <p className="text-gray-500 dark:text-gray-400 text-lg max-w-md mx-auto">
                Add websites above to start comparing their performance, security, and sustainability metrics with
                magical insights and beautiful visualizations.
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Magical Average Scores Overview */}
            <Card className="mb-8 bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 border-0 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white text-2xl flex items-center gap-2">
                  <Award className="h-6 w-6" />
                  Average Performance Across {websites.length} Websites
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                    { label: "Sustainability", value: averages.sustainability, icon: Globe, color: "text-emerald-300" },
                    { label: "Performance", value: averages.performance, icon: Zap, color: "text-yellow-300" },
                    { label: "Security", value: averages.security, icon: Shield, color: "text-blue-300" },
                    { label: "Content", value: averages.content, icon: BarChart3, color: "text-purple-300" },
                  ].map((metric, index) => (
                    <div key={index} className="text-center bg-white/20 backdrop-blur-sm rounded-xl p-4">
                      <metric.icon className={`h-8 w-8 mx-auto mb-2 ${metric.color}`} />
                      <div className="text-3xl font-bold text-white mb-1">{metric.value}%</div>
                      <div className="text-sm text-white/80">{metric.label}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Comparison Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {websites.map((website, index) => {
                const sustainabilityComp = getScoreComparison(website.sustainability_score, averages.sustainability)
                const performanceComp = getScoreComparison(website.performance_score, averages.performance)
                const securityComp = getScoreComparison(website.security_score, averages.security)
                const contentComp = getScoreComparison(website.content_quality_score, averages.content)

                const isTopPerformer =
                  website.sustainability_score >= 90 || website.performance_score >= 90 || website.security_score >= 90

                return (
                  <Card
                    key={website.id}
                    className="group relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-500"
                  >
                    {/* Top Performer Badge */}
                    {isTopPerformer && (
                      <div className="absolute -top-2 -right-2 z-10">
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-2 rounded-full shadow-lg">
                          <Star className="h-4 w-4" />
                        </div>
                      </div>
                    )}

                    <CardHeader className="relative overflow-hidden">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 transition-colors">
                            {website.title}
                          </CardTitle>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{website.url}</p>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                              {website.hosting_provider_name}
                            </Badge>
                            <Badge
                              className={
                                website.ssl_certificate
                                  ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                                  : "bg-gradient-to-r from-red-500 to-pink-500 text-white"
                              }
                            >
                              {website.ssl_certificate ? "🔒 SSL" : "❌ No SSL"}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeWebsite(website.id)}
                          className="hover:bg-red-100 dark:hover:bg-red-900"
                        >
                          <X className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Enhanced Score Displays */}
                      {[
                        {
                          label: "Sustainability",
                          score: website.sustainability_score,
                          comparison: sustainabilityComp,
                          icon: Globe,
                        },
                        {
                          label: "Performance",
                          score: website.performance_score,
                          comparison: performanceComp,
                          icon: Zap,
                        },
                        {
                          label: "Security",
                          score: website.security_score,
                          comparison: securityComp,
                          icon: Shield,
                        },
                        {
                          label: "Content",
                          score: website.content_quality_score,
                          comparison: contentComp,
                          icon: BarChart3,
                        },
                      ].map((metric, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <metric.icon className="h-4 w-4 text-gray-500" />
                              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                {metric.label}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-bold text-gray-900 dark:text-white">{metric.score}%</span>
                              <metric.comparison.icon className={`h-4 w-4 ${metric.comparison.color}`} />
                            </div>
                          </div>
                          <div className="relative">
                            <Progress value={metric.score} className="h-2" />
                            <div
                              className={`absolute top-0 left-0 h-2 rounded-full bg-gradient-to-r ${getScoreGradient(metric.score)} transition-all duration-700`}
                              style={{ width: `${metric.score}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Magical Insights Panel */}
            <Card className="mt-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 border-0 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white text-2xl flex items-center gap-2">
                  <Sparkles className="h-6 w-6" />
                  Magical Insights & Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
                    <h4 className="font-semibold mb-4 text-white text-lg flex items-center gap-2">
                      <Award className="h-5 w-5" />🏆 Best Performers
                    </h4>
                    <ul className="space-y-2 text-white/90">
                      <li className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-emerald-300" />
                        Sustainability:{" "}
                        <span className="font-bold">{getBestPerformer("sustainability_score")?.title}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-yellow-300" />
                        Performance: <span className="font-bold">{getBestPerformer("performance_score")?.title}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-blue-300" />
                        Security: <span className="font-bold">{getBestPerformer("security_score")?.title}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-purple-300" />
                        Content: <span className="font-bold">{getBestPerformer("content_quality_score")?.title}</span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
                    <h4 className="font-semibold mb-4 text-white text-lg flex items-center gap-2">
                      <Sparkles className="h-5 w-5" />✨ Smart Recommendations
                    </h4>
                    <ul className="space-y-2 text-white/90 text-sm">
                      <li>• Focus on improving lowest-scoring metrics across all sites</li>
                      <li>• Consider migrating to top-performing hosting providers</li>
                      <li>• Implement security best practices from leading sites</li>
                      <li>• Optimize performance using insights from best performers</li>
                      <li>• Enhance sustainability with green hosting solutions</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}

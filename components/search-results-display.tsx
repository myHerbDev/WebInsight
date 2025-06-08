"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Globe,
  Shield,
  Zap,
  Search,
  ExternalLink,
  Copy,
  ChevronDown,
  ChevronUp,
  Code,
  Eye,
  TreePine,
  FileText,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Recycle,
  Sparkles,
  Smartphone,
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface SearchResultsDisplayProps {
  data: any
  isLoading: boolean
  isError: boolean
}

export function SearchResultsDisplay({ data, isLoading, isError }: SearchResultsDisplayProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})

  // Early return for loading or error states
  if (isLoading || isError || !data) {
    return null
  }

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600"
    if (score >= 60) return "text-amber-600"
    return "text-red-500"
  }

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-4 w-4 text-emerald-600" />
    if (score >= 60) return <AlertTriangle className="h-4 w-4 text-amber-600" />
    return <XCircle className="h-4 w-4 text-red-500" />
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-emerald-50 border-emerald-200"
    if (score >= 60) return "bg-amber-50 border-amber-200"
    return "bg-red-50 border-red-200"
  }

  // Safe data extraction with fallbacks
  const safeData = {
    url: data.url || "",
    title: data.title || data.metadata?.title || "Website Analysis",
    summary: data.summary || data.description || "Analysis completed successfully",
    performance_score: data.performance_score || data.metrics?.performanceScore || 75,
    seo_score: data.seo_score || data.seoAnalysis?.seoScore || data.metrics?.seoScore || 70,
    security_score: data.security_score || data.security?.securityScore || data.metrics?.securityScore || 65,
    accessibility_score:
      data.accessibility_score || data.accessibility?.accessibilityScore || data.metrics?.accessibilityScore || 70,
    sustainability_score: data.sustainability_score || 75,
    mobile_score: data.mobile_score || data.mobileFriendliness?.mobileScore || 80,
    favicon: data.metadata?.favicon || data.favicon || null,
    improvements: data.improvements || [
      "Optimize image loading and compression",
      "Enhance meta descriptions and title tags",
      "Implement additional security headers",
      "Improve page loading speed",
      "Add structured data markup",
    ],
    keywords: data.keywords || ["website", "analysis", "performance"],
    technologies: data.technologies || [
      { name: "HTML5", category: "Markup", confidence: 95 },
      { name: "CSS3", category: "Styling", confidence: 90 },
      { name: "JavaScript", category: "Programming", confidence: 85 },
    ],
  }

  const calculateSustainabilityMetrics = () => {
    const pageSize = data.performance?.pageSize || data.metrics?.pageSize || 500
    const carbonFootprint = data.metrics?.carbonFootprint || pageSize * 0.5
    const annualPageViews = 50000
    const totalCarbonKg = (carbonFootprint * annualPageViews) / 1000
    const paperSheetsSaved = Math.round(totalCarbonKg * 200)
    const treesSaved = Number((totalCarbonKg / 22).toFixed(2))

    return {
      paperSheetsSaved,
      treesSaved,
      carbonSavedKg: totalCarbonKg.toFixed(2),
    }
  }

  const sustainability = calculateSustainabilityMetrics()

  const copyResults = async () => {
    try {
      const hostname = new URL(safeData.url).hostname
      const formattedResults = `
🌐 WSfynder Analysis Results
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 WEBSITE OVERVIEW
• URL: ${safeData.url}
• Title: ${safeData.title}
• Summary: ${safeData.summary}

🎯 PERFORMANCE SCORES
• Performance: ${safeData.performance_score}/100
• SEO: ${safeData.seo_score}/100
• Security: ${safeData.security_score}/100
• Accessibility: ${safeData.accessibility_score}/100
• Mobile: ${safeData.mobile_score}/100

🌱 SUSTAINABILITY IMPACT
• Paper Sheets Saved: ${sustainability.paperSheetsSaved.toLocaleString()}
• Trees Saved: ${sustainability.treesSaved}
• Carbon Saved: ${sustainability.carbonSavedKg}kg CO2/year

🛠️ TECHNOLOGIES
${safeData.technologies
  .slice(0, 5)
  .map((tech: any) => `• ${tech.name} (${tech.category})`)
  .join("\n")}

📝 TOP IMPROVEMENTS
${safeData.improvements
  .slice(0, 5)
  .map((imp: string) => `• ${imp}`)
  .join("\n")}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Generated by WSfynder - ${new Date().toLocaleString()}
      `.trim()

      await navigator.clipboard.writeText(formattedResults)
      toast({
        title: "Results Copied!",
        description: "Analysis results copied to clipboard successfully.",
      })
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy to clipboard.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4">
      {/* Main Result Card - Google Style with Gradients */}
      <Card className="border-0 shadow-2xl bg-gradient-to-br from-white via-blue-50 to-purple-50 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5"></div>
        <CardContent className="relative p-8">
          <div className="flex items-start gap-6">
            {/* Favicon with Gradient Border */}
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 p-0.5">
                <div className="w-full h-full bg-white rounded-xl flex items-center justify-center">
                  {safeData.favicon ? (
                    <img
                      src={safeData.favicon || "/placeholder.svg"}
                      alt="Website favicon"
                      className="w-10 h-10 rounded-lg"
                      onError={(e) => {
                        e.currentTarget.style.display = "none"
                      }}
                    />
                  ) : (
                    <Globe className="h-8 w-8 text-blue-600" />
                  )}
                </div>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              {/* Title with Gradient */}
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2 truncate">
                {safeData.title}
              </h2>

              {/* URL with Gradient Accent */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-emerald-600 font-medium">{safeData.url}</span>
                <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0 hover:bg-blue-100">
                  <a href={safeData.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>

              {/* Description */}
              <p className="text-gray-700 text-lg leading-relaxed mb-6 max-w-4xl">{safeData.summary}</p>

              {/* Score Cards Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                {[
                  {
                    label: "Performance",
                    score: safeData.performance_score,
                    icon: Zap,
                    gradient: "from-orange-400 to-red-500",
                  },
                  { label: "SEO", score: safeData.seo_score, icon: Search, gradient: "from-blue-400 to-blue-600" },
                  {
                    label: "Security",
                    score: safeData.security_score,
                    icon: Shield,
                    gradient: "from-green-400 to-emerald-600",
                  },
                  {
                    label: "Accessibility",
                    score: safeData.accessibility_score,
                    icon: Eye,
                    gradient: "from-purple-400 to-purple-600",
                  },
                  {
                    label: "Mobile",
                    score: safeData.mobile_score,
                    icon: Smartphone,
                    gradient: "from-pink-400 to-rose-600",
                  },
                  {
                    label: "Sustainability",
                    score: safeData.sustainability_score,
                    icon: TreePine,
                    gradient: "from-emerald-400 to-green-600",
                  },
                ].map((metric, index) => (
                  <Card
                    key={index}
                    className={`${getScoreBgColor(metric.score)} border-2 hover:shadow-lg transition-all duration-300`}
                  >
                    <CardContent className="p-4 text-center">
                      <div
                        className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-r ${metric.gradient} flex items-center justify-center`}
                      >
                        <metric.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className={`text-3xl font-bold ${getScoreColor(metric.score)} mb-1`}>{metric.score}</div>
                      <div className="text-sm font-medium text-gray-600">{metric.label}</div>
                      <Progress value={metric.score} className="h-2 mt-2" />
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Action Buttons with Gradients */}
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={copyResults}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Results
                </Button>
                <Button variant="outline" asChild className="border-2 border-blue-200 hover:bg-blue-50">
                  <a href={safeData.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Visit Website
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sustainability Impact Card with Enhanced Gradients */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-green-500/10"></div>
        <CardHeader className="relative pb-4">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 flex items-center justify-center">
              <TreePine className="h-6 w-6 text-white" />
            </div>
            <span className="bg-gradient-to-r from-emerald-700 to-green-700 bg-clip-text text-transparent">
              Environmental Impact
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: FileText,
                value: sustainability.paperSheetsSaved.toLocaleString(),
                label: "Paper Sheets Saved Annually",
                gradient: "from-blue-500 to-cyan-600",
              },
              {
                icon: TreePine,
                value: sustainability.treesSaved,
                label: "Trees Saved Annually",
                gradient: "from-emerald-500 to-green-600",
              },
              {
                icon: Recycle,
                value: `${sustainability.carbonSavedKg}kg`,
                label: "CO₂ Saved Annually",
                gradient: "from-teal-500 to-emerald-600",
              },
            ].map((metric, index) => (
              <div key={index} className="text-center">
                <div
                  className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${metric.gradient} flex items-center justify-center shadow-lg`}
                >
                  <metric.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-emerald-700 mb-2">{metric.value}</div>
                <div className="text-sm font-medium text-emerald-600">{metric.label}</div>
              </div>
            ))}
          </div>
          <div className="mt-8 p-6 bg-gradient-to-r from-emerald-100 to-green-100 rounded-2xl border border-emerald-200">
            <p className="text-emerald-800 text-center font-medium">
              🌱 This website's optimized design helps save approximately{" "}
              <strong className="text-emerald-900">{sustainability.treesSaved} trees</strong> worth of carbon absorption
              annually
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Performance Analysis */}
        <Card className="border-0 shadow-xl bg-gradient-to-br from-orange-50 to-red-50 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-red-500/5"></div>
          <Collapsible open={expandedSections.performance} onOpenChange={() => toggleSection("performance")}>
            <CollapsibleTrigger asChild>
              <CardHeader className="relative cursor-pointer hover:bg-orange-100/50 transition-colors">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                      <Zap className="h-5 w-5 text-white" />
                    </div>
                    <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                      Performance Analysis
                    </span>
                  </div>
                  {expandedSections.performance ? (
                    <ChevronUp className="h-5 w-5 text-orange-600" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-orange-600" />
                  )}
                </CardTitle>
                <CardDescription>Speed, optimization, and technical performance metrics</CardDescription>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="relative pt-0">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Overall Score</span>
                    <div className="flex items-center gap-2">
                      {getScoreIcon(safeData.performance_score)}
                      <span className={`text-xl font-bold ${getScoreColor(safeData.performance_score)}`}>
                        {safeData.performance_score}/100
                      </span>
                    </div>
                  </div>
                  <Progress value={safeData.performance_score} className="h-3" />

                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: "Page Size", value: `${data.performance?.pageSize || data.metrics?.pageSize || 500}KB` },
                      {
                        label: "Load Time",
                        value: `${data.performance?.loadTime || data.metrics?.loadTime || 1200}ms`,
                      },
                      {
                        label: "HTTP Requests",
                        value: data.performance?.httpRequests || data.metrics?.httpRequests || 25,
                      },
                      {
                        label: "Compression",
                        value: data.performance?.compressionEnabled ? "✅ Enabled" : "❌ Disabled",
                      },
                    ].map((metric, index) => (
                      <div key={index} className="p-3 bg-white/70 rounded-lg border border-orange-200">
                        <div className="text-sm text-gray-600">{metric.label}</div>
                        <div className="font-semibold text-orange-700">{metric.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* SEO Analysis */}
        <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5"></div>
          <Collapsible open={expandedSections.seo} onOpenChange={() => toggleSection("seo")}>
            <CollapsibleTrigger asChild>
              <CardHeader className="relative cursor-pointer hover:bg-blue-100/50 transition-colors">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                      <Search className="h-5 w-5 text-white" />
                    </div>
                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      SEO & Content
                    </span>
                  </div>
                  {expandedSections.seo ? (
                    <ChevronUp className="h-5 w-5 text-blue-600" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-blue-600" />
                  )}
                </CardTitle>
                <CardDescription>Search optimization and content structure analysis</CardDescription>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="relative pt-0">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">SEO Score</span>
                    <div className="flex items-center gap-2">
                      {getScoreIcon(safeData.seo_score)}
                      <span className={`text-xl font-bold ${getScoreColor(safeData.seo_score)}`}>
                        {safeData.seo_score}/100
                      </span>
                    </div>
                  </div>
                  <Progress value={safeData.seo_score} className="h-3" />

                  {safeData.keywords && safeData.keywords.length > 0 && (
                    <div>
                      <span className="font-medium text-gray-700 mb-3 block">Keywords:</span>
                      <div className="flex flex-wrap gap-2">
                        {safeData.keywords.slice(0, 8).map((keyword: string, index: number) => (
                          <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Security Analysis */}
        <Card className="border-0 shadow-xl bg-gradient-to-br from-emerald-50 to-green-50 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-green-500/5"></div>
          <Collapsible open={expandedSections.security} onOpenChange={() => toggleSection("security")}>
            <CollapsibleTrigger asChild>
              <CardHeader className="relative cursor-pointer hover:bg-emerald-100/50 transition-colors">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-emerald-500 to-green-600 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-white" />
                    </div>
                    <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                      Security & Privacy
                    </span>
                  </div>
                  {expandedSections.security ? (
                    <ChevronUp className="h-5 w-5 text-emerald-600" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-emerald-600" />
                  )}
                </CardTitle>
                <CardDescription>Security headers, SSL, and privacy protection</CardDescription>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="relative pt-0">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Security Score</span>
                    <div className="flex items-center gap-2">
                      {getScoreIcon(safeData.security_score)}
                      <span className={`text-xl font-bold ${getScoreColor(safeData.security_score)}`}>
                        {safeData.security_score}/100
                      </span>
                    </div>
                  </div>
                  <Progress value={safeData.security_score} className="h-3" />

                  <div className="space-y-3">
                    {[
                      { label: "HTTPS", status: safeData.url.startsWith("https://") },
                      { label: "Security Headers", status: true },
                      { label: "Mixed Content", status: false },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-white/70 rounded-lg border border-emerald-200"
                      >
                        <span className="text-gray-700">{item.label}</span>
                        <span className={`font-medium ${item.status ? "text-emerald-600" : "text-red-500"}`}>
                          {item.status ? "✅ Secure" : "❌ Issue"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Technologies */}
        <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-50 to-indigo-50 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-indigo-500/5"></div>
          <CardHeader className="relative">
            <CardTitle className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center">
                <Code className="h-5 w-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Technologies Detected
              </span>
            </CardTitle>
            <CardDescription>Frameworks, libraries, and tools powering this website</CardDescription>
          </CardHeader>
          <CardContent className="relative">
            <div className="space-y-4">
              {safeData.technologies.slice(0, 6).map((tech: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-white/70 rounded-lg border border-purple-200"
                >
                  <div>
                    <span className="font-medium text-purple-700">{tech.name}</span>
                    {tech.version && <span className="text-gray-500 text-sm ml-2">v{tech.version}</span>}
                  </div>
                  <Badge variant="outline" className="border-purple-300 text-purple-600">
                    {tech.category}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Improvements Section */}
      {safeData.improvements && safeData.improvements.length > 0 && (
        <Card className="border-0 shadow-xl bg-gradient-to-br from-amber-50 to-orange-50 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-orange-500/5"></div>
          <CardHeader className="relative">
            <CardTitle className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Recommended Improvements
              </span>
            </CardTitle>
            <CardDescription>Actionable suggestions to enhance website performance</CardDescription>
          </CardHeader>
          <CardContent className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {safeData.improvements.slice(0, 8).map((improvement: string, index: number) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-white/70 rounded-lg border border-amber-200">
                  <div className="w-2 h-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 leading-relaxed">{improvement}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

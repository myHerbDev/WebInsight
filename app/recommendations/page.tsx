"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Leaf,
  Zap,
  Globe,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Target,
  Lightbulb,
  ArrowRight,
  Star,
  Award,
  BarChart3,
  TreePine,
  Sparkles,
  Info,
  Download,
  Share2,
} from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"
import { toast } from "@/components/ui/use-toast"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface RecommendationData {
  websiteUrl: string
  sustainabilityScore: number
  performanceScore: number
  carbonFootprint: number
  energyEfficiency: number
  recommendations: {
    priority: "high" | "medium" | "low"
    category: "sustainability" | "performance" | "hosting" | "optimization"
    title: string
    description: string
    impact: "high" | "medium" | "low"
    effort: "low" | "medium" | "high"
    estimatedImprovement: number
    actionItems: string[]
  }[]
  hostingRecommendations: {
    name: string
    score: number
    reason: string
    features: string[]
    pricing: string
    link: string
  }[]
  currentIssues: {
    type: "critical" | "warning" | "info"
    title: string
    description: string
    solution: string
  }[]
}

// Mock data generator based on typical website analysis results
const generateTailoredRecommendations = (websiteData?: any): RecommendationData => {
  // This would normally come from your analysis API
  const baseScore = websiteData?.sustainabilityScore || Math.floor(Math.random() * 40) + 30
  const perfScore = websiteData?.performanceScore || Math.floor(Math.random() * 30) + 50

  return {
    websiteUrl: websiteData?.url || "example.com",
    sustainabilityScore: baseScore,
    performanceScore: perfScore,
    carbonFootprint: Math.round((100 - baseScore) * 0.8 + Math.random() * 20),
    energyEfficiency: Math.round(baseScore * 0.9 + Math.random() * 10),
    recommendations: [
      {
        priority: baseScore < 50 ? "high" : "medium",
        category: "sustainability",
        title: "Switch to Green Hosting Provider",
        description: `Your current hosting has a sustainability score of ${baseScore}%. Switching to a green hosting provider could reduce your carbon footprint by up to 70%.`,
        impact: "high",
        effort: "low",
        estimatedImprovement: Math.min(30, 85 - baseScore),
        actionItems: [
          "Research green hosting providers from our catalog",
          "Compare renewable energy percentages",
          "Check for carbon offset programs",
          "Plan migration timeline",
        ],
      },
      {
        priority: perfScore < 70 ? "high" : "low",
        category: "performance",
        title: "Optimize Image Loading",
        description: `Performance score of ${perfScore}% indicates room for improvement. Optimizing images could improve load times by 40-60%.`,
        impact: "high",
        effort: "medium",
        estimatedImprovement: Math.min(25, 90 - perfScore),
        actionItems: [
          "Implement lazy loading for images",
          "Use modern image formats (WebP, AVIF)",
          "Compress existing images",
          "Set up responsive image sizes",
        ],
      },
      {
        priority: "medium",
        category: "optimization",
        title: "Enable Content Delivery Network (CDN)",
        description:
          "A CDN can reduce server load and improve global performance while potentially reducing energy consumption.",
        impact: "medium",
        effort: "low",
        estimatedImprovement: 15,
        actionItems: [
          "Choose a green CDN provider",
          "Configure CDN for static assets",
          "Set up proper cache headers",
          "Monitor performance improvements",
        ],
      },
      {
        priority: baseScore > 70 ? "low" : "medium",
        category: "sustainability",
        title: "Implement Dark Mode",
        description: "Dark mode can reduce energy consumption on OLED displays and improve user experience.",
        impact: "low",
        effort: "medium",
        estimatedImprovement: 5,
        actionItems: [
          "Design dark theme variants",
          "Implement theme switching",
          "Test across different devices",
          "Add user preference detection",
        ],
      },
      {
        priority: "medium",
        category: "hosting",
        title: "Optimize Database Queries",
        description: "Efficient database queries reduce server processing time and energy consumption.",
        impact: "medium",
        effort: "high",
        estimatedImprovement: 12,
        actionItems: [
          "Audit current database queries",
          "Add appropriate indexes",
          "Implement query caching",
          "Consider database optimization tools",
        ],
      },
    ],
    hostingRecommendations: [
      {
        name: "GreenHost",
        score: 95,
        reason: "100% renewable energy with excellent performance metrics",
        features: ["100% Renewable Energy", "Carbon Neutral", "High Performance", "24/7 Support"],
        pricing: "Starting at $12/month",
        link: "/hosting/1",
      },
      {
        name: "EcoWeb Solutions",
        score: 92,
        reason: "Strong sustainability focus with premium features",
        features: ["95% Renewable Energy", "Carbon Offset Programs", "Advanced Security", "CDN Included"],
        pricing: "Starting at $18/month",
        link: "/hosting/2",
      },
      {
        name: "CloudGreen",
        score: 88,
        reason: "Excellent performance with good environmental practices",
        features: ["100% Renewable Energy", "Global CDN", "99.99% Uptime", "Scalable Infrastructure"],
        pricing: "Starting at $25/month",
        link: "/hosting/4",
      },
    ],
    currentIssues: [
      ...(baseScore < 50
        ? [
            {
              type: "critical" as const,
              title: "High Carbon Footprint",
              description: "Your website's current hosting solution has a significant environmental impact.",
              solution: "Switch to a green hosting provider immediately to reduce carbon emissions by up to 70%.",
            },
          ]
        : []),
      ...(perfScore < 60
        ? [
            {
              type: "warning" as const,
              title: "Poor Performance Metrics",
              description: "Slow loading times increase energy consumption and hurt user experience.",
              solution: "Implement performance optimizations like image compression and caching.",
            },
          ]
        : []),
      {
        type: "info" as const,
        title: "Optimization Opportunities",
        description: "Several areas for improvement have been identified to enhance sustainability.",
        solution: "Follow the prioritized recommendations below to make incremental improvements.",
      },
    ],
  }
}

export default function RecommendationsPage() {
  const [data, setData] = useState<RecommendationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    // Simulate loading recommendations based on previous analysis
    const timer = setTimeout(() => {
      setData(generateTailoredRecommendations())
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const handleExportRecommendations = async () => {
    try {
      const response = await fetch("/api/export-ai-content-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: data,
          type: "recommendations",
          websiteUrl: data?.websiteUrl,
        }),
      })

      if (!response.ok) throw new Error("Export failed")

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.style.display = "none"
      a.href = url
      a.download = `sustainability-recommendations-${data?.websiteUrl || "report"}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)

      toast({
        title: "Export Successful",
        description: "Your recommendations report has been downloaded.",
      })
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Unable to export recommendations. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleShareRecommendations = async () => {
    if (navigator.share && data) {
      try {
        await navigator.share({
          title: `Sustainability Recommendations for ${data.websiteUrl}`,
          text: `Check out these tailored sustainability recommendations for improving website environmental impact.`,
          url: window.location.href,
        })
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href)
        toast({
          title: "Link Copied",
          description: "Recommendations link copied to clipboard.",
        })
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link Copied",
        description: "Recommendations link copied to clipboard.",
      })
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 dark:text-red-400"
      case "medium":
        return "text-yellow-600 dark:text-yellow-400"
      case "low":
        return "text-green-600 dark:text-green-400"
      default:
        return "text-slate-600 dark:text-slate-400"
    }
  }

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case "high":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "medium":
        return <BarChart3 className="h-4 w-4 text-yellow-600" />
      case "low":
        return <Target className="h-4 w-4 text-blue-600" />
      default:
        return <Info className="h-4 w-4 text-slate-600" />
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
          <Card className="w-full max-w-md p-8 text-center bg-white/70 dark:bg-slate-900/70 backdrop-blur-md">
            <div className="animate-spin-slow mx-auto mb-4 h-12 w-12 rounded-full bg-primary-gradient p-3">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Generating Recommendations</h2>
            <p className="text-slate-600 dark:text-slate-400">
              Analyzing your website data to create tailored sustainability recommendations...
            </p>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
          <Card className="w-full max-w-md p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Data Available</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Please analyze a website first to get personalized recommendations.
            </p>
            <Button asChild className="bg-primary-gradient hover:opacity-90 text-white">
              <Link href="/">Analyze Website</Link>
            </Button>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 magic-fade-in">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <div className="inline-block p-3 rounded-full bg-primary-gradient mb-4 shadow-lg animate-pulse-glow-slow">
            <Lightbulb className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold bg-primary-gradient bg-clip-text text-transparent mb-4">
            Sustainability Recommendations
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            Tailored recommendations for{" "}
            <span className="font-semibold text-primary-gradient-middle">{data.websiteUrl}</span> to improve
            environmental impact and performance.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 justify-center mt-6">
            <Button
              onClick={handleExportRecommendations}
              className="bg-primary-gradient hover:opacity-90 text-white shimmer"
            >
              <Download className="h-4 w-4 mr-2" />
              Export PDF Report
            </Button>
            <Button
              onClick={handleShareRecommendations}
              variant="outline"
              className="border-primary-gradient-middle/30 text-primary-gradient-middle hover:bg-primary-gradient-middle/10"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share Results
            </Button>
          </div>
        </div>

        {/* Current Issues Alert */}
        {data.currentIssues.length > 0 && (
          <div className="mb-8 space-y-4">
            {data.currentIssues.map((issue, index) => (
              <Alert
                key={index}
                variant={issue.type === "critical" ? "destructive" : "default"}
                className={cn(
                  "border-l-4 rounded-xl shadow-lg",
                  issue.type === "critical" && "border-l-red-500 bg-red-50/50 dark:bg-red-950/20",
                  issue.type === "warning" && "border-l-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/20",
                  issue.type === "info" && "border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20",
                )}
              >
                {issue.type === "critical" && <AlertTriangle className="h-5 w-5 text-red-600" />}
                {issue.type === "warning" && <AlertTriangle className="h-5 w-5 text-yellow-600" />}
                {issue.type === "info" && <Info className="h-5 w-5 text-blue-600" />}
                <AlertTitle className="font-semibold">{issue.title}</AlertTitle>
                <AlertDescription className="mt-2">
                  <p className="mb-2">{issue.description}</p>
                  <p className="font-medium text-sm">{issue.solution}</p>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {/* Score Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/60 rounded-xl shimmer">
            <CardContent className="p-6 text-center">
              <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-3">
                <TreePine className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                {data.sustainabilityScore}%
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Sustainability</div>
              <Progress value={data.sustainabilityScore} className="mt-2 h-2" />
            </CardContent>
          </Card>

          <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/60 rounded-xl shimmer">
            <CardContent className="p-6 text-center">
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-3">
                <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">{data.performanceScore}%</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Performance</div>
              <Progress value={data.performanceScore} className="mt-2 h-2" />
            </CardContent>
          </Card>

          <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/60 rounded-xl shimmer">
            <CardContent className="p-6 text-center">
              <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-3">
                <Globe className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400 mb-1">{data.carbonFootprint}g</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">CO₂ per visit</div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/60 rounded-xl shimmer">
            <CardContent className="p-6 text-center">
              <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto mb-3">
                <Leaf className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                {data.energyEfficiency}%
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Energy Efficiency</div>
              <Progress value={data.energyEfficiency} className="mt-2 h-2" />
            </CardContent>
          </Card>
        </div>

        {/* Tabbed Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-lg p-1">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-primary-gradient data-[state=active]:text-white rounded-md data-[state=active]:shadow-lg transition-all"
            >
              Action Items
            </TabsTrigger>
            <TabsTrigger
              value="hosting"
              className="data-[state=active]:bg-primary-gradient data-[state=active]:text-white rounded-md data-[state=active]:shadow-lg transition-all"
            >
              Hosting Options
            </TabsTrigger>
            <TabsTrigger
              value="roadmap"
              className="data-[state=active]:bg-primary-gradient data-[state=active]:text-white rounded-md data-[state=active]:shadow-lg transition-all"
            >
              Implementation
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-8">
            <div className="space-y-6">
              {data.recommendations
                .sort((a, b) => {
                  const priorityOrder = { high: 3, medium: 2, low: 1 }
                  return priorityOrder[b.priority] - priorityOrder[a.priority]
                })
                .map((rec, index) => (
                  <Card
                    key={index}
                    className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/60 rounded-xl float-animation"
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            {getImpactIcon(rec.impact)}
                            <CardTitle className="text-lg">{rec.title}</CardTitle>
                            <Badge
                              variant="outline"
                              className={cn("text-xs font-medium", getPriorityColor(rec.priority))}
                            >
                              {rec.priority} priority
                            </Badge>
                          </div>
                          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                            {rec.description}
                          </p>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-2xl font-bold text-primary-gradient-middle">
                            +{rec.estimatedImprovement}%
                          </div>
                          <div className="text-xs text-slate-500">improvement</div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                        <div className="flex items-center">
                          <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                          Impact: <span className="font-medium ml-1 capitalize">{rec.impact}</span>
                        </div>
                        <div className="flex items-center">
                          <Target className="h-4 w-4 mr-2 text-blue-500" />
                          Effort: <span className="font-medium ml-1 capitalize">{rec.effort}</span>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm mb-2 text-slate-700 dark:text-slate-300">Action Items:</h4>
                        <ul className="space-y-1">
                          {rec.actionItems.map((item, itemIndex) => (
                            <li key={itemIndex} className="flex items-start text-sm text-slate-600 dark:text-slate-400">
                              <CheckCircle className="h-4 w-4 mr-2 text-green-500 shrink-0 mt-0.5" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="hosting" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.hostingRecommendations.map((host, index) => (
                <Card
                  key={index}
                  className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/60 rounded-xl float-animation"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg mb-1">{host.name}</CardTitle>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                          <span className="text-sm font-medium">{host.score}/100</span>
                        </div>
                      </div>
                      <Badge className="bg-primary-gradient text-white">Recommended</Badge>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">{host.reason}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm mb-2">Key Features:</h4>
                      <ul className="space-y-1">
                        {host.features.map((feature, featureIndex) => (
                          <li
                            key={featureIndex}
                            className="flex items-center text-sm text-slate-600 dark:text-slate-400"
                          >
                            <CheckCircle className="h-3 w-3 mr-2 text-green-500 shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium">{host.pricing}</span>
                      </div>
                      <Button asChild className="w-full bg-primary-gradient hover:opacity-90 text-white shimmer">
                        <Link href={host.link}>
                          View Details
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="roadmap" className="mt-8">
            <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/60 rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2 text-primary-gradient-middle" />
                  Implementation Roadmap
                </CardTitle>
                <p className="text-slate-600 dark:text-slate-400">
                  Follow this step-by-step plan to maximize your sustainability improvements.
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Phase 1: Immediate Actions */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-primary-gradient-middle">
                      Phase 1: Immediate Actions (Week 1-2)
                    </h3>
                    <div className="space-y-3">
                      {data.recommendations
                        .filter((rec) => rec.priority === "high" && rec.effort === "low")
                        .map((rec, index) => (
                          <div
                            key={index}
                            className="flex items-start p-3 bg-green-50/50 dark:bg-green-950/20 rounded-lg border border-green-200/50 dark:border-green-800/50"
                          >
                            <CheckCircle className="h-5 w-5 text-green-600 mr-3 shrink-0 mt-0.5" />
                            <div>
                              <h4 className="font-medium text-sm">{rec.title}</h4>
                              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                                Expected improvement: +{rec.estimatedImprovement}%
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Phase 2: Medium-term Goals */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-primary-gradient-middle">
                      Phase 2: Medium-term Goals (Month 1-2)
                    </h3>
                    <div className="space-y-3">
                      {data.recommendations
                        .filter(
                          (rec) => rec.priority === "medium" || (rec.priority === "high" && rec.effort === "medium"),
                        )
                        .map((rec, index) => (
                          <div
                            key={index}
                            className="flex items-start p-3 bg-yellow-50/50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200/50 dark:border-yellow-800/50"
                          >
                            <Target className="h-5 w-5 text-yellow-600 mr-3 shrink-0 mt-0.5" />
                            <div>
                              <h4 className="font-medium text-sm">{rec.title}</h4>
                              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                                Expected improvement: +{rec.estimatedImprovement}%
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Phase 3: Long-term Optimization */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-primary-gradient-middle">
                      Phase 3: Long-term Optimization (Month 3+)
                    </h3>
                    <div className="space-y-3">
                      {data.recommendations
                        .filter((rec) => rec.effort === "high" || rec.priority === "low")
                        .map((rec, index) => (
                          <div
                            key={index}
                            className="flex items-start p-3 bg-blue-50/50 dark:bg-blue-950/20 rounded-lg border border-blue-200/50 dark:border-blue-800/50"
                          >
                            <Sparkles className="h-5 w-5 text-blue-600 mr-3 shrink-0 mt-0.5" />
                            <div>
                              <h4 className="font-medium text-sm">{rec.title}</h4>
                              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                                Expected improvement: +{rec.estimatedImprovement}%
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Total Potential Improvement */}
                  <div className="mt-8 p-4 bg-primary-gradient/10 rounded-lg border border-primary-gradient-middle/20">
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-primary-gradient-middle mb-2">
                        Total Potential Improvement
                      </h3>
                      <div className="text-3xl font-bold text-primary-gradient-middle mb-1">
                        +{data.recommendations.reduce((sum, rec) => sum + rec.estimatedImprovement, 0)}%
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Combined sustainability score improvement
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Call to Action */}
        <Card className="bg-primary-gradient text-white rounded-xl shimmer">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Make a Difference?</h2>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
              Start implementing these recommendations today and join the movement towards a more sustainable web.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild variant="secondary" className="bg-white text-primary-gradient-middle hover:bg-white/90">
                <Link href="/hosting?view=green">
                  <Leaf className="h-4 w-4 mr-2" />
                  Browse Green Hosting
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-white text-white hover:bg-white/10">
                <Link href="/">
                  <Zap className="h-4 w-4 mr-2" />
                  Analyze Another Site
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
      <Toaster />
    </div>
  )
}

"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { MagicalWebsiteInput } from "@/components/magical-website-input"
import { EnhancedErrorMessage } from "@/components/enhanced-error-message"
import { ChevronDown, Sparkles, Globe, Zap, Shield, Search, TrendingUp, Users, Leaf } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type { WebsiteData } from "@/types/website-data"

// Dynamic imports for better performance
const GoogleResultsCard = dynamic(
  () => import("@/components/google-results-card").then((mod) => ({ default: mod.GoogleResultsCard })),
  {
    loading: () => <Skeleton className="h-32 w-full" />,
    ssr: false,
  },
)

const GoogleMetricsGrid = dynamic(
  () => import("@/components/google-metrics-grid").then((mod) => ({ default: mod.GoogleMetricsGrid })),
  {
    loading: () => (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    ),
    ssr: false,
  },
)

const ResultsSection = dynamic(() => import("@/components/results-section"), {
  loading: () => <Skeleton className="h-96 w-full" />,
  ssr: false,
})

interface AnalysisState {
  data: WebsiteData | null
  isLoading: boolean
  error: string | null
  progress: number
}

const FEATURES = [
  {
    icon: Globe,
    title: "Website Analysis",
    description: "Comprehensive analysis of your website's performance, SEO, and user experience",
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    stats: "50K+ sites analyzed",
  },
  {
    icon: Shield,
    title: "Security Insights",
    description: "Identify security vulnerabilities and get recommendations to protect your site",
    color: "text-green-500",
    bgColor: "bg-green-50",
    stats: "99.9% accuracy",
  },
  {
    icon: Zap,
    title: "Performance Optimization",
    description: "Actionable tips to improve loading speed and overall performance",
    color: "text-yellow-500",
    bgColor: "bg-yellow-50",
    stats: "40% avg improvement",
  },
  {
    icon: Leaf,
    title: "Sustainability Metrics",
    description: "Measure and reduce your website's carbon footprint and environmental impact",
    color: "text-emerald-500",
    bgColor: "bg-emerald-50",
    stats: "Carbon neutral tracking",
  },
  {
    icon: Search,
    title: "SEO Recommendations",
    description: "Improve your search engine rankings with targeted optimization tips",
    color: "text-indigo-500",
    bgColor: "bg-indigo-50",
    stats: "200+ SEO factors",
  },
  {
    icon: Sparkles,
    title: "AI Content Generation",
    description: "Create optimized content based on your website's analysis results",
    color: "text-pink-500",
    bgColor: "bg-pink-50",
    stats: "GPT-4 powered",
  },
]

export default function Home() {
  const [url, setUrl] = useState("")
  const [showFeatures, setShowFeatures] = useState(false)
  const [analysis, setAnalysis] = useState<AnalysisState>({
    data: null,
    isLoading: false,
    error: null,
    progress: 0,
  })
  const router = useRouter()

  // Load stored analysis data on mount
  useEffect(() => {
    try {
      const storedData = localStorage.getItem("webInsightAnalysisData")
      if (storedData) {
        const parsedData = JSON.parse(storedData)
        setAnalysis((prev) => ({ ...prev, data: parsedData }))
      }
    } catch (error) {
      console.error("Failed to parse stored analysis data:", error)
    }
  }, [])

  // Simulate progress during analysis
  useEffect(() => {
    if (analysis.isLoading) {
      const interval = setInterval(() => {
        setAnalysis((prev) => ({
          ...prev,
          progress: Math.min(prev.progress + Math.random() * 15, 95),
        }))
      }, 500)

      return () => clearInterval(interval)
    }
  }, [analysis.isLoading])

  const handleAnalyze = useCallback(async (inputUrl: string) => {
    if (!inputUrl) return

    setUrl(inputUrl)
    setAnalysis({
      data: null,
      isLoading: true,
      error: null,
      progress: 0,
    })

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: inputUrl }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to analyze website")
      }

      const data = await response.json()

      setAnalysis({
        data,
        isLoading: false,
        error: null,
        progress: 100,
      })

      localStorage.setItem("webInsightAnalysisData", JSON.stringify(data))
      localStorage.setItem("latest-website-analysis", JSON.stringify(data))
    } catch (err: any) {
      console.error("Analysis error:", err)
      setAnalysis({
        data: null,
        isLoading: false,
        error: err.message || "An unexpected error occurred",
        progress: 0,
      })
    }
  }, [])

  const handleClear = useCallback(() => {
    setAnalysis({
      data: null,
      isLoading: false,
      error: null,
      progress: 0,
    })
    localStorage.removeItem("webInsightAnalysisData")
    localStorage.removeItem("latest-website-analysis")
  }, [])

  const handleRetry = useCallback(() => {
    if (url) {
      handleAnalyze(url)
    }
  }, [url, handleAnalyze])

  const handleReset = useCallback(() => {
    setUrl("")
    handleClear()
  }, [handleClear])

  const getErrorType = useMemo(() => {
    if (!analysis.error) return "unknown"

    if (analysis.error.includes("Invalid URL") || analysis.error.includes("URL format")) return "url"
    if (analysis.error.includes("timeout") || analysis.error.includes("took too long")) return "timeout"
    if (analysis.error.includes("access") || analysis.error.includes("blocked")) return "access"
    if (analysis.error.includes("server") || analysis.error.includes("500")) return "server"

    return "unknown"
  }, [analysis.error])

  // Show error state
  if (analysis.error) {
    return (
      <main className="flex min-h-screen flex-col">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <Logo size="md" />
            <Button variant="outline" onClick={handleClear}>
              New Analysis
            </Button>
          </div>

          <div className="max-w-4xl mx-auto py-12">
            <EnhancedErrorMessage
              error={analysis.error}
              errorType={getErrorType}
              onRetry={handleRetry}
              onReset={handleReset}
            />
          </div>
        </div>
      </main>
    )
  }

  // Show results if we have analysis data
  if (analysis.data) {
    return (
      <main className="flex min-h-screen flex-col">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <Logo size="md" />
            <div className="flex gap-4">
              <Button variant="outline" onClick={handleClear}>
                New Analysis
              </Button>
              <Button
                onClick={() => router.push("/ai-content")}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Generate Content <Sparkles className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <GoogleResultsCard analysisData={analysis.data} />
            <GoogleMetricsGrid analysisData={analysis.data} />
            <ResultsSection data={analysis.data} />
          </motion.div>
        </div>
      </main>
    )
  }

  // Show loading state
  if (analysis.isLoading) {
    return (
      <main className="flex min-h-screen flex-col">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <Logo size="md" />
          </div>

          <div className="max-w-4xl mx-auto py-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-8"
            >
              <div className="space-y-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  className="w-16 h-16 mx-auto"
                >
                  <Logo size="lg" animated />
                </motion.div>

                <h2 className="text-2xl font-bold text-gray-900">Analyzing Website</h2>
                <p className="text-gray-600">
                  We're performing a comprehensive analysis of <span className="font-medium text-blue-600">{url}</span>
                </p>
              </div>

              <div className="max-w-md mx-auto space-y-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${analysis.progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <p className="text-sm text-gray-500">{Math.round(analysis.progress)}% complete</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                {["Performance", "Security", "SEO", "Sustainability"].map((metric, index) => (
                  <motion.div
                    key={metric}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className="bg-white rounded-lg p-4 shadow-sm border"
                  >
                    <div className="text-sm font-medium text-gray-600">{metric}</div>
                    <div className="mt-2">
                      <Skeleton className="h-2 w-full" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    )
  }

  // Show initial landing page
  return (
    <main className="flex min-h-screen flex-col">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center justify-center text-center py-12">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Logo size="xl" animated={true} />
            </motion.div>

            <motion.div
              className="mt-8 space-y-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.7 }}
            >
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
                  Advanced Website Intelligence Platform
                </h1>

                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  Analyze your website's performance, sustainability, and security with AI-powered insights
                </p>

                <div className="flex flex-wrap justify-center gap-2 mt-6">
                  <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    50K+ Analyses
                  </Badge>
                  <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                    <Shield className="w-3 h-3 mr-1" />
                    Enterprise Security
                  </Badge>
                  <Badge variant="secondary" className="bg-purple-50 text-purple-700 border-purple-200">
                    <Sparkles className="w-3 h-3 mr-1" />
                    AI-Powered
                  </Badge>
                  <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                    <Leaf className="w-3 h-3 mr-1" />
                    Carbon Tracking
                  </Badge>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="mt-12 w-full max-w-2xl"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.7 }}
            >
              <MagicalWebsiteInput onAnalyze={handleAnalyze} isLoading={analysis.isLoading} />
            </motion.div>

            <motion.div
              className="mt-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.7 }}
            >
              <Button
                variant="ghost"
                onClick={() => setShowFeatures(!showFeatures)}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
              >
                Discover our powerful features
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${showFeatures ? "rotate-180" : ""}`}
                />
              </Button>
            </motion.div>

            <AnimatePresence>
              {showFeatures && (
                <motion.div
                  className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  {FEATURES.map((feature, index) => (
                    <FeatureCard key={feature.title} feature={feature} index={index} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Trust indicators */}
            <motion.div
              className="mt-16 flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.7 }}
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>Trusted by 10,000+ websites</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>SOC 2 Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                <span>Real-time Analysis</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  )
}

function FeatureCard({ feature, index }: { feature: (typeof FEATURES)[0]; index: number }) {
  const Icon = feature.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="group"
    >
      <Card className="overflow-hidden border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300 hover:shadow-lg group-hover:shadow-xl">
        <CardContent className="p-6">
          <div
            className={`rounded-full ${feature.bgColor} p-3 w-12 h-12 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}
          >
            <Icon className={`h-6 w-6 ${feature.color}`} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">
                {feature.title}
              </h3>
              <Badge variant="outline" className="text-xs">
                {feature.stats}
              </Badge>
            </div>

            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{feature.description}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

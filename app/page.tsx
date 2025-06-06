"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MagicalWebsiteInput } from "@/components/magical-website-input"
import { GoogleHeroSection } from "@/components/google-hero-section"
import { GoogleResultsCard } from "@/components/google-results-card"
import { GoogleMetricsGrid } from "@/components/google-metrics-grid"
import { ResultsSection } from "@/components/results-section"
import { ChevronDown, Sparkles, Globe, Zap, Shield, BarChart3, Search } from "lucide-react"
import { motion } from "framer-motion"

export default function Home() {
  const [url, setUrl] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisData, setAnalysisData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [showFeatures, setShowFeatures] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if there's stored analysis data
    const storedData = localStorage.getItem("webInsightAnalysisData")
    if (storedData) {
      try {
        setAnalysisData(JSON.parse(storedData))
      } catch (e) {
        console.error("Failed to parse stored analysis data")
      }
    }
  }, [])

  const handleAnalyze = async (inputUrl: string) => {
    if (!inputUrl) return

    setUrl(inputUrl)
    setIsAnalyzing(true)
    setError(null)

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
        throw new Error(errorData.message || "Failed to analyze website")
      }

      const data = await response.json()
      setAnalysisData(data)
      localStorage.setItem("webInsightAnalysisData", JSON.stringify(data))
    } catch (err: any) {
      console.error("Analysis error:", err)
      setError(err.message || "An unexpected error occurred")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleClear = () => {
    setAnalysisData(null)
    localStorage.removeItem("webInsightAnalysisData")
  }

  return (
    <main className="flex min-h-screen flex-col">
      <div className="container mx-auto px-4 py-8">
        {!analysisData ? (
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col items-center justify-center text-center py-12">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Logo size="xl" animated={true} />
              </motion.div>

              <motion.h1
                className="mt-8 text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.7 }}
              >
                Advanced Website Intelligence Platform
              </motion.h1>

              <motion.p
                className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-3xl"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.7 }}
              >
                Analyze your website's performance, sustainability, and security with AI-powered insights
              </motion.p>

              <motion.div
                className="mt-8 w-full max-w-2xl"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.7 }}
              >
                <MagicalWebsiteInput onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} error={error} />
              </motion.div>

              <motion.div
                className="mt-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.7 }}
              >
                <Button
                  variant="ghost"
                  onClick={() => setShowFeatures(!showFeatures)}
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-300"
                >
                  Learn more about our features
                  <ChevronDown className={`h-4 w-4 transition-transform ${showFeatures ? "rotate-180" : ""}`} />
                </Button>
              </motion.div>

              {showFeatures && (
                <motion.div
                  className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <FeatureCard
                    icon={<Globe className="h-6 w-6 text-blue-500" />}
                    title="Website Analysis"
                    description="Comprehensive analysis of your website's performance, SEO, and user experience"
                  />
                  <FeatureCard
                    icon={<Shield className="h-6 w-6 text-green-500" />}
                    title="Security Insights"
                    description="Identify security vulnerabilities and get recommendations to protect your site"
                  />
                  <FeatureCard
                    icon={<Zap className="h-6 w-6 text-yellow-500" />}
                    title="Performance Optimization"
                    description="Actionable tips to improve loading speed and overall performance"
                  />
                  <FeatureCard
                    icon={<BarChart3 className="h-6 w-6 text-purple-500" />}
                    title="Sustainability Metrics"
                    description="Measure and reduce your website's carbon footprint and environmental impact"
                  />
                  <FeatureCard
                    icon={<Search className="h-6 w-6 text-indigo-500" />}
                    title="SEO Recommendations"
                    description="Improve your search engine rankings with targeted optimization tips"
                  />
                  <FeatureCard
                    icon={<Sparkles className="h-6 w-6 text-pink-500" />}
                    title="AI Content Generation"
                    description="Create optimized content based on your website's analysis results"
                  />
                </motion.div>
              )}
            </div>
          </div>
        ) : (
          <div>
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

            <GoogleHeroSection
              url={url}
              title={analysisData.title || url}
              description={analysisData.description || "Website analysis results"}
            />

            <div className="mt-8">
              <GoogleResultsCard analysisData={analysisData} />
            </div>

            <div className="mt-8">
              <GoogleMetricsGrid analysisData={analysisData} />
            </div>

            <div className="mt-12">
              <ResultsSection analysisData={analysisData} />
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="overflow-hidden border border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 hover:shadow-md">
      <CardContent className="p-6">
        <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-3 w-12 h-12 flex items-center justify-center mb-4">
          {icon}
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm">{description}</p>
      </CardContent>
    </Card>
  )
}

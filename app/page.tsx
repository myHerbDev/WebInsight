"use client"

import { useState } from "react"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { LoadingAnimation } from "@/components/loading-animation"
import { ResultsSection } from "@/components/results-section"
import { SignUpModal } from "@/components/sign-up-modal"
import { MagicalWebsiteInput } from "@/components/magical-website-input"
import { EnhancedErrorMessage } from "@/components/enhanced-error-message"
import { toast } from "@/components/ui/use-toast"
import type { WebsiteData } from "@/types/website-data"
import { motion } from "framer-motion"
import { AnalyticsGraphic } from "@/components/analytics-graphic"
import { Sparkles, TrendingUp, Shield, Leaf, Globe, Users } from "lucide-react"

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [websiteData, setWebsiteData] = useState<WebsiteData | null>(null)
  const [showSignUpModal, setShowSignUpModal] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [errorType, setErrorType] = useState<"url" | "access" | "timeout" | "server" | "unknown">("unknown")
  const [lastAnalyzedUrl, setLastAnalyzedUrl] = useState<string>("")

  const determineErrorType = (
    error: Error | string,
    statusCode?: number,
  ): "url" | "access" | "timeout" | "server" | "unknown" => {
    const errorMessage = typeof error === "string" ? error : error.message

    if (errorMessage.includes("Invalid URL") || errorMessage.includes("URL format")) {
      return "url"
    }

    if (errorMessage.includes("access denied") || errorMessage.includes("403") || statusCode === 403) {
      return "access"
    }

    if (errorMessage.includes("timeout") || errorMessage.includes("timed out") || statusCode === 408) {
      return "timeout"
    }

    if (errorMessage.includes("server error") || statusCode === 500) {
      return "server"
    }

    return "unknown"
  }

  const handleAnalyzeWebsite = async (url: string) => {
    setIsLoading(true)
    setWebsiteData(null)
    setError(null)
    setLastAnalyzedUrl(url)

    try {
      // Validate URL format first
      try {
        new URL(url)
      } catch (e) {
        setErrorType("url")
        throw new Error(`Invalid URL format: ${url}. Please enter a valid website address.`)
      }

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Determine error type based on status code and message
        const errorType = determineErrorType(data.error || "Failed to analyze website", response.status)
        setErrorType(errorType)

        throw new Error(data.error || `Failed to analyze website: ${url}`)
      }

      setWebsiteData(data)
    } catch (error: any) {
      console.error("Error analyzing website:", error)

      // If error type wasn't set during the try block
      if (errorType === "unknown") {
        setErrorType(determineErrorType(error))
      }

      setError(error.message || "Failed to analyze the website. Please try again.")
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze the website. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveAnalysis = async (type: "save" | "favorite") => {
    if (!websiteData) return

    try {
      const response = await fetch("/api/user/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          analysisId: websiteData._id,
          type: type === "favorite" ? "favorite" : "save",
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `Failed to ${type} analysis`)
      }

      if (data.userId && !userId) {
        setUserId(data.userId)
      }

      toast({
        title: "Success",
        description: data.message || `${type === "favorite" ? "Added to favorites" : "Analysis saved"}`,
      })
    } catch (error: any) {
      console.error(`Error ${type}ing analysis:`, error)
      toast({
        title: "Error",
        description: `Failed to ${type} the analysis. Please try again.`,
        variant: "destructive",
      })
    }
  }

  const handleSignUp = (tempUserId: string) => {
    setUserId(tempUserId || userId)
    setShowSignUpModal(true)
  }

  const handleRetryAnalysis = () => {
    if (lastAnalyzedUrl) {
      handleAnalyzeWebsite(lastAnalyzedUrl)
    }
  }

  const handleResetAnalysis = () => {
    setError(null)
    setWebsiteData(null)
    setLastAnalyzedUrl("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Header />

      <main className="relative">
        {/* Hero Section with Magical Input */}
        {!websiteData && !isLoading && !error && (
          <section className="relative">
            <MagicalWebsiteInput onAnalyze={handleAnalyzeWebsite} isLoading={isLoading} />
          </section>
        )}

        {/* Loading Animation */}
        {isLoading && (
          <div className="min-h-[600px] flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <LoadingAnimation />
          </div>
        )}

        {/* Enhanced Error State */}
        {error && !isLoading && (
          <div className="min-h-[600px] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            <EnhancedErrorMessage
              error={error}
              errorType={errorType}
              onRetry={handleRetryAnalysis}
              onReset={handleResetAnalysis}
            />
          </div>
        )}

        {/* Results Section with Improved Visual Separation */}
        {websiteData && (
          <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <div className="container mx-auto px-4 py-8">
              <div className="max-w-4xl mx-auto">
                {/* Back to Search Button */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
                  <button
                    onClick={handleResetAnalysis}
                    className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
                  >
                    <span>←</span>
                    <span>Analyze Another Website</span>
                  </button>
                </motion.div>

                <ResultsSection
                  data={websiteData}
                  onSignUpClick={handleSignUp}
                  onSave={() => handleSaveAnalysis("save")}
                  onFavorite={() => handleSaveAnalysis("favorite")}
                  userId={userId}
                />
              </div>
            </div>
          </div>
        )}

        {/* Features Section - Only show when no analysis is displayed */}
        {!websiteData && !isLoading && !error && (
          <section className="relative py-24 px-4">
            <div className="container mx-auto max-w-6xl">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-purple-400 to-teal-400 bg-clip-text text-transparent">
                    Powerful Features
                  </span>
                </h2>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                  Comprehensive website analysis with AI-powered insights and actionable recommendations
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  {
                    icon: TrendingUp,
                    title: "Performance Analysis",
                    description:
                      "Deep dive into loading speeds, optimization opportunities, and user experience metrics",
                    color: "from-green-400 to-emerald-400",
                    delay: 0.1,
                  },
                  {
                    icon: Shield,
                    title: "Security Assessment",
                    description: "Comprehensive security analysis including SSL, headers, and vulnerability detection",
                    color: "from-blue-400 to-cyan-400",
                    delay: 0.2,
                  },
                  {
                    icon: Leaf,
                    title: "Sustainability Metrics",
                    description: "Environmental impact analysis and carbon footprint optimization suggestions",
                    color: "from-emerald-400 to-teal-400",
                    delay: 0.3,
                  },
                  {
                    icon: Sparkles,
                    title: "AI Content Generation",
                    description: "Generate blog posts, social media content, and marketing copy from your analysis",
                    color: "from-purple-400 to-pink-400",
                    delay: 0.4,
                  },
                  {
                    icon: Globe,
                    title: "Hosting Intelligence",
                    description: "Identify hosting providers, server locations, and infrastructure recommendations",
                    color: "from-orange-400 to-red-400",
                    delay: 0.5,
                  },
                  {
                    icon: Users,
                    title: "Competitive Analysis",
                    description: "Compare your website against competitors and industry benchmarks",
                    color: "from-indigo-400 to-purple-400",
                    delay: 0.6,
                  },
                ].map(({ icon: Icon, title, description, color, delay }) => (
                  <motion.div
                    key={title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05 }}
                    className="group relative"
                  >
                    <div
                      className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl blur-xl"
                      style={{ background: `linear-gradient(135deg, var(--tw-gradient-stops))` }}
                    />

                    <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 h-full hover:border-white/30 transition-all duration-300">
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-r ${color} flex items-center justify-center mb-6`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>

                      <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>
                      <p className="text-gray-300 leading-relaxed">{description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Analytics Graphic Section */}
        {!websiteData && !isLoading && !error && (
          <section className="relative py-24 px-4">
            <div className="container mx-auto max-w-4xl text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <AnalyticsGraphic className="w-full max-w-2xl mx-auto mb-8" />
                <h3 className="text-3xl font-bold text-white mb-4">Real-time Analytics Dashboard</h3>
                <p className="text-xl text-gray-300">
                  Visualize your website's performance with beautiful, interactive charts and insights
                </p>
              </motion.div>
            </div>
          </section>
        )}
      </main>

      <Footer />

      {showSignUpModal && (
        <SignUpModal
          onClose={() => setShowSignUpModal(false)}
          tempUserId={userId}
          onSignUpSuccess={(newUserId) => {
            setUserId(newUserId)
            setShowSignUpModal(false)
            toast({
              title: "Success",
              description: "Account created successfully!",
            })
          }}
        />
      )}
    </div>
  )
}

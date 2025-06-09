"use client"

import { useState, useEffect } from "react"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { LoadingAnimation } from "@/components/loading-animation"
import { ResultsSection } from "@/components/results-section"
import { MagicalWebsiteInput } from "@/components/magical-website-input"
import { EnhancedErrorMessage } from "@/components/enhanced-error-message"
import { EnhancedAIGenerator } from "@/components/enhanced-ai-generator"
import { GoogleStyleCard } from "@/components/google-style-card"
import { toast } from "@/components/ui/use-toast"
import type { WebsiteData, AnalysisOptions } from "@/types/website-data"
import { motion, AnimatePresence } from "framer-motion"
import { TrendingUp, Shield, Leaf, Globe, Users, ArrowUp, Brain, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { safeFetch } from "@/lib/safe-fetch"

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [websiteData, setWebsiteData] = useState<WebsiteData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [errorType, setErrorType] = useState<"url" | "access" | "timeout" | "server" | "unknown">("unknown")
  const [lastAnalyzedUrl, setLastAnalyzedUrl] = useState<string>("")
  const [showScrollToTop, setShowScrollToTop] = useState(false)
  const [activeTab, setActiveTab] = useState("analyze")
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true) // Ensures client-side logic runs after hydration
  }, [])

  useEffect(() => {
    if (!isClient) return

    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 300)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isClient])

  const determineErrorType = (
    errorMsg: string,
    statusCode?: number,
  ): "url" | "access" | "timeout" | "server" | "unknown" => {
    const lowerErrorMsg = errorMsg.toLowerCase()
    if (lowerErrorMsg.includes("invalid url") || lowerErrorMsg.includes("url format")) return "url"
    if (lowerErrorMsg.includes("access denied") || lowerErrorMsg.includes("403") || statusCode === 403) return "access"
    if (lowerErrorMsg.includes("timeout") || lowerErrorMsg.includes("timed out") || statusCode === 408) return "timeout"
    if (lowerErrorMsg.includes("server error") || statusCode === 500 || statusCode === 503) return "server"
    return "unknown"
  }

  const handleAnalyzeWebsite = async (url: string) => {
    if (!isClient) return

    setIsLoading(true)
    setWebsiteData(null)
    setError(null)
    setLastAnalyzedUrl(url)
    setActiveTab("analyze") // Keep on analyze tab while loading

    try {
      let normalizedUrl = url.trim()
      if (!normalizedUrl) throw new Error("URL cannot be empty.")
      if (!normalizedUrl.startsWith("http://") && !normalizedUrl.startsWith("https://")) {
        normalizedUrl = `https://${normalizedUrl}`
      }
      new URL(normalizedUrl) // Validate URL format

      const analysisOptions: AnalysisOptions = {
        includeAdvancedMetrics: true,
        analyzeSEO: true,
        checkAccessibility: true,
        analyzePerformance: true,
        checkSecurity: true,
        analyzeSustainability: true,
        includeContentAnalysis: true,
        checkMobileOptimization: true,
        analyzeLoadingSpeed: true,
        checkSocialMedia: true,
      }

      const {
        success,
        data,
        error: fetchError,
        status,
      } = await safeFetch<WebsiteData>("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: normalizedUrl, ...analysisOptions }),
        timeout: 45000, // 45 seconds timeout for analysis
      })

      if (!success || !data) {
        const determinedErrorType = determineErrorType(fetchError || "Analysis failed", status)
        setErrorType(determinedErrorType)
        throw new Error(fetchError || "Analysis failed due to an unknown error.")
      }

      // Basic validation of received data
      if (!data._id || !data.url) {
        throw new Error("Received incomplete analysis data from server.")
      }

      setWebsiteData(data)
      toast({ title: "Analysis Complete!", description: `Successfully analyzed ${data.url}` })
      setTimeout(() => setActiveTab("results"), 300) // Switch to results tab
    } catch (err: any) {
      const errorMessage = err.message || "An unexpected error occurred during analysis."
      setError(errorMessage)
      if (errorType === "unknown") {
        // Set error type if not already set by safeFetch
        setErrorType(determineErrorType(errorMessage))
      }
      toast({ title: "Analysis Failed", description: errorMessage, variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveAnalysis = async (type: "save" | "favorite") => {
    // This function would require authentication.
    // For now, it will just show a toast.
    if (!websiteData) return
    toast({
      title: "Feature Coming Soon",
      description: `${type === "favorite" ? "Favoriting" : "Saving"} analyses will be available with user accounts.`,
    })
  }

  const handleSignUpClick = () => {
    toast({
      title: "Feature Coming Soon",
      description: "User accounts and sign-up functionality will be available soon.",
    })
  }

  const handleRetryAnalysis = () => {
    if (lastAnalyzedUrl) handleAnalyzeWebsite(lastAnalyzedUrl)
  }

  const handleResetAnalysis = () => {
    setError(null)
    setWebsiteData(null)
    setLastAnalyzedUrl("")
    setActiveTab("analyze")
  }

  const scrollToTop = () => {
    if (isClient) window.scrollTo({ top: 0, behavior: "smooth" })
  }

  if (!isClient) {
    // Basic SSR fallback / pre-hydration view
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 text-center">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-8"></div>
            <div className="h-64 bg-gray-200 rounded-xl"></div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-slate-800">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="grid grid-cols-3 w-full max-w-lg bg-white dark:bg-slate-700 shadow-lg border border-gray-200 dark:border-slate-600 rounded-full p-1">
                {[
                  { value: "analyze", label: "Analyze", icon: Globe },
                  { value: "results", label: "Results", icon: BarChart3, disabled: !websiteData && !error },
                  { value: "ai-content", label: "AI Content", icon: Brain },
                ].map((tab) => {
                  const Icon = tab.icon
                  return (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      disabled={tab.disabled}
                      className="rounded-full data-[state=active]:bg-blue-600 data-[state=active]:text-white dark:data-[state=active]:bg-blue-500 transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </TabsTrigger>
                  )
                })}
              </TabsList>
            </div>

            <TabsContent value="analyze" className="space-y-8">
              <GoogleStyleCard className="p-0 overflow-hidden">
                <MagicalWebsiteInput onAnalyze={handleAnalyzeWebsite} isLoading={isLoading} />
              </GoogleStyleCard>
              <AnimatePresence>
                {isLoading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <GoogleStyleCard>
                      <LoadingAnimation />
                    </GoogleStyleCard>
                  </motion.div>
                )}
                {error && !isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <GoogleStyleCard>
                      <EnhancedErrorMessage
                        error={error}
                        errorType={errorType}
                        onRetry={handleRetryAnalysis}
                        onReset={handleResetAnalysis}
                      />
                    </GoogleStyleCard>
                  </motion.div>
                )}
              </AnimatePresence>
              {!isLoading && !error && !websiteData && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {[
                    {
                      icon: TrendingUp,
                      title: "Performance Insights",
                      description: "Optimize loading speeds and Core Web Vitals.",
                      color: "from-green-500 to-emerald-500",
                    },
                    {
                      icon: Shield,
                      title: "Security Checks",
                      description: "Assess SSL, headers, and common vulnerabilities.",
                      color: "from-blue-500 to-cyan-500",
                    },
                    {
                      icon: Leaf,
                      title: "Sustainability Metrics",
                      description: "Analyze environmental impact and carbon footprint.",
                      color: "from-emerald-500 to-teal-500",
                    },
                    {
                      icon: Brain,
                      title: "AI Content Ideas",
                      description: "Generate content from your site's analysis.",
                      color: "from-purple-500 to-pink-500",
                    },
                    {
                      icon: Globe,
                      title: "SEO & Accessibility",
                      description: "Audit SEO best practices and accessibility compliance.",
                      color: "from-orange-500 to-red-500",
                    },
                    {
                      icon: Users,
                      title: "Mobile Friendliness",
                      description: "Check mobile optimization and social media integration.",
                      color: "from-indigo-500 to-purple-500",
                    },
                  ].map((feature, index) => (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      whileHover={{ y: -5 }}
                    >
                      <GoogleStyleCard className="h-full hover:shadow-xl transition-all duration-300">
                        <div
                          className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}
                        >
                          <feature.icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{feature.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                          {feature.description}
                        </p>
                      </GoogleStyleCard>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </TabsContent>

            <TabsContent value="results" className="space-y-8">
              <AnimatePresence>
                {websiteData && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <GoogleStyleCard>
                      <ResultsSection
                        data={websiteData}
                        onSignUpClick={handleSignUpClick}
                        onSave={() => handleSaveAnalysis("save")}
                        onFavorite={() => handleSaveAnalysis("favorite")}
                        userId={null}
                      />
                      <div className="text-center mt-8">
                        <Button
                          onClick={() => setActiveTab("ai-content")}
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          <Brain className="mr-2 h-5 w-5" /> Generate AI Content from this Analysis
                        </Button>
                      </div>
                    </GoogleStyleCard>
                  </motion.div>
                )}
                {error &&
                  !isLoading && ( // Show error message on results tab if navigation happened while error was present
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <GoogleStyleCard>
                        <EnhancedErrorMessage
                          error={error}
                          errorType={errorType}
                          onRetry={handleRetryAnalysis}
                          onReset={handleResetAnalysis}
                        />
                      </GoogleStyleCard>
                    </motion.div>
                  )}
              </AnimatePresence>
            </TabsContent>

            <TabsContent value="ai-content" className="space-y-8">
              <GoogleStyleCard>
                <EnhancedAIGenerator websiteData={websiteData} onSignUpClick={handleSignUpClick} />
              </GoogleStyleCard>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>

      <AnimatePresence>
        {showScrollToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-200 p-3 rounded-full shadow-lg hover:shadow-xl border border-gray-200 dark:border-slate-600 transition-all duration-300 hover:scale-110"
          >
            <ArrowUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
      <Footer />
    </div>
  )
}

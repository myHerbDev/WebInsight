"use client"

import { useState, useEffect } from "react"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { LoadingAnimation } from "@/components/loading-animation"
import { ResultsSection } from "@/components/results-section"
import { SignUpModal } from "@/components/sign-up-modal"
import { MagicalWebsiteInput } from "@/components/magical-website-input"
import { EnhancedErrorMessage } from "@/components/enhanced-error-message"
import { EnhancedAIGenerator } from "@/components/enhanced-ai-generator"
import { GoogleStyleCard } from "@/components/google-style-card"
import { toast } from "@/components/ui/use-toast"
import type { WebsiteData } from "@/types/website-data"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, TrendingUp, Shield, Leaf, Globe, Users, ArrowUp, Brain } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [websiteData, setWebsiteData] = useState<WebsiteData | null>(null)
  const [showSignUpModal, setShowSignUpModal] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [errorType, setErrorType] = useState<"url" | "access" | "timeout" | "server" | "unknown">("unknown")
  const [lastAnalyzedUrl, setLastAnalyzedUrl] = useState<string>("")
  const [showScrollToTop, setShowScrollToTop] = useState(false)
  const [activeTab, setActiveTab] = useState("analyze")
  const [isClient, setIsClient] = useState(false)

  // Client-side hydration
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Enhanced scroll detection
  useEffect(() => {
    if (!isClient) return

    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 300)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isClient])

  const determineErrorType = (
    error: Error | string,
    statusCode?: number,
  ): "url" | "access" | "timeout" | "server" | "unknown" => {
    const errorMessage = typeof error === "string" ? error : error.message || ""

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
    if (!isClient) return

    setIsLoading(true)
    setWebsiteData(null)
    setError(null)
    setLastAnalyzedUrl(url)
    setActiveTab("analyze")

    try {
      // Enhanced URL validation
      let normalizedUrl = ""
      try {
        normalizedUrl = url.trim()
        if (!normalizedUrl) {
          throw new Error("URL cannot be empty")
        }

        if (!normalizedUrl.startsWith("http://") && !normalizedUrl.startsWith("https://")) {
          normalizedUrl = "https://" + normalizedUrl
        }

        // Validate URL format
        const urlObj = new URL(normalizedUrl)
        if (!urlObj.hostname || urlObj.hostname.length < 3) {
          throw new Error("Invalid hostname")
        }
      } catch (urlError: any) {
        setErrorType("url")
        throw new Error(`Invalid URL format: ${url}. Please enter a valid website address.`)
      }

      console.log("Starting website analysis for:", normalizedUrl)

      // Enhanced request preparation
      const requestData = {
        url: normalizedUrl,
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

      // Validate request data
      if (!requestData.url) {
        throw new Error("Request data validation failed")
      }

      console.log("Sending analysis request...")

      // Enhanced fetch with comprehensive error handling
      const controller = new AbortController()
      const timeoutId = setTimeout(() => {
        console.log("Request timeout triggered")
        controller.abort()
      }, 30000)

      let response: Response
      try {
        response = await fetch("/api/analyze", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
          signal: controller.signal,
        })
      } catch (fetchError: any) {
        clearTimeout(timeoutId)
        if (fetchError.name === "AbortError") {
          setErrorType("timeout")
          throw new Error("Request timeout - analysis took too long")
        }
        throw new Error(`Network error: ${fetchError.message}`)
      }

      clearTimeout(timeoutId)
      console.log("Response received with status:", response.status)

      // Enhanced response handling
      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`

        try {
          const responseText = await response.text()
          console.log("Error response text length:", responseText?.length || 0)

          if (responseText && responseText.trim()) {
            try {
              const errorData = JSON.parse(responseText)
              errorMessage = errorData.error || errorData.message || errorMessage
            } catch (parseError) {
              console.warn("Could not parse error response as JSON")
              errorMessage = responseText.substring(0, 200)
            }
          }
        } catch (textError) {
          console.error("Failed to read error response:", textError)
        }

        const errorType = determineErrorType(errorMessage, response.status)
        setErrorType(errorType)
        throw new Error(errorMessage)
      }

      // Enhanced response parsing
      let data
      try {
        const responseText = await response.text()
        console.log("Success response length:", responseText?.length || 0)

        if (!responseText || !responseText.trim()) {
          throw new Error("Empty response from server")
        }

        // Validate JSON structure
        const trimmed = responseText.trim()
        if (!trimmed.startsWith("{")) {
          throw new Error("Invalid response format from server")
        }

        data = JSON.parse(responseText)
        console.log("Successfully parsed response data")

        // Enhanced data validation
        if (!data || typeof data !== "object") {
          throw new Error("Invalid data format received from server")
        }

        // Ensure all required fields with comprehensive defaults
        data = {
          _id: data._id || "unknown",
          url: data.url || normalizedUrl,
          title: data.title || "Website Analysis",
          summary: data.summary || "Analysis completed successfully",
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
      } catch (parseError: any) {
        console.error("Response parsing error:", parseError.message)
        throw new Error(`Failed to parse server response: ${parseError.message}`)
      }

      // Final validation before setting state
      if (!data._id || !data.url) {
        throw new Error("Response missing required fields")
      }

      setWebsiteData(data)
      setShowScrollToTop(true)

      // Auto-switch to results tab
      setTimeout(() => setActiveTab("results"), 500)

      console.log("Analysis completed successfully")
    } catch (error: any) {
      console.error("Error analyzing website:", error)

      if (error.name === "AbortError") {
        setError("Request timeout - analysis took too long")
        setErrorType("timeout")
      } else {
        if (errorType === "unknown") {
          setErrorType(determineErrorType(error))
        }

        const errorMessage = error.message || "Failed to analyze the website. Please try again."
        setError(errorMessage)
      }

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
    if (!websiteData || !isClient) return

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

      let data
      try {
        const responseText = await response.text()
        if (responseText.trim()) {
          data = JSON.parse(responseText)
        } else {
          throw new Error("Empty response from server")
        }
      } catch (e) {
        throw new Error(`Failed to ${type} analysis: Invalid response format`)
      }

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
    setShowScrollToTop(false)
    setActiveTab("analyze")
  }

  const scrollToTop = () => {
    if (isClient) {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  // Don't render until client-side to avoid hydration issues
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-96 bg-gray-200 rounded-3xl"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Google-style floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [null, -50],
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <Header />

      <main className="relative z-10">
        {/* Main Content Container */}
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Core App Tabs */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList className="grid grid-cols-3 w-full max-w-md bg-white shadow-lg border border-gray-200 rounded-full p-1">
                  <TabsTrigger
                    value="analyze"
                    className="rounded-full data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-all duration-300"
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    Analyze
                  </TabsTrigger>
                  <TabsTrigger
                    value="results"
                    className="rounded-full data-[state=active]:bg-green-500 data-[state=active]:text-white transition-all duration-300"
                    disabled={!websiteData && !error}
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Results
                  </TabsTrigger>
                  <TabsTrigger
                    value="ai-content"
                    className="rounded-full data-[state=active]:bg-purple-500 data-[state=active]:text-white transition-all duration-300"
                  >
                    <Brain className="w-4 h-4 mr-2" />
                    AI Content
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Analyze Tab */}
              <TabsContent value="analyze" className="space-y-8">
                <GoogleStyleCard className="p-0 overflow-hidden">
                  <MagicalWebsiteInput onAnalyze={handleAnalyzeWebsite} isLoading={isLoading} />
                </GoogleStyleCard>

                {/* Loading Animation */}
                <AnimatePresence>
                  {isLoading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <GoogleStyleCard>
                        <LoadingAnimation />
                      </GoogleStyleCard>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Enhanced Error State */}
                <AnimatePresence>
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

                {/* Features Section */}
                {!isLoading && !error && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  >
                    {[
                      {
                        icon: TrendingUp,
                        title: "Performance Analysis",
                        description: "Deep dive into loading speeds, Core Web Vitals, and optimization opportunities",
                        color: "from-green-500 to-emerald-500",
                      },
                      {
                        icon: Shield,
                        title: "Security Assessment",
                        description:
                          "Comprehensive security analysis including SSL, headers, and vulnerability detection",
                        color: "from-blue-500 to-cyan-500",
                      },
                      {
                        icon: Leaf,
                        title: "Sustainability Metrics",
                        description: "Environmental impact analysis and carbon footprint optimization suggestions",
                        color: "from-emerald-500 to-teal-500",
                      },
                      {
                        icon: Brain,
                        title: "AI Content Generation",
                        description: "Generate blog posts, social media content, and marketing copy from your analysis",
                        color: "from-purple-500 to-pink-500",
                      },
                      {
                        icon: Globe,
                        title: "SEO & Accessibility",
                        description: "Complete SEO audit and accessibility compliance checking",
                        color: "from-orange-500 to-red-500",
                      },
                      {
                        icon: Users,
                        title: "Mobile & Social",
                        description: "Mobile optimization analysis and social media integration assessment",
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
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                          <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                        </GoogleStyleCard>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </TabsContent>

              {/* Results Tab */}
              <TabsContent value="results" className="space-y-8">
                <AnimatePresence>
                  {websiteData && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <GoogleStyleCard>
                        <div className="text-center mb-6">
                          <h2 className="text-2xl font-bold text-gray-900 mb-2">Analysis Complete</h2>
                          <p className="text-gray-600">
                            Comprehensive analysis results for{" "}
                            <span className="font-semibold text-blue-600">{websiteData.url}</span>
                          </p>
                        </div>

                        <ResultsSection
                          data={websiteData}
                          onSignUpClick={handleSignUp}
                          onSave={() => handleSaveAnalysis("save")}
                          onFavorite={() => handleSaveAnalysis("favorite")}
                          userId={userId}
                        />

                        <div className="text-center mt-8">
                          <Button
                            onClick={() => setActiveTab("ai-content")}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                          >
                            <Brain className="mr-2 h-5 w-5" />
                            Generate AI Content
                          </Button>
                        </div>
                      </GoogleStyleCard>
                    </motion.div>
                  )}
                </AnimatePresence>
              </TabsContent>

              {/* AI Content Tab */}
              <TabsContent value="ai-content" className="space-y-8">
                <GoogleStyleCard>
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200 mb-4">
                      <Brain className="w-5 h-5 text-purple-600" />
                      <span className="text-sm font-medium text-purple-700">AI-Powered Content Generation</span>
                      <Sparkles className="w-5 h-5 text-pink-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Amazing Content</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                      Transform your website analysis into engaging content for blogs, social media, marketing
                      campaigns, and more.
                    </p>
                  </div>

                  <EnhancedAIGenerator websiteData={websiteData} onSignUpClick={() => handleSignUp("")} />
                </GoogleStyleCard>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 bg-white text-gray-700 p-3 rounded-full shadow-lg hover:shadow-xl border border-gray-200 transition-all duration-300 hover:scale-110"
          >
            <ArrowUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>

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
